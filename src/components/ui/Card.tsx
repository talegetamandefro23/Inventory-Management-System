import React from "react";

export default function Card({
  title,
  subtitle,
  children,
  actions,
  className = "",
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-zinc-200 bg-white p-5 ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            {title && <h3 className="font-semibold text-zinc-900 text-sm">{title}</h3>}
            {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
