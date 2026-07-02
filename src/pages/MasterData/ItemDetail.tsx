import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  X, Package, FileText, QrCode, Plus, Minus, Save,
  ArrowLeft, TrendingUp, TrendingDown, Clock,
} from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../../components/ui";
import { useAppStore } from "../../context/AppStoreContext";
import { useToast } from "../../hooks/useToast";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, adjustStock } = useAppStore();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const item = items.find((i) => i.code === id) ?? items[0];

  function save() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast(`"${item.name}" saved successfully`, "success");
    }, 800);
  }

  const statusColor = item.status === "Active" ? "green" : item.status === "Low Stock" ? "amber" : "red";

  return (
    <div>
      <PageHeader
        trail={["Master Data", "Items", item.name]}
        title={item.name}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("/master-data/items")}>
              <ArrowLeft size={14} /> Back to List
            </Button>
            <Button onClick={save} loading={loading}>
              <Save size={14} /> Save Changes
            </Button>
          </>
        }
      />

      {/* Hero Card */}
      <Card className="mb-5">
        <div className="flex items-start gap-5">
          <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/20 flex items-center justify-center border border-primary-200/50 dark:border-primary-800/30">
            <Package size={32} className="text-primary-400 dark:text-primary-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge tone={statusColor} dot>{item.status}</Badge>
              <span className="text-xs text-zinc-400 font-mono">UID: ITEM-{item.code}</span>
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{item.name}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
              {item.description}
            </p>
            <div className="grid grid-cols-5 gap-5 mt-5 text-sm">
              {[
                ["Item Code", item.code],
                ["Category", item.category],
                ["Brand", item.brand],
                ["Base Unit", item.unit],
                ["Warehouse", item.warehouse],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">{label}</p>
                  <p className="font-semibold text-zinc-900 dark:text-white mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-20 w-20 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white flex flex-col items-center justify-center text-[10px] text-center gap-1.5 cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
            <QrCode size={24} /> <span className="font-medium">SCAN QR</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-5">
        {/* Left Column — 2/3 */}
        <div className="col-span-2 space-y-5">
          <Card title="General Identification">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Global Barcode (GTIN/EAN)</label>
                <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" defaultValue="0812938475621" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Model Number</label>
                <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" defaultValue={`IW-${item.code}`} />
              </div>
            </div>
          </Card>

          <Card title="Inventory & Logistics Settings">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">Control Parameters</p>
            <div className="grid grid-cols-3 gap-4 mb-5">
              {[
                ["Safety Stock", "25"],
                ["Reorder Level", "45"],
                ["Max Stock", "250"],
              ].map(([label, val]) => (
                <div key={label}>
                  <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</label>
                  <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" defaultValue={val} />
                </div>
              ))}
            </div>

            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">Current On-Hand</p>
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
              <Button variant="secondary" onClick={() => adjustStock(item.code, -1)}>
                <Minus size={14} />
              </Button>
              <div className="text-center px-4">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">{item.onHand}</span>
                <span className="text-sm text-zinc-400 ml-1">{item.unit}</span>
              </div>
              <Button variant="secondary" onClick={() => adjustStock(item.code, 1)}>
                <Plus size={14} />
              </Button>
              <span className="text-xs text-zinc-400 ml-2">Adjust quantity directly (manual cycle correction)</span>
            </div>
          </Card>

          <Card title="Documentation & Assets">
            <div className="space-y-2">
              {["Technical_Specs_Brushless.pdf", "Product_Explosion_Diagram.svg"].map((f) => (
                <div key={f} className="flex items-center gap-3 border border-zinc-100 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                  <div className="h-8 w-8 rounded-lg bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
                    <FileText size={14} className="text-primary-500" />
                  </div>
                  <span className="flex-1 font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-primary-600 transition-colors">{f}</span>
                  <span className="text-xs text-zinc-400">2.4 MB</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column — 1/3 */}
        <div className="space-y-5">
          <Card title="Costing & Valuation">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Standard Cost</label>
                <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" defaultValue={`$${item.unitCost.toFixed(2)}`} />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Average Weighted Cost</label>
                <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500" defaultValue={`$${(item.unitCost * 0.985).toFixed(2)}`} disabled />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Valuation Method</label>
                <div className="flex gap-2 mt-1.5">
                  {["FIFO", "LIFO", "AVG"].map((m) => (
                    <button
                      key={m}
                      className={`flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-150 ${
                        m === "AVG"
                          ? "bg-primary-600 text-white shadow-primary-sm"
                          : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card title="Movement History" actions={<button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">View All</button>}>
            <div className="space-y-0">
              {[
                { t: "Stock In via PO-29384", qty: "+50 EA", tone: "green", icon: TrendingUp, time: "2h ago" },
                { t: "Stock Out via IS-10029", qty: "-12 EA", tone: "red", icon: TrendingDown, time: "5h ago" },
                { t: "Adjustment via Cycle Count", qty: "-2 EA", tone: "amber", icon: Clock, time: "Yesterday" },
                { t: "Stock In via PO-29210", qty: "+120 EA", tone: "green", icon: TrendingUp, time: "2 days ago" },
              ].map((entry, i) => (
                <div key={i} className="flex justify-between items-center text-xs py-2.5 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`h-6 w-6 rounded-md flex items-center justify-center ${
                      entry.tone === "green" ? "bg-emerald-50 dark:bg-emerald-950/30" : entry.tone === "red" ? "bg-rose-50 dark:bg-rose-950/30" : "bg-amber-50 dark:bg-amber-950/30"
                    }`}>
                      <entry.icon size={12} className={
                        entry.tone === "green" ? "text-emerald-500" : entry.tone === "red" ? "text-rose-500" : "text-amber-500"
                      } />
                    </div>
                    <div>
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">{entry.t}</span>
                      <span className="text-zinc-400 ml-2">{entry.time}</span>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    entry.tone === "green" ? "text-emerald-600" : entry.tone === "red" ? "text-rose-500" : "text-amber-600"
                  }`}>{entry.qty}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs rounded-lg p-3 border border-amber-100 dark:border-amber-900/30">
              <strong>Note:</strong> This item has high turnover. Consider increasing safety stock levels.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
