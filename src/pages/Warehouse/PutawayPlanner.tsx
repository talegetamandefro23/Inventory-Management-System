import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

interface QueueItem {
  id: string;
  name: string;
  meta: string;
  suggestion?: string;
  hazard?: boolean;
}

const QUEUE: QueueItem[] = [
  { id: "PT-8801", name: "Industrial Compressor Valve", meta: "45 Units · Mechanical", suggestion: "A1-04-12" },
  { id: "PT-8802", name: "Lithium Ion Battery Pack", meta: "12 Crates · Electronics", hazard: true, suggestion: "B4-02-09" },
  { id: "PT-8803", name: "Precision Steel Bolts", meta: "200 Boxes · Fasteners", suggestion: "D1-09-02" },
  { id: "PT-8804", name: "Hydraulic Fluid XL", meta: "5 Drums · Liquids", hazard: true, suggestion: "C2-01-04" },
  { id: "PT-8805", name: "Heavy Duty Casing", meta: "8 Pallets · Structural", suggestion: "E1-12-01" },
];

export default function PutawayPlanner() {
  const [active, setActive] = useState(QUEUE[0]);
  const [allocated, setAllocated] = useState<string[]>([]);
  const { addToast } = useToast();

  function confirmAllocation() {
    setAllocated((prev) => [...prev, active.id]);
    addToast(`"${active.name}" allocated to ${active.suggestion}`, "success");
    const next = QUEUE.find((q) => !allocated.includes(q.id) && q.id !== active.id);
    if (next) setActive(next);
  }

  const suggestions = [
    { loc: active.suggestion ?? "A1-04-12", desc: "Fast-moving proximity", pct: 98 },
    { loc: "B4-02-09", desc: "Same category proximity", pct: 84 },
    { loc: "D1-09-02", desc: "Available bulk capacity", pct: 67 },
  ];

  return (
    <div>
      <PageHeader trail={["Warehouse Management", "Putaway Planner"]} title="Putaway Planner & Bin Allocation" actions={<><Button variant="secondary">View History</Button><Button><Plus size={14} />Bulk Allocate</Button></>} />
      <div className="grid grid-cols-3 gap-5">
        <Card title="Arrival Queue" actions={<Badge tone="amber">{QUEUE.length - allocated.length} Pending</Badge>}>
          <input className="w-full mb-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm" placeholder="Filter by SKU or ID..." />
          <div className="space-y-2">
            {QUEUE.filter((q) => !allocated.includes(q.id)).map((q) => (
              <button
                key={q.id}
                onClick={() => setActive(q)}
                className={`w-full text-left rounded-lg border p-3 transition-all duration-150 ${active.id === q.id ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 dark:border-primary-700" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-zinc-400">{q.id}</span>
                  {q.hazard && <Badge tone="red">Hazard</Badge>}
                </div>
                <p className="font-medium text-sm">{q.name}</p>
                <p className="text-xs text-zinc-400 mb-1">{q.meta}</p>
                {q.suggestion && <p className="text-xs text-zinc-600 flex items-center gap-1">↗ Suggested: {q.suggestion}</p>}
              </button>
            ))}
            {QUEUE.length === allocated.length && <p className="text-xs text-zinc-400 text-center py-4">Queue cleared 🎉</p>}
          </div>
        </Card>
        <Card title="Visual Storage Mapping" subtitle="Schematic view of Warehouse Zone Alpha & Beta" className="col-span-2">
          {[1, 2, 3, 4].map((row) => (
            <div key={row} className="flex gap-3 mb-4">
              {["A1", "A2", "A3", "A4", "A5", "A6", "A7"].map((b, i) => (
                <div key={b} className={`h-9 w-9 rounded-lg flex items-center justify-center text-[9px] font-medium ${i === 0 && row === 1 ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-500"}`}>
                  {b}
                  {row}
                </div>
              ))}
            </div>
          ))}
          <Button variant="secondary">Open Full Map View</Button>
        </Card>
      </div>
      {QUEUE.length > allocated.length && (
        <div className="grid grid-cols-3 gap-5 mt-5">
          <div className="col-span-2">
            <Card title="Allocation Detail" actions={<Badge tone="indigo">AI Recommended</Badge>}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Package size={16} />
                </div>
                <div>
                  <p className="font-medium text-sm">{active.name}</p>
                  <p className="text-xs text-zinc-400">{active.id} · {active.meta}</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-zinc-400 mb-2">SMART SUGGESTIONS</p>
              {suggestions.map((s, i) => (
                <div key={s.loc} className={`flex items-center justify-between rounded-lg border p-3 mb-2 transition-all duration-150 ${i === 0 ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 dark:border-primary-700" : "border-zinc-200 dark:border-zinc-700"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-primary-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>{s.loc.slice(0, 2)}</div>
                    <div>
                      <p className="font-medium text-sm">{s.loc}</p>
                      <p className="text-xs text-zinc-400">{s.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold">{s.pct}% Match</span>
                </div>
              ))}
            </Card>
          </div>
          <Card title="Assign Clerk">
            <label className="text-xs text-zinc-500">Assigned Personnel</label>
            <input className="w-full mt-1 mb-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="Alex Chen (Zone A)" />
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-zinc-500">Est. Transport Time</span><span className="font-medium">4.5 mins</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Equipment Required</span><span className="font-medium">Forklift 02</span></div>
            </div>
            <Button className="w-full justify-center mb-2" onClick={confirmAllocation}>Confirm Allocation & Assign</Button>
            <Button variant="secondary" className="w-full justify-center" onClick={confirmAllocation}>Postpone Task</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
