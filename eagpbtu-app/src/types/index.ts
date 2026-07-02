export type Tone = "zinc" | "green" | "red" | "amber" | "blue";

export type NavChild = {
  key: string;
  label: string;
  path: string;
};

export type NavItem = {
  key: string;
  label: string;
  path: string;
  icon: string; // lucide icon name, resolved in Sidebar
  children?: NavChild[];
};
