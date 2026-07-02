import { useState } from "react";
import { Search, Filter, Download, Plus, Package, AlertTriangle, Database, ArrowLeftRight, MapPin } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useAppStore } from "../../context/AppStoreContext";
import { useToast } from "../../hooks/useToast";
import { statusTone } from "../../data/items";

export default function InventoryOverview() {
  const { items } = useAppStore();
  const { addToast } = useToast();
  const [query, setQuery] = useState("");

  const filtered = items.filter(
    (it) =>
      it.name.toLowerCase().includes(query.toLowerCase()) ||
      it.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        trail={["Inventory Control", "Inventory Overview"]}
        title="Inventory Overview"
        subtitle="Real-time stock visibility and warehouse distribution across all regions."
        actions={
          <Card className="!p-3">
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Total Valuation</p>
            <p className="font-bold text-zinc-900 dark:text-white">$1,242,500.00</p>
          </Card>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Package} label="Total Stock Items" value="42,108" trend="+12.5%" trendUp tone="indigo" />
        <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={items.filter((i) => i.status === "Low Stock").length} trend="-4.2%" tone="amber" />
        <StatCard icon={Database} label="Reserved Items" value="1,842" trend="+8.1%" trendUp tone="teal" />
        <StatCard icon={ArrowLeftRight} label="Pending Transfers" value="12" trend="2.4%" tone="zinc" />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Card title="Warehouse Capacity">
          {[
            ["Main Hub - Zone A", 85, "bg-primary-600"],
            ["Regional East", 42, "bg-secondary-500"],
            ["Main Hub - Zone B", 92, "bg-rose-500"],
          ].map(([l, p, color]) => (
            <div key={l as string} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-zinc-600 dark:text-zinc-400">{l}</span>
                <span className="font-medium text-zinc-900 dark:text-white">{p}%</span>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <div className={`h-1.5 ${color} rounded-full transition-all duration-500`} style={{ width: `${p}%` }} />
              </div>
            </div>
          ))}
        </Card>
        <Card title="Stock Value Movement (7d)" actions={<Badge tone="green" dot>Live</Badge>}>
          <div className="h-24 flex items-end gap-2">
            {[40, 50, 45, 60, 75, 65, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-primary-200 to-primary-100 dark:from-primary-800 dark:to-primary-700 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </Card>
      </div>
      <Card
        title="Item Availability"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => addToast("Inventory report exported", "success")}><Download size={14} /> Export</Button>
            <Button onClick={() => addToast("Stock addition form opening...", "info")}><Plus size={14} /> Add Stock</Button>
          </div>
        }
      >
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary-400 transition-all">
            <Search size={14} className="text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none text-sm w-full dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
              placeholder="Search SKU, name or serial..."
            />
          </div>
          <Button variant="secondary">All Warehouses</Button>
          <Button variant="secondary"><Filter size={14} /> Filters</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                <th className="py-2.5 font-medium">Item & SKU</th>
                <th className="py-2.5 font-medium">Warehouse</th>
                <th className="py-2.5 font-medium text-right">On Hand</th>
                <th className="py-2.5 font-medium">Unit Cost</th>
                <th className="py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.code} className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 transition-colors">
                  <td className="py-3">
                    <p className="font-medium text-zinc-900 dark:text-white">{r.name}</p>
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <MapPin size={11} /> {r.code}
                    </p>
                  </td>
                  <td className="py-3"><Badge>{r.warehouse}</Badge></td>
                  <td className="py-3 text-right font-semibold text-zinc-900 dark:text-white">{r.onHand}</td>
                  <td className="py-3 text-zinc-500 dark:text-zinc-400">${r.unitCost.toFixed(2)}</td>
                  <td className="py-3">
                    <Badge tone={statusTone(r.status)} dot>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
