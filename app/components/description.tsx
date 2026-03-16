'use client'

import React, { useState } from "react"
import Image from "next/image"


interface QuestionMetadata {
    name: string,
    description?: string,
    tags?: string[]
}

export function DescriptionBlock() {
    const [form, setForm] = useState({
        name: '',
        description: '',
        tags: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
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
}