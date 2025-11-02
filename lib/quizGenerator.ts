import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY!;
const genai = new GoogleGenerativeAI(apiKey);

export async function generateQuiz({topic, difficulty}:{
    topic:string;
    difficulty: string
}){
    const prompt = `You are an expert educational content creator.

        Your task:
        Generate exactly **10 MCQ quiz questions** about the topic **"${topic}"** with **${difficulty}difficulty**.

        Requirements:
        - Return ONLY valid JSON (no markdown, no explanation, no backticks).
        - JSON must be an array of 10 objects.
        - Each object must follow EXACTLY this schema:

        {
        "id": number,                     // 1–10
        "question": string,
        "options": [string, string, string, string],   // 4 options
        "answer": string                  // must match exactly one of the options
        }

        Content rules:
        - Avoid repetition.
        - Keep questions concise.
        - Ensure only ONE correct answer.
        - Ensure difficulty matches ${difficulty} level.
        - No controversial/harmful content.
        - No external URLs.

        Output example structure (do NOT repeat this text, only follow structure):

        [
        {
            "id": 1,
            "question": "…",
            "options": ["…", "…", "…", "…"],
            "answer": "…"
        }
        ]

        Return ONLY JSON. Nothing else.`


        const model = genai.getGenerativeModel({
            model: "gemini-2.5-flash"
        })

        const result = await model.generateContent(prompt)
        let text_res = result.response.text()


        let questions = []
        try{
            text_res = text_res
                        .replace(/```json/g, '')   // Remove ```json
                        .replace(/```/g, '')        // Remove ```
                        .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
                        .trim();
            questions = JSON.parse(text_res)
        }catch(err){
            console.log("Error parsing the text", err);
        }

        return questions
}

