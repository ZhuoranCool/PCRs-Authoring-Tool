import OpenAI from "openai";

const client = new OpenAI();

export async function POST(req: Request) {
  const { description, difficulty, questionType, language } = await req.json();
    const prompt= `You are given a programming problem description.

Your task is to generate exactly 10 test cases for this problem.

Instructions:
	1.	Carefully read the problem description: ${description}
	2.	Identify any input/output examples explicitly provided in the description:
	•	Include ALL of them as test cases.
	•	Mark them as “Example test”.
	3.	Generate additional test cases to reach a total of 10:
	•	Focus on edge cases and boundary conditions (e.g., empty input, minimum/maximum values, large inputs, duplicates, special structures, etc.).
	•	Mark these as “Hidden test” unless they were explicitly shown in the problem description.
	4.	For each test case, strictly follow this for mat (plaintext only, no Markdown, no bold, no symbols):

input:

expected output:

Description:
<brief explanation; explicitly mention if this is a boundary/edge case>
test type:

	5.	Do NOT use Markdown formatting (no **, no bullets, no numbering, no code blocks).
	6.	Do NOT omit expected outputs.
	7.	Ensure outputs are correct and consistent with the problem.
	8.	Keep formatting consistent and clean.

Now generate the 10 test cases for the following problem:`


    const response = await client.responses.create({
        model: "gpt-5.4-nano",
        input: prompt,
    });

  return Response.json({ description: response.output_text });
}

export async function GET() {
  return Response.json({ success: true });
}
