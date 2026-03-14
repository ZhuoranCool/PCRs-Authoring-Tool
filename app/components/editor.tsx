'use client'

import React from 'react';
import ReactDOM from 'react-dom';

import Editor from '@monaco-editor/react';


export function OnlineEditor() {
    let typeInValue="";
    function handleChange(defaultValue: any){
        typeInValue=typeInValue;
    }

    return <Editor height="90vh" defaultLanguage="javascript" defaultValue="" onChange={handleChange}/>;
}

