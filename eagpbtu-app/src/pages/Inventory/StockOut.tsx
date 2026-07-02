import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, ClipboardList, Check, ScanLine } from "lucide-react";
import { Button, Card, PageHeader } from "../../components/ui";

const STEPS = ["Recipient", "Pick & Scan", "Confirm"];

export default function StockOut() {
  const [step, setStep] = useState(0);
  const [dest, setDest] = useState("Department");
  const [department, setDepartment] = useState("");
  const [reference, setReference] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
    else navigate("/inventory/overview");
  }

  return (
    <div>
      <PageHeader trail={["Inventory", "Stock Out (Issue)"]} title="Issue Stock Wizard" subtitle="Manage the outflow of items to departments, projects, or staff." />
      <div className="flex items-center gap-3 mb-6 max-w-xl">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${i <= step ? "bg-zinc-900 text-white" : "border border-zinc-300 text-zinc-400"}`}>
                {i < step ? <Check size={13} /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i <= step ? "text-zinc-800" : "text-zinc-400"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-zinc-200" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <Card title="Select Issue Destination" className="max-w-3xl">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { k: "Department", desc: "General issuance for internal department stock.", icon: Briefcase },
              { k: "Project", desc: "Charge inventory costs against a specific project code.", icon: ClipboardList },
              { k: "Employee", desc: "Personal issuance or PPE allocation to staff.", icon: Check },
            ].map(({ k, desc, icon: Icon }) => (
              <button
                key={k}
                onClick={() => setDest(k)}
                className={`text-left rounded-lg border p-4 ${dest === k ? "border-zinc-900 bg-zinc-50" : "border-zinc-200"}`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${dest === k ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                  <Icon size={15} />
                </div>
                <p className="font-medium text-sm">{k}</p>
                <p className="text-xs text-zinc-500 mt-1">{desc}</p>
              </button>
            ))}
          </div>
          <p className="font-semibold text-sm mb-3">Issuance Details</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-500">Select {dest}</label>
              <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" placeholder="Search..." />
            </div>
            <div>
              <label className="text-xs text-zinc-500">Authorization Reference (PO/REQ)</label>
              <input value={reference} onChange={(e) => setReference(e.target.value)} className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm" placeholder="e.g. PR-2024-991" />
            </div>
          </div>
          <label className="text-xs text-zinc-500">Issuance Reason / Notes</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm h-20" placeholder="Explain why these items are being issued..." />
          <div className="flex justify-between mt-5">
            <Button variant="ghost" disabled>← Previous Step</Button>
            <Button onClick={next}>Next: Pick & Scan →</Button>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card title="Pick & Scan Items" className="max-w-3xl">
          <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-2 mb-4">
            <ScanLine size={14} className="text-zinc-400" />
            <input className="outline-none text-sm w-full" placeholder="Scan barcode or enter SKU code..." />
          </div>
          <p className="text-xs text-zinc-400 mb-4">Items scanned for this issuance will appear here as you scan them.</p>
          <div className="flex justify-between mt-5">
            <Button variant="ghost" onClick={() => setStep(0)}>← Previous Step</Button>
            <Button onClick={next}>Next: Confirm →</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card title="Confirm Issuance" className="max-w-3xl">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-zinc-500">Destination Type</span><span className="font-medium">{dest}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Department / Project / Employee</span><span className="font-medium">{department || "—"}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Authorization Reference</span><span className="font-medium">{reference || "—"}</span></div>
          </div>
          <div className="bg-zinc-50 rounded-lg p-3 text-xs text-zinc-500 mb-4">
            <p className="font-medium mb-1">Validation Checklist</p>
            <p>✓ Verified recipient authority</p>
            <p>✓ Budget availability checked</p>
            <p>✓ Inventory availability confirmed</p>
          </div>
          <div className="flex justify-between mt-5">
            <Button variant="ghost" onClick={() => setStep(1)}>← Previous Step</Button>
            <Button onClick={next}>Finalize Issuance →</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
