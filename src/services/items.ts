/**
 * Items API Service
 *
 * Handles all CRUD operations for inventory items.
 * Currently uses mock data — swap endpoints for real API calls.
 */

import { ITEMS, type Item } from "../data/items";

// Simulated network delay for mock mode
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// In-memory store for mock mode
let mockItems = [...ITEMS];

export const itemsService = {
  /** GET /api/items */
  async list(params?: { search?: string; category?: string; status?: string }): Promise<Item[]> {
    await delay();
    let result = [...mockItems];
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.code.toLowerCase().includes(q) ||
          it.brand.toLowerCase().includes(q)
      );
    }
    if (params?.category) {
      result = result.filter((it) => it.category === params.category);
    }
    if (params?.status) {
      result = result.filter((it) => it.status === params.status);
    }
    return result;
  },

  /** GET /api/items/:code */
  async getByCode(code: string): Promise<Item | undefined> {
    await delay(200);
    return mockItems.find((it) => it.code === code);
  },

  /** POST /api/items */
  async create(item: Omit<Item, "code">): Promise<Item> {
    await delay(400);
    const newItem: Item = {
      ...item,
      code: `SKU-${String(mockItems.length + 1).padStart(3, "0")}`,
    };
    mockItems = [newItem, ...mockItems];
    return newItem;
  },

  /** PUT /api/items/:code */
  async update(code: string, updates: Partial<Item>): Promise<Item> {
    await delay(300);
    const idx = mockItems.findIndex((it) => it.code === code);
    if (idx === -1) throw new Error("Item not found");
    mockItems[idx] = { ...mockItems[idx], ...updates };
    return mockItems[idx];
  },

  /** DELETE /api/items/:code */
  async remove(code: string): Promise<void> {
    await delay(300);
    mockItems = mockItems.filter((it) => it.code !== code);
  },

  /** PATCH /api/items/:code/stock */
  async adjustStock(code: string, delta: number): Promise<Item> {
    await delay(200);
    const idx = mockItems.findIndex((it) => it.code === code);
    if (idx === -1) throw new Error("Item not found");
    const newOnHand = Math.max(0, mockItems[idx].onHand + delta);
    mockItems[idx] = {
      ...mockItems[idx],
      onHand: newOnHand,
      status:
        newOnHand <= 0 ? "Out of Stock" : newOnHand < 15 ? "Low Stock" : "Active",
    };
    return mockItems[idx];
  },

  /** POST /api/items/import */
  async importItems(items: Omit<Item, "code">[]): Promise<Item[]> {
    await delay(500);
    const created = items.map((item, i) => ({
      ...item,
      code: `SKU-${String(mockItems.length + i + 1).padStart(3, "0")}`,
    }));
    mockItems = [...created, ...mockItems];
    return created;
  },

  /** GET /api/items/export */
  async exportCsv(): Promise<string> {
    await delay(300);
    const headers = ["Code", "Name", "Category", "Brand", "Unit", "On Hand", "Status", "Warehouse", "Unit Cost"];
    const rows = mockItems.map((it) =>
      [it.code, it.name, it.category, it.brand, it.unit, it.onHand, it.status, it.warehouse, it.unitCost].join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  },
};
