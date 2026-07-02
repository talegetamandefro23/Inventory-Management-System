import React from "react";
import { LucideIcon } from "lucide-react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
        <Icon size={24} className="text-zinc-300 dark:text-zinc-500" />
      </div>
      <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
