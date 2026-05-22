"use client"

import { useState } from "react"
import { FiTrash2, FiRotateCcw, FiX } from "react-icons/fi"
import { useAppStore } from "@/stores/appStore"
import { deleteBlob } from "@/lib/idb"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function TrashContent() {
  const trashItems = useAppStore((s) => s.trashItems)
  const restoreDesktopItem = useAppStore((s) => s.restoreDesktopItem)
  const emptyTrash = useAppStore((s) => s.emptyTrash)
  const permanentDeleteDesktopItem = useAppStore((s) => s.permanentDeleteDesktopItem)
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false)

  const handleDelete = async (id: string, storageId?: string) => {
    if (storageId) {
      try { await deleteBlob(storageId) } catch { /* ignore */ }
    }
    permanentDeleteDesktopItem(id)
  }

  if (trashItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
        <span className="text-5xl opacity-40">🗑️</span>
        <p className="text-sm">Trash is empty</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/8">
        <span className="text-xs text-slate-400">
          {trashItems.length} {trashItems.length === 1 ? "item" : "items"}
        </span>
        <button
          onClick={() => setShowEmptyConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <FiTrash2 size={12} />
          Empty Trash
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {trashItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div className="w-8 h-8 rounded-md bg-white/7 border border-white/10 flex items-center justify-center text-sm overflow-hidden shrink-0">
              {item.fileMeta?.thumbnail ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={item.fileMeta.thumbnail} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{item.icon || "📄"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-slate-200 truncate">{item.label}</div>
              {item.fileMeta && (
                <div className="text-[10px] text-slate-500">{formatSize(item.fileMeta.size)}</div>
              )}
            </div>
            <button
              onClick={() => handleDelete(item.id, item.fileMeta?.storageId)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <FiX size={11} />
              Delete
            </button>
            <button
              onClick={() => restoreDesktopItem(item.id)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-accent hover:bg-accent/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <FiRotateCcw size={11} />
              Restore
            </button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={showEmptyConfirm}
        title="Empty Trash"
        message="Are you sure you want to permanently delete all items in the trash? This action cannot be undone."
        confirmLabel="Empty Trash"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={async () => {
          for (const item of trashItems) {
            if (item.fileMeta?.storageId) {
              try { await deleteBlob(item.fileMeta.storageId) } catch { /* ignore */ }
            }
          }
          emptyTrash();
          setShowEmptyConfirm(false)
        }}
        onCancel={() => setShowEmptyConfirm(false)}
      />
    </div>
  )
}
