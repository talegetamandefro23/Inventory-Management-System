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
    <div
      className={`rounded-xl border border-zinc-200/80 bg-white p-5 shadow-soft transition-shadow duration-200 hover:shadow-lifted dark:bg-zinc-900 dark:border-zinc-800 ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            {title && (
              <h3 className="font-semibold text-zinc-900 text-sm dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-0.5 dark:text-zinc-400">
                {subtitle}
              </p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}
