import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, FileText, Clock, AlertTriangle, Check } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useAppStore } from "../../context/AppStoreContext";
import { urgencyTone } from "../../data/requisitions";

export default function Requisitions() {
  const { requisitions } = useAppStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      requisitions.filter(
        (r) =>
          r.id.toLowerCase().includes(query.toLowerCase()) ||
          r.requester.toLowerCase().includes(query.toLowerCase()) ||
          r.department.toLowerCase().includes(query.toLowerCase())
      ),
    [requisitions, query]
  );

  const pending = requisitions.length;
  const urgent = requisitions.filter((r) => r.urgency === "High").length;
  const approvedTotal = requisitions.reduce((s, r) => s + r.value, 0);

  return (
    <div>
      <PageHeader
        trail={["Procurement", "Purchase Requisitions"]}
        title="Purchase Requisitions"
        actions={
          <Button onClick={() => navigate("/procurement/requisitions/new")}>
            <Plus size={14} /> Create PR
          </Button>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={FileText} label="Total Requisitions" value={requisitions.length} trend="+12% vs last month" trendUp tone="indigo" />
        <StatCard icon={Clock} label="Pending Approval" value={pending} tone="amber" />
        <StatCard icon={AlertTriangle} label="Urgent Requests" value={urgent} tone="red" />
        <StatCard icon={Check} label="Total Value" value={`$${(approvedTotal / 1000).toFixed(1)}k`} trendUp trend="+8.2% vs last month" tone="green" />
      </div>
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2">
            <Search size={14} className="text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none text-sm w-full"
              placeholder="Search PR number, requester, or department..."
            />
          </div>
          <Button variant="secondary">
            <Filter size={14} /> Filters
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
              <th className="py-2 font-medium">PR Number</th>
              <th className="py-2 font-medium">Requester</th>
              <th className="py-2 font-medium">Department</th>
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Urgency</th>
              <th className="py-2 font-medium">Total Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer"
                onClick={() => navigate("/procurement/rfq")}
              >
                <td className="py-3 font-medium">{p.id}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-semibold">
                      {p.requester[0]}
                    </div>
                    {p.requester}
                  </div>
                </td>
                <td className="py-3 text-zinc-500">{p.department}</td>
                <td className="py-3 text-zinc-500">{p.date}</td>
                <td className="py-3">
                  <Badge tone={urgencyTone(p.urgency)}>{p.urgency}</Badge>
                </td>
                <td className="py-3 font-medium">${p.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-zinc-400 text-sm">
                  No requisitions match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="text-xs text-zinc-400 mt-4">
          Showing {filtered.length} of {requisitions.length} requisitions
        </p>
      </Card>
    </div>
  );
}
