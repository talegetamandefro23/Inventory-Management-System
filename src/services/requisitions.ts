/**
 * Requisitions API Service
 *
 * Handles CRUD for purchase requisitions.
 */

import { REQUISITIONS, type Requisition } from "../data/requisitions";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let mockRequisitions = [...REQUISITIONS];

export const requisitionsService = {
  /** GET /api/requisitions */
  async list(params?: { search?: string; urgency?: string }): Promise<Requisition[]> {
    await delay(200);
    let result = [...mockRequisitions];
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.requester.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q)
      );
    }
    if (params?.urgency) {
      result = result.filter((r) => r.urgency === params.urgency);
    }
    return result;
  },

  /** GET /api/requisitions/:id */
  async getById(id: string): Promise<Requisition | undefined> {
    await delay(150);
    return mockRequisitions.find((r) => r.id === id);
  },

  /** POST /api/requisitions */
  async create(req: Omit<Requisition, "id">): Promise<Requisition> {
    await delay(400);
    const newReq: Requisition = {
      ...req,
      id: `PR-${Date.now().toString().slice(-6)}`,
    };
    mockRequisitions = [newReq, ...mockRequisitions];
    return newReq;
  },

  /** PUT /api/requisitions/:id */
  async update(id: string, updates: Partial<Requisition>): Promise<Requisition> {
    await delay(300);
    const idx = mockRequisitions.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Requisition not found");
    mockRequisitions[idx] = { ...mockRequisitions[idx], ...updates };
    return mockRequisitions[idx];
  },

  /** DELETE /api/requisitions/:id */
  async remove(id: string): Promise<void> {
    await delay(300);
    mockRequisitions = mockRequisitions.filter((r) => r.id !== id);
  },
};
