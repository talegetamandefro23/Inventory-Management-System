import { useState, useMemo } from "react";
import {
  Folder, FolderOpen, ChevronDown, ChevronRight, Search,
  Plus, Download, Edit2, Trash2, Filter, MoreHorizontal, Check, X,
} from "lucide-react";
import { Badge, Button, Card, PageHeader } from "../../components/ui";

// ─── Data model ────────────────────────────────────────────────────────────────
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
];

// ─── Tree helpers ───────────────────────────────────────────────────────────────
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
  return { roots, children, parentPath };
}

// ─── Tree node component ────────────────────────────────────────────────────────
function TreeNode({
  cat,
  depth,
  selected,
  onSelect,
  children,
}: {
  cat: Category;
  depth: number;
  selected: string;
  onSelect: (id: string) => void;
  children: Category[];
}) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = children.length > 0;
  const isSelected = selected === cat.id;

  return (
    <div>
      <button
        onClick={() => { onSelect(cat.id); if (hasChildren) setOpen((o) => !o); }}
        className={`w-full flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
          isSelected ? "bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-zinc-50 text-zinc-700"
        }`}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {hasChildren ? (
          open ? <ChevronDown size={13} className="shrink-0 text-zinc-400" /> : <ChevronRight size={13} className="shrink-0 text-zinc-400" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {open && hasChildren
          ? <FolderOpen size={14} className="shrink-0 text-indigo-400" />
          : <Folder size={14} className="shrink-0 text-zinc-400" />}
        <span className="truncate">{cat.name}</span>
      </button>
      {open && hasChildren && (
        <div>
          {children.map((child) => (
            <TreeNodeWrapper key={child.id} cat={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

// Wrapper to resolve children lazily from context
function TreeNodeWrapper({
  cat, depth, selected, onSelect,
}: { cat: Category; depth: number; selected: string; onSelect: (id: string) => void }) {
  // children passed via closure from parent — re-implemented inline for simplicity
  return null; // replaced below with inline usage
}

// ─── Modal ──────────────────────────────────────────────────────────────────────
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-[480px] shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">{mode === "add" ? "Add New Category" : "Edit Category"}</h2>
          <button onClick={onClose}><X size={18} className="text-zinc-400" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-500">Category Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g., Power Tools" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 h-20 resize-none" placeholder="Describe the category…" />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500">Parent Category</label>
            <select value={parentId ?? ""} onChange={(e) => setParentId(e.target.value || null)} className="w-full mt-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="">— Root (no parent)</option>
              {categories.filter((c) => c.id !== existing?.id).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500">Status</label>
            <div className="flex gap-2 mt-1">
              {(["Active", "Inactive"] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${status === s ? "bg-indigo-600 text-white border-indigo-600" : "border-zinc-200 text-zinc-600"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <Button variant="secondary" className="flex-1 justify-center" onClick={onClose}>Cancel</Button>
          <button onClick={submit} className="flex-1 justify-center inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
            <Check size={14} /> {mode === "add" ? "Add Category" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedId, setSelectedId] = useState("electronics");
  const [modal, setModal] = useState<null | "add" | "edit">(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [treeQuery, setTreeQuery] = useState("");

  const { roots, children, parentPath } = useTree(categories);
  const selected = categories.find((c) => c.id === selectedId)!;
  const subCategories = categories.filter((c) => c.parentId === selectedId);

  const filteredSubs = useMemo(
    () => subCategories.filter((c) => c.name.toLowerCase().includes(filterQuery.toLowerCase())),
    [subCategories, filterQuery]
  );

  function addCategory(data: Omit<Category, "id" | "productCount">) {
    const id = data.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    setCategories((prev) => [...prev, { ...data, id, productCount: 0 }]);
  }

  function editCategory(data: Omit<Category, "id" | "productCount">) {
    setCategories((prev) => prev.map((c) => (c.id === selectedId ? { ...c, ...data } : c)));
  }

  function deleteCategory(id: string) {
    if (!window.confirm("Delete this category and all its sub-categories?")) return;
    const toDelete = new Set<string>();
    function collect(cid: string) {
      toDelete.add(cid);
      categories.filter((c) => c.parentId === cid).forEach((c) => collect(c.id));
    }
    collect(id);
    setCategories((prev) => prev.filter((c) => !toDelete.has(c.id)));
    setSelectedId(roots.find((r) => !toDelete.has(r.id))?.id ?? "");
  }

  // Recursive tree renderer (inline to access categories state)
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

  return (
    <div>
      <PageHeader
        trail={["Master Data", "Categories"]}
        title="Category Management"
        subtitle="Organize and structure your product hierarchy for efficient inventory control."
        actions={
          <>
            <Button variant="secondary"><Download size={14} /> Export Hierarchy</Button>
            <button
              onClick={() => setModal("add")}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <Plus size={14} /> Add Category
            </button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-5">
        {/* ── Left: Hierarchy Tree ── */}
        <Card className="col-span-1 !p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <FolderOpen size={15} className="text-indigo-500" /> Hierarchy
            </div>
            <button><Search size={14} className="text-zinc-400" /></button>
          </div>
          <p className="text-xs text-zinc-400 px-4 py-2 border-b border-zinc-50">Browse through your category structure.</p>

          <div className="px-2 py-2 border-b border-zinc-50">
            <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-2.5 py-1.5">
              <Search size={12} className="text-zinc-300" />
              <input value={treeQuery} onChange={(e) => setTreeQuery(e.target.value)} className="outline-none text-xs w-full text-zinc-600" placeholder="Filter categories..." />
            </div>
          </div>

          <div className="py-2 overflow-y-auto max-h-[520px]">
            {visibleRoots.map((cat) => renderNode(cat, 0))}
          </div>
        </Card>

        {/* ── Right: Detail ── */}
        <div className="col-span-2 space-y-4">
          {selected ? (
            <>
              {/* Header card */}
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-zinc-900">{selected.name}</h2>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${selected.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${selected.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                      {selected.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setModal("edit")}><Edit2 size={13} /> Edit</Button>
                    <button onClick={() => deleteCategory(selected.id)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 border border-red-100 hover:bg-red-50 transition-colors">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 mb-4">{selected.description}</p>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wide">Direct Products</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-0.5">{selected.productCount.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-px bg-zinc-100" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wide">Sub-Categories</p>
                    <p className="text-2xl font-bold text-zinc-900 mt-0.5">{subCategories.length}</p>
                  </div>
                  <div className="h-10 w-px bg-zinc-100" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wide">Parent Path</p>
                    <p className="text-sm font-semibold text-indigo-600 mt-1">{parentPath(selected)}</p>
                  </div>
                </div>
              </Card>

              {/* Sub-categories table */}
              <Card
                title={`Sub-categories of ${selected.name}`}
                subtitle="Manage secondary classifications and their associations."
                actions={
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5">
                      <Search size={13} className="text-zinc-400" />
                      <input
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="outline-none text-sm w-36"
                        placeholder="Filter list..."
                      />
                    </div>
                    <Button variant="secondary"><Filter size={13} /> Sort</Button>
                    <button
                      onClick={() => { setModal("add"); }}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      <Plus size={12} /> Add Sub-category
                    </button>
                  </div>
                }
              >
                {filteredSubs.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-zinc-400 border-b border-zinc-100">
                        <th className="py-2 font-medium">Category Name</th>
                        <th className="py-2 font-medium">Parent Category</th>
                        <th className="py-2 font-medium">Status</th>
                        <th className="py-2 font-medium">Product Count</th>
                        <th className="py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubs.map((sub) => (
                        <tr
                          key={sub.id}
                          className="border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer"
                          onClick={() => setSelectedId(sub.id)}
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Folder size={14} className="text-zinc-400 shrink-0" />
                              <span className="font-medium text-zinc-900">{sub.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-zinc-500">{selected.name}</td>
                          <td className="py-3">
                            <span className={`flex items-center gap-1 w-fit text-xs font-medium px-2 py-0.5 rounded-full ${sub.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${sub.status === "Active" ? "bg-emerald-500" : "bg-zinc-400"}`} />
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 font-semibold">{sub.productCount.toLocaleString()}</td>
                          <td className="py-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteCategory(sub.id); }}
                              className="text-zinc-300 hover:text-red-500 transition-colors"
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-zinc-400">
                    <Folder size={28} className="mx-auto mb-2 text-zinc-200" />
                    <p className="text-sm">No sub-categories found.</p>
                    <button
                      onClick={() => setModal("add")}
                      className="mt-3 text-xs text-indigo-600 font-medium"
                    >
                      + Add the first sub-category
                    </button>
                  </div>
                )}
              </Card>
            </>
          ) : (
            <Card className="flex flex-col items-center justify-center py-20 text-center">
              <Folder size={32} className="text-zinc-200 mb-3" />
              <p className="font-medium text-zinc-500">Select a category from the hierarchy</p>
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

// Inline stateful tree node (avoids prop-drilling issues)
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
        className={`w-full flex items-center gap-1.5 py-2 rounded-lg text-sm text-left transition-colors ${
          isSelected ? "bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-zinc-50 text-zinc-700"
        }`}
        style={{ paddingLeft: `${12 + depth * 20}px`, paddingRight: "12px" }}
      >
        {hasKids ? (
          open ? <ChevronDown size={13} className="shrink-0 text-zinc-400" /> : <ChevronRight size={13} className="shrink-0 text-zinc-400" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {open && hasKids
          ? <FolderOpen size={14} className="shrink-0 text-indigo-500" />
          : <Folder size={14} className={`shrink-0 ${isSelected ? "text-indigo-400" : "text-zinc-400"}`} />}
        <span className="truncate">{cat.name}</span>
      </button>
      {open && hasKids && <div>{kidNodes}</div>}
    </div>
  );
}
