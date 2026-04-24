"use client";

import { useState } from "react";
import Link from "next/link";
import type { SubmissionPayload } from "@/app/types";

const STORAGE_KEY = "pcrs-authoring-submission";

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

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-md">
          <h1 className="text-2xl font-semibold text-gray-900">Submission Output</h1>
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
          <h1 className="text-2xl font-semibold text-gray-900">Submission Output</h1>
          <Link
            href="/"
            className="inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
          >
            Back to editor
          </Link>
        </div>

        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">Problem Details</h2>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{submission.form.name || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="text-sm text-gray-900">{submission.form.tags || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Difficulty</dt>
              <dd className="text-sm text-gray-900">{submission.form.difficulty}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Question Type</dt>
              <dd className="text-sm text-gray-900">{submission.form.questionType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Language</dt>
              <dd className="text-sm text-gray-900">{submission.form.language}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
              {submission.form.description || "-"}
            </p>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">Source Code</h2>
          <dl className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">File Name</dt>
              <dd className="text-sm text-gray-900">{submission.sourceCode.fileName || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Language</dt>
              <dd className="text-sm text-gray-900">{submission.sourceCode.language || "-"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Example Input</dt>
              <dd className="text-sm text-gray-900">
                {submission.sourceCode.exampleInput || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Example Output</dt>
              <dd className="text-sm text-gray-900">
                {submission.sourceCode.exampleOutput || "-"}
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">Code</h3>
            <pre className="mt-1 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
              {submission.sourceCode.code || "// No source code provided"}
            </pre>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900">Tests</h2>
          <div className="mt-4 space-y-4">
            {submission.tests.examples.map((example, index) => (
              <div key={example.id} className="rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900">Example {index + 1}</h3>
                <dl className="mt-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Input</dt>
                    <dd className="text-sm text-gray-900">{example.input || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Expected Output</dt>
                    <dd className="text-sm text-gray-900">{example.expectedOutput || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900">{example.exampleType}</dd>
                  </div>
                </dl>
                <div className="mt-3">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="whitespace-pre-wrap text-sm text-gray-900">
                    {example.description || "-"}
                  </dd>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Full Test Code</h3>
            <p className="mt-1 text-sm text-gray-900">
              Language: {submission.tests.fullCodeLanguage || "-"}
            </p>
            <pre className="mt-2 overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
              {submission.tests.fullCode || "// No full test code provided"}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
