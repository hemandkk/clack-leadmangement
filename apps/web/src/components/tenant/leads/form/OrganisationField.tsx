"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Building2, Search, X, Plus } from "lucide-react";
import { useOrganisations } from "@/hooks/useMasterData";
import { masterApi } from "@leadpro/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@leadpro/utils";
import type { Organisation } from "@leadpro/types";

export function OrganisationField() {
  const { setValue, watch } = useFormContext();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const { data } = useOrganisations(search);
  const orgs: Organisation[] = data?.organisations ?? [];

  const selectedId: string | undefined = watch("organisationId");
  const selectedOrg = orgs.find((o) => o.id === selectedId);

  const selectOrg = (org: Organisation) => {
    setValue("organisationId", org.id, { shouldDirty: true });
    setSearch("");
    setOpen(false);
  };

  const clearOrg = () => {
    setValue("organisationId", undefined, { shouldDirty: true });
  };

  const createAndSelect = async () => {
    if (!search.trim()) return;
    setCreating(true);
    try {
      const res = await masterApi.createOrganisation({ name: search.trim() });
      qc.invalidateQueries({ queryKey: ["master", "organisations"] });
      selectOrg(res.data.organisation);
      toast.success(`Organisation "${search}" created`);
    } catch {
      toast.error("Failed to create organisation");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">
        Organisation
        <span className="ml-1 text-xs font-normal text-slate-400">
          (optional)
        </span>
      </label>

      {/* Selected state */}
      {selectedOrg ? (
        <div
          className="flex items-center gap-2 px-3 py-2 border border-blue-300
          bg-blue-50 rounded-lg"
        >
          <Building2 className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="flex-1 text-sm font-medium text-blue-700">
            {selectedOrg.name}
          </span>
          <button
            type="button"
            onClick={clearOrg}
            className="text-blue-400 hover:text-blue-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Building2
              className="absolute left-3 top-1/2 -translate-y-1/2
              h-4 w-4 text-slate-400"
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search or create organisation..."
              className="pl-9"
            />
          </div>

          {open && (
            <div
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-white
              border border-slate-200 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto">
                {orgs.length === 0 && !search ? (
                  <p className="text-center text-xs text-slate-400 py-6">
                    Type to search organisations
                  </p>
                ) : (
                  <>
                    {orgs.map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => selectOrg(org)}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5
                          hover:bg-slate-50 text-left"
                      >
                        <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {org.name}
                          </p>
                          {org.industry && (
                            <p className="text-xs text-slate-400">
                              {org.industry}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}

                    {/* Create new option */}
                    {search.trim() &&
                      !orgs.find(
                        (o) => o.name.toLowerCase() === search.toLowerCase(),
                      ) && (
                        <button
                          type="button"
                          onClick={createAndSelect}
                          disabled={creating}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5
                          border-t border-slate-100 hover:bg-blue-50 text-left"
                        >
                          <Plus className="h-4 w-4 text-blue-500 shrink-0" />
                          <span className="text-sm text-blue-600 font-medium">
                            {creating ? "Creating..." : `Create "${search}"`}
                          </span>
                        </button>
                      )}
                  </>
                )}
              </div>

              <div className="border-t border-slate-100 p-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setSearch("");
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
