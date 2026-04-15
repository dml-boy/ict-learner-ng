import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { teacherContent, moduleTitle, studentContext, engageAnswer, engageMCQAnswers } = await req.json();

    if (!teacherContent || !studentContext || (!engageAnswer && !engageMCQAnswers)) {
      return NextResponse.json({ success: false, error: 'Incomplete pedagogical context.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Act as an elite Constructivist Pedagogical Expert. Your goal is to ADAPT a high-quality ICT lesson using the 5E Instructional Model based on a student's initial diagnostic phase.
      
      Lesson Title: "${moduleTitle}"
      Full Syllabus/Content: "${teacherContent}"
      Student Role/Context: "${studentContext}"
      Student's Task Result (Engage/Explore): "${engageAnswer}"
      Student's Diagnostic MCQ Answers (Engage): "${JSON.stringify(engageMCQAnswers)}"
      
      CRITICAL INSTRUCTION: 
      1. You must adapt the subsequent phases (Explore, Explain, Elaborate, Evaluate) to address the student's initial thought AND their MCQ choices.
      2. The EXPLAIN phase is the most critical: It MUST be VAST and EXPLICITLY reference the student's MCQ answers. Bridge their prior knowledge (proven by the MCQs) with deep formal theory. Maximize content length.
      3. The ELABORATE phase MUST be deep and specific to a ${studentContext} in Nigeria, using the Engage answers as anchor points for the scenarios.
      4. Ensure all analogies, scenarios, and assessments make sense for their context.

      Please generate the ADAPTED lesson in the following JSON format ONLY:
      {
        "explore": "An adapted hands-on investigative task (extended instructions).",
        "explain": "A VAST, detailed, and personalized theoretical core (at least 5-8 paragraphs).",
        "elaborate": "An extensive specific application challenge for a ${studentContext}.",
        "evaluate": "An adapted metacognitive reflection question and 3 personalized MCQ assessment questions."
      }
      
      Ensure the tone is premium, professional, and encouraging. Return ONLY valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // JSON Sanctuary cleaning
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json({ 
        success: true, 
        message: 'Personalized constructivist journey successfully adapted to your initial input.',
        data 
      });
    } catch (parseErr) {
      console.error('[API] Adapted Generation Parsing Failure:', parseErr, text);
      return NextResponse.json({ 
        success: false, 
        error: 'Synthesis failure. Neural engine returned non-compliant structure.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[API] Gemini Neural Engine Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Cognitive synthesis interrupted. AI Engine currently unreachable.' 
    }, { status: 500 });
  }
}
