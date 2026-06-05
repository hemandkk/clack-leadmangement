"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  LeadFilters as ILeadFilters,
  LeadPriority,
  LeadStatus,
} from "@leadpro/types";
import { STATUS_CONFIG } from "@/lib/leadConfig";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  filters: ILeadFilters;
  onFiltersChange: (f: ILeadFilters) => void;
}

const STATUSES = Object.keys(STATUS_CONFIG) as LeadStatus[];

export function LeadFilters({
  filters,
  onFiltersChange,
  onClose,
  open,
}: Props) {
  const [search, setSearch] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    onFiltersChange({ ...filters, search: debouncedSearch, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  /*  const handleFilterUpdate = (fields: Partial<ILeadFilters>) => {
    onFiltersChange((prev) => ({ ...prev, ...fields }));
  }; */
  const toggleStatus = (s: LeadStatus) => {
    const current = filters.status ?? [];
    const next = current.includes(s)
      ? current.filter((x) => x !== s)
      : [...current, s];
    onFiltersChange({
      ...filters,
      status: next.length ? next : undefined,
      page: 1,
    });
  };

  const clearAll = () => {
    setSearch("");
    onFiltersChange({
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
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className=" w-180 max-w-[90vw]  p-4  gap-0 overflow-hidden  rounded-2xl shadow-2xl">
          <DialogHeader className=" px-6  py-5  border-b  bg-slate-50/80">
            <DialogTitle className="flex items-center justify-between">
              <span className="text-2xl font-semibold">Filters</span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-5 p-6">
            {/* Priority filter */}
            <div className="space-y-2">
              <label>Priority</label>
              <Select
                value={filters.priority ?? ""}
                onValueChange={(v) =>
                  onFiltersChange({
                    ...filters,
                    priority: (v || undefined) as LeadPriority | undefined,
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="d">All priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Sort */}
            <label>Source</label>
            <Select
              value={`${filters.sortBy}-${filters.sortDir}`}
              onValueChange={(v) => {
                const [sortBy, sortDir] = v.split("-");
                onFiltersChange({
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
            <label>Agent</label>
            <Select
              value={`${filters.sortBy}-${filters.sortDir}`}
              onValueChange={(v) => {
                const [sortBy, sortDir] = v.split("-");
                onFiltersChange({
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
          </div>

          {/* Status pills */}

          <div className="border-t px-6 py-5 ">
            <div className="space-y-3">
              <label className="text-sm font-medium">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  const active = filters.status?.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleStatus(s)}
                      className={`px-3 py-1.5  rounded-full text-sm font-medium  transition-all ${
                        active
                          ? `${cfg.color} ${cfg.textColor} ${cfg.borderColor}`
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" /> Clear All
            </Button>
          )}
          <DialogFooter className="px-6 py-4 flex items-center !justify-between">
            <Button
              className="font-black cursor-pointer"
              variant="outline"
              onClick={clearAll}
            >
              Reset
            </Button>

            <Button className="cursor-pointer" onClick={clearAll}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
/* {filtersOpen && (
  <Card className="p-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      <SourceFilter />

      <TypeFilter />

      <PriorityFilter />

      <StatusFilter />

      <AssignedFilter />

      <SortFieldFilter />

      <SortDirectionFilter />

    </div>

    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        onClick={resetFilters}
      >
        Reset
      </Button>

      <Button
        onClick={() => setFiltersOpen(false)}
      >
        Apply
      </Button>
    </div>
  </Card>
)} */
