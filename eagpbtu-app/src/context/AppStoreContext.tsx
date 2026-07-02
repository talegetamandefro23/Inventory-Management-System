import React, { createContext, useContext, useState } from "react";
import { ITEMS, Item } from "../data/items";
import { REQUISITIONS, Requisition } from "../data/requisitions";

export interface ApprovalTask {
  id: string;
  type: "PR" | "TR" | "ADJ" | "AS";
  title: string;
  who: string;
  time: string;
  value?: string;
  tone: "zinc" | "amber" | "red";
  status: "Pending" | "Approved" | "Rejected";
}

const INITIAL_TASKS: ApprovalTask[] = [
  { id: "PR-2024-001", type: "PR", title: "Office Supplies & Electronics", who: "Sarah Jenkins", time: "2 hours ago", value: "$4,250.00", tone: "amber", status: "Pending" },
  { id: "TR-99281", type: "TR", title: "WH-A to WH-C Electronics", who: "Marcus Vane", time: "5 hours ago", tone: "red", status: "Pending" },
  { id: "ADJ-102", type: "ADJ", title: "Q3 Inventory Correction", who: "Elena Rodriguez", time: "Yesterday", tone: "zinc", status: "Pending" },
  { id: "AS-882", type: "AS", title: "MacBook Pro M3 Deployment", who: "David Chen", time: "Yesterday", value: "$2,800.00", tone: "amber", status: "Pending" },
  { id: "PR-2024-005", type: "PR", title: "Industrial Grade Forklift Parts", who: "Robert Fox", time: "2 days ago", value: "$12,400.00", tone: "red", status: "Pending" },
];

interface AppStore {
  items: Item[];
  requisitions: Requisition[];
  tasks: ApprovalTask[];
  addRequisition: (r: Requisition) => void;
  approveTask: (id: string) => void;
  rejectTask: (id: string) => void;
  adjustStock: (code: string, delta: number) => void;
}

const AppStoreContext = createContext<AppStore | undefined>(undefined);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>(ITEMS);
  const [requisitions, setRequisitions] = useState<Requisition[]>(REQUISITIONS);
  const [tasks, setTasks] = useState<ApprovalTask[]>(INITIAL_TASKS);

  function addRequisition(r: Requisition) {
    setRequisitions((prev) => [r, ...prev]);
    setTasks((prev) => [
      { id: r.id, type: "PR", title: r.requester, who: r.requester, time: "Just now", value: `$${r.value.toFixed(2)}`, tone: "amber", status: "Pending" },
      ...prev,
    ]);
  }

  function approveTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Approved" } : t)));
  }

  function rejectTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Rejected" } : t)));
  }

  function adjustStock(code: string, delta: number) {
    setItems((prev) =>
      prev.map((it) =>
        it.code === code
          ? {
              ...it,
              onHand: Math.max(0, it.onHand + delta),
              status: it.onHand + delta <= 0 ? "Out of Stock" : it.onHand + delta < 15 ? "Low Stock" : "Active",
            }
          : it
      )
    );
  }

  return (
    <AppStoreContext.Provider value={{ items, requisitions, tasks, addRequisition, approveTask, rejectTask, adjustStock }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
