import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { teacherContent, moduleTitle, studentContext } = await req.json();

    if (!teacherContent || !studentContext) {
      return NextResponse.json({ success: false, error: 'Content and Context are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Act as an elite Constructivist Pedagogical Expert. Your goal is to design a high-quality, deeply personalized ICT lesson using the 5E Instructional Model (Engage, Explore, Explain, Elaborate, Evaluate).
      
      Lesson Title: "${moduleTitle}"
      Raw Content / Syllabus: "${teacherContent}"
      
      CRITICAL INSTRUCTION: You must tailor this entire lesson exclusively for a student whose personal context or role is: "${studentContext}".
      Every analogy, scenario, and assessment must make sense for a ${studentContext} operating in a Nigerian environment.

      Please generate the lesson in the following JSON format ONLY:
      {
        "engage": "A 'hook' activity or puzzle tailored for a ${studentContext} to activate their specific prior knowledge.",
        "explore": "A hands-on investigative task where they discover concepts through manipulation or experimentation relevant to their field.",
        "explain": "Formal definitions bridging the raw content with their discovery from the Explore phase.",
        "elaborate": "A specific application or challenge applying this concept to a real-world scenario they would encounter as a ${studentContext}.",
        "evaluate": "A metacognitive reflection question and a short formative assessment relating directly to their context."
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
        message: 'Personalized constructivist journey synthesized.',
        data 
      });
    } catch (parseErr) {
      console.error('[API] Dynamic Generation Parsing Failure:', parseErr, text);
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
