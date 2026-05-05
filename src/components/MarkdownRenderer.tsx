
"use client"

import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const renderLine = (line: string, index: number) => {
    // Basic Header Handling
    if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-6 mb-4 text-primary">{line.substring(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-5 mb-3 text-primary/90">{line.substring(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-primary/80">{line.substring(4)}</h3>;
    
    // Basic List Handling
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      return <li key={index} className="ml-4 list-disc mb-1">{parseInline(line.trim().substring(2))}</li>;
    }

    // Basic Blockquote
    if (line.startsWith('> ')) {
      return <blockquote key={index} className="border-l-4 border-accent pl-4 italic my-4 text-muted-foreground">{parseInline(line.substring(2))}</blockquote>;
    }

    // Empty lines
    if (!line.trim()) return <div key={index} className="h-4" />;

    // Normal paragraph
    return <p key={index} className="mb-4 leading-relaxed">{parseInline(line)}</p>;
  };

  const parseInline = (text: string) => {
    // Simple bold/italic parsing with regex
    let elements: (string | JSX.Element)[] = [text];

    // Bold **text**
    elements = elements.flatMap(el => {
      if (typeof el !== 'string') return el;
      const parts = el.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => 
        part.startsWith('**') && part.endsWith('**') 
          ? <strong key={i} className="font-bold">{part.slice(2, -2)}</strong> 
          : part
      );
    });

    // Italic *text*
    elements = elements.flatMap(el => {
      if (typeof el !== 'string') return el;
      const parts = el.split(/(\*.*?\*)/g);
      return parts.map((part, i) => 
        part.startsWith('*') && part.endsWith('*') 
          ? <em key={i} className="italic">{part.slice(1, -1)}</em> 
          : part
      );
    });

    return elements;
  };

  const lines = content.split('\n');

  return (
    <div className={cn("prose prose-blue max-w-none text-foreground/90 font-body", className)}>
      {lines.map((line, idx) => renderLine(line, idx))}
    </div>
  );
}
