"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Search, X, Package, Plus } from "lucide-react";
import { useProducts } from "@/hooks/useMasterData";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency } from "@leadpro/utils";
import type { Product } from "@leadpro/types";

export function ProductSelector() {
  const { watch, setValue } = useFormContext();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const { data } = useProducts(search);
  const products: Product[] = data?.products ?? [];

  const selected: string[] = watch("productIds") ?? [];

  const selectedProducts = products.filter((p) => selected.includes(p.id));

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((s) => s !== id)
      : [...selected, id];
    setValue("productIds", next, { shouldDirty: true });
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">
        Products
        <span className="ml-1 text-xs font-normal text-slate-400">
          (optional)
        </span>
      </label>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedProducts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-1.5 bg-blue-50 border border-blue-200
                text-blue-700 text-xs px-2.5 py-1 rounded-full"
            >
              <Package className="h-3 w-3" />
              <span className="font-medium">{p.name}</span>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className="hover:text-blue-900 ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-sm",
          "text-left transition-colors",
          open
            ? "border-slate-400 bg-white"
            : "border-slate-200 bg-white hover:border-slate-300",
        )}
      >
        <Plus className="h-4 w-4 text-slate-400 shrink-0" />
        <span className="text-slate-400">
          {selected.length === 0
            ? "Add products..."
            : `${selected.length} selected — add more`}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="border border-slate-200 rounded-xl bg-white shadow-md
          overflow-hidden"
        >
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2
                h-3.5 w-3.5 text-slate-400"
              />
              <Input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>

          {/* Product list */}
          <div className="max-h-52 overflow-y-auto">
            {products.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">
                {search ? "No products found" : "No products in master list"}
              </p>
            ) : (
              products.map((p) => {
                const isSelected = selected.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggle(p.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-left",
                      "hover:bg-slate-50 transition-colors",
                      isSelected && "bg-blue-50",
                    )}
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-300",
                      )}
                    >
                      {isSelected && (
                        <span className="text-white text-[10px] font-bold leading-none">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isSelected ? "text-blue-700" : "text-slate-800",
                        )}
                      >
                        {p.name}
                      </p>
                      {p.category && (
                        <p className="text-xs text-slate-400 truncate">
                          {p.category}
                        </p>
                      )}
                    </div>

                    {p.price != null && (
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatCurrency(p.price)}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5
                rounded-md hover:bg-slate-100"
            >
              Done ({selected.length} selected)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
