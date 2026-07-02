import { useState } from "react";
import { Plus, Check, ClipboardList, AlertTriangle, ScanLine } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

export default function PhysicalAudit() {
  const [progress, setProgress] = useState(36);
  const { addToast } = useToast();

  return (
    <div>
      <PageHeader
        trail={["Inventory", "Cycle Counting"]}
        title="Physical Inventory Audit"
        subtitle="Manage, execute, and reconcile warehouse stock counts."
        actions={
          <>
            <Button variant="secondary" onClick={() => addToast("Audit history loaded", "info")}>View History</Button>
            <Button onClick={() => addToast("New audit schedule created", "success")}><Plus size={14} /> Create New Schedule</Button>
          </>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Check} label="Inventory Accuracy" value="98.4%" trend="+1.2%" trendUp tone="green" />
        <StatCard icon={ClipboardList} label="Open Schedules" value="12" tone="indigo" />
        <StatCard icon={AlertTriangle} label="Net Discrepancy" value="-$1,240" trend="-4.5%" tone="red" />
        <StatCard icon={ScanLine} label="Items Scanned" value="4,821" trend="+12%" trendUp tone="teal" />
      </div>
      <div className="grid grid-cols-3 gap-5 mb-5">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <Card title="Quarterly High-Value Audit" subtitle="Zone A - Electronics & Precision Tools" actions={<Badge tone="amber" dot>High Priority</Badge>}>
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span>Assigned to Michael Chen</span>
              <span className="text-rose-500 font-medium">Due Tomorrow</span>
            </div>
            <p className="text-xs mb-1.5">
              Progress <span className="font-semibold text-zinc-900 dark:text-white">{progress}%</span> &middot; {Math.round((progress / 100) * 400)}/400 items
            </p>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3">
              <div className="h-2 bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <Button className="w-full justify-center" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
              Continue Count
            </Button>
          </Card>
          <Card title="Zone C - Daily Spot Check" subtitle="Fast Moving Consumer Goods (FMCG)" actions={<Badge tone="green" dot>Finished</Badge>}>
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span>Sarah Jenkins</span>
              <span>10:45 AM</span>
            </div>
            <p className="text-xs mb-1.5">
              Progress <span className="font-semibold text-zinc-900 dark:text-white">100%</span> &middot; 100/100 items
            </p>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3">
              <div className="h-2 bg-emerald-500 rounded-full w-full" />
            </div>
            <Button variant="secondary" className="w-full justify-center">Review Variance</Button>
          </Card>
        </div>
        <Card title="Active Count Helper" subtitle="Quick reference for the current active audit.">
          <div className="space-y-3 text-sm mb-3">
            <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Last Scanned Location</span><span className="font-medium text-zinc-900 dark:text-white">BIN-A1-42</span></div>
            <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Last Item</span><span className="font-medium text-zinc-900 dark:text-white">Power Drill Model Z</span></div>
            <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Items Remaining</span><span className="font-medium text-zinc-900 dark:text-white">{400 - Math.round((progress / 100) * 400)}</span></div>
          </div>
          <Button className="w-full justify-center">
            <ScanLine size={14} /> Open Scanner
          </Button>
        </Card>
      </div>
      <Card title="Recent Reconciliation History">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                <th className="py-2.5 font-medium">Audit Date</th>
                <th className="py-2.5 font-medium">Type</th>
                <th className="py-2.5 font-medium">Warehouse</th>
                <th className="py-2.5 font-medium">Auditor</th>
                <th className="py-2.5 font-medium text-right">Total Items</th>
                <th className="py-2.5 font-medium text-right">Net Adjustment</th>
                <th className="py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: "Aug 10, 2024", type: "Cycle Count", wh: "Central Hub", auditor: "Admin User", items: 450, adj: "-$450.00" },
                { date: "Aug 05, 2024", type: "Spot Check", wh: "North Branch", auditor: "S. Jenkins", items: 12, adj: "+$25.00" },
                { date: "Jul 28, 2024", type: "Wall-to-Wall", wh: "Cold Storage", auditor: "M. Chen", items: 2100, adj: "-$3,420.00" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 font-medium text-zinc-900 dark:text-white">{r.date}</td>
                  <td className="py-3">{r.type}</td>
                  <td className="py-3">{r.wh}</td>
                  <td className="py-3">{r.auditor}</td>
                  <td className="py-3 text-right">{r.items}</td>
                  <td className={`py-3 text-right font-semibold ${r.adj.startsWith("-") ? "text-rose-500" : "text-emerald-600"}`}>{r.adj}</td>
                  <td className="py-3"><Badge tone="green" dot>Posted</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
