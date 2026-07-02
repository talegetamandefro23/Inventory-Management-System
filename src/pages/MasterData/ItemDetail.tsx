import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { X, Package, FileText, QrCode, Plus, Minus } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../../components/ui";
import { useAppStore } from "../../context/AppStoreContext";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, adjustStock } = useAppStore();
  const [savedMsg, setSavedMsg] = useState("");

  const item = items.find((i) => i.code === id) ?? items[0];

  function save() {
    setSavedMsg("Saved just now");
    setTimeout(() => setSavedMsg(""), 2000);
  }

  return (
    <div>
      <PageHeader
        trail={["Master Data", "Items", "Item Details"]}
        title={item.name}
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate("/master-data/items")}>
              <X size={14} /> Discard Changes
            </Button>
            <Button onClick={save}>Save Item</Button>
          </>
        }
      />
      {savedMsg && <div className="mb-4 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 inline-block">{savedMsg}</div>}
      <Card className="mb-5">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-300">
            <Package size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge tone="green">{item.status}</Badge>
              <span className="text-xs text-zinc-400">UID: ITEM-{item.code}</span>
            </div>
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p className="text-sm text-zinc-500 mt-1">
              Heavy-duty industrial grade equipment with brushless motor technology, dual-speed transmission, and
              ergonomic rubberized grip.
            </p>
            <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
              <div><p className="text-xs text-zinc-400">Item Code</p><p className="font-medium">{item.code}</p></div>
              <div><p className="text-xs text-zinc-400">Category</p><p className="font-medium">{item.category}</p></div>
              <div><p className="text-xs text-zinc-400">Brand</p><p className="font-medium">{item.brand}</p></div>
              <div><p className="text-xs text-zinc-400">Base Unit</p><p className="font-medium">{item.unit}</p></div>
            </div>
          </div>
          <div className="h-16 w-16 rounded-lg bg-zinc-900 text-white flex flex-col items-center justify-center text-[9px] text-center gap-1">
            <QrCode size={20} /> SCAN
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <Card title="General Identification">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500">Global Barcode (GTIN/EAN)</label>
                <input className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="0812938475621" />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Model Number</label>
                <input className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue={`IW-${item.code}`} />
              </div>
            </div>
          </Card>
          <Card title="Inventory & Logistics Settings">
            <p className="text-xs font-semibold text-zinc-400 mb-2">CONTROL PARAMETERS</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div><label className="text-xs text-zinc-500">Safety Stock</label><input className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="25" /></div>
              <div><label className="text-xs text-zinc-500">Reorder Level</label><input className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="45" /></div>
              <div><label className="text-xs text-zinc-500">Max Stock</label><input className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="250" /></div>
            </div>
            <p className="text-xs font-semibold text-zinc-400 mb-2">CURRENT ON-HAND ({item.onHand} {item.unit})</p>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => adjustStock(item.code, -1)}><Minus size={14} /></Button>
              <span className="font-semibold text-sm w-12 text-center">{item.onHand}</span>
              <Button variant="secondary" onClick={() => adjustStock(item.code, 1)}><Plus size={14} /></Button>
              <span className="text-xs text-zinc-400">Adjust on-hand quantity directly (manual cycle correction)</span>
            </div>
          </Card>
          <Card title="Documentation & Assets">
            {["Technical_Specs_Brushless.pdf", "Product_Explosion_Diagram.svg"].map((f) => (
              <div key={f} className="flex items-center gap-2 border border-zinc-100 rounded-lg px-3 py-2 mb-2 text-sm">
                <FileText size={14} className="text-zinc-400" /> {f}
              </div>
            ))}
          </Card>
        </div>
        <div className="space-y-5">
          <Card title="Costing & Valuation">
            <label className="text-xs text-zinc-500">Standard Cost</label>
            <input className="w-full mt-1 mb-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="$185.00" />
            <label className="text-xs text-zinc-500">Average Weighted Cost</label>
            <input className="w-full mt-1 mb-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm" defaultValue="$182.44" disabled />
            <label className="text-xs text-zinc-500">Valuation Method</label>
            <div className="flex gap-2 mt-1">
              {["FIFO", "LIFO", "AVG"].map((m) => (
                <button key={m} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium ${m === "AVG" ? "bg-zinc-900 text-white" : "border border-zinc-200"}`}>
                  {m}
                </button>
              ))}
            </div>
          </Card>
          <Card title="Movement History" actions={<button className="text-xs text-zinc-400">View All</button>}>
            {[
              ["Stock In via PO-29384", "+50 EA", "green"],
              ["Stock Out via IS-10029", "-12 EA", "red"],
              ["Adjustment via Cycle Count", "-2 EA", "amber"],
              ["Stock In via PO-29210", "+120 EA", "green"],
            ].map(([t, qty, tone], i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1.5 border-b border-zinc-50 last:border-0">
                <span className="text-zinc-600">{t}</span>
                <span className={`font-semibold ${tone === "green" ? "text-emerald-600" : tone === "red" ? "text-red-500" : "text-amber-600"}`}>{qty}</span>
              </div>
            ))}
            <div className="mt-3 bg-amber-50 text-amber-700 text-xs rounded-lg p-2">
              Heads up! This item has high turnover. Consider increasing safety stock.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
