"use client"

import { useState } from "react"
import { FiCamera } from "react-icons/fi"
import { useAppStore } from "@/stores/appStore"
import html2canvas from "html2canvas"

export function SnippingToolContent() {
  const [capturing, setCapturing] = useState(false)
  const mergeDesktopItems = useAppStore((s) => s.mergeDesktopItems)
  const updateVfsNode = useAppStore((s) => s.updateVfsNode)
  const vfs = useAppStore((s) => s.vfs)

  const takeScreenshot = async () => {
    setCapturing(true)
    try {
      // Small delay to hide snipping tool UI from screenshot if possible
      await new Promise(r => setTimeout(r, 100))
      
      const element = document.body
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        logging: false,
        useCORS: true,
        scale: 1,
      })
      
      const dataUrl = canvas.toDataURL("image/png")
      const id = `screenshot-${Date.now()}`
      const filename = `Screenshot-${new Date().toLocaleTimeString().replace(/:/g, '-')}.png`
      const path = `/home/appelgryn/${filename}`

      // Save to VFS
      updateVfsNode(path, { type: "file", content: dataUrl })
      
      // Update parent dir
      const parent = vfs["/home/appelgryn"]
      if (parent && parent.children) {
        updateVfsNode("/home/appelgryn", { ...parent, children: [...parent.children, filename] })
      }

      // Add to Desktop
      mergeDesktopItems([{
        id,
        icon: "",
        label: filename,
        x: 100,
        y: 100,
        vfsPath: path,
        fileMeta: {
          name: filename,
          size: dataUrl.length,
          type: "image/png",
          dataUrl
        }
      }])

      alert("Screenshot saved to desktop!")
    } catch (err) {
      console.error("Capture failed", err)
      alert("Failed to capture screenshot.")
    } finally {
      setCapturing(false)
    }
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full bg-[#0a1520] text-slate-200 gap-6">
      <div className="w-24 h-24 rounded-3xl bg-accent/20 flex items-center justify-center text-5xl border border-accent/30 shadow-[0_0_30px_var(--accent-soft)]">
        <FiCamera size={48} />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Snipping Tool</h2>
        <p className="text-sm text-slate-400 max-w-[240px]">
          Capture a high-quality screenshot of your current Portfolio OS session.
        </p>
      </div>
      
      <button
        onClick={takeScreenshot}
        disabled={capturing}
        className={`px-8 py-3 rounded-xl font-bold transition-all ${
          capturing 
            ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
            : "bg-accent text-slate-900 hover:scale-105 active:scale-95 shadow-[0_4px_20px_var(--accent-soft)]"
        }`}
      >
        {capturing ? "Capturing..." : "Capture Screen"}
      </button>
      
      <p className="text-[10px] text-slate-600 uppercase tracking-widest">
        Saved as .png to Desktop
      </p>
    </div>
  )
}
