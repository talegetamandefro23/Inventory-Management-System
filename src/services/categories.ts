/**
 * Categories API Service
 *
 * Handles CRUD for the category hierarchy.
 * Currently uses mock data — swap endpoints for real API calls.
 */

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  status: "Active" | "Inactive";
  productCount: number;
}

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

let mockCategories: Category[] = [
  { id: "electronics", name: "Electronics", parentId: null, description: "All electronic gadgets and hardware", status: "Active", productCount: 1250 },
  { id: "laptops", name: "Laptops", parentId: "electronics", description: "Portable computing devices", status: "Active", productCount: 450 },
  { id: "smartphones", name: "Smartphones", parentId: "electronics", description: "Mobile phones and accessories", status: "Active", productCount: 600 },
  { id: "accessories", name: "Accessories", parentId: "electronics", description: "Cables, cases, and peripherals", status: "Active", productCount: 200 },
  { id: "office-supplies", name: "Office Supplies", parentId: null, description: "Stationery and office consumables", status: "Active", productCount: 890 },
  { id: "paper-products", name: "Paper Products", parentId: "office-supplies", description: "Paper, notebooks, and printing supplies", status: "Active", productCount: 340 },
  { id: "writing-tools", name: "Writing Tools", parentId: "office-supplies", description: "Pens, markers, and correction tools", status: "Active", productCount: 180 },
  { id: "furniture", name: "Furniture", parentId: null, description: "Office and warehouse furniture", status: "Active", productCount: 320 },
  { id: "industrial-equipment", name: "Industrial Equipment", parentId: null, description: "Heavy machinery and industrial tools", status: "Inactive", productCount: 95 },
  { id: "tools", name: "Tools", parentId: "industrial-equipment", description: "Hand tools and power tools", status: "Active", productCount: 340 },
  { id: "machinery", name: "Machinery", parentId: "industrial-equipment", description: "Heavy machinery and equipment", status: "Active", productCount: 120 },
  { id: "ppe", name: "PPE", parentId: null, description: "Personal protective equipment", status: "Active", productCount: 560 },
  { id: "chemicals", name: "Chemicals", parentId: null, description: "Industrial chemicals and lubricants", status: "Active", productCount: 280 },
  { id: "hardware", name: "Hardware", parentId: null, description: "Fasteners, casters, and hardware components", status: "Active", productCount: 890 },
  { id: "components", name: "Components", parentId: null, description: "Electronic and mechanical components", status: "Active", productCount: 1100 },
  { id: "safety", name: "Safety", parentId: null, description: "Safety equipment and fire protection", status: "Active", productCount: 340 },
];

export const categoriesService = {
  /** GET /api/categories */
  async list(): Promise<Category[]> {
    await delay(200);
    return [...mockCategories];
  },

  /** GET /api/categories/:id */
  async getById(id: string): Promise<Category | undefined> {
    await delay(150);
    return mockCategories.find((c) => c.id === id);
  },

  /** GET /api/categories/tree */
  async tree(): Promise<Category[]> {
    await delay(200);
    return [...mockCategories];
  },

  /** POST /api/categories */
  async create(cat: Omit<Category, "id" | "productCount">): Promise<Category> {
    await delay(300);
    const id = cat.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const newCat: Category = { ...cat, id, productCount: 0 };
    mockCategories = [...mockCategories, newCat];
    return newCat;
  },

  /** PUT /api/categories/:id */
  async update(id: string, updates: Partial<Category>): Promise<Category> {
    await delay(300);
    const idx = mockCategories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Category not found");
    mockCategories[idx] = { ...mockCategories[idx], ...updates };
    return mockCategories[idx];
  },

  /** DELETE /api/categories/:id */
  async remove(id: string): Promise<void> {
    await delay(300);
    // Also remove children
    const toDelete = new Set<string>();
    function collect(cid: string) {
      toDelete.add(cid);
      mockCategories.filter((c) => c.parentId === cid).forEach((c) => collect(c.id));
    }
    collect(id);
    mockCategories = mockCategories.filter((c) => !toDelete.has(c.id));
  },

  /** GET /api/categories/:id/items */
  async getItems(categoryId: string): Promise<string[]> {
    await delay(200);
    // Returns item codes belonging to this category
    const cat = mockCategories.find((c) => c.id === categoryId);
    if (!cat) return [];
    // In a real API, this would join with items table
    return [];
  },
};
