'use client';

import { Editor } from '@monaco-editor/react';
import { Section } from '@/lib/types/website';

interface CodeEditorProps {
  section: Section;
  onChange: (code: string) => void;
  language?: string;
}

export function CodeEditor({ section, onChange, language = 'html' }: CodeEditorProps) {
  const code = JSON.stringify(section, null, 2);

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={code}
        onChange={(value) => value && onChange(value)}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
}
