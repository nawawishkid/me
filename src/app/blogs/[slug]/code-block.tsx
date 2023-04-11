"use client";
import { ReactNode } from "react";
import Highlight from "react-highlight";
import "highlight.js/styles/github-dark-dimmed.css";

export default function CodeBlock({
  children,
  className,
  language,
}: {
  children: ReactNode;
  className?: string;
  language: string;
}) {
  return (
    <div className={`relative ${className || ""}`}>
      <small className="absolute top-0 right-0 p-1 px-2 rounded-bl bg-slate-100 text-slate-500">
        {language}
      </small>
      <pre>
        <Highlight className={`language-${language}`}>
          <br />
          {children}
        </Highlight>
      </pre>
    </div>
  );
}
