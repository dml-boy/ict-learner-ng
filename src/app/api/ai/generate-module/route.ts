import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { topic, contextOptions } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Act as an elite Constructivist Pedagogical Expert. Your goal is to design a high-quality ICT lesson using the 5E Instructional Model (Engage, Explore, Explain, Elaborate, Evaluate).
      
      Topic/Syllabus Snippet: "${topic}"
      Allowed Contexts for Adaptation: [${contextOptions.join(', ')}]
      
      Please generate the lesson in the following JSON format ONLY:
      {
        "engage": "A 'hook' activity or puzzle to activate schema and create cognitive dissonance.",
        "explore": "A hands-on investigative task where students discover concepts through manipulation or experimentation.",
        "explain": "Formal definitions and concepts based on their discovery from the Explore phase.",
        "elaborate": {
           // Create a specific scenario or expansion for EACH of the following roles:
           ${contextOptions.reduce((acc: string[], ctx: string) => {
             acc.push(`"${ctx}": "A specific application of this concept for a ${ctx} in a real-world Nigerian context."`);
             return acc;
           }, []).join(',\n           ')}
        },
        "evaluate": "A metacognitive reflection question and a short formative assessment/exit ticket."
      }
      
      Ensure the tone is premium, professional, and encouraging. Focus on Nigerian ICT relevance (e.g. using local scenarios like markets, cyber cafés, or business offices where appropriate).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Improved JSON Sanctuary cleaning
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json({ 
        success: true, 
        message: 'High-fidelity pedagogical module synthesized by Gemini.',
        data 
      });
    } catch (parseErr) {
      console.error('[API] AI Generation Parsing Failure:', parseErr, text);
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
