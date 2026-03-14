'use client'

import { OnlineEditor } from "./editor";

export function SourceCode() {
    return (
        <div className="bg-gray-200 px-4 py-4 shadow-md">
            <h1 className="text-lg font-bold text-gray-900">Source Code</h1>
            <div className="mt-4 grid gap-3">
                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">File Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Main.java"
                        className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    />
                </div>
                <div className="grid grid-cols-[110px_1fr] items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <select
                        className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                        defaultValue=""
                    >
                        <option value="" disabled>Select a language</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-md bg-gray-900 text-yellow-400 text-sm font-semibold shadow-sm hover:bg-gray-500"
                    >
                        Check Code with AI
                    </button>
                </div>
            </div>

            <div className="mt-4 grid gap-3" >
                <OnlineEditor />
            </div>

            <div className="mt-4">
                <h1 className="text-lg font-bold text-gray-900">Program Example Input</h1>
                <p className="text-md text-gray-500">Input avaliable through function argument</p>
                <input
                        type="text"
                        placeholder="e.g. 5 10 15"
                        className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    />
            </div>

           <div className="mt-4">
                <h1 className="text-lg font-bold text-gray-900">Program Example Output</h1>
                <p className="text-md text-gray-500">Input avaliable through function argument</p>
                <input
                        type="text"
                        placeholder="e.g. 5 10 15"
                        className="bg-white text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    />
            </div>


        </div>
    );

}
