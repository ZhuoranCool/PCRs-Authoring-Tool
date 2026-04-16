import OpenAI from "openai";

const client = new OpenAI();

export async function POST(req: Request) {
  const { description, difficulty, questionType, language } = await req.json();
    const prompt= `You are a coding problem generator.

Generate exactly one programming question based on the following attributes:
	•	Description: ${description}
	•   Difficulty: ${difficulty} (easy / medium / difficult)
	•	Type: ${questionType} (basic / life-situation)
	•	Language: ${language} (java / python)

Requirements:
	1.	The problem should resemble a LeetCode-style question.
	2.	Include:
	•	Problem description
	•	Input/output description
	•	At least one example
	3.	The problem should require implementing a function.

Code Requirements:
	•	Provide a function skeleton only (not the full solution).
	•	Include:
	•	Proper function signature
	•	Comments indicating where the student should implement logic
	•	Do NOT include the solution.

Output Format (STRICT):
	•	Output must be plain text only.
	•	Do NOT use any Markdown, including:
	•	No bold (**)
	•	No italics (*)
	•	No headings (#)
	•	No bullet points or numbered lists
	•	Do NOT add extra symbols or formatting.
	•	First write the question body as plain text.
	•	Then write a new line containing exactly: Here is the code skeleton
	•	Then write the code skeleton.

Additional Rules:
	•	Do NOT include explanations, hints, or solutions.
	•	Ensure the question difficulty matches the requested level.
	•	If type is “life-situation”, use a realistic scenario.
	•	If type is “basic”, keep it algorithm-focused.

⸻

Why this works:
	•	Explicitly bans Markdown
	•	Reinforces “plain text only” multiple times
	•	Defines exact separator usage
	•	Reduces creative formatting tendencies of smaller models`


    const response = await client.responses.create({
        model: "gpt-5.4-nano",
        input: prompt,
    });

  return Response.json({ description: response.output_text });
}

export async function GET() {
  return Response.json({ success: true });
}
