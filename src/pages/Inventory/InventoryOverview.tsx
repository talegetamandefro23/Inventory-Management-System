import { Search, Filter, Download, Plus, Package, AlertTriangle, Database, ArrowLeftRight, MapPin } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useAppStore } from "../../context/AppStoreContext";
import { statusTone } from "../../data/items";

export default function InventoryOverview() {
  const { items } = useAppStore();

  return (
    <div>
      <PageHeader
        trail={["Inventory Control", "Inventory Overview"]}
        title="Inventory Overview"
        subtitle="Real-time stock visibility and warehouse distribution across all regions."
        actions={
          <Card className="!p-3">
            <p className="text-[10px] text-zinc-400 uppercase">Total Valuation</p>
            <p className="font-bold">$1,242,500.00</p>
          </Card>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={Package} label="Total Stock Items" value="42,108" trend="+12.5%" trendUp tone="blue" />
        <StatCard icon={AlertTriangle} label="Low Stock Alerts" value={items.filter((i) => i.status === "Low Stock").length} trend="-4.2%" tone="amber" />
        <StatCard icon={Database} label="Reserved Items" value="1,842" trend="+8.1%" trendUp tone="zinc" />
        <StatCard icon={ArrowLeftRight} label="Pending Transfers" value="12" trend="2.4%" tone="zinc" />
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Card title="Warehouse Capacity">
          {[
            ["Main Hub - Zone A", 85],
            ["Regional East", 42],
            ["Main Hub - Zone B", 92],
          ].map(([l, p]) => (
            <div key={l as string} className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>{l}</span>
                <span className="font-medium">{p}%</span>
              </div>
              <div className="h-1.5 bg-zinc-100 rounded-full">
                <div className="h-1.5 bg-zinc-800 rounded-full" style={{ width: `${p}%` }} />
              </div>
            </div>
          ))}
        </Card>
        <Card title="Stock Value Movement (7d)" actions={<Badge tone="green">Live</Badge>}>
          <div className="h-24 flex items-end gap-2">
            {[40, 50, 45, 60, 75, 65, 80].map((h, i) => (
              <div key={i} className="flex-1 bg-zinc-200 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </Card>
      </div>
      <Card
        title="Item Availability"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary">
              <Download size={14} /> Export
            </Button>
            <Button>
              <Plus size={14} /> Add Stock
            </Button>
          </div>
        }
      >
        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2">
            <Search size={14} className="text-zinc-400" />
            <input className="outline-none text-sm w-full" placeholder="Search SKU, name or serial..." />
          </div>
          <Button variant="secondary">All Warehouses</Button>
          <Button variant="secondary">
            <Filter size={14} /> Filters
          </Button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
              <th className="py-2 font-medium">Item & SKU</th>
              <th className="py-2 font-medium">On Hand</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.code} className="border-b border-zinc-50 hover:bg-zinc-50">
                <td className="py-3">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-zinc-400 flex items-center gap-1">
                    <MapPin size={11} /> {r.code}
                  </p>
                </td>
                <td className="py-3 font-medium">{r.onHand}</td>
                <td className="py-3">
                  <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
