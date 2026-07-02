import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Plus } from "lucide-react";
import { Badge, Button, Card, PageHeader, StatCard } from "../../components/ui";
import { useToast } from "../../hooks/useToast";

const SUPPLIERS = [
  { name: "Global Industrial Supplies Co.", stars: 4, price: 12450, terms: "Net 30", lead: 14, inco: "DDP", quality: 92, match: 95 },
  { name: "Apex Manufacturing Ltd.", stars: 4, price: 10800, terms: "Net 60", lead: 28, inco: "FOB", quality: 85, match: 90 },
  { name: "Precision Parts & Tools", stars: 4, price: 13200, terms: "COD", lead: 7, inco: "EXW", quality: 98, match: 100 },
];

export default function RfqComparison() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [weights, setWeights] = useState({ price: 60, delivery: 30, quality: 10 });
  const [selected, setSelected] = useState<number | null>(null);

  const lowestPrice = Math.min(...SUPPLIERS.map((s) => s.price));
  const shortestLead = Math.min(...SUPPLIERS.map((s) => s.lead));

  const scores = useMemo(() => {
    return SUPPLIERS.map((s) => {
      const priceScore = ((lowestPrice / s.price) * 100 * weights.price) / 100;
      const deliveryScore = ((shortestLead / s.lead) * 100 * weights.delivery) / 100;
      const qualityScore = (s.quality * weights.quality) / 100;
      return Math.round(priceScore + deliveryScore + qualityScore);
    });
  }, [weights, lowestPrice, shortestLead]);

  const ranked = [...SUPPLIERS.map((s, i) => ({ ...s, score: scores[i], idx: i }))].sort((a, b) => b.score - a.score);

  function updateWeight(key: keyof typeof weights, val: number) {
    const others = Object.keys(weights).filter((k) => k !== key) as (keyof typeof weights)[];
    const remaining = 100 - val;
    const share = Math.round(remaining / 2);
    setWeights({ ...weights, [key]: val, [others[0]]: share, [others[1]]: 100 - val - share });
  }

  return (
    <div>
      <PageHeader
        trail={["Procurement", "RFQ Management", "Quotation Comparison"]}
        title="RFQ-2024-0892"
        subtitle="Annual Procurement for Maintenance Tools and Hydraulic Components."
        actions={
          <>
            <Button variant="secondary">
              <Download size={14} /> Export Analysis
            </Button>
            <Button>
              <Plus size={14} /> New Comparison View
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon={Plus} label="Total Bids" value="03 Suppliers" tone="indigo" />
        <StatCard icon={Plus} label="Best Bid Price" value={`$${lowestPrice.toLocaleString()}`} trendUp tone="green" />
        <StatCard icon={Plus} label="Shortest Lead Time" value={`${shortestLead} Days`} tone="amber" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Comparison table */}
        <Card title="Side-by-Side Comparison" className="col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                  <th className="py-2 font-medium w-36">Criteria</th>
                  {SUPPLIERS.map((s) => (
                    <th key={s.name} className="py-2 font-medium text-center">
                      {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Total Bid Price",
                    render: (s: typeof SUPPLIERS[0]) => (
                      <span className={s.price === lowestPrice ? "text-emerald-600 font-bold" : "font-medium"}>
                        ${s.price.toLocaleString()}
                        {s.price === lowestPrice && <p className="text-[10px] font-normal text-emerald-500">Lowest Price</p>}
                      </span>
                    ),
                  },
                  { label: "Payment Terms", render: (s: typeof SUPPLIERS[0]) => s.terms },
                  {
                    label: "Lead Time",
                    render: (s: typeof SUPPLIERS[0]) => (
                      <span className={s.lead === shortestLead ? "text-emerald-600 font-medium" : ""}>
                        {s.lead} Days
                        {s.lead === shortestLead && <p className="text-[10px] text-emerald-500">Fastest</p>}
                      </span>
                    ),
                  },
                  { label: "Incoterms", render: (s: typeof SUPPLIERS[0]) => s.inco },
                  {
                    label: "Quality Score",
                    render: (s: typeof SUPPLIERS[0]) => (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-zinc-100 rounded-full">
                          <div className="h-1.5 bg-zinc-800 rounded-full" style={{ width: `${s.quality}%` }} />
                        </div>
                        <span className="text-xs">{s.quality}%</span>
                      </div>
                    ),
                  },
                  {
                    label: "Technical Match",
                    render: (s: typeof SUPPLIERS[0]) => <Badge tone="green">{s.match}% Match</Badge>,
                  },
                ].map(({ label, render }) => (
                  <tr key={label} className="border-b border-zinc-50">
                    <td className="py-3 text-xs text-zinc-400 uppercase">{label}</td>
                    {SUPPLIERS.map((s) => (
                      <td key={s.name} className="py-3 text-center">
                        {render(s)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 text-amber-700 text-xs rounded-lg p-3 mt-4">
            <p className="font-medium mb-1">Auditor's Note</p>
            Precision Parts & Tools (S3) has the highest unit cost but offers the fastest turnaround and 100% technical compliance. Consider whether urgency outweighs the price premium over Apex (S2).
          </div>
        </Card>

        {/* Decision matrix */}
        <Card title="Decision Matrix" subtitle="Adjust weightings to recalculate rankings.">
          {(Object.entries(weights) as [keyof typeof weights, number][]).map(([key, val]) => (
            <div key={key} className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="capitalize">{key === "delivery" ? "Delivery Speed" : key === "quality" ? "Reliability & Quality" : "Price Importance"}</span>
                <span className="font-medium">{val}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={90}
                value={val}
                onChange={(e) => updateWeight(key, Number(e.target.value))}
                className="w-full accent-zinc-800"
              />
            </div>
          ))}

          <p className="text-xs font-semibold text-zinc-400 mt-4 mb-3">AUTOMATED RECOMMENDATION</p>
          {ranked.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setSelected(s.idx)}
              className={`flex items-center justify-between w-full border rounded-lg p-2.5 mb-2 text-xs transition-all duration-150 ${selected === s.idx ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 dark:border-primary-700" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"}`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${i === 0 ? "bg-primary-600 text-white" : "bg-zinc-100 dark:bg-zinc-800"}`}>#{i + 1}</span>
                <div className="text-left">
                  <p className="font-medium truncate max-w-[140px]">{s.name}</p>
                  <p className="text-zinc-400">Composite Score: {s.score}/100</p>
                </div>
              </div>
            </button>
          ))}

          <Button
            className="w-full justify-center mt-3 mb-2"
            onClick={() => {
              addToast(`PO created for ${SUPPLIERS[selected!].name}`, "success");
              navigate("/procurement/orders");
            }}
            disabled={selected === null}
          >
            Convert to Purchase Order
          </Button>
          <Button variant="secondary" className="w-full justify-center" onClick={() => addToast("RFQ sent for approval", "info")}>
            Send for Approval
          </Button>
          {selected !== null && (
            <div className="mt-3 bg-zinc-50 text-zinc-500 text-xs rounded-lg p-2">
              Drafting PO for: <strong>{SUPPLIERS[selected].name}</strong>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
