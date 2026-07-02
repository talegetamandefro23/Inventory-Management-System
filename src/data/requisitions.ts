export interface Requisition {
  id: string;
  requester: string;
  department: string;
  date: string;
  urgency: "High" | "Medium" | "Low";
  value: number;
}

export const REQUISITIONS: Requisition[] = [
  { id: "PR-2024-001", requester: "Sarah Jenkins", department: "Operations", date: "2024-05-15", urgency: "High", value: 12450.0 },
  { id: "PR-2024-002", requester: "Michael Chen", department: "IT Infrastructure", date: "2024-05-14", urgency: "Medium", value: 3200.5 },
  { id: "PR-2024-003", requester: "Elena Rodriguez", department: "Maintenance", date: "2024-05-12", urgency: "Low", value: 850.0 },
  { id: "PR-2024-004", requester: "David Smith", department: "Logistics", date: "2024-05-10", urgency: "High", value: 25700.0 },
  { id: "PR-2024-005", requester: "Jessica Taylor", department: "Operations", date: "2024-05-09", urgency: "Medium", value: 5400.0 },
];

export function urgencyTone(u: string) {
  return u === "High" ? ("red" as const) : u === "Medium" ? ("amber" as const) : ("zinc" as const);
}
