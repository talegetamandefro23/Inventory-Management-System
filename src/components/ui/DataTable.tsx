import React from "react";

interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  className?: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  rowKey: (item: T) => string;
}

export default function DataTable<T>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No results found.",
  rowKey,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-zinc-500 border-b border-zinc-100 dark:border-zinc-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2.5 font-semibold uppercase tracking-wider ${
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""
                } ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              key={rowKey(item)}
              className={`border-b border-zinc-50 dark:border-zinc-800/50 transition-colors ${
                onRowClick
                  ? "cursor-pointer hover:bg-primary-50/40 dark:hover:bg-primary-950/20"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
              }`}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""} ${col.className ?? ""}`}
                >
                  {col.render(item, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="py-12 text-center text-zinc-400 text-sm">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
