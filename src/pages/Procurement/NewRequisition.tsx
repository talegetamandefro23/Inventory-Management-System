import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus, Trash2, AlertTriangle, FileText } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../../components/ui";
import { useAppStore } from "../../context/AppStoreContext";
import type { Requisition } from "../../data/requisitions";

interface LineItem {
  id: number;
  name: string;
  sku: string;
  qty: number;
  unit: string;
  price: number;
}

const TAX = 0.08;

export default function NewRequisition() {
  const { addRequisition } = useAppStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("IT Operations");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [project, setProject] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [lines, setLines] = useState<LineItem[]>([
    {
      id: 1,
      name: "High-Performance Server Rack",
      sku: "SK-IT-203-01",
      qty: 2,
      unit: "EA",
      price: 1250,
    },
    {
      id: 2,
      name: "Cat6 Networking Cables (100m)",
      sku: "SK-IT-203-02",
      qty: 5,
      unit: "Roll",
      price: 85.5,
    },
  ]);

  const subTotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const taxAmount = subTotal * TAX;
  const grandTotal = subTotal + taxAmount;
  const needsMultipleQuotes = grandTotal > 2000;

  function addLine() {
    setLines((prev) => [
      ...prev,
      { id: Date.now(), name: "", sku: "", qty: 1, unit: "EA", price: 0 },
    ]);
  }

  function removeLine(id: number) {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLine(
    id: number,
    field: keyof LineItem,
    value: string | number,
  ) {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  }

  function validate() {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Requisition title is required.");
    if (lines.length === 0) errs.push("At least one item is required.");
    if (lines.some((l) => !l.name.trim()))
      errs.push("All item names must be filled in.");
    return errs;
  }

  function submit() {
    const errs = validate();
    if (errs.length) {
      setErrors(errs);
      return;
    }
    setErrors([]);

    const pr: Requisition = {
      id: `PR-${Date.now().toString().slice(-6)}`,
      requester: "John Doe",
      department,
      date: new Date().toISOString().slice(0, 10),
      urgency: priority,
      value: grandTotal,
    };
    addRequisition(pr);
    setSubmitted(true);
    setTimeout(() => navigate("/procurement/requisitions"), 1500);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl">
          ✓
        </div>
        <p className="font-semibold text-lg">Requisition Submitted!</p>
        <p className="text-sm text-zinc-500">
          Routing to approval queue… redirecting to list.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        trail={[
          "Procurement",
          "Purchase Requisitions",
          "Create New Requisition",
        ]}
        title="New Purchase Requisition"
        subtitle="Submit a formal request for materials or services."
      />

      {/* Approval route */}
      <Card title="Expected Approval Route" className="mb-5">
        <div className="flex items-center gap-4">
          {[
            ["John Doe", "Initiator"],
            ["Sarah Miller", "Dept. Head"],
            ["Robert Chen", "Finance Dir."],
          ].map(([name, role], i) => (
            <div key={role} className="flex items-center gap-4 flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-10 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-bold">
                  {(name as string)[0]}
                </div>
                <p className="text-xs font-medium">{role as string}</p>
                <p className="text-[10px] text-zinc-400">{name as string}</p>
              </div>
              {i < 2 && (
                <div className="flex-1 h-px border-t border-dashed border-zinc-300" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {errors.length > 0 && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 space-y-1">
          {errors.map((e) => (
            <p key={e}>• {e}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-5">
        {/* Left: form */}
        <div className="col-span-2 space-y-5">
          <Card
            title="General Information"
            subtitle="Header details for this requisition."
          >
            <label className="text-xs text-zinc-500">Requisition Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 mb-4 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              placeholder="e.g., IT Infrastructure Upgrade - Q3 2024"
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-zinc-500">
                  Requesting Department
                </label>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as "High" | "Medium" | "Low")
                  }
                  className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500">Link to Project</label>
                <input
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                  placeholder="Project ARES: Automation"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500">
                  Desired Delivery Date
                </label>
                <input
                  type="date"
                  className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </Card>

          <Card
            title="Requested Items"
            subtitle="Add the materials or services needed."
            actions={
              <Button variant="secondary" onClick={addLine}>
                <Plus size={14} /> Add Item
              </Button>
            }
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                  <th className="py-2 font-medium">Item / Description</th>
                  <th className="py-2 font-medium w-16">Qty</th>
                  <th className="py-2 font-medium w-16">Unit</th>
                  <th className="py-2 font-medium w-24">Unit Price</th>
                  <th className="py-2 font-medium w-24">Subtotal</th>
                  <th className="w-6"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((it) => (
                  <tr key={it.id} className="border-b border-zinc-50">
                    <td className="py-2">
                      <input
                        value={it.name}
                        onChange={(e) =>
                          updateLine(it.id, "name", e.target.value)
                        }
                        className="w-full border border-zinc-100 rounded px-2 py-1 text-sm"
                        placeholder="Item name"
                      />
                      <input
                        value={it.sku}
                        onChange={(e) =>
                          updateLine(it.id, "sku", e.target.value)
                        }
                        className="w-full border-0 text-xs text-zinc-400 px-2 py-0 mt-0.5 outline-none"
                        placeholder="SKU"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={it.qty}
                        onChange={(e) =>
                          updateLine(it.id, "qty", Number(e.target.value))
                        }
                        className="w-full border border-zinc-100 rounded px-2 py-1 text-sm text-center"
                        min={1}
                      />
                    </td>
                    <td className="py-2">
                      <input
                        value={it.unit}
                        onChange={(e) =>
                          updateLine(it.id, "unit", e.target.value)
                        }
                        className="w-full border border-zinc-100 rounded px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={it.price}
                        onChange={(e) =>
                          updateLine(it.id, "price", Number(e.target.value))
                        }
                        className="w-full border border-zinc-100 rounded px-2 py-1 text-sm text-right"
                        step={0.01}
                      />
                    </td>
                    <td className="py-2 font-medium text-right pr-2">
                      ${(it.qty * it.price).toFixed(2)}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => removeLine(it.id)}
                        className="text-zinc-300 hover:text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Reason for Requisition">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm h-20"
              placeholder="Provide a detailed explanation of why these items are required. Mention specific milestones or operational gaps this will address."
            />
          </Card>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-5">
          <Card title="Supporting Documents">
            <div className="rounded-lg border-2 border-dashed border-zinc-200 p-6 text-center text-xs text-zinc-400 mb-3">
              <Upload size={18} className="mx-auto mb-2" />
              Click to upload quotes
              <br />
              PDF, DOCX or JPEG (Max 10MB)
            </div>
            {["Supplier_Quote_A.pdf", "System_Specs_Final.docx"].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-xs border border-zinc-100 rounded-lg px-3 py-2 mb-2"
              >
                <FileText size={13} className="text-zinc-400" />
                {f}
              </div>
            ))}
          </Card>

          <Card
            title="Suggested Suppliers"
            subtitle="Based on item category history."
          >
            {[
              ["TechSolutions Global", "4.8", "Lowest Price", true],
              ["OmniNet Systems", "4.5", "Fastest Lead Time", false],
              ["Logix Hardware", "4.2", "Local", false],
            ].map(([n, r, tag, pref]) => (
              <div
                key={n as string}
                className="rounded-lg border border-zinc-100 p-2.5 mb-2 text-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{n}</span>
                  {pref && <Badge tone="green">Preferred</Badge>}
                </div>
                <p className="text-xs text-zinc-400">
                  {r}★ · {tag}
                </p>
              </div>
            ))}
          </Card>

          {needsMultipleQuotes && (
            <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-3">
              <p className="font-medium flex items-center gap-1 mb-1">
                <AlertTriangle size={12} /> Policy Requirement
              </p>
              Total value exceeds $2,000. Three comparative quotes are required
              before Finance Director approval.
            </div>
          )}

          <Card
            title="Submit Requisition"
            className="bg-zinc-900 text-white border-zinc-900"
          >
            <div className="flex justify-between text-sm mb-1 text-zinc-300">
              <span>Base Total</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2 text-zinc-300">
              <span>Est. Tax (8%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mb-3">
              <span>Grand Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            <Button
              className="w-full justify-center text-white hover:bg-zinc-100"
              onClick={submit}
            >
              Submit for Approval →
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-center text-zinc-200 mt-2"
              onClick={() => navigate("/procurement/requisitions")}
            >
              Cancel
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
