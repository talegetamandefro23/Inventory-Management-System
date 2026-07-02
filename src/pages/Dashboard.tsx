import { useState } from "react";
import {
  TrendingUp, Package, Warehouse as WarehouseIcon, AlertTriangle, Clock, Check,
  Truck, Star, ScanLine,
} from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../components/ui";

const RANGE_OPTIONS = ["Today", "Last 7 Days", "This Month", "Custom Range"];

export default function Dashboard() {
  const [range, setRange] = useState("Last 7 Days");
  const [scan, setScan] = useState("");
  const [lastScan, setLastScan] = useState("BAT-LITH-009");

  function processScan() {
    if (!scan.trim()) return;
    setLastScan(scan.trim());
    setScan("");
  }

  return (
    <div>
      <PageHeader
        trail={["Home", "Dashboard"]}
        title="Executive Overview"
        subtitle="Real-time inventory insights and warehouse operations status."
        actions={RANGE_OPTIONS.map((r) => (
          <Button key={r} variant={range === r ? "primary" : "secondary"} onClick={() => setRange(r)}>
            {r}
          </Button>
        ))}
      />

      {/* KPI Row 1 */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        <StatCard icon={TrendingUp} label="Total Inventory Value" value="$4.2M" trend="+13.5%" trendUp tone="green" />
        <StatCard icon={Package} label="Total SKUs" value="12,480" trend="+450 new" trendUp tone="indigo" />
        <StatCard icon={WarehouseIcon} label="Warehouse Count" value="8 Sites" tone="teal" />
        <StatCard icon={AlertTriangle} label="Low Stock" value="42 Items" tone="amber" />
        <StatCard icon={AlertTriangle} label="Out of Stock" value="12 Items" tone="red" />
        <StatCard icon={Clock} label="Pending Req." value="18" tone="zinc" />
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        <StatCard icon={Clock} label="Pending Approvals" value="7" tone="amber" />
        <StatCard icon={Truck} label="Goods Received Today" value="320" tone="teal" />
        <StatCard icon={Check} label="Goods Issued Today" value="285" tone="green" />
        <StatCard icon={AlertTriangle} label="Damaged Items" value="4" tone="red" />
        <StatCard icon={Clock} label="Expired Items" value="2" tone="amber" />
        <StatCard icon={Star} label="Inventory Accuracy" value="99.4%" tone="green" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        <Card title="Inventory Value Trend" subtitle={`Consolidated stock valuation — ${range}`} className="col-span-2">
          <div className="h-48 flex items-end gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-1">
            {[60, 65, 68, 70, 72, 78].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-primary-200 to-primary-100 dark:from-primary-800 dark:to-primary-700 rounded-t transition-all duration-500" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-2">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Card>

        <Card title="Quick Scan" subtitle="Direct SKU/Serial entry" className="bg-gradient-to-br from-primary-900 to-primary-950 text-white border-primary-800">
          <input
            value={scan}
            onChange={(e) => setScan(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && processScan()}
            className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/40 mb-3 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="SKU, Serial, or Barcode..."
          />
          <Button className="w-full justify-center bg-white text-primary-700 hover:bg-white/90" onClick={processScan}>
            <ScanLine size={14} /> Process Scan
          </Button>
          <p className="text-xs text-white/50 mt-3">Last scan: <span className="text-white/80 font-medium">{lastScan}</span></p>
        </Card>
      </div>

      {/* Movement & Utilization */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        <Card title="Daily Stock Movement" subtitle="Inbound vs Outbound flow comparison" className="col-span-2">
          <div className="h-40 flex items-end gap-2">
            {[40, 55, 48, 35, 65, 62, 50, 25, 18].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all duration-300 ${
                  i % 2
                    ? "bg-primary-600 dark:bg-primary-500"
                    : "bg-secondary-400 dark:bg-secondary-500"
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-primary-600" />
              <span className="text-zinc-500">Inbound</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-secondary-400" />
              <span className="text-zinc-500">Outbound</span>
            </div>
          </div>
        </Card>

        <Card title="Warehouse Utilization" subtitle="Combined pallet position occupancy">
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative h-28 w-28 rounded-full" style={{ background: "conic-gradient(#4f46e5 78%, #e4e4e7 0)" }}>
              <div className="absolute inset-3 rounded-full bg-white dark:bg-zinc-900 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-zinc-900 dark:text-white">78%</span>
                <span className="text-[10px] text-zinc-400">TOTAL LOAD</span>
              </div>
            </div>
            <div className="flex gap-6 mt-4 text-xs">
              <div>
                <span className="font-semibold text-zinc-900 dark:text-white">14,200</span> <span className="text-zinc-400">Occupied</span>
              </div>
              <div>
                <span className="font-semibold text-zinc-900 dark:text-white">2,180</span> <span className="text-zinc-400">Reserved</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-5">
        <Card title="Purchase Trend" subtitle="PO volume against budget allocation">
          <div className="h-32 flex items-end">
            <svg viewBox="0 0 200 80" className="w-full h-full">
              <polyline fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points="0,70 40,55 80,40 120,30 160,15 200,8" />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-1">
            <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
          <p className="text-xs text-zinc-400 mt-3">
            Est. Pipeline Value <span className="font-semibold text-zinc-700 dark:text-zinc-300">$842,500</span>
          </p>
        </Card>

        <Card title="Monthly Consumption" subtitle="Resource utilization by department">
          {[
            ["Engineering", 85, "bg-primary-500"],
            ["Production", 72, "bg-secondary-500"],
            ["R&D", 45, "bg-tertiary-500"],
            ["Maintenance", 30, "bg-zinc-400"],
          ].map(([label, pct, color]) => (
            <div key={label as string} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
                <span className="font-medium text-zinc-900 dark:text-white">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className={`h-1.5 rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </Card>

        <Card title="Activity Feed" subtitle="Recent system events and actions">
          {[
            { who: "John Doe", initial: "JD", what: "Approved Purchase Requisition PR-2024-0012", when: "12 mins ago", color: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400" },
            { who: "Sarah Smith", initial: "SS", what: "Reported Stock Discrepancy Warehouse A - Zone 4", when: "45 mins ago", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
            { who: "System", initial: "SY", what: "Inventory Auto-Sync Complete All Nodes", when: "3 hours ago", color: "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/40 dark:text-secondary-400" },
            { who: "Mike Ross", initial: "MR", what: "Issued Goods for Project PRJ-NEPTUNE", when: "4 hours ago", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
          ].map((item, i) => (
            <div key={i} className="flex gap-2.5 mb-3 last:mb-0">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${item.color}`}>
                {item.initial}
              </div>
              <div className="text-xs">
                <p className="font-medium text-zinc-800 dark:text-zinc-200">{item.who}</p>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.what}</p>
                <p className="text-zinc-300 dark:text-zinc-600 mt-0.5">{item.when}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
