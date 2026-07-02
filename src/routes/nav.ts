import {
  LayoutGrid, Database, PackageSearch, Warehouse, ShoppingCart,
  Briefcase, CheckSquare, BarChart2, Settings,
} from "lucide-react";
import type { NavItem } from "../types";

export const NAV: NavItem[] = [
  { key: "dashboard", label: "Dashboard", path: "/", icon: "LayoutGrid" },
  {
    key: "master-data", label: "Master Data", path: "/master-data/items", icon: "Database",
    children: [
      { key: "items-library", label: "Items Library", path: "/master-data/items" },
      { key: "item-detail", label: "Item Detail", path: "/master-data/items/:id" },
    ],
  },
  {
    key: "inventory", label: "Inventory", path: "/inventory/overview", icon: "PackageSearch",
    children: [
      { key: "inventory-overview", label: "Overview", path: "/inventory/overview" },
      { key: "stock-in", label: "Stock In (GRN)", path: "/inventory/stock-in" },
      { key: "stock-out", label: "Stock Out (Issue)", path: "/inventory/stock-out" },
      { key: "stock-transfer", label: "Stock Transfer", path: "/inventory/stock-transfer" },
      { key: "physical-audit", label: "Physical Audit", path: "/inventory/physical-audit" },
    ],
  },
  {
    key: "warehouse", label: "Warehouse", path: "/warehouse/receiving", icon: "Warehouse",
    children: [
      { key: "receiving-board", label: "Receiving Board", path: "/warehouse/receiving" },
      { key: "putaway-planner", label: "Putaway Planner", path: "/warehouse/putaway" },
      { key: "warehouse-map", label: "Digital Map", path: "/warehouse/map" },
      { key: "picking-packing", label: "Picking & Packing", path: "/warehouse/picking" },
    ],
  },
  {
    key: "procurement", label: "Procurement", path: "/procurement/requisitions", icon: "ShoppingCart",
    children: [
      { key: "requisitions", label: "Purchase Requisitions", path: "/procurement/requisitions" },
      { key: "new-requisition", label: "New Requisition", path: "/procurement/requisitions/new" },
      { key: "rfq-comparison", label: "RFQ Comparison", path: "/procurement/rfq" },
      { key: "purchase-orders", label: "Purchase Orders", path: "/procurement/orders" },
    ],
  },
  { key: "assets", label: "Assets", path: "/assets", icon: "Briefcase" },
  { key: "approvals", label: "Approvals", path: "/approvals", icon: "CheckSquare" },
  { key: "reports", label: "Reports", path: "/reports", icon: "BarChart2" },
  { key: "administration", label: "Administration", path: "/administration", icon: "Settings" },
];

export const ICONS: Record<string, any> = {
  LayoutGrid, Database, PackageSearch, Warehouse, ShoppingCart, Briefcase, CheckSquare, BarChart2, Settings,
};
