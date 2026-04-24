"use client";

import { useState } from "react";
import Link from "next/link";
import { buildPeml } from "@/app/peml";
import type { SubmissionPayload } from "@/app/types";

const STORAGE_KEY = "pcrs-authoring-submission";
const PEML_KEY = "pcrs-authoring-peml";

export default function SubmissionPage() {
  const [submission] = useState<SubmissionPayload | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const rawPayload = window.sessionStorage.getItem(STORAGE_KEY);
    if (!rawPayload) {
      return null;
    }
    try {
      return JSON.parse(rawPayload) as SubmissionPayload;
    } catch {
      return null;
    }
  });

  const [peml] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const savedPeml = window.sessionStorage.getItem(PEML_KEY);
    if (savedPeml) {
      return savedPeml;
    }

    return submission ? buildPeml(submission) : "";
  });

  const handleDownload = () => {
    const blob = new Blob([peml], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "xxx.peml";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!submission || !peml) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-md">
          <h1 className="text-2xl font-semibold text-gray-900">PEML Output</h1>
          <p className="mt-3 text-sm text-gray-600">No submitted data found.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Back to editor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">PEML Output</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Download `xxx.peml`
            </button>
            <Link
              href="/"
              className="inline-flex rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Back to editor
            </Link>
          </div>
        </div>

        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">PEML Preview</h2>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
            {peml}
          </pre>
        </section>
      </div>
    </div>
  );
}
