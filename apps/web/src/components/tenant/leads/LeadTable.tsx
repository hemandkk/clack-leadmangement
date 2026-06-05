"use client";

import { useState, useMemo, Dispatch, SetStateAction, memo } from "react";
import {
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { MoreVertical, ArrowUpDown } from "lucide-react";
import { useLeadsList, useDeleteLead } from "@/hooks/useLeads";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadPriorityBadge } from "./LeadPriorityBadge";
import { formatDate } from "@leadpro/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Lead, LeadFilters } from "@leadpro/types";

interface Props {
  filters: LeadFilters;
  onFiltersChange: (f: LeadFilters) => void;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  rowSelection: RowSelectionState;
}

function LeadTable({
  filters,
  onFiltersChange,
  setRowSelection,
  rowSelection,
}: Props) {
  const memoFilters = useMemo(() => filters, [filters.page, filters.search]);
  const router = useRouter();
  const { data, isLoading } = useLeadsList(memoFilters);

  const { mutate: deleteLead } = useDeleteLead();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const leads: Lead[] = data?.data ?? [];
  const meta = {
    total: data?.total ?? 0,
    lastPage: data?.last_page ?? 0,
    currentPage: data?.current_page ?? 0,
    perPage: data?.per_page ?? 0,
  };

  const columns: ColumnDef<Lead>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="bg-gray-500/40"
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          className="bg-gray-500/40"
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      accessorKey: "name",
      header: () => (
        <button
          className="flex items-center gap-1 text-xs font-medium"
          onClick={() =>
            onFiltersChange({
              ...filters,
              sortBy: "name",
              sortDir: filters.sortDir === "asc" ? "desc" : "asc",
            })
          }
        >
          Name <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm text-slate-900">
            {row.original.name}
          </p>
          <p className="text-xs text-slate-400">
            {row.original.contactNumbers?.[0]?.number ?? "—"}
          </p>
        </div>
      ),
    },
    /*     {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <LeadStatusBadge status={row.original.status} />,
    }, */
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => <LeadPriorityBadge priority={row.original.priority} />,
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600">{row.original.source}</span>
      ),
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned to",
      cell: ({ row }) => {
        const staff = row.original.assignedStaff;
        if (!staff) return <span className="text-xs text-slate-300">—</span>;
        return (
          <span className="text-xs text-slate-300">
            {row.original.assignedTo}
          </span>
        );
        {
          /* <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-slate-700 text-white">
                {staff.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-slate-700">{staff.name}</span>
          </div> */
        }
      },
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) =>
        row.original.value ? (
          <span className="text-sm font-medium">
            ₹{row.original.value.toLocaleString("en-IN")}
          </span>
        ) : (
          <span className="text-slate-300 text-sm">—</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs text-slate-500">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sm">
            <DropdownMenuItem
              onClick={() => router.push(`/leads/${row.original.id}`)}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>Assign to staff</DropdownMenuItem>
            <DropdownMenuItem>Add note</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(row.original.id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: leads,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: meta?.lastPage ?? 1,
    getRowId: (row) => row.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-slate-50 hover:bg-slate-50">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-medium text-slate-500 h-10"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => router.push(`/leads/${row.original.id}`)}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-16 text-slate-400 text-sm"
                >
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {(meta.currentPage - 1) * meta.perPage + 1}–
            {Math.min(meta.currentPage * meta.perPage, meta.total)} of{" "}
            {meta.total}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.currentPage <= 1}
              onClick={() =>
                onFiltersChange({ ...filters, page: meta.currentPage - 1 })
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.currentPage >= meta.lastPage}
              onClick={() =>
                onFiltersChange({ ...filters, page: meta.currentPage + 1 })
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All activity and notes for this lead
              will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                deleteLead(deleteId!);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
export default memo(LeadTable);
