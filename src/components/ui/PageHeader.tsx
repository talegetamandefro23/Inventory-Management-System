import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const ROUTE_MAP: Record<string, string> = {
  Dashboard: "/",
  Home: "/",
  "Master Data": "/master-data/items",
  Inventory: "/inventory/overview",
  Warehouse: "/warehouse/receiving",
  Procurement: "/procurement/requisitions",
};

export function Crumbs({ trail }: { trail: string[] }) {
  return (
    <div className="flex items-center gap-1 text-xs text-zinc-400 mb-1.5">
      <Home size={12} className="text-zinc-300 dark:text-zinc-600" />
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-600" />
          {ROUTE_MAP[t] && i < trail.length - 1 ? (
            <Link
              to={ROUTE_MAP[t]}
              className="text-zinc-400 hover:text-primary-600 transition-colors"
            >
              {t}
            </Link>
          ) : (
            <span
              className={
                i === trail.length - 1
                  ? "text-zinc-600 font-medium dark:text-zinc-300"
                  : "text-zinc-400"
              }
            >
              {t}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function PageHeader({
  trail,
  title,
  subtitle,
  actions,
}: {
  trail: string[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
      <div>
        <Crumbs trail={trail} />
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-zinc-500 mt-1 dark:text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-wrap">{actions}</div>
      )}
    </div>
  );
}
