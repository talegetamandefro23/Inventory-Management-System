import { useState } from "react";
import { Search, ScanLine, Bell, X, Check, AlertTriangle, Package } from "lucide-react";

const NOTIFICATIONS = [
  { id: 1, icon: AlertTriangle, color: "text-amber-500", text: "3 purchase requisitions awaiting your approval.", time: "5 min ago" },
  { id: 2, icon: Package, color: "text-rose-500", text: "Low stock alert: NVIDIA RTX 4090 FE (3 units left).", time: "12 min ago" },
  { id: 3, icon: Check, color: "text-secondary-500", text: "Cycle count for Zone A is due tomorrow.", time: "1 hour ago" },
];

export default function Topbar() {
  const [scanOpen, setScanOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="relative flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-3 transition-colors">
      {/* Search */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <div className="flex items-center gap-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary-400 transition-all duration-200">
          <Search size={15} className="text-zinc-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-sm w-full dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-500"
            placeholder="Search items, POs, or assets..."
          />
          <span className="ml-auto text-[10px] text-zinc-300 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 font-medium">
            ⌘K
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setScanOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-secondary-200 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-950/30 px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-900/40 transition-all duration-150"
        >
          <ScanLine size={15} /> Scan Barcode
        </button>

        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Bell size={17} className="text-zinc-500 dark:text-zinc-300" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-900" />
        </button>

        <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-semibold shadow-primary-sm">
          JD
        </div>
      </div>

      {/* Notifications Dropdown */}
      {notifOpen && (
        <div className="absolute right-6 top-14 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-modal p-1 z-50 animate-slide-down">
          <div className="flex items-center justify-between px-3 py-2.5">
            <p className="font-semibold text-sm text-zinc-900 dark:text-white">
              Notifications
            </p>
            <button
              onClick={() => setNotifOpen(false)}
              className="text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <div className="border-t border-zinc-100 dark:border-zinc-800" />
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-2.5 px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="mt-0.5">
                <n.icon size={14} className={n.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {n.text}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Barcode Scan Modal */}
      {scanOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setScanOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-96 shadow-modal animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-zinc-900 dark:text-white">
                Scan Barcode
              </p>
              <button
                onClick={() => setScanOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="h-40 rounded-xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm mb-4 border border-zinc-800">
              Camera preview unavailable in demo
            </div>
            <input
              autoFocus
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 dark:bg-zinc-800 dark:text-white transition-all"
              placeholder="Or type SKU / barcode manually..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
