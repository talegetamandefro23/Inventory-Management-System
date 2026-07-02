import { useState } from "react";
import { Search, ScanLine, Bell, X } from "lucide-react";

export default function Topbar() {
  const [scanOpen, setScanOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="relative flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3">
      <div className="flex items-center gap-2 text-sm text-zinc-400 w-full max-w-md">
        <div className="flex items-center gap-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2">
          <Search size={15} className="text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-sm w-full dark:text-white"
            placeholder="Search items, POs, or assets..."
          />
          <span className="ml-auto text-xs text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded px-1">⌘K</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setScanOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:text-white"
        >
          <ScanLine size={15} /> Scan Barcode
        </button>
        <button onClick={() => setNotifOpen((o) => !o)} className="relative rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Bell size={17} className="text-zinc-500 dark:text-zinc-300" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>
        <div className="h-8 w-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-semibold">JD</div>
      </div>

      {notifOpen && (
        <div className="absolute right-6 top-14 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg p-3 z-50">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-sm">Notifications</p>
            <button onClick={() => setNotifOpen(false)}><X size={14} /></button>
          </div>
          <div className="space-y-2 text-xs text-zinc-500">
            <p>3 purchase requisitions are awaiting your approval.</p>
            <p>Low stock alert: NVIDIA RTX 4090 FE (3 units left).</p>
            <p>Cycle count for Zone A is due tomorrow.</p>
          </div>
        </div>
      )}

      {scanOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setScanOpen(false)}>
          <div className="bg-white rounded-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Scan Barcode</p>
              <button onClick={() => setScanOpen(false)}><X size={16} /></button>
            </div>
            <div className="h-40 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500 text-sm mb-4">
              Camera preview unavailable in demo
            </div>
            <input autoFocus className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm" placeholder="Or type SKU / barcode manually..." />
          </div>
        </div>
      )}
    </div>
  );
}
