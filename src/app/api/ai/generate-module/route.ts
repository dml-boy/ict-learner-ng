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
      
      1. ENGAGE: Generate TWO components: (a) Exactly 5 "Diagnostic/Reflective Multiple Choice Questions" (MCQs) in JSON format to activate schema and gauge prior knowledge. Each question must have 4 options. (b) A "Simple Discovery Task" (e.g., 'Google X', 'Look at your phone's Y') for the student to accomplish immediately. Hook the student!
      2. EXPLORE: Provide a specific "Hands-on Investigative Task". This should not be reading; it should be a discovery activity where students "play" with a concept.
      3. EXPLAIN: Provide the "Theoretical Core". Formal definitions and models based on the topic. Generate as much deep, high-quality content as possible. This phase MUST BE BUILT to be dynamically influenced by the student's initial engagement in the Engage phase.
      4. ELABORATE: For each of the Contextual Personas, create a vast "Real-World Nigerian Scenario" that directly relates the topic back to the personal hooks from the Engage phase. Maximize detail and application.
      5. EVALUATE: Provide a "Short Test (3 Questions)" in JSON format.
      
      You MUST return your response in this EXACT JSON structure:
      {
        "engage": "The text for the Engage phase (intro + the task instructions).",
        "engageQuestions": [
          { "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." } // Provide 5 such questions.
        ],
        "explore": "The text for the Explore phase (the investigative task).",
        "explain": "The comprehensive theoretical core.",
        "elaborate": {
           ${contextOptions.map((ctx: string) => `"${ctx}": "A deep contextual application for a ${ctx} referencing the Engage choices."`).join(',\n           ')}
        },
        "evaluate": "A final metacognitive reflection question.",
        "constructivistNote": "Pedagogical rationale.",
        "questions": [
          { "question": "Test question.", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..." } // Exactly 3 questions.
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
