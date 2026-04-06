import OpenAI from "openai";

const client = new OpenAI();

export async function POST(req: Request) {
  const { description, difficulty, questionType, language } = await req.json();
    const prompt= `You are a coding problem generator.

Generate exactly one programming question based on the following attributes:
	•	Difficulty: ${difficulty}  (easy / medium / difficult)
	•	Type: ${questionType}  (basic / life-situation)
	•	Language: ${language}  (java / python)
    •	Basic description: ${description}

Requirements:
	1.	The problem should resemble a LeetCode-style question based on the provided basic description.
	2.	Include:
	•	Clear problem description
	•	Input/output description
	•	At least one example
	3.	The problem should require implementing a function.

Code Requirements:
	•	Provide a function skeleton only (not the full solution).
	•	The function must include:
	•	Proper function signature
	•	Comments indicating where the student should implement logic
	•	Do NOT include the solution.

Output Format (STRICT):
	•	First: the full question body
	•	Then a separator line:
####
	•	Then: the code skeleton

Additional Rules:
	•	Do NOT include explanations, hints, or solutions.
	•	Ensure the question difficulty matches the requested level.
	•	If type is “life-situation”, frame the problem using a realistic scenario.
	•	If type is “basic”, keep it abstract and algorithm-focused.`


    const response = await client.responses.create({
        model: "gpt-5.4-nano",
        input: prompt,
    });

  return Response.json({ description: response.output_text });
}

export async function GET() {
  return Response.json({ success: true });
}
