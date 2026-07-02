import { useState } from "react";
import { Search, Download, Plus, Briefcase, Check, Wrench, Minus } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../components/ui";
import { useToast } from "../hooks/useToast";

interface Asset {
  tag: string;
  name: string;
  category: string;
  assignee: string;
  email: string;
  department: string;
  status: "Active" | "Under Maintenance" | "Available";
}

const ASSETS: Asset[] = [
  { tag: "AST-2024-001", name: 'MacBook Pro M3 14"', category: "IT", assignee: "Sarah Jenkins", email: "s.jenkins@eagpbtu.com", department: "Software Engineering", status: "Active" },
  { tag: "AST-2024-042", name: "Heavy Duty Forklift X500", category: "Machinery", assignee: "Mike Ross", email: "m.ross@eagpbtu.com", department: "Warehouse Ops", status: "Under Maintenance" },
  { tag: "AST-2023-112", name: "Conference Table - Oak", category: "Furniture", assignee: "Unassigned", email: "", department: "Administration", status: "Available" },
  { tag: "AST-2022-088", name: "Ford Transit Delivery Van", category: "Vehicle", assignee: "David Chen", email: "d.chen@eagpbtu.com", department: "Logistics", status: "Active" },
  { tag: "AST-2024-009", name: "Dell Precision 5820 Tower", category: "IT", assignee: "Elena Rodriguez", email: "e.rodriguez@eagpbtu.com", department: "R&D", status: "Active" },
];

function statusTone(s: string) {
  if (s === "Active") return "green" as const;
  if (s === "Under Maintenance") return "red" as const;
  return "zinc" as const;
}

const MAINTENANCE_LOGS = [
  { title: "Preventative Maintenance", desc: "Full diagnostic completed. Hydraulic seals replaced.", date: "Feb 10", user: "Engineer Mark" },
  { title: "Asset Transferred", desc: "Transferred from Central Hub to Warehouse B.", date: "Jan 02", user: "Admin Sarah" },
  { title: "Warranty Registered", desc: "Manufacturer 3-year extended warranty activated.", date: "Nov 15", user: "Procurement" },
];

export default function Assets() {
  const [selected, setSelected] = useState<Asset>(ASSETS[1]);
  const [query, setQuery] = useState("");
  const [showMaintModal, setShowMaintModal] = useState(false);
  const { addToast } = useToast();

  const filtered = ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        trail={["Dashboard", "Asset Registry"]}
        title="Fixed Asset Management"
        subtitle="Track, assign, and maintain your organization's high-value equipment."
        actions={
          <>
            <Button variant="secondary">
              <Download size={14} /> Export CSV
            </Button>
            <Button>
              <Plus size={14} /> Register New Asset
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon={Briefcase} label="Total Assets" value="1,248" trend="+$4.2k valuation" trendUp tone="indigo" />
        <StatCard icon={Check} label="Active Assignments" value="1,102" tone="green" />
        <StatCard icon={Wrench} label="Upcoming Maintenance" value="24" tone="amber" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Table */}
        <Card className="col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="secondary">Registry View</Button>
            <Button variant="secondary">Maintenance Calendar</Button>
            <div className="flex-1 flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 ml-auto max-w-xs">
              <Search size={14} className="text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="outline-none text-sm w-full"
                placeholder="Filter by Tag or Serial..."
              />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                <th className="py-2 font-medium">Asset Tag</th>
                <th className="py-2 font-medium">Name & Category</th>
                <th className="py-2 font-medium">Assigned To</th>
                <th className="py-2 font-medium">Department</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.tag}
                  onClick={() => setSelected(a)}
                  className={`border-b border-zinc-50 cursor-pointer ${selected.tag === a.tag ? "bg-zinc-50" : "hover:bg-zinc-50"}`}
                >
                  <td className="py-3 text-zinc-500 text-xs">{a.tag}</td>
                  <td className="py-3">
                    <p className="font-medium">{a.name}</p>
                    <p className="text-xs text-zinc-400">{a.category}</p>
                  </td>
                  <td className="py-3">
                    {a.assignee === "Unassigned" ? (
                      <Badge>Unassigned</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-semibold">
                          {a.assignee[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{a.assignee}</p>
                          <p className="text-[10px] text-zinc-400">{a.email}</p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-zinc-500 text-xs">{a.department}</td>
                  <td className="py-3">
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Detail panel */}
        <div className="space-y-4">
          <Card title={selected.name} subtitle={selected.tag}>
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div><p className="text-zinc-400">Serial Number</p><p className="font-medium">FL-99283-GT</p></div>
              <div><p className="text-zinc-400">Warranty Ends</p><p className="font-medium">2025-05-20</p></div>
              <div><p className="text-zinc-400">Last Maintenance</p><p className="font-medium">2024-02-10</p></div>
              <div><p className="text-zinc-400">Next Inspection</p><p className="font-medium">2024-03-15</p></div>
            </div>
            <p className="text-xs font-semibold text-zinc-400 mb-1">Current Custodian</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-semibold">
                {selected.assignee[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{selected.assignee}</p>
                <p className="text-xs text-zinc-400">{selected.department}</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-zinc-400 mb-2">Lifecycle History</p>
            {MAINTENANCE_LOGS.map((l) => (
              <div key={l.title} className="text-xs mb-3 border-l-2 border-zinc-100 pl-3">
                <div className="flex justify-between">
                  <span className="font-medium">{l.title}</span>
                  <span className="text-zinc-300">{l.date}</span>
                </div>
                <p className="text-zinc-500">{l.desc}</p>
                <p className="text-zinc-400">{l.user}</p>
              </div>
            ))}

            <div className="flex gap-2 mt-3">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => addToast(`Transfer request for "${selected.name}" created`, "info")}>Transfer</Button>
              <Button variant="danger" className="flex-1 justify-center" onClick={() => {
                if (window.confirm(`Dispose "${selected.name}"? This will mark it as decommissioned.`)) {
                  addToast(`"${selected.name}" disposed`, "warning");
                }
              }}>Dispose</Button>
            </div>
            <Button className="w-full justify-center mt-2" onClick={() => setShowMaintModal(true)}>
              <Wrench size={13} /> Log Maintenance Task
            </Button>
          </Card>
        </div>
      </div>

      {/* Maintenance modal */}
      {showMaintModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowMaintModal(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-96 shadow-modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-zinc-900 dark:text-white">Log Maintenance Task</p>
              <button onClick={() => setShowMaintModal(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors"><Minus size={16} /></button>
            </div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Task Type</label>
            <select className="w-full mt-1.5 mb-3 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all">
              <option>Preventative Maintenance</option>
              <option>Corrective Repair</option>
              <option>Inspection</option>
            </select>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</label>
            <textarea className="w-full mt-1.5 mb-3 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" placeholder="Describe the maintenance activity..." />
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Assigned Technician</label>
            <input className="w-full mt-1.5 mb-4 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" placeholder="Engineer name..." />
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 justify-center" onClick={() => setShowMaintModal(false)}>Cancel</Button>
              <Button className="flex-1 justify-center" onClick={() => {
                addToast(`Maintenance task logged for "${selected.name}"`, "success");
                setShowMaintModal(false);
              }}>Save Task</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
