"use client"

import { useState } from "react"
import { SOURCE_CODE } from "@/data/sourceCode"

export function SourceViewerContent() {
  const [selectedFile, setSelectedFile] = useState(Object.keys(SOURCE_CODE)[0])

  return (
    <div className="flex h-full bg-[#0d1117] text-[#c9d1d9] font-mono text-sm overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/5 flex flex-col shrink-0 bg-[#010409]">
        <div className="p-3 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-white/5">
          Files
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {Object.keys(SOURCE_CODE).map((file) => (
            <button
              key={file}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-4 py-1.5 transition-colors ${
                selectedFile === file
                  ? "bg-accent/20 text-accent border-l-2 border-accent"
                  : "hover:bg-white/5 text-slate-400"
              }`}
            >
              {file}
            </button>
          ))}
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-9 bg-[#0d1117] border-b border-white/5 flex items-center px-4 shrink-0">
          <span className="text-xs text-slate-400 italic">src/components/os/{selectedFile}</span>
        </div>
        <div className="flex-1 overflow-auto p-4 custom-scrollbar">
          <pre className="whitespace-pre">
            <code>
              {SOURCE_CODE[selectedFile] || "// File not found"}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}
