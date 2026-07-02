import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Check, AlertTriangle, Clock, Filter } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

interface Zone {
  name: string;
  sub: string;
  util: number;
  occ: number;
  alerts: number;
  tone: string;
  bins: { bin: string; name: string; sku: string; qty: number }[];
}

const ZONES: Zone[] = [
  {
    name: "Zone A - High Density", sub: "Racking", util: 88, occ: 396, alerts: 12, tone: "border-red-300 bg-red-50 text-red-600",
    bins: [
      { bin: "A-101", name: "Industrial Compressor X1", sku: "SKU-8821", qty: 45 },
      { bin: "A-102", name: "Hydraulic Seals (Pack 50)", sku: "SKU-1190", qty: 22 },
    ],
  },
  {
    name: "Zone B - Standard", sub: "Racking", util: 42, occ: 252, alerts: 0, tone: "border-emerald-300 bg-emerald-50 text-emerald-700",
    bins: [{ bin: "B-201", name: "Standard Pallet Jack", sku: "SKU-7701", qty: 18 }],
  },
  {
    name: "Zone C - Cold Chain", sub: "Cold Storage", util: 65, occ: 130, alerts: 5, tone: "border-amber-300 bg-amber-50 text-amber-700",
    bins: [{ bin: "C-301", name: "Refrigerated Sealant", sku: "SKU-3301", qty: 9 }],
  },
];

export default function WarehouseMap() {
  const [active, setActive] = useState(ZONES[0]);
  const navigate = useNavigate();
  const { addToast } = useToast();

  return (
    <div>
      <PageHeader
        trail={["Warehouse", "Digital Map & Heatmap"]}
        title="Main Distribution Center (DC-01)"
        subtitle="Real-time spatial visualization and utilization intelligence."
        actions={
          <>
            <Button variant="secondary">
              <Filter size={14} /> Filters
            </Button>
            <Button onClick={() => addToast("Layout optimization analysis started", "info")}>Optimize Layout</Button>
          </>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={LayoutGrid} label="+2.4% capacity used" value="76.4%" tone="indigo" />
        <StatCard icon={Check} label="clerks on floor" value="14 / 20" tone="zinc" />
        <StatCard icon={AlertTriangle} label="Zones A, E reaching capacity" value="02 Zones" tone="red" />
        <StatCard icon={Clock} label="pallets at receiving" value="142" tone="amber" />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 grid grid-cols-3 gap-3">
          {ZONES.map((z) => (
            <button key={z.name} onClick={() => setActive(z)} className={`text-left rounded-xl border-2 p-4 ${z.tone} ${active.name === z.name ? "ring-2 ring-zinc-900" : ""}`}>
              <p className="text-[10px] uppercase font-semibold opacity-70">{z.sub}</p>
              <p className="font-bold text-sm mb-3">{z.name}</p>
              <p className="text-xs mb-1">Utilization {z.util}%</p>
              <div className="h-1.5 bg-white/60 rounded-full mb-3">
                <div className="h-1.5 bg-current rounded-full" style={{ width: `${z.util}%` }} />
              </div>
              <div className="flex justify-between text-xs">
                <span>Bins {z.occ}/600</span>
                <span>Alerts {z.alerts}</span>
              </div>
            </button>
          ))}
        </div>
        <Card title={active.name} subtitle="Comprehensive drill-down of storage bins and items.">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-zinc-400">Occupied</p>
              <p className="font-bold">{active.occ}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Alerts</p>
              <p className="font-bold text-red-500">{active.alerts}</p>
            </div>
          </div>
          <p className="text-xs font-semibold text-zinc-400 mb-2">PRIORITY BIN CONTENTS</p>
          {active.bins.map((b) => (
            <div key={b.bin} className="border-b border-zinc-50 py-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{b.bin}</span>
                <span className="text-zinc-400">2h ago</span>
              </div>
              <p className="text-sm">{b.name}</p>
              <div className="flex justify-between text-xs text-zinc-400">
                <Badge>{b.sku}</Badge>
                <span>Qty: {b.qty}</span>
              </div>
            </div>
          ))}
          <Button variant="secondary" className="w-full justify-center mt-3" onClick={() => navigate("/warehouse/locations")}>
            View Locations & Bins →
          </Button>
        </Card>
      </div>
    </div>
  );
}
