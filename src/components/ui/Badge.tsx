import React from "react";
import type { Tone } from "../../types";

const TONES: Record<Tone, string> = {
  zinc: "bg-zinc-100 text-zinc-600",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
};

export default function Badge({
  children,
  tone = "zinc",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}
