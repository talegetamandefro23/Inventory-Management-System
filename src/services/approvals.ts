/**
 * Approvals API Service
 *
 * Handles approval workflow tasks.
 */

import type { ApprovalTask } from "../context/AppStoreContext";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const INITIAL_TASKS: ApprovalTask[] = [
  { id: "PR-2024-001", type: "PR", title: "Office Supplies & Electronics", who: "Sarah Jenkins", time: "2 hours ago", value: "$4,250.00", tone: "amber", status: "Pending" },
  { id: "TR-99281", type: "TR", title: "WH-A to WH-C Electronics", who: "Marcus Vane", time: "5 hours ago", tone: "red", status: "Pending" },
  { id: "ADJ-102", type: "ADJ", title: "Q3 Inventory Correction", who: "Elena Rodriguez", time: "Yesterday", tone: "zinc", status: "Pending" },
  { id: "AS-882", type: "AS", title: "MacBook Pro M3 Deployment", who: "David Chen", time: "Yesterday", value: "$2,800.00", tone: "amber", status: "Pending" },
  { id: "PR-2024-005", type: "PR", title: "Industrial Grade Forklift Parts", who: "Robert Fox", time: "2 days ago", value: "$12,400.00", tone: "red", status: "Pending" },
  { id: "TR-99305", type: "TR", title: "WH-B to WH-A Chemical Transfer", who: "Amanda Lee", time: "2 days ago", tone: "amber", status: "Pending" },
  { id: "ADJ-108", type: "ADJ", title: "Annual Cycle Count Discrepancy", who: "Tom Wilson", time: "3 days ago", tone: "red", status: "Pending" },
  { id: "AS-895", type: "AS", title: "Server Rack Deployment", who: "Michael Chen", time: "3 days ago", value: "$8,500.00", tone: "zinc", status: "Pending" },
];

let mockTasks = [...INITIAL_TASKS];

export const approvalsService = {
  /** GET /api/approvals */
  async list(params?: { type?: string; status?: string }): Promise<ApprovalTask[]> {
    await delay(200);
    let result = [...mockTasks];
    if (params?.type && params.type !== "All") {
      result = result.filter((t) => t.type === params.type);
    }
    if (params?.status) {
      result = result.filter((t) => t.status === params.status);
    }
    return result;
  },

  /** GET /api/approvals/:id */
  async getById(id: string): Promise<ApprovalTask | undefined> {
    await delay(150);
    return mockTasks.find((t) => t.id === id);
  },

  /** POST /api/approvals/:id/approve */
  async approve(id: string): Promise<ApprovalTask> {
    await delay(400);
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    mockTasks[idx] = { ...mockTasks[idx], status: "Approved" };
    return mockTasks[idx];
  },

  /** POST /api/approvals/:id/reject */
  async reject(id: string): Promise<ApprovalTask> {
    await delay(400);
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    mockTasks[idx] = { ...mockTasks[idx], status: "Rejected" };
    return mockTasks[idx];
  },
};
