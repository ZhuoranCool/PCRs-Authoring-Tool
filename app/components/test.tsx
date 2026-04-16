'use client'

import React, { ChangeEvent, useMemo, useState } from "react";
import { OnlineEditor } from "./editor";
import { error } from "console";

type ExampleType = "example" | "hidden";

interface TestExample {
    id: string;
    input: string;
    expectedOutput: string;
    description: string;
    testExpression: string;
    exampleType: ExampleType;
}

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

    return blocks.map((block) => {
        const input = block.match(/input:\s*([\s\S]*?)\nexpected output:/i)?.[1]?.trim() ?? "";
        const expectedOutput = block.match(/expected output:\s*([\s\S]*?)\nDescription:/i)?.[1]?.trim() ?? "";
        const description = block.match(/Description:\s*([\s\S]*?)\ntest type:/i)?.[1]?.trim() ?? "";
        const testType = block.match(/test type:\s*([\s\S]*)$/i)?.[1]?.trim().toLowerCase() ?? "";

        return {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            input,
            expectedOutput,
            description,
            testExpression: "",
            exampleType: (testType.includes("hidden") ? "hidden" : "example") as ExampleType,
        };
    }).filter((example) => example.input || example.expectedOutput || example.description);
}

interface TestSpaceProps {
    problemDescription: string;
    difficulty: string;
    questionType: string;
    language: string;
}

export function TestSpace({
    problemDescription,
    difficulty,
    questionType,
    language,
}: TestSpaceProps) {
    const [activeTab, setActiveTab] = useState<"examples" | "full">("examples");
    const [examples, setExamples] = useState<TestExample[]>(() => [makeExample()]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [descriptionGenerationError, setDescriptionGenerationError]=useState<string | null>(null);

    const exampleCountLabel = useMemo(
        () => `Test Examples (${examples.length})`,
        [examples.length]
    );

    const updateExample = <K extends keyof Omit<TestExample, "id">>(
        id: string,
        field: K,
        value: TestExample[K]
    ) => {
        setExamples((prev) =>
            prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const addExample = () => {
        setExamples((prev) => [...prev, makeExample()]);
    };

    const removeExample = (id: string) => {
        setExamples((prev) => prev.filter((item) => item.id !== id));
    };

    function handleLanguageSelection(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedLanguage(event.target.value);
    }
    
    async function handleDescriptionGenerateExamples(example: TestExample){
        if (!example.input.trim() && !example.expectedOutput.trim() && !problemDescription.trim()){
            setDescriptionGenerationError("Miss input / output / problem description");
            return;
        }
        setIsGenerating(true);
        setDescriptionGenerationError(null);

        try {
            const response = await fetch("api/testdescriptionCreate",{
                method: "POST", 
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify({
                    description: problemDescription,
                    input: example.input,
                    expectedoutput: example.expectedOutput
                })
            });

            if (!response.ok){
                throw new Error("Fail to generate test case description");
            }

            const data= await response.json();
            const rawDescription = data.description ?? "";
            updateExample(example.id, "description", rawDescription);
        }
        finally{
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

            setExamples(generatedExamples);
        } catch (error) {
            setGenerationError(
                error instanceof Error ? error.message : "Failed to generate test cases."
            );
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="bg-gray-200 px-4 py-4 shadow-md">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-gray-900">Tests</h1>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => setActiveTab("examples")}
                    className={`px-4 py-2 rounded-md text-sm font-semibold shadow-sm ${activeTab === "examples"
                        ? "bg-gray-900 text-yellow-400"
                        : "bg-white text-gray-700"
                        }`}
                >
                    {exampleCountLabel}
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("full")}
                    className={`px-4 py-2 rounded-md text-sm font-semibold shadow-sm ${activeTab === "full"
                        ? "bg-gray-900 text-yellow-400"
                        : "bg-white text-gray-700"
                        }`}
                >
                    Example Full Code
                </button>
            </div>

            {activeTab === "examples" && (
                <div className="mt-6 grid gap-6">
                    {examples.map((example, index) => (
                        <div key={example.id} className="rounded-md bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-md font-semibold text-gray-900">
                                    Example {index + 1}
                                </h2>
                                {examples.length > 1 && (
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
                                    <label className="text-sm font-medium text-gray-700">
                                        Input
                                    </label>
                                    <input
                                        type="text"
                                        value={example.input}
                                        onChange={(e) =>
                                            updateExample(example.id, "input", e.target.value)
                                        }
                                        placeholder="Enter input"
                                        className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                    />
                                </div>

                                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">
                                        Expected Output
                                    </label>
                                    <input
                                        type="text"
                                        value={example.expectedOutput}
                                        onChange={(e) =>
                                            updateExample(
                                                example.id,
                                                "expectedOutput",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter expected output"
                                        className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                    />
                                </div>

                                <div className="grid grid-cols-[150px_1fr] items-start gap-4">
                                    <label className="text-sm font-medium text-gray-700 pt-2">
                                        Description
                                    </label>
                                    <div className="grid gap-2">
                                        <textarea
                                            rows={3}
                                            value={example.description}
                                            onChange={(e) =>
                                                updateExample(
                                                    example.id,
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="What does this test cover?"
                                            className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                        />
                                        <div className="flex justify-end">
                                            {descriptionGenerationError && (
                                                <p className="mb-3 text-sm text-red-600">{descriptionGenerationError}</p>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDescriptionGenerateExamples(example)}
                                                disabled={isGenerating}
                                                className="px-3 py-2 rounded-md bg-gray-900 text-yellow-400 text-xs font-semibold shadow-sm hover:bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {isGenerating ? "Generating..." : "Generate with AI"}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">
                                        Test Type
                                    </label>
                                    <select
                                        value={example.exampleType}
                                        onChange={(e) =>
                                            updateExample(
                                                example.id,
                                                "exampleType",
                                                e.target.value as ExampleType
                                            )
                                        }
                                        className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
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
                            className="px-4 py-2 rounded-md bg-gray-900 text-yellow-400 text-sm font-semibold shadow-sm hover:bg-gray-500"
                        >
                            Add Test Example
                        </button>
                        <button
                            type="button"
                            onClick={handleGenerateExamples}
                            disabled={isGenerating}
                            className="flex px-4 py-2 rounded-md bg-gray-900 text-yellow-400 text-sm font-semibold shadow-sm hover:bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? "Generating..." : "Generate with AI"}
                        </button>
                        {generationError && (
                            <p className="mb-3 text-sm text-red-600">{generationError}</p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "full" && (
                <div className="mt-6">
                    <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Language</label>
                        <select
                            className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            defaultValue=""
                            id="languageSelect"
                            onChange={handleLanguageSelection}
                        >
                            <option value="" disabled>Select a language</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                    </div>
                    <div className="mt-6">
                        <OnlineEditor language={selectedLanguage} />
                    </div>
                </div>
            )}
        </div>
    );
}
