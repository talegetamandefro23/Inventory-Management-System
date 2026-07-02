import { useState } from "react";
import { Settings, Plus, Trash2, Check } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../components/ui";
import { useToast } from "../hooks/useToast";

const USERS = [
  { name: "John Doe", email: "j.doe@eagpbtu.com", role: "Admin", status: "Active", lastLogin: "2 hours ago" },
  { name: "Sarah Jenkins", email: "s.jenkins@eagpbtu.com", role: "Procurement Manager", status: "Active", lastLogin: "5 hours ago" },
  { name: "Marcus Vane", email: "m.vane@eagpbtu.com", role: "Warehouse Clerk", status: "Active", lastLogin: "Yesterday" },
  { name: "Elena Rodriguez", email: "e.rodriguez@eagpbtu.com", role: "Inventory Analyst", status: "Inactive", lastLogin: "3 days ago" },
];

const TABS = ["Users & Roles", "Warehouses", "Integrations", "Audit Log", "System Settings"];

export default function Administration() {
  const [tab, setTab] = useState("Users & Roles");
  const [saved, setSaved] = useState(false);
  const { addToast } = useToast();

  function saveSettings() {
    setSaved(true);
    addToast("Settings saved successfully", "success");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <PageHeader
        trail={["Administration"]}
        title="Administration"
        subtitle="Manage users, roles, warehouses, and system configuration."
        actions={
          saved ? (
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1"><Check size={13} /> Settings saved</span>
          ) : (
            <Button onClick={saveSettings}>Save Changes</Button>
          )
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Settings} label="Active Users" value={USERS.filter((u) => u.status === "Active").length} tone="green" />
        <StatCard icon={Settings} label="Warehouses" value="8" tone="indigo" />
        <StatCard icon={Settings} label="Integrations" value="4 Active" tone="teal" />
        <StatCard icon={Settings} label="System Version" value="v2.4.0" tone="zinc" />
      </div>

      <div className="flex gap-2 mb-5 border-b border-zinc-100 pb-3 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${tab === t ? "bg-primary-600 text-white shadow-primary-sm" : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Users & Roles" && (
        <Card
          title="Users & Roles"
          actions={
            <Button>
              <Plus size={14} /> Invite User
            </Button>
          }
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                <th className="py-2 font-medium">User</th>
                <th className="py-2 font-medium">Role</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Last Login</th>
                <th className="py-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.email} className="border-b border-zinc-50 hover:bg-zinc-50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-semibold">{u.name[0]}</div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-zinc-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-zinc-500">{u.role}</td>
                  <td className="py-3">
                    <Badge tone={u.status === "Active" ? "green" : "zinc"}>{u.status}</Badge>
                  </td>
                  <td className="py-3 text-zinc-400 text-xs">{u.lastLogin}</td>
                  <td className="py-3 text-right">
                    <button className="text-zinc-300 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === "Warehouses" && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { code: "WH-NORTH-01", name: "Main Hub - North", location: "Chicago, IL", zones: 4, status: "Active" },
            { code: "WH-EAST-02", name: "Regional East", location: "Boston, MA", zones: 2, status: "Active" },
            { code: "WH-WEST-03", name: "West Distribution", location: "Los Angeles, CA", zones: 3, status: "Active" },
            { code: "WH-COLD-04", name: "Cold Storage Facility", location: "Denver, CO", zones: 1, status: "Maintenance" },
          ].map((wh) => (
            <Card key={wh.code} title={wh.name} subtitle={wh.location} actions={<Badge tone={wh.status === "Active" ? "green" : "amber"}>{wh.status}</Badge>}>
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>Code: {wh.code}</span>
                <span>{wh.zones} zones configured</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "System Settings" && (
        <div className="grid grid-cols-2 gap-5">
          <Card title="General Settings">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500">Organization Name</label>
                <input className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="EAGPBTU Corporation" />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Default Currency</label>
                <select className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm">
                  <option>USD — US Dollar</option>
                  <option>EUR — Euro</option>
                  <option>GBP — British Pound</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-500">Fiscal Year Start</label>
                <input className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="January" />
              </div>
            </div>
          </Card>
          <Card title="Notification Settings">
            {[
              ["Low stock alerts", true],
              ["PO approval reminders", true],
              ["Audit schedule reminders", false],
              ["Maintenance due alerts", true],
              ["Daily inventory digest", false],
            ].map(([label, def]) => (
              <div key={label as string} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                <span className="text-sm">{label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={def as boolean} className="sr-only peer" />
                  <div className="w-9 h-5 bg-zinc-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                </label>
              </div>
            ))}
          </Card>
        </div>
      )}

      {(tab === "Integrations" || tab === "Audit Log") && (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 text-zinc-400">
            <Settings size={22} />
          </div>
          <p className="font-medium text-zinc-700">{tab}</p>
          <p className="text-sm text-zinc-400 max-w-sm mt-1">
            {tab === "Integrations"
              ? "Connect ERP, accounting, and logistics platforms to sync data automatically."
              : "Full audit trail of all system actions, user changes, and approvals."}
          </p>
          <Button className="mt-4">Configure {tab}</Button>
        </Card>
      )}
    </div>
  );
}
