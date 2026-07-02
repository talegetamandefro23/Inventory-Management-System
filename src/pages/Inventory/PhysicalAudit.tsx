import { useState } from "react";
import { Plus, Check, ClipboardList, AlertTriangle, ScanLine } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";

export default function PhysicalAudit() {
  const [progress, setProgress] = useState(36);

  return (
    <div>
      <PageHeader
        trail={["Inventory", "Cycle Counting"]}
        title="Physical Inventory Audit"
        subtitle="Manage, execute, and reconcile warehouse stock counts."
        actions={
          <>
            <Button variant="secondary">View History</Button>
            <Button>
              <Plus size={14} /> Create New Schedule
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Check} label="Inventory Accuracy" value="98.4%" trend="+1.2%" trendUp tone="green" />
        <StatCard icon={ClipboardList} label="Open Schedules" value="12" tone="zinc" />
        <StatCard icon={AlertTriangle} label="Net Discrepancy" value="-$1,240" trend="-4.5%" tone="red" />
        <StatCard icon={ScanLine} label="Items Scanned" value="4,821" trend="+12%" trendUp tone="blue" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <Card title="Quarterly High-Value Audit" subtitle="Zone A - Electronics & Precision Tools" actions={<Badge tone="amber">High Priority</Badge>}>
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>Assigned to Michael Chen</span>
              <span className="text-red-500">Due Tomorrow</span>
            </div>
            <p className="text-xs mb-1">Progress {progress}% &middot; {Math.round((progress / 100) * 400)}/400 items</p>
            <div className="h-1.5 bg-zinc-100 rounded-full mb-3">
              <div className="h-1.5 bg-zinc-800 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <Button className="w-full justify-center" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
              Continue Count
            </Button>
          </Card>
          <Card title="Zone C - Daily Spot Check" subtitle="Fast Moving Consumer Goods (FMCG)" actions={<Badge tone="green">Finished</Badge>}>
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>Sarah Jenkins</span>
              <span>10:45 AM</span>
            </div>
            <p className="text-xs mb-1">Progress 100% &middot; 100/100 items</p>
            <div className="h-1.5 bg-zinc-100 rounded-full mb-3">
              <div className="h-1.5 bg-emerald-500 rounded-full w-full" />
            </div>
            <Button variant="secondary" className="w-full justify-center">Review Variance</Button>
          </Card>
        </div>
        <Card title="Active Count Helper" subtitle="Quick reference for the current active audit.">
          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between"><span className="text-zinc-500">Last Scanned Location</span><span className="font-medium">BIN-A1-42</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Last Item</span><span className="font-medium">Power Drill Model Z</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Items Remaining</span><span className="font-medium">{400 - Math.round((progress / 100) * 400)}</span></div>
          </div>
          <Button className="w-full justify-center">
            <ScanLine size={14} /> Open Scanner
          </Button>
        </Card>
      </div>
      <Card title="Recent Reconciliation History">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
              <th className="py-2 font-medium">Audit Date</th>
              <th className="py-2 font-medium">Type</th>
              <th className="py-2 font-medium">Warehouse</th>
              <th className="py-2 font-medium">Auditor</th>
              <th className="py-2 font-medium">Total Items</th>
              <th className="py-2 font-medium">Net Adjustment</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Aug 10, 2024", "Cycle Count", "Central Hub", "Admin User", 450, "-$450.00"],
              ["Aug 05, 2024", "Spot Check", "North Branch", "S. Jenkins", 12, "+$25.00"],
              ["Jul 28, 2024", "Wall-to-Wall", "Cold Storage", "M. Chen", 2100, "-$3,420.00"],
            ].map((r, i) => (
              <tr key={i} className="border-b border-zinc-50">
                <td className="py-3">{r[0]}</td>
                <td className="py-3">{r[1]}</td>
                <td className="py-3">{r[2]}</td>
                <td className="py-3">{r[3]}</td>
                <td className="py-3">{r[4]}</td>
                <td className={`py-3 font-medium ${String(r[5]).startsWith("-") ? "text-red-500" : "text-emerald-600"}`}>{r[5]}</td>
                <td className="py-3">
                  <Badge tone="green">Posted</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
