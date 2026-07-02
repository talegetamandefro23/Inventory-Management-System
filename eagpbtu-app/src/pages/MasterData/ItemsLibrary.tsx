import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Upload, Download, Plus, MoreVertical, Database, X, AlertTriangle } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useAppStore } from "../../context/AppStoreContext";
import { statusTone } from "../../data/items";
import { Link } from "react-router-dom";

export default function ItemsLibrary() {
  const { items } = useAppStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          it.name.toLowerCase().includes(query.toLowerCase()) ||
          it.code.toLowerCase().includes(query.toLowerCase()) ||
          it.brand.toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  const lowStock = items.filter((i) => i.status === "Low Stock").length;
  const outOfStock = items.filter((i) => i.status === "Out of Stock").length;
  const active = items.filter((i) => i.status === "Active").length;

  return (
    <div>
      <PageHeader
        trail={["Dashboard", "Master Data", "Items Master"]}
        title="Items Library"
        subtitle="Manage and track your organization's entire SKU portfolio."
        actions={
          <>
            <Link
              to="/master-data/categories"
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            >
              Manage Categories →
            </Link>
            <Button variant="secondary">
              <Upload size={14} /> Import SKUs
            </Button>
            <Button variant="secondary">
              <Download size={14} /> Export CSV
            </Button>
            <Button onClick={() => navigate("/master-data/items/new")}>
              <Plus size={14} /> New SKU Item
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Database} label="Total SKUs" value={items.length} tone="blue" />
        <StatCard icon={Filter} label="Active Items" value={active} tone="green" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock} tone="amber" />
        <StatCard icon={X} label="Out of Stock" value={outOfStock} tone="red" />
      </div>
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2">
            <Search size={14} className="text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none text-sm w-full"
              placeholder="Search by SKU name, code, or brand..."
            />
          </div>
          <Button variant="secondary">
            <Filter size={14} /> Advanced Filters
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
              <th className="py-2 font-medium">Item Code</th>
              <th className="py-2 font-medium">Item Name</th>
              <th className="py-2 font-medium">Category</th>
              <th className="py-2 font-medium">Brand</th>
              <th className="py-2 font-medium">On Hand</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it) => (
              <tr
                key={it.code}
                className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer"
                onClick={() => navigate(`/master-data/items/${it.code}`)}
              >
                <td className="py-3 font-medium text-zinc-700">{it.code}</td>
                <td className="py-3 font-medium text-zinc-900">{it.name}</td>
                <td className="py-3">
                  <Badge>{it.category}</Badge>
                </td>
                <td className="py-3 text-zinc-500">{it.brand}</td>
                <td className="py-3">{it.onHand}</td>
                <td className="py-3">
                  <Badge tone={statusTone(it.status)}>{it.status}</Badge>
                </td>
                <td className="py-3 text-right">
                  <MoreVertical size={14} className="inline text-zinc-400" />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-400 text-sm">
                  No items match "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="text-xs text-zinc-400 mt-4">
          Showing {filtered.length} of {items.length} results
        </p>
      </Card>
    </div>
  );
}
