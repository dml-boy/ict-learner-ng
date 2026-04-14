import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { teacherContent, moduleTitle, studentContext, engageAnswer } = await req.json();

    if (!teacherContent || !studentContext || !engageAnswer) {
      return NextResponse.json({ success: false, error: 'Teacher content, Student context, and Engage answer are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Act as an elite Constructivist Pedagogical Expert. Your goal is to ADAPT a high-quality ICT lesson using the 5E Instructional Model based on a student's initial engagement.
      
      Lesson Title: "${moduleTitle}"
      Raw Content / Syllabus: "${teacherContent}"
      Student Role/Context: "${studentContext}"
      Student's Initial Thought (Engage phase answer): "${engageAnswer}"
      
      CRITICAL INSTRUCTION: 
      1. You must adapt the subsequent phases (Explore, Explain, Elaborate, Evaluate) to address the student's initial thought.
      2. The EXPLAIN phase is the most critical: It MUST explicitly reference the student's answer/task result from the Engage phase. Correct any misconceptions shown there, or use their correct insights as the foundation for the formal definitions.
      3. If the student has a brilliant insight, validate and build upon it in the Explore and Elaborate phases.
      4. Ensure every analogy, scenario, and assessment makes sense for a ${studentContext} operating in a Nigerian environment.

      Please generate the ADAPTED lesson in the following JSON format ONLY:
      {
        "explore": "An adapted hands-on investigative task where they discover concepts through manipulation or experimentation relevant to their field and their initial thought.",
        "explain": "Adapted formal definitions bridging the raw content with their discovery and addressing their initial thought.",
        "elaborate": "An adapted specific application or challenge applying this concept to a real-world scenario they would encounter as a ${studentContext}.",
        "evaluate": "An adapted metacognitive reflection question and a short formative assessment relating directly to their context and the journey they just took."
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
