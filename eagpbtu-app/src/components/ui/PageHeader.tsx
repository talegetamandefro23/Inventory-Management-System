import React from "react";
import { ChevronRight } from "lucide-react";

export function Crumbs({ trail }: { trail: string[] }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={12} />}
          <span className={i === trail.length - 1 ? "text-zinc-500 font-medium" : ""}>{t}</span>
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
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
