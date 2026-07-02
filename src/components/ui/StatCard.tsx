import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import type { Tone } from "../../types";

const TONES: Record<Tone, string> = {
  zinc: "bg-zinc-100 text-zinc-600",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
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
    <div className="rounded-xl border border-zinc-200 bg-white p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${TONES[tone]}`}>
          <Icon size={16} />
        </div>
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-xl font-bold text-zinc-900">{value}</div>
        <div className="text-xs text-zinc-500">{label}</div>
      </div>
    </div>
  );
}
