import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import type { Tone } from "../../types";

const TONES: Record<Tone, string> = {
  zinc: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  red: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  blue: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
  indigo: "bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400",
  teal: "bg-secondary-50 text-secondary-600 dark:bg-secondary-950 dark:text-secondary-400",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  tone = "zinc",
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  tone?: Tone;
}) {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-4 flex flex-col gap-3 shadow-soft transition-all duration-200 hover:shadow-lifted hover:-translate-y-0.5 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center ${TONES[tone]}`}
        >
          <Icon size={17} />
        </div>
        {trend && (
          <span
            className={`text-xs font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
              trendUp
                ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950"
                : "text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-950"
            }`}
          >
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{" "}
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-xl font-bold text-zinc-900 dark:text-white">
          {value}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
      </div>
    </div>
  );
}
