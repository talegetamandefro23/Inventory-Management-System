import React from "react";
import type { Tone } from "../../types";

const TONES: Record<Tone, string> = {
  zinc: "bg-zinc-100 text-zinc-600 ring-zinc-500/10",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  red: "bg-rose-50 text-rose-700 ring-rose-600/10",
  amber: "bg-amber-50 text-amber-700 ring-amber-500/10",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/10",
  indigo: "bg-primary-50 text-primary-700 ring-primary-600/10",
  teal: "bg-secondary-50 text-secondary-700 ring-secondary-600/10",
};

const DOT_COLORS: Record<Tone, string> = {
  zinc: "bg-zinc-400",
  green: "bg-emerald-500",
  red: "bg-rose-500",
  amber: "bg-amber-500",
  blue: "bg-sky-500",
  indigo: "bg-primary-500",
  teal: "bg-secondary-500",
};

export default function Badge({
  children,
  tone = "zinc",
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[tone]}`} />}
      {children}
    </span>
  );
}
