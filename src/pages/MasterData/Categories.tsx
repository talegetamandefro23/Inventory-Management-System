import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Folder, FolderOpen, ChevronDown, ChevronRight, Search,
  Plus, Download, Edit2, Trash2, Filter, MoreHorizontal, Check, X,
  Package, Eye, ArrowLeft,
} from "lucide-react";
import { Badge, Button, Card, PageHeader, EmptyState } from "../../components/ui";
import { useToast } from "../../hooks/useToast";
import { useAppStore } from "../../context/AppStoreContext";
import { statusTone } from "../../data/items";
import type { Item } from "../../data/items";

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  status: "Active" | "Inactive";
  productCount: number;
}

const INITIAL_CATEGORIES: Category[] = [
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

// Map category names to their IDs for item matching
const CATEGORY_NAME_TO_ID: Record<string, string> = {
  "Machinery": "machinery",
  "Tools": "tools",
  "Chemicals": "chemicals",
  "PPE": "ppe",
  "Components": "components",
  "Hardware": "hardware",
  "Electronics": "electronics",
  "Safety": "safety",
};

function useTree(categories: Category[]) {
  const roots = categories.filter((c) => c.parentId === null);
  function children(id: string) {
    return categories.filter((c) => c.parentId === id);
  }
  function parentPath(cat: Category): string {
    if (!cat.parentId) return "Root";
    const parent = categories.find((c) => c.id === cat.parentId);
    return parent ? parent.name : "Root";
  }
  function getAllDescendantIds(catId: string): string[] {
    const kids = categories.filter((c) => c.parentId === catId);
    let ids: string[] = [];
    for (const kid of kids) {
      ids.push(kid.id);
      ids = ids.concat(getAllDescendantIds(kid.id));
    }
    return ids;
  }
  return { roots, children, parentPath, getAllDescendantIds };
}

function CategoryModal({
  mode,
  existing,
  categories,
  onSave,
  onClose,
}: {
  mode: "add" | "edit";
  existing?: Category;
  categories: Category[];
  onSave: (cat: Omit<Category, "id" | "productCount">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(existing?.name ?? "");
  const [desc, setDesc] = useState(existing?.description ?? "");
  const [parentId, setParentId] = useState<string | null>(existing?.parentId ?? null);
  const [status, setStatus] = useState<"Active" | "Inactive">(existing?.status ?? "Active");

  function submit() {
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: desc, parentId, status });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[480px] shadow-modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg text-zinc-900 dark:text-white">
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Category Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all"
              placeholder="e.g., Power Tools"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white h-20 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all"
              placeholder="Describe the category..."
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Parent Category</label>
            <select
              value={parentId ?? ""}
              onChange={(e) => setParentId(e.target.value || null)}
              className="w-full mt-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 px-3 py-2.5 text-sm bg-white dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-400 transition-all"
            >
              <option value="">Root (no parent)</option>
              {categories.filter((c) => c.id !== existing?.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Status</label>
            <div className="flex gap-2 mt-1.5">
              {(["Active", "Inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    status === s
                      ? "bg-primary-600 text-white border-primary-600 shadow-primary-sm"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="secondary" className="flex-1 justify-center" onClick={onClose}>Cancel</Button>
          <button
            onClick={submit}
            className="flex-1 justify-center inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2.5 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-primary-sm hover:shadow-primary-md transition-all duration-150 active:scale-[0.98]"
          >
            <Check size={14} /> {mode === "add" ? "Add Category" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function TreeNodeItem({
  cat, depth, hasKids, isSelected, onSelect, kidNodes,
}: {
  cat: Category; depth: number; hasKids: boolean; isSelected: boolean;
  onSelect: (id: string) => void; kidNodes: React.ReactNode[];
}) {
  const [open, setOpen] = useState(depth === 0);
  return (
    <div>
      <button
        onClick={() => { onSelect(cat.id); if (hasKids) setOpen((o) => !o); }}
        className={`w-full flex items-center gap-1.5 py-2 rounded-lg text-sm text-left transition-all duration-150 ${
          isSelected
            ? "bg-primary-50 text-primary-700 font-medium dark:bg-primary-950/30 dark:text-primary-400"
            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300"
        }`}
        style={{ paddingLeft: `${12 + depth * 20}px`, paddingRight: "12px" }}
      >
        {hasKids ? (
          open ? <ChevronDown size={13} className="shrink-0 text-zinc-400" /> : <ChevronRight size={13} className="shrink-0 text-zinc-400" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {open && hasKids
          ? <FolderOpen size={14} className="shrink-0 text-primary-500" />
          : <Folder size={14} className={`shrink-0 ${isSelected ? "text-primary-400" : "text-zinc-400"}`} />}
        <span className="truncate">{cat.name}</span>
      </button>
      {open && hasKids && <div>{kidNodes}</div>}
    </div>
  );
}

// ─── Items View (shown when clicking View All on sub-category) ──────────────
function CategoryItemsView({
  categoryId,
  categoryName,
  items,
  onBack,
}: {
  categoryId: string;
  categoryName: string;
  items: Item[];
  onBack: () => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = items.filter(
    (it) =>
      it.name.toLowerCase().includes(query.toLowerCase()) ||
      it.code.toLowerCase().includes(query.toLowerCase()) ||
      it.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Categories
        </button>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              Items in "{categoryName}"
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search size={13} className="text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="outline-none text-sm w-48 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                placeholder="Search items..."
              />
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                  <th className="py-2.5 font-medium">Item Code</th>
                  <th className="py-2.5 font-medium">Name</th>
                  <th className="py-2.5 font-medium">Brand</th>
                  <th className="py-2.5 font-medium text-right">On Hand</th>
                  <th className="py-2.5 font-medium text-right">Unit Cost</th>
                  <th className="py-2.5 font-medium">Status</th>
                  <th className="py-2.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.code}
                    className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 cursor-pointer transition-colors"
                    onClick={() => navigate(`/master-data/items/${item.code}`)}
                  >
                    <td className="py-3">
                      <span className="font-mono text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{item.code}</span>
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-zinc-900 dark:text-white">{item.name}</span>
                    </td>
                    <td className="py-3 text-zinc-500 dark:text-zinc-400">{item.brand}</td>
                    <td className="py-3 text-right">
                      <span className={`font-semibold ${item.onHand === 0 ? "text-rose-500" : item.onHand < 15 ? "text-amber-600" : "text-zinc-900 dark:text-white"}`}>
                        {item.onHand}
                      </span>
                    </td>
                    <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">${item.unitCost.toFixed(2)}</td>
                    <td className="py-3">
                      <Badge tone={statusTone(item.status)} dot>{item.status}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/master-data/items/${item.code}`); }}
                        className="text-primary-500 hover:text-primary-700 transition-colors text-xs font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No items in this category"
            description="Items assigned to this category will appear here."
          />
        )}
      </Card>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function Categories() {
  const { items } = useAppStore();
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedId, setSelectedId] = useState("electronics");
  const [modal, setModal] = useState<null | "add" | "edit">(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [treeQuery, setTreeQuery] = useState("");
  const [viewingItems, setViewingItems] = useState<{ categoryId: string; categoryName: string } | null>(null);
  const { addToast } = useToast();

  const { roots, children, parentPath, getAllDescendantIds } = useTree(categories);
  const selected = categories.find((c) => c.id === selectedId)!;
  const subCategories = categories.filter((c) => c.parentId === selectedId);

  const filteredSubs = useMemo(
    () => subCategories.filter((c) => c.name.toLowerCase().includes(filterQuery.toLowerCase())),
    [subCategories, filterQuery]
  );

  // Get items for a category (including all descendants)
  function getItemsForCategory(categoryId: string): Item[] {
    const catIds = [categoryId, ...getAllDescendantIds(categoryId)];
    return items.filter((it) => {
      const itemCategoryId = CATEGORY_NAME_TO_ID[it.category] || it.categoryId;
      return catIds.includes(itemCategoryId);
    });
  }

  // Get items directly for a category (no descendants)
  function getDirectItemsForCategory(categoryId: string): Item[] {
    const itemCategoryId = CATEGORY_NAME_TO_ID[items.find((it) => it.categoryId === categoryId)?.category ?? ""] || categoryId;
    return items.filter((it) => {
      const itCatId = CATEGORY_NAME_TO_ID[it.category] || it.categoryId;
      return itCatId === categoryId;
    });
  }

  // Compute live product counts from actual items
  function getLiveProductCount(categoryId: string): number {
    return getItemsForCategory(categoryId).length;
  }

  function addCategory(data: Omit<Category, "id" | "productCount">) {
    const id = data.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setCategories((prev) => [...prev, { ...data, id, productCount: 0 }]);
    addToast(`"${data.name}" category created`, "success");
  }

  function editCategory(data: Omit<Category, "id" | "productCount">) {
    setCategories((prev) => prev.map((c) => (c.id === selectedId ? { ...c, ...data } : c)));
    addToast(`"${data.name}" category updated`, "success");
  }

  function deleteCategory(id: string) {
    const cat = categories.find((c) => c.id === id);
    if (!window.confirm(`Delete "${cat?.name}" and all its sub-categories?`)) return;
    const toDelete = new Set<string>();
    function collect(cid: string) {
      toDelete.add(cid);
      categories.filter((c) => c.parentId === cid).forEach((c) => collect(c.id));
    }
    collect(id);
    setCategories((prev) => prev.filter((c) => !toDelete.has(c.id)));
    setSelectedId(roots.find((r) => !toDelete.has(r.id))?.id ?? "");
    addToast(`"${cat?.name}" deleted`, "success");
  }

  function handleViewAllItems(categoryId: string, categoryName: string) {
    setViewingItems({ categoryId, categoryName });
  }

  function renderNode(cat: Category, depth: number): React.ReactNode {
    const kids = categories.filter((c) => c.parentId === cat.id);
    const hasKids = kids.length > 0;
    const isSelected = selectedId === cat.id;
    return (
      <TreeNodeItem
        key={cat.id}
        cat={cat}
        depth={depth}
        hasKids={hasKids}
        isSelected={isSelected}
        onSelect={setSelectedId}
        kidNodes={kids.map((k) => renderNode(k, depth + 1))}
      />
    );
  }

  const visibleRoots = treeQuery
    ? categories.filter((c) => c.name.toLowerCase().includes(treeQuery.toLowerCase()))
    : roots;

  // If viewing items for a sub-category
  if (viewingItems) {
    const catItems = getItemsForCategory(viewingItems.categoryId);
    return (
      <div>
        <PageHeader
          trail={["Master Data", "Categories", viewingItems.categoryName]}
          title={`${viewingItems.categoryName} — Items`}
          subtitle={`Viewing all ${catItems.length} items in this category and its sub-categories.`}
        />
        <CategoryItemsView
          categoryId={viewingItems.categoryId}
          categoryName={viewingItems.categoryName}
          items={catItems}
          onBack={() => setViewingItems(null)}
        />
      </div>
    );
  }

  const selectedLiveCount = getLiveProductCount(selectedId);

  return (
    <div>
      <PageHeader
        trail={["Master Data", "Categories"]}
        title="Category Management"
        subtitle="Organize and structure your product hierarchy for efficient inventory control."
        actions={
          <>
            <Button variant="secondary" onClick={() => addToast("Category hierarchy exported as CSV", "success")}><Download size={14} /> Export</Button>
            <button
              onClick={() => setModal("add")}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 shadow-primary-sm hover:shadow-primary-md transition-all duration-150 active:scale-[0.98]"
            >
              <Plus size={14} /> Add Category
            </button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-5">
        {/* Left: Hierarchy Tree */}
        <Card className="col-span-1 !p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <FolderOpen size={15} className="text-primary-500" /> Hierarchy
            </div>
          </div>
          <p className="text-xs text-zinc-400 px-4 py-2 border-b border-zinc-50 dark:border-zinc-800/50">
            Browse through your category structure.
          </p>
          <div className="px-3 py-2.5 border-b border-zinc-50 dark:border-zinc-800/50">
            <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary-400 transition-all">
              <Search size={12} className="text-zinc-300 dark:text-zinc-600" />
              <input
                value={treeQuery}
                onChange={(e) => setTreeQuery(e.target.value)}
                className="outline-none text-xs w-full text-zinc-600 dark:text-zinc-300 placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                placeholder="Filter categories..."
              />
            </div>
          </div>
          <div className="py-2 overflow-y-auto max-h-[520px]">
            {visibleRoots.map((cat) => renderNode(cat, 0))}
          </div>
        </Card>

        {/* Right: Detail */}
        <div className="col-span-2 space-y-4">
          {selected ? (
            <>
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{selected.name}</h2>
                    <Badge tone={selected.status === "Active" ? "green" : "zinc"} dot>
                      {selected.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setModal("edit")}><Edit2 size={13} /> Edit</Button>
                    <button
                      onClick={() => deleteCategory(selected.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{selected.description}</p>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wide">Total Products</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-0.5">{selectedLiveCount.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wide">Sub-Categories</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-0.5">{subCategories.length}</p>
                  </div>
                  <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wide">Parent Path</p>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">{parentPath(selected)}</p>
                  </div>
                  <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800" />
                  <div>
                    <Button variant="secondary" onClick={() => handleViewAllItems(selectedId, selected.name)}>
                      <Eye size={13} /> View All Items
                    </Button>
                  </div>
                </div>
              </Card>

              <Card
                title={`Sub-categories of ${selected.name}`}
                subtitle="Click a sub-category row to drill into it, or View All to see its items."
                actions={
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary-400 transition-all">
                      <Search size={13} className="text-zinc-400" />
                      <input
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="outline-none text-sm w-36 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
                        placeholder="Filter list..."
                      />
                    </div>
                    <Button variant="secondary"><Filter size={13} /> Sort</Button>
                    <button
                      onClick={() => setModal("add")}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      <Plus size={12} /> Add Sub
                    </button>
                  </div>
                }
              >
                {filteredSubs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[11px] font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                          <th className="py-2.5 font-medium">Category Name</th>
                          <th className="py-2.5 font-medium">Parent Category</th>
                          <th className="py-2.5 font-medium">Status</th>
                          <th className="py-2.5 font-medium text-right">Products</th>
                          <th className="py-2.5 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubs.map((sub) => {
                          const subItemCount = getItemsForCategory(sub.id).length;
                          return (
                            <tr
                              key={sub.id}
                              className="border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 transition-colors group"
                            >
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <Folder size={14} className="text-zinc-400 shrink-0" />
                                  <button
                                    onClick={() => setSelectedId(sub.id)}
                                    className="font-medium text-zinc-900 dark:text-white hover:text-primary-600 transition-colors text-left"
                                  >
                                    {sub.name}
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 text-zinc-500 dark:text-zinc-400">{selected.name}</td>
                              <td className="py-3">
                                <Badge tone={sub.status === "Active" ? "green" : "zinc"} dot>{sub.status}</Badge>
                              </td>
                              <td className="py-3 text-right font-semibold text-zinc-900 dark:text-white">
                                {subItemCount}
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleViewAllItems(sub.id, sub.name)}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-colors"
                                    title="View all items in this category"
                                  >
                                    View All
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(sub.id); }}
                                    className="text-xs text-zinc-400 hover:text-zinc-600 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    title="Edit category"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deleteCategory(sub.id); }}
                                    className="text-xs text-zinc-400 hover:text-rose-500 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    title="Delete category"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    icon={Folder}
                    title="No sub-categories found"
                    description="Add your first sub-category to start organizing items."
                    actionLabel="Add Sub-category"
                    onAction={() => setModal("add")}
                  />
                )}
              </Card>
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <Folder size={32} className="text-zinc-200 dark:text-zinc-700 mb-3" />
              <p className="font-medium text-zinc-500 dark:text-zinc-400">Select a category from the hierarchy</p>
            </Card>
          )}
        </div>
      </div>

      {modal && (
        <CategoryModal
          mode={modal}
          existing={modal === "edit" ? selected : undefined}
          categories={categories}
          onSave={modal === "add" ? addCategory : editCategory}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
