export interface QuestionFormState {
  name: string;
  description: string;
  difficulty: string;
  questionType: string;
  language: string;
  tags: string;
}

export interface SourceCodeState {
  fileName: string;
  language: string;
  code: string;
  exampleInput: string;
  exampleOutput: string;
}

export type ExampleType = "example" | "hidden";

export interface TestExample {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
  testExpression: string;
  exampleType: ExampleType;
}

export interface TestsState {
  examples: TestExample[];
  fullCodeLanguage: string;
  fullCode: string;
}

export interface SubmissionPayload {
  form: QuestionFormState;
  sourceCode: SourceCodeState;
  tests: TestsState;
}
