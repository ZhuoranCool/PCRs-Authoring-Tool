"use client";

import React, { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from "react";
import { OnlineEditor } from "./editor";
import type { ExampleType, TestExample, TestsState } from "@/app/types";

function makeExample(): TestExample {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    input: "",
    expectedOutput: "",
    description: "",
    testExpression: "",
    exampleType: "example",
  };
}

function parseGeneratedExamples(rawText: string): TestExample[] {
  const blocks = rawText
    .split(/\n\s*\n(?=input:)/i)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const input = block.match(/input:\s*([\s\S]*?)\nexpected output:/i)?.[1]?.trim() ?? "";
      const expectedOutput =
        block.match(/expected output:\s*([\s\S]*?)\nDescription:/i)?.[1]?.trim() ?? "";
      const description =
        block.match(/Description:\s*([\s\S]*?)\ntest type:/i)?.[1]?.trim() ?? "";
      const testType = block.match(/test type:\s*([\s\S]*)$/i)?.[1]?.trim().toLowerCase() ?? "";

      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        input,
        expectedOutput,
        description,
        testExpression: "",
        exampleType: (testType.includes("hidden") ? "hidden" : "example") as ExampleType,
      };
    })
    .filter((example) => example.input || example.expectedOutput || example.description);
}

interface TestSpaceProps {
  problemDescription: string;
  difficulty: string;
  questionType: string;
  language: string;
  tests: TestsState;
  setTests: Dispatch<SetStateAction<TestsState>>;
}

export function TestSpace({
  problemDescription,
  difficulty,
  questionType,
  language,
  tests,
  setTests,
}: TestSpaceProps) {
  const [activeTab, setActiveTab] = useState<"examples" | "full">("examples");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [descriptionGenerationError, setDescriptionGenerationError] = useState<string | null>(null);

  const exampleCountLabel = useMemo(
    () => `Test Examples (${tests.examples.length})`,
    [tests.examples.length]
  );

  const updateExample = <K extends keyof Omit<TestExample, "id">>(
    id: string,
    field: K,
    value: TestExample[K]
  ) => {
    setTests((prev) => ({
      ...prev,
      examples: prev.examples.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addExample = () => {
    setTests((prev) => ({ ...prev, examples: [...prev.examples, makeExample()] }));
  };

  const removeExample = (id: string) => {
    setTests((prev) => ({
      ...prev,
      examples: prev.examples.filter((item) => item.id !== id),
    }));
  };

  function handleFullCodeLanguageSelection(event: ChangeEvent<HTMLSelectElement>) {
    setTests((prev) => ({ ...prev, fullCodeLanguage: event.target.value }));
  }

  async function handleDescriptionGenerateExamples(example: TestExample) {
    if (!example.input.trim() && !example.expectedOutput.trim() && !problemDescription.trim()) {
      setDescriptionGenerationError("Miss input / output / problem description");
      return;
    }
    setIsGenerating(true);
    setDescriptionGenerationError(null);

    try {
      const response = await fetch("api/testdescriptionCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: problemDescription,
          input: example.input,
          expectedoutput: example.expectedOutput,
        }),
      });

      if (!response.ok) {
        throw new Error("Fail to generate test case description");
      }

      const data = await response.json();
      const rawDescription = data.description ?? "";
      updateExample(example.id, "description", rawDescription);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleGenerateExamples() {
    if (!problemDescription.trim()) {
      setGenerationError("Add a problem description before generating tests.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch("/api/testcaseCreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: problemDescription,
          difficulty,
          questionType,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test cases.");
      }

      const data = await response.json();
      const generatedExamples = parseGeneratedExamples(data.description ?? "");

      if (!generatedExamples.length) {
        throw new Error("The API response did not contain parseable test cases.");
      }

      setTests((prev) => ({ ...prev, examples: generatedExamples }));
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Failed to generate test cases."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="rounded-xl bg-gray-200 px-4 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Tests</h1>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("examples")}
          className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
            activeTab === "examples" ? "bg-gray-900 text-yellow-400" : "bg-white text-gray-700"
          }`}
        >
          {exampleCountLabel}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("full")}
          className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
            activeTab === "full" ? "bg-gray-900 text-yellow-400" : "bg-white text-gray-700"
          }`}
        >
          Example Full Code
        </button>
      </div>

      {activeTab === "examples" && (
        <div className="mt-6 grid gap-6">
          {tests.examples.map((example, index) => (
            <div key={example.id} className="rounded-md bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-md font-semibold text-gray-900">Example {index + 1}</h2>
                {tests.examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExample(example.id)}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mt-4 grid gap-4">
                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Input</label>
                  <input
                    type="text"
                    value={example.input}
                    onChange={(e) => updateExample(example.id, "input", e.target.value)}
                    placeholder="Enter input"
                    className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Expected Output</label>
                  <input
                    type="text"
                    value={example.expectedOutput}
                    onChange={(e) =>
                      updateExample(example.id, "expectedOutput", e.target.value)
                    }
                    placeholder="Enter expected output"
                    className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-[150px_1fr] items-start gap-4">
                  <label className="pt-2 text-sm font-medium text-gray-700">Description</label>
                  <div className="grid gap-2">
                    <textarea
                      rows={3}
                      value={example.description}
                      onChange={(e) => updateExample(example.id, "description", e.target.value)}
                      placeholder="What does this test cover?"
                      className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
                    />
                    <div className="flex justify-end">
                      {descriptionGenerationError && (
                        <p className="mb-3 text-sm text-red-600">
                          {descriptionGenerationError}
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDescriptionGenerateExamples(example)}
                        disabled={isGenerating}
                        className="rounded-md bg-gray-900 px-3 py-2 text-xs font-semibold text-yellow-400 shadow-sm hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isGenerating ? "Generating..." : "Generate with AI"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Test Type</label>
                  <select
                    value={example.exampleType}
                    onChange={(e) =>
                      updateExample(example.id, "exampleType", e.target.value as ExampleType)
                    }
                    className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
                  >
                    <option value="example">Example Test</option>
                    <option value="hidden">Hidden Test</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={addExample}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-yellow-400 shadow-sm hover:bg-gray-500"
            >
              Add Test Example
            </button>
            <button
              type="button"
              onClick={handleGenerateExamples}
              disabled={isGenerating}
              className="flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-yellow-400 shadow-sm hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? "Generating..." : "Generate with AI"}
            </button>
            {generationError && <p className="mb-3 text-sm text-red-600">{generationError}</p>}
          </div>
        </div>
      )}

      {activeTab === "full" && (
        <div className="mt-6">
          <div className="grid grid-cols-[110px_1fr] items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Language</label>
            <select
              className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
              value={tests.fullCodeLanguage}
              onChange={handleFullCodeLanguageSelection}
            >
              <option value="">Select a language</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          <div className="mt-6">
            <OnlineEditor
              language={tests.fullCodeLanguage}
              value={tests.fullCode}
              onChange={(value) =>
                setTests((prev) => ({ ...prev, fullCode: value }))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
