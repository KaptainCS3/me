"use client"

import { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

export function PdfViewerContent() {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [pageWidth, setPageWidth] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setPageWidth(Math.max(100, el.clientWidth - 32))
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const onLoadSuccess = ({ numPages: pages }: { numPages: number }) => {
    setNumPages(pages)
    setPageNumber(1)
  }

  return (
    <div className="h-full flex flex-col bg-[#0a1520] font-mono">
      <div className="h-9 flex items-center justify-between px-3 bg-[#0d1f2d] border-b border-[#1e3a4a]/50 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="text-xs text-[#6b8fa0] hover:text-white disabled:text-[#2a4a5a] disabled:hover:text-[#2a4a5a] px-1.5 py-0.5 rounded cursor-pointer disabled:cursor-default"
          >
            ◀
          </button>
          <span className="text-xs text-[#6b8fa0] min-w-[6ch] text-center">
            {pageNumber} / {numPages || "—"}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="text-xs text-[#6b8fa0] hover:text-white disabled:text-[#2a4a5a] disabled:hover:text-[#2a4a5a] px-1.5 py-0.5 rounded cursor-pointer disabled:cursor-default"
          >
            ▶
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(1)))}
            disabled={scale <= 0.5}
            className="text-xs text-[#6b8fa0] hover:text-white disabled:text-[#2a4a5a] disabled:hover:text-[#2a4a5a] px-1.5 py-0.5 rounded cursor-pointer disabled:cursor-default"
          >
            −
          </button>
          <span className="text-xs text-[#6b8fa0] min-w-[4ch] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(2, +(s + 0.1).toFixed(1)))}
            disabled={scale >= 2}
            className="text-xs text-[#6b8fa0] hover:text-white disabled:text-[#2a4a5a] disabled:hover:text-[#2a4a5a] px-1.5 py-0.5 rounded cursor-pointer disabled:cursor-default"
          >
            +
          </button>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 overflow-auto p-4 flex flex-col items-center gap-4 min-w-0">
        <Document
          file="/resume.pdf"
          onLoadSuccess={onLoadSuccess}
          loading={
            <p className="text-xs text-[#4a6b7a] py-8">Loading PDF...</p>
          }
          error={
            <p className="text-xs text-[#fb923c] py-8">
              Failed to load PDF. Place resume.pdf in the public folder.
            </p>
          }
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={pageWidth ? Math.round(pageWidth * scale) : undefined}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
            />
          ))}
        </Document>
      </div>
    </div>
  )
}
