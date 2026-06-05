"use client";

import { useState, useMemo } from "react";
import { CirclePlus, FileOutput, ChevronDown, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@leadpro/utils";
import { LeadFilters } from "./LeadFilters";
import LeadTable from "./LeadTable";

import type { LeadFilters as ILeadFilters } from "@leadpro/types";
import { CreateLeadSheet } from "./CreateLeadSheet";

import { useDebounceSearch } from "@/components/shared/DebounceSearch";

type ViewMode = "kanban" | "table";

export function LeadsPageClient() {
  const [view, setView] = useState<ViewMode>("table");
  const [showCreate, setCreate] = useState(false);
  const [showImport, setImport] = useState(false);
  const [showFilterView, setFilterView] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounceSearch(searchTerm, 300);

  const [filters, setFilters] = useState<ILeadFilters>({
    page: 1,
    perPage: 25,
    sortBy: "createdAt",
    sortDir: "desc",
    search: "",
    source: undefined,
    type: undefined,
    priority: undefined,
    status: [],
    assignedTo: undefined,
  });
  const handleFilterUpdate = (fields: Partial<ILeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...fields }));
  };
  /*   const effectiveFilters: ILeadFilters = {
    ...filters,
    search: debouncedSearchTerm,
  }; */
  const effectiveFilters: ILeadFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearchTerm,
    }),
    [filters, debouncedSearchTerm],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Leads</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage and track your leads
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="">
          <input
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search.."
          />
        </div>
        {/* Bulk actions bar */}
        {Object.keys(rowSelection).length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              className="bg-black/80 cursor-pointer"
              onClick={() => setCreate(true)}
              size="sm"
            >
              More Actions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div> /* {Object.keys(rowSelection).length} selected */
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mx-1">
          <Button
            className=" bg-white  text-black cursor-pointer"
            onClick={() => setFilterView(true)}
            size="sm"
          >
            <ListFilter className="h-4 w-4 mr-1.5 " />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2 mx-1">
          <Button
            className="border bg-white text-primary border-primary cursor-pointer"
            onClick={() => setCreate(true)}
            size="sm"
          >
            <FileOutput className="h-4 w-4 mr-1.5 " />
            Import Leads
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-red-500 cursor-pointer"
            onClick={() => setCreate(true)}
            size="sm"
          >
            <CirclePlus className="h-4 w-4 mr-1.5 " />
            New lead
          </Button>
        </div>
      </div>

      {/* Content */}

      <LeadTable
        filters={effectiveFilters}
        onFiltersChange={setFilters}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
      {/* Filters Modal*/}
      <LeadFilters
        open={showFilterView}
        onClose={() => setFilterView(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
      {/* Create lead Drawer */}
      <CreateLeadSheet open={showCreate} onClose={() => setCreate(false)} />
    </div>
  );
}
{
  /* View toggle */
}
{
  /* <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white">
            {([ "kanban", "table"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  view === v
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {v === "kanban" ? (
                  <>
                    <LayoutGrid className="h-3.5 w-3.5" /> Board
                  </>
                ) : (
                  <>
                    <Table2 className="h-3.5 w-3.5" /> Table
                  </>
                )}
              </button>
            ))}
          </div> 
          view === "kanban" ? (
        <LeadKanban filters={filters} />
      )
          */
}
