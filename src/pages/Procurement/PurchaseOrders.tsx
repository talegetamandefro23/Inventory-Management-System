import { useState } from "react";
import { Download, Plus, FileText, Truck, Check, Clock, AlertTriangle } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

interface PO {
  id: string;
  supplier: string;
  value: number;
  status: string;
  statusTone: "amber" | "blue" | "green" | "zinc";
}

const POS: PO[] = [
  { id: "PO-2024-001", supplier: "Apex Industrial Solutions", value: 12450, status: "Partially Received", statusTone: "amber" },
  { id: "PO-2024-002", supplier: "Global Logistics Corp", value: 4200.5, status: "Pending", statusTone: "blue" },
  { id: "PO-2024-003", supplier: "TechParts International", value: 890, status: "Completed", statusTone: "green" },
  { id: "PO-2024-004", supplier: "Heavy Machinery Ltd", value: 54000, status: "Draft", statusTone: "zinc" },
  { id: "PO-2024-005", supplier: "SecureTech Systems", value: 3200, status: "Completed", statusTone: "green" },
];

export default function PurchaseOrders() {
  const [expanded, setExpanded] = useState<string | null>("PO-2024-001");
  const [selectedSupplier] = useState(POS[0]);
  const { addToast } = useToast();

  return (
    <div>
      <PageHeader
        trail={["Procurement", "Purchase Orders"]}
        title="Purchase Orders"
        subtitle="Manage external procurement documents and track 3-way matching."
        actions={
          <>
            <Button variant="secondary" onClick={() => addToast("Purchase orders exported as CSV", "success")}>
              <Download size={14} /> Export Data
            </Button>
            <Button onClick={() => addToast("New purchase order form coming soon", "info")}>
              <Plus size={14} /> Create Purchase Order
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard icon={FileText} label="Active Orders" value="24" trend="+8% 12 Pending" trendUp tone="indigo" />
        <StatCard icon={Truck} label="Pending Delivery" value="1,420 Items" tone="teal" />
        <StatCard icon={AlertTriangle} label="Match Discrepancy" value="2.4%" tone="red" />
        <StatCard icon={Clock} label="Avg. Lead Time" value="5.2 Days" tone="zinc" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <Card>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                  <th className="py-2 font-medium">Order ID</th>
                  <th className="py-2 font-medium">Supplier</th>
                  <th className="py-2 font-medium">Total Value</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {POS.map((po) => (
                  <tr
                    key={po.id}
                    className={`border-b border-zinc-50 cursor-pointer ${expanded === po.id ? "bg-zinc-50" : "hover:bg-zinc-50"}`}
                    onClick={() => setExpanded(expanded === po.id ? null : po.id)}
                  >
                    <td className="py-3 font-medium">{po.id}</td>
                    <td className="py-3">{po.supplier}</td>
                    <td className="py-3">${po.value.toLocaleString()}</td>
                    <td className="py-3">
                      <Badge tone={po.statusTone}>{po.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {expanded && (
            <Card
              title={expanded}
              subtitle="Created on Oct 12, 2024 · Last updated 2h ago"
              actions={
                <div className="flex gap-2">
                  <Button variant="secondary">Modify</Button>
                  <Button variant="secondary">Duplicate</Button>
                </div>
              }
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                    <th className="py-2 font-medium">Item / SKU</th>
                    <th className="py-2 font-medium">Ordered</th>
                    <th className="py-2 font-medium">Received</th>
                    <th className="py-2 font-medium">Invoiced</th>
                    <th className="py-2 font-medium">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-50">
                    <td className="py-3"><p className="font-medium">Standard Steel Rods (10m)</p><p className="text-xs text-zinc-400">SR-10M-GTD</p></td>
                    <td className="py-3">100</td>
                    <td className="py-3 text-amber-600 font-medium">60</td>
                    <td className="py-3">50</td>
                    <td className="py-3">$8,500</td>
                  </tr>
                  <tr>
                    <td className="py-3"><p className="font-medium">Industrial Lubricant XL</p><p className="text-xs text-zinc-400">LUB-XL-50</p></td>
                    <td className="py-3">20</td>
                    <td className="py-3 text-emerald-600 font-medium">20</td>
                    <td className="py-3">20</td>
                    <td className="py-3">$3,950</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-end mt-3">
                <div className="text-sm w-48 space-y-1">
                  <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span>$11,205.00</span></div>
                  <div className="flex justify-between text-zinc-500"><span>Tax (10%)</span><span>$1,245.00</span></div>
                  <div className="flex justify-between font-bold pt-1 border-t border-zinc-100"><span>Total</span><span>$12,450</span></div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Supplier panel */}
        <div className="space-y-4">
          <Card title={selectedSupplier.supplier} subtitle="Premium Vendor · ID: SUP-9402">
            <div className="space-y-1 text-xs text-zinc-500 mb-3">
              <p className="flex items-center gap-1"><Check size={12} className="text-emerald-500" /> Contract Signed: Jan 2024</p>
              <p className="flex items-center gap-1"><Clock size={12} /> Last Order: 3 days ago</p>
            </div>
            <Button variant="secondary" className="w-full justify-center">View Vendor Master →</Button>
          </Card>

          <Card title="Matching Status">
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
              <div><FileText size={16} className="mx-auto mb-1 text-zinc-400" /><Badge tone="amber">Partial</Badge><p className="text-zinc-400 mt-1">PO Issued</p></div>
              <div><Truck size={16} className="mx-auto mb-1 text-zinc-400" /><Badge tone="amber">Partial</Badge><p className="text-zinc-400 mt-1">Goods Recv.</p></div>
              <div><Check size={16} className="mx-auto mb-1 text-zinc-400" /><Badge>—</Badge><p className="text-zinc-400 mt-1">Inv. Matched</p></div>
            </div>
            <div className="flex gap-3 text-xs">
              <button className="text-blue-600 underline underline-offset-2">View Linked GRN</button>
              <button className="text-blue-600 underline underline-offset-2">View Invoice</button>
            </div>
          </Card>

          <Card title="Supplier Performance Summary" subtitle="Historical reliability metrics">
            <div className="grid grid-cols-2 gap-3 mb-3 text-center">
              <div className="bg-zinc-50 rounded-lg p-2">
                <p className="text-lg font-bold text-emerald-600">94.2%</p>
                <p className="text-[10px] text-zinc-400">On-Time Delivery</p>
              </div>
              <div className="bg-zinc-50 rounded-lg p-2">
                <p className="text-lg font-bold text-amber-500">4.8★</p>
                <p className="text-[10px] text-zinc-400">Quality Rating</p>
              </div>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-zinc-500">PO-to-GRN Turnaround</span><span>3.2 Days</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Discrepancy Rate</span><span>1.4%</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Invoicing Accuracy</span><span>99.8%</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
