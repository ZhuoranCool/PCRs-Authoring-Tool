import type { SubmissionPayload } from "@/app/types";

function normalizeLines(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function buildTopicBlock(tags: string) {
  const topics = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!topics.length) {
    return "";
  }

  return `${topics.map((topic) => `- ${topic}`).join("\n")}\n`;
}

function buildCasesBlock(payload: SubmissionPayload) {
  const cases = payload.tests.examples
    .map((example) => {
      const stdin = normalizeLines(example.input);
      const stdout = normalizeLines(example.expectedOutput);

      return `stdin: ${stdin}\nstdout: ${stdout}`;
    })
    .join("\n\n");

  return cases || "stdin:\nstdout:";
}

export function buildPeml(payload: SubmissionPayload) {
  const instructions = normalizeLines(payload.form.description);
  const sourceCode = normalizeLines(payload.sourceCode.code);
  const topicsBlock = buildTopicBlock(payload.form.tags);
  const casesBlock = buildCasesBlock(payload);

  return [
    `exercise_id: ${payload.form.exerciseId}`,
    "",
    `title: ${payload.form.title}`,
    "",
    `license.id: ${payload.form.licenseId}`,
    "license.owner.email: user@pitt.edu",
    "license.owner.name: user",
    "",
    "instructions: ----------",
    instructions,
    "----------",
    "",
    "tag.topics:",
    topicsBlock,
    "code: ----------",
    sourceCode,
    "----------",
    "[systems]",
    `language: ${payload.form.language}`,
    `version: ${payload.form.version}`,
    "[]",
    "",
    "[suites]",
    "[.cases]",
    casesBlock,
    "[]",
    "[]"
  ]
    .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
    .join("\n");
}
