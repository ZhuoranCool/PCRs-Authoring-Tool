"use client";

import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { OnlineEditor } from "./editor";
import type { SourceCodeState } from "@/app/types";

interface SourceCodeProps {
  sourceCode: SourceCodeState;
  setSourceCode: Dispatch<SetStateAction<SourceCodeState>>;
}

export function SourceCode({ sourceCode, setSourceCode }: SourceCodeProps) {
  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { id, value } = event.target;
    setSourceCode((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className="rounded-xl bg-gray-200 px-4 py-4 shadow-md">
      <h1 className="text-lg font-bold text-gray-900">Source Code</h1>
      <div className="mt-4 grid gap-3">
        <div className="grid grid-cols-[110px_1fr] items-center gap-3">
          <label className="text-sm font-medium text-gray-700">File Name</label>
          <input
            id="fileName"
            type="text"
            value={sourceCode.fileName}
            onChange={handleChange}
            placeholder="e.g. Main.java"
            className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
          />
        </div>
        <div className="grid grid-cols-[110px_1fr] items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Language</label>
          <select
            id="language"
            className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
            value={sourceCode.language}
            onChange={handleChange}
          >
            <option value="">Select a language</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-yellow-400 shadow-sm hover:bg-gray-500"
          >
            Check Code with AI
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <OnlineEditor
          language={sourceCode.language}
          value={sourceCode.code}
          onChange={(value) =>
            setSourceCode((prev) => ({ ...prev, code: value }))
          }
        />
      </div>

      <div className="mt-4">
        <h1 className="text-lg font-bold text-gray-900">Program Example Input</h1>
        <p className="text-md text-gray-500">
          Input available through function argument
        </p>
        <input
          id="exampleInput"
          type="text"
          value={sourceCode.exampleInput}
          onChange={handleChange}
          placeholder="e.g. 5 10 15"
          className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
        />
      </div>

      <div className="mt-4">
        <h1 className="text-lg font-bold text-gray-900">Program Example Output</h1>
        <p className="text-md text-gray-500">
          Output expected from the function
        </p>
        <input
          id="exampleOutput"
          type="text"
          value={sourceCode.exampleOutput}
          onChange={handleChange}
          placeholder="e.g. 30"
          className="block w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-xs"
        />
      </div>
    </div>
  );
}
