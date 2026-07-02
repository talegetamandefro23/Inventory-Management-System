import { useState } from "react";
import { MapPin, ScanLine, Check } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";

interface Task {
  loc: string;
  name: string;
  sku: string;
  qty: string;
  status: "Picked" | "In Progress" | "Pending";
}

const INITIAL: Task[] = [
  { loc: "A-12-04", name: "Industrial Grade Servo Motor X-Series", sku: "EAG-7721", qty: "2/2", status: "Picked" },
  { loc: "B-04-11", name: "Logic Controller PLC-9000 V2", sku: "EAG-0904", qty: "1/1", status: "Picked" },
  { loc: "B-06-02", name: "High-Tensile Steel Fastener Pack (500ct)", sku: "ACC-1102", qty: "4/10", status: "In Progress" },
  { loc: "C-01-09", name: "Infrared Proximity Sensor Module", sku: "SNR-2200", qty: "0/5", status: "Pending" },
  { loc: "D-02-15", name: "Shielded CAT6 Ethernet Cable 15m", sku: "CBL-8812", qty: "0/8", status: "Pending" },
];

const TONE: Record<string, "green" | "amber" | "zinc"> = { Picked: "green", "In Progress": "amber", Pending: "zinc" };
const CHECKLIST = ["Verify SKU & Quantity Match", "Physical Inspection (Damage-free)", "Add Sufficient Protective Padding", "Affix Internal Packing Slip"];

export default function PickingPacking() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [checked, setChecked] = useState<boolean[]>([true, false, false, false]);
  const [scan, setScan] = useState("");
  const [lastScan, setLastScan] = useState("SN-8813 Verified");

  const verifiedCount = tasks.filter((t) => t.status === "Picked").length;

  function advanceTask(loc: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.loc !== loc) return t;
        if (t.status === "Pending") return { ...t, status: "In Progress" };
        if (t.status === "In Progress") return { ...t, status: "Picked", qty: t.qty.split("/").reverse().join("/").split("/").reverse().join("/") };
        return t;
      })
    );
  }

  function submitScan() {
    if (!scan.trim()) return;
    setLastScan(`${scan.trim()} Verified`);
    setScan("");
  }

  function toggleCheck(i: number) {
    setChecked((prev) => prev.map((c, idx) => (idx === i ? !c : c)));
  }

  return (
    <div>
      <PageHeader
        trail={["Dashboard", "Warehouse", "Picking & Packing"]}
        title="Picking & Packing"
        subtitle="Fulfilling Shipment: SHIP-22901-EX"
        actions={
          <>
            <Button variant="secondary">Report Discrepancy</Button>
            <Button variant="secondary">New Box</Button>
            <Button>Complete Picking →</Button>
          </>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Check} label="Active Pick List" value="PL-2024-8891" tone="zinc" />
        <StatCard icon={Check} label="Route Progress" value={`${Math.round((verifiedCount / tasks.length) * 100)}%`} tone="amber" />
        <StatCard icon={Check} label="Items Verified" value={`${verifiedCount} / ${tasks.length}`} tone="green" />
        <StatCard icon={Check} label="Package Count" value="02 Units" tone="blue" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <Card title="Pick List Details" subtitle="Zone B1 - South Warehouse Wings" className="col-span-2" actions={<div className="flex gap-2"><Button variant="secondary">Optimize Route</Button><Button variant="secondary">Pick History</Button></div>}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                <th className="py-2 font-medium">Location</th>
                <th className="py-2 font-medium">Item Information</th>
                <th className="py-2 font-medium">Qty</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.loc} className="border-b border-zinc-50 cursor-pointer hover:bg-zinc-50" onClick={() => advanceTask(t.loc)}>
                  <td className="py-3 flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin size={11} />
                    {t.loc}
                  </td>
                  <td className="py-3">
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.sku}</p>
                  </td>
                  <td className="py-3 font-medium">{t.qty}</td>
                  <td className="py-3">
                    <Badge tone={TONE[t.status]}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-zinc-400 mt-2">Click a row to advance its pick status.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="rounded-lg border border-zinc-100 p-3 text-center text-xs text-zinc-500">
              Packing Area: Station 04
              <br />
              <span className="text-zinc-300">Automated Label Printer: Active</span>
            </div>
            <div className="rounded-lg border border-zinc-100 p-3 text-center text-xs text-zinc-500">
              Shipment Weight
              <br />
              <span className="font-bold text-zinc-800 text-sm">12.45 kg</span>
            </div>
          </div>
        </Card>
        <div className="space-y-5">
          <Card title="Verification Terminal" subtitle="Scan SKU, Batch, or Serial to verify">
            <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 mb-3">
              <ScanLine size={14} className="text-zinc-400" />
              <input
                value={scan}
                onChange={(e) => setScan(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitScan()}
                className="outline-none text-sm w-full"
                placeholder="Awaiting scan..."
              />
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-lg p-2 text-xs">
              <Check size={14} /> Last Scanned: {lastScan}
            </div>
          </Card>
          <Card title="Packing Checklist">
            {CHECKLIST.map((c, i) => (
              <label key={c} className="flex items-center gap-2 text-sm mb-2">
                <input type="checkbox" checked={checked[i]} onChange={() => toggleCheck(i)} className="rounded" /> {c}
              </label>
            ))}
            <Button variant="secondary" className="w-full justify-center mt-2" disabled={!checked.every(Boolean)}>
              Generate Packing Slip
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
