"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./primitives";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** valeur utilisée pour le tri (sinon colonne non triable) */
  sortValue?: (row: T) => string | number;
  className?: string;
  align?: "left" | "right" | "center";
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  search,
  onRowClick,
  emptyTitle = "Aucun résultat",
  rowClassName,
}: {
  data: T[];
  columns: Column<T>[];
  /** fonction renvoyant le texte indexé pour la recherche, ou undefined pour désactiver */
  search?: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  rowClassName?: (row: T) => string;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let rows = data;
    if (search && query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter((r) => search(r).toLowerCase().includes(q));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        rows = [...rows].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }
    return rows;
  }, [data, columns, query, sortKey, sortDir, search]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div>
      {search && (
        <div className="px-3 pb-2 pt-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrer…"
            aria-label="Filtrer le tableau"
            className="h-8 w-full max-w-xs rounded-lg border border-white/12 bg-white/5 px-3 text-xs text-white placeholder:text-white/35 focus:border-sky-400/50 focus:outline-none"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs text-white/45">
              {columns.map((c) => (
                <th key={c.key} className={cn("px-3 py-2 font-medium", c.align === "right" && "text-right", c.align === "center" && "text-center", c.className)}>
                  {c.sortValue ? (
                    <button onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1 transition hover:text-white">
                      {c.header}
                      {sortKey === c.key ? (
                        sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 opacity-40" />
                      )}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-white/5 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-white/5",
                  rowClassName?.(row),
                )}
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-3 py-2.5 align-middle text-white/80", c.align === "right" && "text-right", c.align === "center" && "text-center", c.className)}>
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <EmptyState title={emptyTitle} hint={query ? "Essayez un autre terme." : undefined} />}
    </div>
  );
}
