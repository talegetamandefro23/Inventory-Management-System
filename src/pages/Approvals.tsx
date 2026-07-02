import { useState } from "react";
import { FileText, Check, X } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../components/ui";
import { useAppStore, ApprovalTask } from "../context/AppStoreContext";
import { useToast } from "../hooks/useToast";

const TYPE_TABS = ["All", "PR", "TR", "ADJ", "AS"];

export default function Approvals() {
  const { tasks, approveTask, rejectTask } = useAppStore();
  const { addToast } = useToast();
  const [activeType, setActiveType] = useState("All");
  const [selected, setSelected] = useState<ApprovalTask>(tasks[0]);
  const [comment, setComment] = useState("");

  const visible = tasks.filter((t) => activeType === "All" || t.type === activeType);

  function handleApprove() {
    approveTask(selected.id);
    addToast(`${selected.id} approved successfully`, "success");
    setComment("");
    const next = tasks.find((t) => t.status === "Pending" && t.id !== selected.id);
    if (next) setSelected(next);
  }

  function handleReject() {
    rejectTask(selected.id);
    addToast(`${selected.id} rejected`, "warning");
    setComment("");
    const next = tasks.find((t) => t.status === "Pending" && t.id !== selected.id);
    if (next) setSelected(next);
  }

  const pendingCount = tasks.filter((t) => t.status === "Pending").length;

  return (
    <div>
      <PageHeader trail={["System", "Approvals Hub"]} title="Pending Tasks" />
      <div className="grid grid-cols-3 gap-5">
        {/* Task list */}
        <Card>
          <input
            className="w-full mb-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            placeholder="Search request ID, requester..."
          />
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {TYPE_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-2.5 py-1 rounded-full text-xs transition-all duration-150 ${activeType === t ? "bg-primary-600 text-white shadow-primary-sm" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mb-2">
            <span>{pendingCount} Pending</span>
            <span>Latest</span>
          </div>
          <div className="space-y-2">
            {visible.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-full text-left rounded-lg border p-3 transition-all duration-150 ${selected?.id === t.id ? "border-primary-500 bg-primary-50 dark:bg-primary-950/20 dark:border-primary-700" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <Badge tone={t.tone}>{t.type}</Badge>
                  <span className="text-[10px] text-zinc-300">{t.time}</span>
                </div>
                <p className="font-medium text-sm">{t.id}</p>
                <p className="text-xs text-zinc-500 mb-1">{t.title}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <div className="h-4 w-4 rounded-full bg-zinc-200 flex items-center justify-center text-[9px]">{t.who[0]}</div>
                    {t.who}
                  </span>
                  {t.value && <span className="text-xs font-semibold">{t.value}</span>}
                </div>
                <div className="mt-1">
                  {t.status === "Pending" ? (
                    <Badge tone="amber">Draft Review</Badge>
                  ) : t.status === "Approved" ? (
                    <Badge tone="green">Approved</Badge>
                  ) : (
                    <Badge tone="red">Rejected</Badge>
                  )}
                </div>
              </button>
            ))}
            {visible.length === 0 && (
              <p className="text-xs text-zinc-400 text-center py-6">No tasks in this category.</p>
            )}
          </div>
        </Card>

        {/* Detail panel */}
        {selected && (
          <Card title={selected.id} subtitle={selected.title} className="col-span-2">
            <p className="text-xs text-zinc-400 mb-3">
              Submitted by {selected.who} · {selected.type === "PR" ? "Procurement" : "Operations"}
            </p>

            {/* Status ribbon */}
            {selected.status !== "Pending" && (
              <div className={`rounded-lg p-3 text-sm mb-4 font-medium flex items-center gap-2 ${selected.status === "Approved" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {selected.status === "Approved" ? <Check size={16} /> : <X size={16} />}
                This task has been {selected.status.toLowerCase()}.
              </div>
            )}

            <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 text-sm text-zinc-600 mb-4">
              "This request covers materials needed for the {selected.title}. Please review all attached documentation and approve or reject accordingly."
            </div>

            <p className="text-xs font-semibold text-zinc-400 mb-2">LINKED DOCUMENT</p>
            <div className="flex items-center gap-2 border border-zinc-100 rounded-lg p-3 mb-4">
              <FileText size={16} className="text-zinc-400" />
              <span className="text-sm">{selected.id.replace("-", "_")}_Request.pdf</span>
            </div>

            {selected.value && (
              <div className="rounded-lg bg-zinc-900 text-white p-4 mb-4">
                <p className="text-xs text-zinc-400">Requested Value</p>
                <p className="text-2xl font-bold">{selected.value}</p>
              </div>
            )}

            <p className="text-xs font-semibold text-zinc-400 mb-2">ADD COMMENT</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm h-16 mb-3"
              placeholder="Type a comment or reason for decision..."
              disabled={selected.status !== "Pending"}
            />

            {selected.status === "Pending" && (
              <div className="flex gap-2">
                <Button variant="danger" className="flex-1 justify-center" onClick={handleReject}>
                  <X size={14} /> Reject
                </Button>
                <Button className="flex-1 justify-center" onClick={handleApprove}>
                  <Check size={14} /> Approve
                </Button>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
