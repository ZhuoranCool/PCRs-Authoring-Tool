"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DescriptionBlock } from "@/components/description";
import { SourceCode } from "@/components/sourceCode";
import { TestSpace } from "@/components/test";
import type {
  QuestionFormState,
  SourceCodeState,
  SubmissionPayload,
  TestsState,
} from "@/app/types";

const STORAGE_KEY = "pcrs-authoring-submission";

const initialQuestionForm: QuestionFormState = {
  name: "",
  description: "",
  difficulty: "easy",
  questionType: "foundation",
  language: "java",
  tags: "",
};

const initialSourceCode: SourceCodeState = {
  fileName: "",
  language: "",
  code: "",
  exampleInput: "",
  exampleOutput: "",
};

const initialTests: TestsState = {
  examples: [
    {
      id: "example-1",
      input: "",
      expectedOutput: "",
      description: "",
      testExpression: "",
      exampleType: "example",
    },
  ],
  fullCodeLanguage: "",
  fullCode: "",
};

export default function Home() {
  const router = useRouter();
  const [questionForm, setQuestionForm] = useState<QuestionFormState>(initialQuestionForm);
  const [sourceCode, setSourceCode] = useState<SourceCodeState>(initialSourceCode);
  const [tests, setTests] = useState<TestsState>(initialTests);

  const handleSubmit = () => {
    const payload: SubmissionPayload = {
      form: questionForm,
      sourceCode,
      tests,
    };

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    router.push("/submission");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">PCRS Authoring</h1>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
          >
            Submit
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <div className="grid gap-4">
          <DescriptionBlock form={questionForm} setForm={setQuestionForm} />
          <div className="grid gap-4 lg:grid-cols-2">
            <SourceCode sourceCode={sourceCode} setSourceCode={setSourceCode} />
            <TestSpace
              problemDescription={questionForm.description}
              difficulty={questionForm.difficulty}
              questionType={questionForm.questionType}
              language={questionForm.language}
              tests={tests}
              setTests={setTests}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
