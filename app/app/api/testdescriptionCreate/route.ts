import OpenAI from "openai";

const client = new OpenAI();

export async function POST(req: Request) {
  const { description, input, expectedoutput } = await req.json();
    const prompt= `You are given a programming problem description with a pair of input and expected output.

Your task is to generate a short description for the pair of input and expected output based on the programming problem description. 

Instructions:
    1.	Carefully read the problem description: ${description}
    2.	Understand how the program get the expected output ${expectedoutput} from the input ${input}
    3.	The description should be plaintext only, no Markdown, no bold, no symbols.
    4.  Do NOT use Markdown formatting (no **, no bullets, no numbering, no code blocks).
    5.	Ensure expected output is correct and consistent with the problem. If the provided expected output, only say "the expected output is incorrect"
    8.	Keep formatting consistent and clean.

Now generate the description for test case of the problem with its input and expected output`


    const response = await client.responses.create({
        model: "gpt-5.4-nano",
        input: prompt,
    });

  return Response.json({ description: response.output_text });
}

export async function GET() {
  return Response.json({ success: true });
}
