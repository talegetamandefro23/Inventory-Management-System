import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Check, AlertTriangle, FileText } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../../components/ui";

interface Line {
  code: string;
  desc: string;
  ordered: number;
  received: number;
  rejected: number;
}

const INITIAL: Line[] = [
  { code: "ITM-7721", desc: "Standard Pallet Jack", ordered: 10, received: 10, rejected: 0 },
  { code: "ITM-9902", desc: "Industrial Shelving Unit", ordered: 50, received: 45, rejected: 2 },
  { code: "ITM-4456", desc: "Lithium Forklift Battery", ordered: 4, received: 4, rejected: 0 },
  { code: "ITM-1288", desc: "Safety Harness L-Size", ordered: 100, received: 110, rejected: 0 },
  { code: "ITM-5561", desc: "Reflective Traffic Cone", ordered: 200, received: 198, rejected: 0 },
];

function lineStatus(l: Line) {
  if (l.received === l.ordered) return "Matched";
  if (l.received > l.ordered) return "Surplus";
  return l.ordered - l.received <= 2 ? "Discrepancy" : "Shortage";
}

const TONE: Record<string, "green" | "amber" | "blue" | "red"> = {
  Matched: "green",
  Discrepancy: "amber",
  Surplus: "blue",
  Shortage: "red",
};

export default function StockIn() {
  const [lines, setLines] = useState<Line[]>(INITIAL);
  const navigate = useNavigate();

  const totalReceived = lines.reduce((s, l) => s + l.received, 0);
  const discrepancyCount = lines.filter((l) => l.received !== l.ordered).length;
  const progress = Math.round((lines.filter((l) => lineStatus(l) === "Matched").length / lines.length) * 100);

  function updateReceived(code: string, value: number) {
    setLines((prev) => prev.map((l) => (l.code === code ? { ...l, received: value } : l)));
  }

  function proceed() {
    navigate("/inventory/overview");
  }

  return (
    <div>
      <PageHeader trail={["Inventory", "Create Stock In (GRN)"]} title="New Goods Receipt Note" subtitle="Receive physical inventory against Purchase Order #PO-2024-00892" />
      <div className="flex items-center gap-3 mb-6">
        {["Origin & Supplier", "Receive Items", "Discrepancy Review"].map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${i <= 1 ? "bg-zinc-900 text-white" : "border border-zinc-300 text-zinc-400"}`}>
                {i === 0 ? <Check size={13} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i <= 1 ? "text-zinc-800" : "text-zinc-400"}`}>{s}</span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-zinc-200" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <Card
          title="Receipt Lines"
          subtitle="Verify quantities for 5 items from Supplier: Global Logistics Corp."
          className="col-span-2"
          actions={
            <div className="flex gap-2">
              <Button variant="secondary">Bulk Scan</Button>
              <Button variant="secondary">
                <Plus size={14} /> Add Item
              </Button>
            </div>
          }
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                <th className="py-2 font-medium">Item</th>
                <th className="py-2 font-medium">Ordered</th>
                <th className="py-2 font-medium">Received</th>
                <th className="py-2 font-medium">Rejected</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((r) => (
                <tr key={r.code} className="border-b border-zinc-50">
                  <td className="py-3">
                    <p className="font-medium">{r.desc}</p>
                    <p className="text-xs text-zinc-400">{r.code}</p>
                  </td>
                  <td className="py-3">{r.ordered}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      className="w-16 border border-zinc-200 rounded px-2 py-1 text-sm"
                      value={r.received}
                      onChange={(e) => updateReceived(r.code, Number(e.target.value))}
                    />
                  </td>
                  <td className="py-3">{r.rejected}</td>
                  <td className="py-3">
                    <Badge tone={TONE[lineStatus(r)]}>{lineStatus(r)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-zinc-400 mt-3">
            All changes are auto-saved as draft. &nbsp; Total Items: {lines.length} &nbsp; Total Qty Received: {totalReceived}
          </p>
          <Card title="Documentation & Evidence" subtitle="Upload delivery notes, invoices, or photos of damaged goods." className="mt-4">
            <div className="flex gap-3">
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-zinc-200 flex items-center justify-center text-zinc-300">
                <Plus size={18} />
              </div>
              <div className="h-16 flex-1 rounded-lg border border-zinc-100 flex items-center gap-2 px-3 text-xs">
                <FileText size={14} className="text-zinc-400" /> Delivery_Note.pdf
              </div>
            </div>
          </Card>
        </Card>
        <div className="space-y-5">
          <Card title="Discrepancy Review">
            <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-3 mb-3">
              <p className="font-medium flex items-center gap-1 mb-1">
                <AlertTriangle size={12} /> Verification Alert
              </p>
              You have {discrepancyCount} line item(s) with quantity discrepancies. Please provide a reason code before finalizing.
            </div>
          </Card>
          <Card title="Summary Information">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Target Warehouse</span>
                <span className="font-medium">WH-NORTH-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Associated PO</span>
                <span className="font-medium">#PO-2024-00892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Completion</span>
                <span className="font-medium">{progress}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-zinc-100 rounded-full mt-2">
              <div className="h-1.5 bg-zinc-800 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <Button className="w-full justify-center mt-4" onClick={proceed}>
              Proceed to Final Review
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
