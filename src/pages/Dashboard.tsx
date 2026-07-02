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

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        <StatCard icon={TrendingUp} label="Total Inventory Value" value="$4.2M" trend="+13.5%" trendUp tone="green" />
        <StatCard icon={Package} label="Total SKUs" value="12,480" trend="+450 new" trendUp tone="blue" />
        <StatCard icon={WarehouseIcon} label="Warehouse Count" value="8 Sites" tone="zinc" />
        <StatCard icon={AlertTriangle} label="Low Stock" value="42 Items" tone="amber" />
        <StatCard icon={AlertTriangle} label="Out of Stock" value="12 Items" tone="red" />
        <StatCard icon={Clock} label="Pending Req." value="18" tone="zinc" />
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
        <StatCard icon={Clock} label="Pending Approvals" value="7" tone="amber" />
        <StatCard icon={Truck} label="Goods Received Today" value="320" tone="zinc" />
        <StatCard icon={Check} label="Goods Issued Today" value="285" tone="green" />
        <StatCard icon={AlertTriangle} label="Damaged Items" value="4" tone="red" />
        <StatCard icon={Clock} label="Expired Items" value="2" tone="amber" />
        <StatCard icon={Star} label="Inventory Accuracy" value="99.4%" tone="green" />
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        <Card title="Inventory Value Trend" subtitle={`Consolidated stock valuation — ${range}`} className="col-span-2">
          <div className="h-48 flex items-end gap-3 border-b border-zinc-100 pb-1">
            {[60, 65, 68, 70, 72, 78].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-zinc-200 to-zinc-100 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-2">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Card>
        <Card title="Quick Scan" subtitle="Direct SKU/Serial entry" className="bg-zinc-900 text-white border-zinc-900">
          <input
            value={scan}
            onChange={(e) => setScan(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && processScan()}
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 mb-3"
            placeholder="SKU, Serial, or Barcode..."
          />
          <Button className="w-full justify-center" onClick={processScan}>
            <ScanLine size={14} /> Process Scan
          </Button>
          <p className="text-xs text-zinc-400 mt-3">Last scan: {lastScan}</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-5">
        <Card title="Daily Stock Movement" subtitle="Inbound vs Outbound flow comparison" className="col-span-2">
          <div className="h-40 flex items-end gap-2">
            {[40, 55, 48, 35, 65, 62, 50, 25, 18].map((h, i) => (
              <div key={i} className={`flex-1 rounded-t ${i % 2 ? "bg-zinc-800" : "bg-zinc-300"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </Card>
        <Card title="Warehouse Utilization" subtitle="Combined pallet position occupancy">
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative h-28 w-28 rounded-full" style={{ background: "conic-gradient(#18181b 78%, #e4e4e7 0)" }}>
              <div className="absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-lg font-bold">78%</span>
                <span className="text-[10px] text-zinc-400">TOTAL LOAD</span>
              </div>
            </div>
            <div className="flex gap-6 mt-4 text-xs">
              <div>
                <span className="font-semibold">14,200</span> <span className="text-zinc-400">Occupied</span>
              </div>
              <div>
                <span className="font-semibold">2,180</span> <span className="text-zinc-400">Reserved</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Card title="Purchase Trend" subtitle="PO volume against budget allocation">
          <div className="h-32 flex items-end">
            <svg viewBox="0 0 200 80" className="w-full h-full">
              <polyline fill="none" stroke="#18181b" strokeWidth="2" points="0,70 40,55 80,40 120,30 160,15 200,8" />
            </svg>
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mt-1">
            <span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
          <p className="text-xs text-zinc-400 mt-3">
            Est. Pipeline Value <span className="font-semibold text-zinc-700">$842,500</span>
          </p>
        </Card>
        <Card title="Monthly Consumption" subtitle="Resource utilization by department">
          {[
            ["Engineering", 85, "bg-blue-500"],
            ["Production", 72, "bg-emerald-500"],
            ["R&D", 45, "bg-violet-500"],
            ["Maintenance", 30, "bg-amber-500"],
          ].map(([label, pct, color]) => (
            <div key={label as string} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600">{label}</span>
                <span className="font-medium">{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-100">
                <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </Card>
        <Card title="Activity Feed" subtitle="Recent system events and actions">
          {[
            ["John Doe", "Approved Purchase Requisition PR-2024-0012", "12 mins ago"],
            ["Sarah Smith", "Reported Stock Discrepancy Warehouse A - Zone 4", "45 mins ago"],
            ["System", "Inventory Auto-Sync Complete All Nodes", "3 hours ago"],
            ["Mike Ross", "Issued Goods for Project PRJ-NEPTUNE", "4 hours ago"],
          ].map(([who, what, when], i) => (
            <div key={i} className="flex gap-2 mb-3 last:mb-0">
              <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-semibold">
                {who[0]}
              </div>
              <div className="text-xs">
                <p className="font-medium text-zinc-800">{who}</p>
                <p className="text-zinc-500">{what}</p>
                <p className="text-zinc-300">{when}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
