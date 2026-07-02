import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine, Plus, X } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../../components/ui";

interface Line {
  code: string;
  desc: string;
  bin: string;
  qty: number;
  unit: string;
  val: number;
}

const INITIAL: Line[] = [
  { code: "SKU-7721", desc: "Industrial Grade Compressor X1", bin: "B-12-4", qty: 5, unit: "UNITS", val: 1250 },
  { code: "SKU-0982", desc: "Hydraulic Sealant 500ml", bin: "C-04-1", qty: 24, unit: "CANS", val: 480 },
  { code: "SKU-4410", desc: "Precision Calipers 150mm", bin: "A-01-9", qty: 10, unit: "BOXES", val: 1100 },
  { code: "SKU-1129", desc: "Copper Wiring Reel 50m", bin: "D-02-2", qty: 2, unit: "REELS", val: 320 },
];

export default function StockTransfer() {
  const [lines, setLines] = useState<Line[]>(INITIAL);
  const [source, setSource] = useState("Central Warehouse");
  const [destination, setDestination] = useState("North Logistics Hub");
  const navigate = useNavigate();

  const totalQty = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const totalVal = useMemo(() => lines.reduce((s, l) => s + l.val, 0), [lines]);
  const autoApprove = totalVal <= 5000;

  function removeLine(code: string) {
    setLines((prev) => prev.filter((l) => l.code !== code));
  }

  function finalize() {
    navigate("/inventory/overview");
  }

  return (
    <div>
      <PageHeader
        trail={["Inventory", "Stock Movement", "Inter-Warehouse"]}
        title="Stock Transfer"
        subtitle="Move inventory between warehouses and storage zones with bulk scanning."
        actions={
          <>
            <Button variant="secondary">History</Button>
            <Button onClick={finalize}>Review Transfer</Button>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Card title="Source Location" subtitle="Select storage location">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Warehouse</label>
              <input value={source} onChange={(e) => setSource(e.target.value)} className="w-full mt-1.5 mb-3 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" />
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Default Bin / Zone</label>
              <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" defaultValue="Zone A - Receiving" />
            </Card>
            <Card title="Destination" subtitle="Select storage location">
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Warehouse</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full mt-1.5 mb-3 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" />
              <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Default Bin / Zone</label>
              <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" defaultValue="Zone A - Receiving" />
            </Card>
          </div>
          <Card
            title="Item Scanning"
            subtitle="Scan barcodes or manually add items to the batch"
            actions={
              <div className="flex gap-2">
                <Button variant="secondary">Manual Add</Button>
                <Button variant="secondary">Import CSV</Button>
              </div>
            }
          >
            <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 mb-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary-400 transition-all">
              <ScanLine size={14} className="text-zinc-400" />
              <input className="outline-none text-sm w-full dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600" placeholder="Scan barcode or enter SKU code..." />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                    <th className="py-2.5 font-medium">Item Information</th>
                    <th className="py-2.5 font-medium">Source Bin</th>
                    <th className="py-2.5 font-medium">Qty</th>
                    <th className="py-2.5 font-medium">Valuation</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((r) => (
                    <tr key={r.code} className="border-b border-zinc-50 dark:border-zinc-800/50">
                      <td className="py-3">
                        <p className="font-medium text-zinc-900 dark:text-white">{r.desc}</p>
                        <p className="text-xs text-zinc-400">{r.code}</p>
                      </td>
                      <td className="py-3 text-xs"><Badge>{r.bin}</Badge></td>
                      <td className="py-3">{r.qty} <span className="text-xs text-zinc-400">{r.unit}</span></td>
                      <td className="py-3 font-medium">${r.val}</td>
                      <td className="py-3">
                        <button onClick={() => removeLine(r.code)} className="text-zinc-300 hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400 transition-colors p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Notes & Reference">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Transfer Type</label>
                <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" defaultValue="Inter-Warehouse Movement" />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Reference Number (External)</label>
                <input className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" placeholder="e.g. MO-88219" />
              </div>
            </div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Additional Notes</label>
            <textarea className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white h-16 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all" placeholder="Explain the reason for movement..." />
          </Card>
        </div>
        <div className="space-y-5">
          <Card title="Transfer Summary" subtitle="Real-time calculation of current batch">
            <div className="space-y-3 text-sm mb-3">
              <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Source Warehouse</span><span className="font-medium text-zinc-900 dark:text-white">{source}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Target Warehouse</span><span className="font-medium text-zinc-900 dark:text-white">{destination}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Total Unique Items</span><span className="font-medium text-zinc-900 dark:text-white">{lines.length} SKUs</span></div>
              <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Total Quantity</span><span className="font-medium text-zinc-900 dark:text-white">{totalQty} Units</span></div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 flex justify-between mb-3">
              <span className="font-semibold text-sm text-zinc-900 dark:text-white">Total Valuation</span>
              <span className="font-bold text-zinc-900 dark:text-white">${totalVal.toLocaleString()}</span>
            </div>
            {autoApprove ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs rounded-lg p-3 mb-3 border border-emerald-100 dark:border-emerald-900/30">
                <p className="font-medium">Auto-Approval Eligible</p>
                Value is within limits. Transfer will be posted immediately upon confirmation.
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs rounded-lg p-3 mb-3 border border-amber-100 dark:border-amber-900/30">
                <p className="font-medium">Approval Required</p>
                Value exceeds $5,000. This transfer will be routed for manager sign-off.
              </div>
            )}
            <Button className="w-full justify-center mb-2" onClick={finalize}>Finalize & Post Transfer</Button>
            <Button variant="secondary" className="w-full justify-center mb-2">Save as Draft</Button>
            <button className="w-full text-center text-xs text-rose-500 hover:text-rose-600 transition-colors" onClick={() => setLines([])}>Discard Batch</button>
          </Card>
          <Card title="Standard Operating Procedure">
            <ul className="text-xs text-zinc-500 dark:text-zinc-400 list-disc pl-4 space-y-1.5">
              <li>Ensure all items are scanned from their respective physical bins.</li>
              <li>Approval is required for transfers exceeding $5,000.</li>
              <li>Destination bins should be cleared before confirming delivery.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
