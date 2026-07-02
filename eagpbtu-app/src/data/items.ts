export interface Item {
  code: string;
  name: string;
  category: string;
  brand: string;
  unit: string;
  onHand: number;
  status: "Active" | "Low Stock" | "Out of Stock";
}

export const ITEMS: Item[] = [
  { code: "SKU-001", name: "Industrial Drill Press", category: "Machinery", brand: "PowerFix", unit: "PCS", onHand: 45, status: "Active" },
  { code: "SKU-002", name: "Precision Caliper 150mm", category: "Tools", brand: "MeasurePro", unit: "SET", onHand: 120, status: "Active" },
  { code: "SKU-003", name: "High-Temp Lubricant", category: "Chemicals", brand: "LubeMaster", unit: "CAN", onHand: 8, status: "Low Stock" },
  { code: "SKU-004", name: "Standard Safety Goggles", category: "PPE", brand: "SafeGuard", unit: "PAIR", onHand: 0, status: "Out of Stock" },
  { code: "SKU-005", name: "Pneumatic Hose 10m", category: "Components", brand: "AeroFlow", unit: "ROLL", onHand: 34, status: "Active" },
  { code: "SKU-006", name: "Heavy Duty Caster Wheel", category: "Hardware", brand: "RollEase", unit: "PCS", onHand: 210, status: "Active" },
];

export function statusTone(status: string) {
  if (status === "Active") return "green" as const;
  if (status === "Low Stock") return "amber" as const;
  if (status === "Out of Stock") return "red" as const;
  return "zinc" as const;
}
