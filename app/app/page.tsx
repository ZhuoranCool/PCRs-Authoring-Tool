"use client";

import { useState } from "react";
import { DescriptionBlock } from "@/components/description";
import { SourceCode } from "@/components/sourceCode";
import { TestSpace } from "@/components/test";

export interface QuestionFormState {
  name: string;
  description: string;
  difficulty: string;
  questionType: string;
  language: string;
  tags: string;
}

export default function Home() {
  const [questionForm, setQuestionForm] = useState<QuestionFormState>({
    name: "",
    description: "",
    difficulty: "easy",
    questionType: "foundation",
    language: "java",
    tags: "",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid gap-4">
        <DescriptionBlock form={questionForm} setForm={setQuestionForm} />
        <div className="grid gap-4 lg:grid-cols-2">
          <SourceCode />
          <TestSpace
            problemDescription={questionForm.description}
            difficulty={questionForm.difficulty}
            questionType={questionForm.questionType}
            language={questionForm.language}
          />
        </div>
      </div>
    </div>
  );
}
