export interface Item {
  code: string;
  name: string;
  category: string;
  categoryId: string;
  brand: string;
  unit: string;
  onHand: number;
  status: "Active" | "Low Stock" | "Out of Stock";
  warehouse: string;
  lastReceived: string;
  unitCost: number;
  description: string;
}

export const ITEMS: Item[] = [
  { code: "SKU-001", name: "Industrial Drill Press", category: "Machinery", categoryId: "machinery", brand: "PowerFix", unit: "PCS", onHand: 45, status: "Active", warehouse: "WH-A", lastReceived: "2024-05-10", unitCost: 185.00, description: "Heavy-duty industrial grade drill press with brushless motor technology and dual-speed transmission." },
  { code: "SKU-002", name: "Precision Caliper 150mm", category: "Tools", categoryId: "tools", brand: "MeasurePro", unit: "SET", onHand: 120, status: "Active", warehouse: "WH-B", lastReceived: "2024-05-08", unitCost: 42.50, description: "High-precision digital caliper with LCD display and stainless steel construction." },
  { code: "SKU-003", name: "High-Temp Lubricant", category: "Chemicals", categoryId: "chemicals", brand: "LubeMaster", unit: "CAN", onHand: 8, status: "Low Stock", warehouse: "WH-A", lastReceived: "2024-04-28", unitCost: 18.75, description: "Industrial-grade high-temperature lubricant for heavy machinery and conveyor systems." },
  { code: "SKU-004", name: "Standard Safety Goggles", category: "PPE", categoryId: "ppe", brand: "SafeGuard", unit: "PAIR", onHand: 0, status: "Out of Stock", warehouse: "WH-C", lastReceived: "2024-03-15", unitCost: 12.00, description: "ANSI Z87.1 certified safety goggles with anti-fog coating and UV protection." },
  { code: "SKU-005", name: "Pneumatic Hose 10m", category: "Components", categoryId: "components", brand: "AeroFlow", unit: "ROLL", onHand: 34, status: "Active", warehouse: "WH-B", lastReceived: "2024-05-12", unitCost: 28.00, description: "Reinforced rubber pneumatic hose rated for 200 PSI with quick-connect fittings." },
  { code: "SKU-006", name: "Heavy Duty Caster Wheel", category: "Hardware", categoryId: "hardware", brand: "RollEase", unit: "PCS", onHand: 210, status: "Active", warehouse: "WH-A", lastReceived: "2024-05-05", unitCost: 8.50, description: "Swivel caster wheel with brakes, 3-inch diameter, rated for 250 lbs." },
  { code: "SKU-007", name: "LED Panel Light 60W", category: "Electronics", categoryId: "electronics", brand: "BrightZone", unit: "PCS", onHand: 75, status: "Active", warehouse: "WH-C", lastReceived: "2024-05-14", unitCost: 65.00, description: "Ultra-thin LED panel light with dimmable driver, 5000K daylight temperature." },
  { code: "SKU-008", name: "Nitrile Gloves (Box/100)", category: "PPE", categoryId: "ppe", brand: "SafeGuard", unit: "BOX", onHand: 5, status: "Low Stock", warehouse: "WH-A", lastReceived: "2024-04-20", unitCost: 14.50, description: "Disposable powder-free nitrile gloves, 8 mil thickness, food-safe certified." },
  { code: "SKU-009", name: "Wire Stripper Tool", category: "Tools", categoryId: "tools", brand: "GripTech", unit: "PCS", onHand: 88, status: "Active", warehouse: "WH-B", lastReceived: "2024-05-11", unitCost: 22.00, description: "Automatic wire stripper with adjustable tension for 10-24 AWG cables." },
  { code: "SKU-010", name: "Epoxy Adhesive 500ml", category: "Chemicals", categoryId: "chemicals", brand: "BondPro", unit: "TUBE", onHand: 3, status: "Low Stock", warehouse: "WH-A", lastReceived: "2024-04-15", unitCost: 32.00, description: "Two-part industrial epoxy adhesive with 30-minute cure time and 3500 PSI bond strength." },
  { code: "SKU-011", name: "Steel Shelving Unit", category: "Hardware", categoryId: "hardware", brand: "StorageMax", unit: "SET", onHand: 12, status: "Active", warehouse: "WH-C", lastReceived: "2024-05-03", unitCost: 145.00, description: "5-tier adjustable steel shelving unit, 48x18x72 inches, 500 lb capacity per shelf." },
  { code: "SKU-012", name: "Digital Multimeter", category: "Tools", categoryId: "tools", brand: "MeasurePro", unit: "PCS", onHand: 0, status: "Out of Stock", warehouse: "WH-B", lastReceived: "2024-02-28", unitCost: 89.00, description: "Auto-ranging digital multimeter with True RMS, 10,000 count display." },
  { code: "SKU-013", name: "Fire Extinguisher ABC", category: "Safety", categoryId: "safety", brand: "SafeGuard", unit: "PCS", onHand: 24, status: "Active", warehouse: "WH-A", lastReceived: "2024-05-01", unitCost: 55.00, description: "5 lb ABC dry chemical fire extinguisher with wall mount bracket, UL rated." },
  { code: "SKU-014", name: "Conveyor Belt 2m", category: "Components", categoryId: "components", brand: "AeroFlow", unit: "ROLL", onHand: 7, status: "Low Stock", warehouse: "WH-C", lastReceived: "2024-04-25", unitCost: 320.00, description: "PVC conveyor belt segment, 2m length, 500mm width, food-grade certified." },
  { code: "SKU-015", name: "Hydraulic Jack 3-Ton", category: "Machinery", categoryId: "machinery", brand: "PowerFix", unit: "PCS", onHand: 18, status: "Active", warehouse: "WH-A", lastReceived: "2024-05-09", unitCost: 125.00, description: "3-ton hydraulic floor jack with dual pump system and safety bypass valve." },
  { code: "SKU-016", name: "Cable Ties Assorted (500pc)", category: "Components", categoryId: "components", brand: "GripTech", unit: "BOX", onHand: 150, status: "Active", warehouse: "WH-B", lastReceived: "2024-05-13", unitCost: 9.50, description: "UV-resistant nylon cable ties in 6 sizes from 8 to 16 inches, natural color." },
  { code: "SKU-017", name: "Noise Cancelling Headphones", category: "Electronics", categoryId: "electronics", brand: "BrightZone", unit: "PCS", onHand: 0, status: "Out of Stock", warehouse: "WH-C", lastReceived: "2024-03-20", unitCost: 195.00, description: "Industrial-grade ANC headphones with 30dB noise reduction, Bluetooth 5.0, 40hr battery." },
  { code: "SKU-018", name: "Marking Paint Spray", category: "Chemicals", categoryId: "chemicals", brand: "LubeMaster", unit: "CAN", onHand: 65, status: "Active", warehouse: "WH-A", lastReceived: "2024-05-07", unitCost: 7.25, description: "Fast-drying aerosol marking paint for floor layouts, 12 oz can, available in 8 colors." },
  { code: "SKU-019", name: "First Aid Kit Industrial", category: "Safety", categoryId: "safety", brand: "SafeGuard", unit: "KIT", onHand: 30, status: "Active", warehouse: "WH-B", lastReceived: "2024-04-30", unitCost: 48.00, description: "OSHA-compliant 50-person industrial first aid kit in wall-mount metal cabinet." },
  { code: "SKU-020", name: "Voltage Transformer 500W", category: "Electronics", categoryId: "electronics", brand: "BrightZone", unit: "PCS", onHand: 14, status: "Active", warehouse: "WH-C", lastReceived: "2024-05-06", unitCost: 78.00, description: "Step-up/step-down voltage transformer with dual output, 500W continuous duty." },
];

export function statusTone(status: string) {
  if (status === "Active") return "green" as const;
  if (status === "Low Stock") return "amber" as const;
  if (status === "Out of Stock") return "red" as const;
  return "zinc" as const;
}
