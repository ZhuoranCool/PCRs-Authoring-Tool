'use client'

import Editor from '@monaco-editor/react';

type OnlineEditorProps = {
    language?: string;
};

export function OnlineEditor({ language = "" }: OnlineEditorProps) {
    return <Editor height="30vh" language={language} defaultValue="" />;
}
