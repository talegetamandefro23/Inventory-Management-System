import React from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const STYLES: Record<Variant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary: "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-zinc-500 hover:bg-zinc-100",
};

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
