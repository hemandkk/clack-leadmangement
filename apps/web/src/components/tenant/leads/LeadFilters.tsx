"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LeadFilters as ILeadFilters, LeadStatus } from "@leadpro/types";
import { STATUS_CONFIG } from "@/lib/leadConfig";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

interface Props {
  filters: ILeadFilters;
  onChange: (f: ILeadFilters) => void;
}

const STATUSES = Object.keys(STATUS_CONFIG) as LeadStatus[];

export function LeadFilters({ filters, onChange }: Props) {
  const [search, setSearch] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const toggleStatus = (s: LeadStatus) => {
    const current = filters.status ?? [];
    const next = current.includes(s)
      ? current.filter((x) => x !== s)
      : [...current, s];
    onChange({ ...filters, status: next.length ? next : undefined, page: 1 });
  };

  const clearAll = () => {
    setSearch("");
    onChange({
      page: 1,
      perPage: filters.perPage,
      sortBy: "createdAt",
      sortDir: "desc",
    });
  };

  const hasFilters =
    !!filters.search ||
    (filters.status?.length ?? 0) > 0 ||
    !!filters.priority ||
    !!filters.assignedTo;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Priority filter */}
        <Select
          value={filters.priority ?? ""}
          onValueChange={(v) =>
            onChange({ ...filters, priority: (v || undefined) as any, page: 1 })
          }
        >
          <SelectTrigger className="h-8 text-sm w-32">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${filters.sortBy}-${filters.sortDir}`}
          onValueChange={(v) => {
            const [sortBy, sortDir] = v.split("-");
            onChange({
              ...filters,
              sortBy,
              sortDir: sortDir as "asc" | "desc",
            });
          }}
        >
          <SelectTrigger className="h-8 text-sm w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest first</SelectItem>
            <SelectItem value="createdAt-asc">Oldest first</SelectItem>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="value-desc">Highest value</SelectItem>
            <SelectItem value="updatedAt-desc">Recently updated</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 text-xs"
          >
            <X className="h-3 w-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-500">Status:</span>
        {STATUSES.map((s) => {
          const cfg = STATUS_CONFIG[s];
          const active = filters.status?.includes(s);
          return (
            <button
              key={s}
              onClick={() => toggleStatus(s)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${
                active
                  ? `${cfg.color} ${cfg.textColor} ${cfg.borderColor}`
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
