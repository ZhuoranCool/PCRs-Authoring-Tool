"use client";

import Editor from "@monaco-editor/react";

type OnlineEditorProps = {
  language?: string;
  value: string;
  onChange: (value: string) => void;
};

export function OnlineEditor({
  language = "",
  value,
  onChange,
}: OnlineEditorProps) {
  return (
    <Editor
      height="30vh"
      language={language || undefined}
      value={value}
      onChange={(nextValue) => onChange(nextValue ?? "")}
    />
  );
}
