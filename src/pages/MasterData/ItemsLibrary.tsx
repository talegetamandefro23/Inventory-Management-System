import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Filter, Upload, Download, Plus, MoreVertical, Database, X,
  AlertTriangle, Package,
} from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard, EmptyState } from "../../components/ui";
import { useAppStore } from "../../context/AppStoreContext";
import { statusTone } from "../../data/items";
import { useToast } from "../../hooks/useToast";
import { Link } from "react-router-dom";

export default function ItemsLibrary() {
  const { items, deleteItem } = useAppStore();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (it.name.toLowerCase().includes(query.toLowerCase()) ||
          it.code.toLowerCase().includes(query.toLowerCase()) ||
          it.brand.toLowerCase().includes(query.toLowerCase()) ||
          it.category.toLowerCase().includes(query.toLowerCase())) &&
          (!categoryFilter || it.category === categoryFilter) &&
          (!statusFilter || it.status === statusFilter)
      ),
    [items, query, categoryFilter, statusFilter]
  );

  const categories = useMemo(() => [...new Set(items.map((it) => it.category))], [items]);

  function handleExport() {
    const headers = ["Code", "Name", "Category", "Brand", "Unit", "On Hand", "Status", "Warehouse", "Unit Cost"];
    const rows = filtered.map((it) =>
      [it.code, it.name, it.category, it.brand, it.unit, it.onHand, it.status, it.warehouse, it.unitCost].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `items-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${filtered.length} items to CSV`, "success");
  }

  function handleImport() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    addToast(`Importing items from ${file.name}...`, "info");
    setTimeout(() => addToast("Items imported successfully", "success"), 1500);
    e.target.value = "";
  }

  function handleDeleteItem(code: string, name: string) {
    if (window.confirm(`Delete "${name}"? This action cannot be undone.`)) {
      deleteItem(code);
      addToast(`"${name}" has been deleted`, "success");
      setShowActions(null);
    }
  }

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
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-150 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
            >
              Manage Categories
            </Link>
            <Button variant="secondary" onClick={handleImport}>
              <Upload size={14} /> Import
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              <Download size={14} /> Export
            </Button>
            <Button onClick={() => {
              addToast("New SKU form coming soon", "info");
            }}>
              <Plus size={14} /> New SKU
            </Button>
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileChange} />
          </>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Database} label="Total SKUs" value={items.length} tone="indigo" />
        <StatCard icon={Package} label="Active Items" value={active} tone="green" />
        <StatCard icon={AlertTriangle} label="Low Stock" value={lowStock} tone="amber" />
        <StatCard icon={X} label="Out of Stock" value={outOfStock} tone="red" />
      </div>

      {/* Table Card */}
      <Card className="!p-0 overflow-hidden">
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex-1 flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary-400 transition-all duration-200">
            <Search size={14} className="text-zinc-400 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none text-sm w-full dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
              placeholder="Search by SKU name, code, brand, or category..."
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          {(categoryFilter || statusFilter) && (
            <button
              onClick={() => { setCategoryFilter(""); setStatusFilter(""); }}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                  <th className="px-5 py-2.5">Item Code</th>
                  <th className="px-5 py-2.5">Item Name</th>
                  <th className="px-5 py-2.5">Category</th>
                  <th className="px-5 py-2.5">Brand</th>
                  <th className="px-5 py-2.5 text-right">On Hand</th>
                  <th className="px-5 py-2.5">Unit Cost</th>
                  <th className="px-5 py-2.5">Status</th>
                  <th className="px-5 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => (
                  <tr
                    key={it.code}
                    className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 cursor-pointer transition-colors group"
                    onClick={() => navigate(`/master-data/items/${it.code}`)}
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{it.code}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-zinc-900 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{it.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge>{it.category}</Badge>
                    </td>
                    <td className="px-5 py-3 text-zinc-500 dark:text-zinc-400">{it.brand}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-semibold ${it.onHand === 0 ? "text-rose-500" : it.onHand < 15 ? "text-amber-600" : "text-zinc-900 dark:text-white"}`}>
                        {it.onHand}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">${it.unitCost.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone(it.status)} dot>{it.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowActions(showActions === it.code ? null : it.code); }}
                        className="text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <MoreVertical size={14} />
                      </button>
                      {showActions === it.code && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg py-1 z-50 animate-slide-down">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/master-data/items/${it.code}`); setShowActions(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToast(`Editing ${it.name}`, "info"); setShowActions(null); }}
                            className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                          >
                            Edit Item
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteItem(it.code, it.name); }}
                            className="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No items found"
            description={`No items match "${query}". Try adjusting your search terms.`}
            actionLabel="Clear Search"
            onAction={() => setQuery("")}
          />
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
          <p className="text-xs text-zinc-400">
            Showing <span className="font-medium text-zinc-600 dark:text-zinc-300">{filtered.length}</span> of <span className="font-medium text-zinc-600 dark:text-zinc-300">{items.length}</span> items
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" className="text-xs px-2.5 py-1.5">Previous</Button>
            <span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-950/30 px-2.5 py-1 rounded-md">1</span>
            <Button variant="ghost" className="text-xs px-2.5 py-1.5">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
