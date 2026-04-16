'use client'

import React, { Dispatch, SetStateAction, useState } from "react"
import Image from "next/image"
import type { QuestionFormState } from "@/app/page";

interface DescriptionBlockProps {
    form: QuestionFormState;
    setForm: Dispatch<SetStateAction<QuestionFormState>>;
}

export function DescriptionBlock({ form, setForm }: DescriptionBlockProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestedSkeleton, setSuggestedSkeleton] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const { id, value } = target;
        setForm(prev => ({
            ...prev,
            [id]: value
        }));
    }

    const [fold, setFoldStatus] = useState(true);

    const handleFold = () => {
        setFoldStatus(prev => !prev);
    }

    const handleGenerateDescription = async () => {
        if (!form.description.trim()) return;
        setIsGenerating(true);
        try {
            const response = await fetch ("/api/problemCreate",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    description: form.description,
                    difficulty: form.difficulty,
                    questionType: form.questionType,
                    language: form.language
                })
            });
            const data=await response.json();
            const rawDescription = data.description ?? "";
            const marker = "Here is the code skeleton";
            const markerIndex = rawDescription.indexOf(marker);
            if (markerIndex >= 0) {
                const cleanedDescription = rawDescription.slice(0, markerIndex).trimEnd();
                const skeleton = rawDescription.slice(markerIndex + marker.length).trim();
                setForm(prev => ({ ...prev, description: cleanedDescription }));
                setSuggestedSkeleton(skeleton.length ? skeleton : null);
            } else {
                setForm(prev => ({ ...prev, description: rawDescription }));
                setSuggestedSkeleton(null);
            }
            console.log(data)
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="bg-gray-200 px-4 py-2 shadow-md">
            {fold && (
                <div className="space-y-4 ">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-xl">Name *</label>
                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                        ></input>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-xl">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            cols={50}
                            value={form.description}
                            onChange={handleChange}
                            className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                        />
                    </div>
                    {suggestedSkeleton && (
                        <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                            <span />
                            <div className="relative bg-white border border-gray-300 rounded-base p-3 shadow-xs">
                                <button
                                    type="button"
                                    aria-label="Close suggested code skeleton"
                                    onClick={() => setSuggestedSkeleton(null)}
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                                >
                                    ×
                                </button>
                                <div className="text-sm font-semibold mb-2">Suggested Code Skeleton</div>
                                <pre className="text-xs whitespace-pre-wrap font-mono text-gray-900">
                                    {suggestedSkeleton}
                                </pre>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                        <label className="text-xl">Attributes</label>
                        <div className="grid grid-cols-3 gap-4">
                            <select
                                id="difficulty"
                                value={form.difficulty}
                                onChange={handleChange}
                                className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <select
                                id="questionType"
                                value={form.questionType}
                                onChange={handleChange}
                                className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            >
                                <option value="foundation">Foundation</option>
                                <option value="life-situation">Life-situation</option>
                            </select>
                            <select
                                id="language"
                                value={form.language}
                                onChange={handleChange}
                                className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            >
                                <option value="java">Java</option>
                                <option value="python">Python</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <span />
                        <div className="flex">
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={isGenerating || !form.description.trim()}
                                className="px-4 py-2 rounded-md bg-gray-900 text-yellow-400 text-sm font-semibold shadow-sm hover:bg-gray-500 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? "Generating..." : "Generate with AI"}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <label className="text-xl">Tags</label>
                        <input
                            id="tags"
                            type="text"
                            value={form.tags}
                            onChange={handleChange}
                            className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                        />
                    </div>
                </div>
            )}
            <div className="py-2.5 mt-2" onClick={handleFold}>
                <Image
                    src="/foldArrow.svg"
                    alt="fold arrow"
                    width={20}
                    height={20}
                    className={`w-5 h-5 ${fold ? "" : "rotate-180"} `}
                    
                />
            </div>
        </div>
    )
    };
