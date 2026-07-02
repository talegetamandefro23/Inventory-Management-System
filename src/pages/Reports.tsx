import { useState } from "react";
import { BarChart2, Download } from "lucide-react";
import { Button, Card, PageHeader, StatCard } from "../components/ui";

const TABS = ["Inventory", "Procurement", "Warehouse", "Assets", "Financial"];

const INV_DATA = [
  { label: "Jan", value: 380 },
  { label: "Feb", value: 420 },
  { label: "Mar", value: 390 },
  { label: "Apr", value: 510 },
  { label: "May", value: 480 },
  { label: "Jun", value: 560 },
];

export default function Reports() {
  const [tab, setTab] = useState("Inventory");
  const max = Math.max(...INV_DATA.map((d) => d.value));

  return (
    <div>
      <PageHeader
        trail={["Reports"]}
        title="Reports & Analytics"
        subtitle="Operational and financial reporting across inventory, procurement, and assets."
        actions={
          <Button variant="secondary">
            <Download size={14} /> Export Report
          </Button>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={BarChart2} label="Reports Generated (MTD)" value="48" tone="blue" />
        <StatCard icon={BarChart2} label="Scheduled Reports" value="12" tone="zinc" />
        <StatCard icon={BarChart2} label="Alerts Triggered" value="7" tone="amber" />
        <StatCard icon={BarChart2} label="Data Freshness" value="Live" tone="green" />
      </div>

      <div className="flex gap-2 mb-5 border-b border-zinc-100 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${tab === t ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Inventory" && (
        <div className="grid grid-cols-2 gap-5">
          <Card title="Monthly Stock Movement" subtitle="Total items received vs issued per month">
            <div className="h-52 flex items-end gap-4 border-b border-zinc-100 pb-2">
              {INV_DATA.map((d) => (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-zinc-400">{d.value}</span>
                  <div className="w-full bg-zinc-800 rounded-t" style={{ height: `${(d.value / max) * 100}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-zinc-400 mt-2">
              {INV_DATA.map((d) => <span key={d.label}>{d.label}</span>)}
            </div>
          </Card>

          <Card title="Stock Status Breakdown" subtitle="Current distribution by status">
            <div className="space-y-3 mt-2">
              {[
                ["Active Items", 72, "bg-emerald-500", "1,120 SKUs"],
                ["Low Stock", 18, "bg-amber-400", "280 SKUs"],
                ["Out of Stock", 10, "bg-red-400", "156 SKUs"],
              ].map(([label, pct, color, count]) => (
                <div key={label as string}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-600">{label}</span>
                    <span className="text-zinc-400">{count} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-zinc-100 rounded-full">
                    <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct as number}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Inventory Accuracy Trend" subtitle="Daily accuracy % from cycle counts">
            <div className="h-40 flex items-end gap-1">
              {[97.2, 97.8, 98.1, 97.9, 98.3, 98.4, 98.0, 98.6, 98.4, 99.1].map((v, i) => (
                <div key={i} className="flex-1 bg-zinc-200 rounded-t" style={{ height: `${((v - 96) / 4) * 100}%` }} />
              ))}
            </div>
            <div className="text-xs text-zinc-400 text-center mt-2">Last 10 audits</div>
          </Card>

          <Card title="Top Consumed Items" subtitle="By volume issued this month">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                  <th className="py-2 font-medium">Item</th>
                  <th className="py-2 font-medium text-right">Units Issued</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Lithium Battery X1", 450],
                  ["Control Board MK3", 380],
                  ["Motor Assembly Kit", 275],
                  ["Copper Wiring 50m", 220],
                  ["Aluminum Bracket", 198],
                ].map(([name, qty]) => (
                  <tr key={name as string} className="border-b border-zinc-50">
                    <td className="py-2">{name}</td>
                    <td className="py-2 text-right font-medium">{qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab !== "Inventory" && (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
            <BarChart2 size={22} />
          </div>
          <p className="font-medium text-zinc-700">{tab} Reports</p>
          <p className="text-sm text-zinc-400 max-w-sm mt-1">
            {tab} reporting analytics will be displayed here. Select a date range and metric type to generate.
          </p>
          <Button className="mt-4">Generate {tab} Report</Button>
        </Card>
      )}
    </div>
  );
}
