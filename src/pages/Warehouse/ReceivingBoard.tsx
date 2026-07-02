import { useState } from "react";
import { Plus, Truck, Clock, AlertTriangle, TrendingUp, Package } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

interface Shipment {
  name: string;
  po: string;
  time: string;
  skus: string;
  tone: "red" | "amber" | "zinc";
  priority: string;
  progress?: number;
  who?: string;
}

const INITIAL: Record<string, Shipment[]> = {
  "PLANNED / EXPECTED": [
    { name: "Nordic Hardware Supply", po: "PO-2024-012", time: "11:30 AM", skus: "15 SKUs", tone: "amber", priority: "Medium Priority" },
    { name: "Summit Packaging Co.", po: "PO-2024-045", time: "02:00 PM", skus: "8 SKUs", tone: "zinc", priority: "Low Priority" },
  ],
  "AT DOCK / ACTIVE": [
    { name: "Global Logistics Corp", po: "PO-2024-001", time: "09:00 AM", skus: "24 SKUs", tone: "red", priority: "High Priority", progress: 45, who: "David Chen" },
    { name: "Industrial Gears Ltd", po: "PO-2024-099", time: "10:45 AM", skus: "42 SKUs", tone: "amber", priority: "Medium Priority", progress: 15, who: "Marcus Tao" },
  ],
  "QC / STAGING": [
    { name: "Precision Electronics", po: "PO-2023-882", time: "08:15 AM", skus: "120 SKUs", tone: "red", priority: "High Priority", progress: 80, who: "Sarah Miller" },
  ],
};

export default function ReceivingBoard() {
  const [board, setBoard] = useState(INITIAL);
  const { addToast } = useToast();

  function assignClerk(col: string, idx: number) {
    setBoard((prev) => {
      const next = { ...prev };
      const item = { ...next[col][idx], progress: 5, who: "Unassigned Clerk" };
      next[col] = next[col].map((s, i) => (i === idx ? item : s));
      return next;
    });
  }

  return (
    <div>
      <PageHeader trail={["Warehouse", "Receiving Board"]} title="Receiving Board" subtitle="Orchestrate inbound shipments and clerk assignments." actions={<Button onClick={() => addToast("New inbound task created", "success")}><Plus size={14} />New Inbound Task</Button>} />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Truck} label="Total Shipments" value="12" tone="indigo" />
        <StatCard icon={Clock} label="Expected" value="08" tone="amber" />
        <StatCard icon={AlertTriangle} label="Delayed" value="02" tone="red" />
        <StatCard icon={TrendingUp} label="Throughput" value="85%" tone="green" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        {Object.entries(board).map(([col, items]) => (
          <div key={col}>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">
              {col} <span className="text-zinc-300 dark:text-zinc-600">{items.length}</span>
            </p>
            <div className="space-y-3">
              {items.map((it, idx) => (
                <Card key={it.name}>
                  <div className="flex justify-between items-start mb-2">
                    <Badge tone={it.tone}>{it.priority}</Badge>
                  </div>
                  <p className="font-medium text-sm">{it.name}</p>
                  <p className="text-xs text-zinc-400 mb-2">PO: {it.po}</p>
                  <div className="flex gap-3 text-xs text-zinc-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {it.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package size={11} />
                      {it.skus}
                    </span>
                  </div>
                  {it.progress != null ? (
                    <>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">Receiving Progress</span>
                        <span>{it.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3">
                        <div className="h-1.5 bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${it.progress}%` }} />
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="h-5 w-5 rounded-full bg-zinc-200" />
                        {it.who}
                      </div>
                    </>
                  ) : (
                    <button onClick={() => assignClerk(col, idx)} className="text-xs font-medium text-zinc-700 flex items-center gap-1">
                      Assign Clerk →
                    </button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
