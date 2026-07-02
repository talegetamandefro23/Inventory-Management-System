import { useState, useMemo } from "react";
import {
  MapPin, ChevronDown, ChevronRight, Plus, Download, Filter,
  MoreVertical, Layers, Box, AlertCircle, Check, X,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";

// ─── Types ─────────────────────────────────────────────────────────────────────
type BinStatus = "Active" | "Full" | "Empty" | "Maintenance";
type StorageType = "Pallet" | "Small Bin" | "Bulk" | "Cold" | "Rack";

interface Bin {
  code: string;
  storageType: StorageType;
  capacity: number;
  used: number;
  items: number;
  status: BinStatus;
}

interface Zone {
  id: string;
  name: string;
  binCount: number;
  bins: Bin[];
}

interface Floor {
  id: string;
  name: string;
  zones: Zone[];
}

// ─── Mock data ──────────────────────────────────────────────────────────────────
const WAREHOUSES = ["CDC-North", "CDC-South", "Regional-East", "Cold-Hub"];

const INITIAL_FLOORS: Floor[] = [
  {
    id: "main-floor", name: "Main Floor",
    zones: [
      {
        id: "high-rack", name: "High-Rack Storage", binCount: 120,
        bins: [
          { code: "A1-01-01", storageType: "Pallet", capacity: 100, used: 85, items: 42, status: "Active" },
          { code: "A1-01-02", storageType: "Pallet", capacity: 100, used: 98, items: 56, status: "Full" },
          { code: "A1-02-01", storageType: "Small Bin", capacity: 50, used: 12, items: 8, status: "Active" },
          { code: "A1-02-02", storageType: "Small Bin", capacity: 50, used: 0, items: 0, status: "Empty" },
          { code: "A1-03-01", storageType: "Bulk", capacity: 500, used: 450, items: 120, status: "Active" },
          { code: "A1-03-02", storageType: "Bulk", capacity: 500, used: 500, items: 145, status: "Full" },
          { code: "A1-04-01", storageType: "Rack", capacity: 200, used: 60, items: 35, status: "Active" },
        ],
      },
      {
        id: "picking-area", name: "Picking Area", binCount: 45,
        bins: [
          { code: "B1-01-01", storageType: "Small Bin", capacity: 30, used: 18, items: 12, status: "Active" },
          { code: "B1-01-02", storageType: "Small Bin", capacity: 30, used: 30, items: 22, status: "Full" },
          { code: "B1-02-01", storageType: "Rack", capacity: 80, used: 0, items: 0, status: "Empty" },
        ],
      },
    ],
  },
  {
    id: "cold-storage", name: "Cold Storage",
    zones: [
      {
        id: "cold-zone-a", name: "Cold Zone A", binCount: 30,
        bins: [
          { code: "C1-01-01", storageType: "Cold", capacity: 50, used: 40, items: 18, status: "Active" },
          { code: "C1-01-02", storageType: "Cold", capacity: 50, used: 50, items: 22, status: "Full" },
        ],
      },
    ],
  },
  {
    id: "mezzanine", name: "Mezzanine",
    zones: [
      {
        id: "mez-zone-a", name: "Mezzanine Zone A", binCount: 20,
        bins: [
          { code: "M1-01-01", storageType: "Small Bin", capacity: 25, used: 10, items: 5, status: "Active" },
        ],
      },
    ],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────
function binStatusTone(s: BinStatus): "green" | "red" | "zinc" | "amber" {
  if (s === "Active") return "green";
  if (s === "Full") return "red";
  if (s === "Empty") return "zinc";
  return "amber";
}

function capacityColor(pct: number) {
  if (pct >= 95) return "bg-rose-500";
  if (pct >= 80) return "bg-amber-500";
  return "bg-primary-500";
}

// ─── Add Bin Modal ─────────────────────────────────────────────────────────────
function AddBinModal({ onSave, onClose }: { onSave: (bin: Bin) => void; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<StorageType>("Pallet");
  const [capacity, setCapacity] = useState(100);

  function submit() {
    if (!code.trim()) return;
    onSave({ code: code.trim(), storageType: type, capacity, used: 0, items: 0, status: "Empty" });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[420px] shadow-modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">Add New Bin</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Bin Code *</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" placeholder="e.g., A2-05-01" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Storage Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as StorageType)} className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all">
              {(["Pallet", "Small Bin", "Bulk", "Cold", "Rack"] as StorageType[]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Max Capacity (units)</label>
            <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} min={1} className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="secondary" className="flex-1 justify-center" onClick={onClose}>Cancel</Button>
          <button onClick={submit} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-primary-sm hover:shadow-primary-md transition-all duration-150 active:scale-[0.98]">
            <Check size={14} /> Add Bin
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LocationsBins() {
  const [warehouse, setWarehouse] = useState("CDC-North");
  const [floors, setFloors] = useState<Floor[]>(INITIAL_FLOORS);
  const [openFloors, setOpenFloors] = useState<Set<string>>(new Set(["main-floor"]));
  const [selectedZoneId, setSelectedZoneId] = useState("high-rack");
  const [binFilter, setBinFilter] = useState("");
  const [showAddBin, setShowAddBin] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const { addToast } = useToast();

  const selectedZone = useMemo(() => {
    for (const f of floors) {
      const z = f.zones.find((z) => z.id === selectedZoneId);
      if (z) return z;
    }
    return null;
  }, [floors, selectedZoneId]);

  const filteredBins = useMemo(
    () => (selectedZone?.bins ?? []).filter((b) => b.code.toLowerCase().includes(binFilter.toLowerCase())),
    [selectedZone, binFilter]
  );

  const pagedBins = filteredBins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filteredBins.length / PAGE_SIZE);

  // Stats from selected zone
  const totalBins = selectedZone?.bins.length ?? 0;
  const usedCapacityPct = selectedZone
    ? Math.round((selectedZone.bins.reduce((s, b) => s + b.used, 0) / Math.max(1, selectedZone.bins.reduce((s, b) => s + b.capacity, 0))) * 100)
    : 0;
  const emptySlots = selectedZone?.bins.filter((b) => b.status === "Empty").length ?? 0;
  const criticalBins = selectedZone?.bins.filter((b) => b.status === "Full").length ?? 0;

  function toggleFloor(id: string) {
    setOpenFloors((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function addBin(bin: Bin) {
    setFloors((prev) => prev.map((f) => ({
      ...f,
      zones: f.zones.map((z) =>
        z.id === selectedZoneId ? { ...z, bins: [...z.bins, bin], binCount: z.binCount + 1 } : z
      ),
    })));
    addToast(`Bin "${bin.code}" added successfully`, "success");
  }

  function addZone(floorId: string) {
    const name = prompt("Zone name:");
    if (!name?.trim()) return;
    const id = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setFloors((prev) => prev.map((f) =>
      f.id === floorId ? { ...f, zones: [...f.zones, { id, name, binCount: 0, bins: [] }] } : f
    ));
    addToast(`Zone "${name}" created`, "success");
  }

  return (
    <div>
      <PageHeader
        trail={["Warehouses", warehouse, "Locations & Bins"]}
        title="Warehouse Locations & Bins"
        subtitle="Manage storage zones, bin configurations, and capacity allocation."
        actions={
          <>
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none"
            >
              {WAREHOUSES.map((w) => <option key={w}>{w}</option>)}
            </select>
            <Button variant="secondary"><Download size={14} /> Export Map</Button>
            <button className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-primary-sm hover:shadow-primary-md transition-all duration-150">
              <Plus size={14} /> New Location
            </button>
          </>
        }
      />

      <div className="grid grid-cols-4 gap-5">
        {/* ── Left: Warehouse Explorer ── */}
        <div className="col-span-1">
          <Card className="!p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Warehouse Explorer</p>
              <button><Filter size={14} className="text-zinc-400" /></button>
            </div>
            <div className="py-2 overflow-y-auto max-h-[600px]">
              {floors.map((floor) => {
                const isOpen = openFloors.has(floor.id);
                return (
                  <div key={floor.id}>
                    <button
                      onClick={() => toggleFloor(floor.id)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-50 text-left"
                    >
                      <MapPin size={14} className="text-indigo-500 shrink-0" />
                      <span className="text-sm font-medium text-zinc-700 flex-1">{floor.name}</span>
                      {isOpen ? <ChevronDown size={13} className="text-zinc-400" /> : <ChevronRight size={13} className="text-zinc-400" />}
                    </button>

                    {isOpen && (
                      <div className="pl-4">
                        {floor.zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => { setSelectedZoneId(zone.id); setPage(1); }}
                      className={`w-full flex items-center justify-between gap-2 pl-5 pr-4 py-2 rounded-lg text-sm transition-colors ${
                        selectedZoneId === zone.id
                          ? "bg-primary-50 text-primary-700 font-medium dark:bg-primary-950/30 dark:text-primary-400"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Layers size={13} className="shrink-0" />
                        <span className="truncate">{zone.name}</span>
                      </div>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${selectedZoneId === zone.id ? "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
                        {zone.binCount}
                      </span>
                    </button>
                        ))}
                        <button
                          onClick={() => addZone(floor.id)}
                          className="w-full flex items-center gap-1.5 pl-7 pr-4 py-2 text-xs text-zinc-400 hover:text-indigo-600 transition-colors"
                        >
                          <Plus size={11} /> Add Zone
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* ── Right: Zone Detail ── */}
        <div className="col-span-3 space-y-5">
          {selectedZone ? (
            <>
              {/* Zone header + stats */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900">{selectedZone.name}</h2>
                    <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle size={11} /> Configuration for {warehouse} Distribution
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary"><Box size={13} /> Bulk Edit Bins</Button>
                    <button
                      onClick={() => setShowAddBin(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-primary-sm hover:shadow-primary-md transition-all duration-150"
                    >
                      <Plus size={14} /> Add Bin
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <StatCard icon={Box} label="Total Bins" value={totalBins} tone="blue" />
                  <div className="rounded-xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600"><Check size={16} /></div>
                      <span className="text-xs text-zinc-400">Optimal range</span>
                    </div>
                    <div className="text-xl font-bold">{usedCapacityPct}%</div>
                    <div className="text-xs text-zinc-500">Used Capacity</div>
                  </div>
                  <StatCard icon={Layers} label="Empty Slots — Ready for intake" value={emptySlots} tone="zinc" />
                  <div className="rounded-xl border border-zinc-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-red-50 text-red-600"><AlertCircle size={16} /></div>
                      <span className="text-xs text-red-400">Requires attention</span>
                    </div>
                    <div className="text-xl font-bold text-red-500">{criticalBins}</div>
                    <div className="text-xs text-zinc-500">Critical Bins</div>
                  </div>
                </div>
              </div>

              {/* Bins Registry */}
              <Card title="Zone Bins Registry">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 w-56">
                    <Filter size={13} className="text-zinc-400" />
                    <input
                      value={binFilter}
                      onChange={(e) => { setBinFilter(e.target.value); setPage(1); }}
                      className="outline-none text-sm w-full"
                      placeholder="Filter bin code..."
                    />
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                      <th className="py-2 font-medium">Bin Code</th>
                      <th className="py-2 font-medium">Storage Type</th>
                      <th className="py-2 font-medium w-64">Capacity Usage</th>
                      <th className="py-2 font-medium">Items</th>
                      <th className="py-2 font-medium">Status</th>
                      <th className="py-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedBins.map((bin) => {
                      const pct = Math.round((bin.used / bin.capacity) * 100);
                      return (
                        <tr key={bin.code} className="border-b border-zinc-50 hover:bg-zinc-50 group">
                          <td className="py-3">
                            <span className="font-medium text-primary-600 hover:text-primary-700 cursor-pointer transition-colors">{bin.code}</span>
                          </td>
                          <td className="py-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-600">
                              {bin.storageType}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-2 rounded-full ${capacityColor(pct)}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="text-xs text-zinc-500 w-28 shrink-0">
                                  <span className={`font-semibold ${pct >= 95 ? "text-rose-500" : pct >= 80 ? "text-amber-500" : "text-primary-600"}`}>
                                  {pct}% Filled
                                </span>
                                <span className="text-zinc-400 ml-1">{bin.used}/{bin.capacity} Units</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-semibold">{bin.items}</td>
                          <td className="py-3">
                            <Badge tone={binStatusTone(bin.status)}>{bin.status}</Badge>
                          </td>
                          <td className="py-3">
                            <button className="text-zinc-300 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {pagedBins.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-zinc-400 text-sm">
                          No bins match "{binFilter}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 text-sm text-zinc-500">
                  <span>Showing {Math.min(filteredBins.length, (page - 1) * PAGE_SIZE + 1)}–{Math.min(filteredBins.length, page * PAGE_SIZE)} of {filteredBins.length} bins</span>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                    <Button variant="secondary" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <Layers size={32} className="text-zinc-200 mb-3" />
              <p className="font-medium text-zinc-500">Select a zone from the warehouse explorer</p>
            </Card>
          )}
        </div>
      </div>

      {showAddBin && (
        <AddBinModal onSave={addBin} onClose={() => setShowAddBin(false)} />
      )}
    </div>
  );
}
