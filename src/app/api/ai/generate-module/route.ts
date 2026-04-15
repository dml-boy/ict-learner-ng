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
      Act as an elite Constructivist Pedagogical Expert. Your goal is to design a high-fidelity 5E ICT module based on the provided topic.
      
      Topic/Syllabus: "${topic}"
      Contextual Personas for Elaboration: [${contextOptions.join(', ')}]
      
      Strictly follow this 5E Constructivist Architecture:
      
      1. ENGAGE: (a) Exactly 5 "Diagnostic MCQs" (Radio style) to gauge prior logical intuition. (b) A very BASIC "Simple Discovery Task" (e.g. 'Look at a recipe', 'Notice steps to login').
      2. EXPLORE: Provide a basic, inquiry-driven discovery task.
      3. EXPLAIN: Provide an "Academic Masterclass". Act as a Senior University Professor. This section must be MASSIVE (at least 8-10 deep paragraphs, approx 1500 words). It must include: (a) Formal Definition, (b) Historical Context/Origins, (c) Core Technical Architecture/Step-by-step logic, and (d) Industry Applications in the Nigerian ecosystem.
      4. ELABORATE: Deep contextual scenarios for the personas.
      5. EVALUATE: Provide a RIGOROUS 3-question test that is STRICTLY based on the technical details provided in the EXPLAIN section.

      You MUST return your response in this EXACT JSON structure:
      {
        "engage": "The text for the Engage phase.",
        "engageQuestions": [
          { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." } // Provide 5.
        ],
        "explore": "The basic inquiry task.",
        "explain": "The comprehensive academic lesson (MUST BE VAST).",
        "elaborate": {
           ${contextOptions.map((ctx: string) => `"${ctx}": "A deep contextual application."`).join(',\n           ')}
        },
        "evaluate": "A final metacognitive reflection question.",
        "constructivistNote": "Pedagogical rationale.",
        "questions": [
          { "question": "Technical test question.", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." } // Exactly 3.
        ]
      }
      
      Maintain a premium, encouraging, and authoritative tone throughout. Ensure extreme relevance to the Nigerian ICT ecosystem.
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
