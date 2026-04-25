"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@leadpro/utils";
import { PHONE_PREFIXES } from "@leadpro/utils";
const LABELS = [
  { value: "mobile", label: "📱 Mobile" },
  { value: "work", label: "🏢 Work" },
  { value: "home", label: "🏠 Home" },
  { value: "other", label: "📞 Other" },
];

export function ContactNumbersField() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contactNumbers",
  });

  const watchNumbers = watch("contactNumbers") ?? [];

  const setPrimary = (idx: number) => {
    watchNumbers.forEach((_: unknown, i: number) => {
      setValue(`contactNumbers.${i}.isPrimary`, i === idx, {
        shouldDirty: true,
      });
    });
  };

  const addNumber = () => {
    append({
      number: "",
      label: "mobile",
      mobile_prefix: "+91",
      isPrimary: fields.length === 0, // first one auto-primary
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-slate-700">
            Contact numbers
          </span>
          <span className="text-red-500 text-sm">*</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={addNumber}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add number
        </Button>
      </div>

      {fields.length === 0 && (
        <button
          type="button"
          onClick={addNumber}
          className="w-full border-2 border-dashed border-slate-200 rounded-lg
            py-3 text-sm text-slate-400 hover:border-slate-300 hover:text-slate-500
            transition-colors"
        >
          + Add contact number
        </button>
      )}

      <div className="space-y-2">
        {fields.map((field, idx) => {
          const isPrimary = watchNumbers[idx]?.isPrimary;
          const error = (errors as any)?.contactNumbers?.[idx]?.number?.message;

          return (
            <div key={field.id}>
              <div
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border transition-colors",
                  isPrimary
                    ? "border-blue-300 bg-blue-50/40"
                    : "border-slate-200 bg-white",
                )}
              >
                {/* Primary star */}
                <button
                  type="button"
                  onClick={() => setPrimary(idx)}
                  title={isPrimary ? "Primary number" : "Set as primary"}
                  className="shrink-0 p-0.5"
                >
                  <Star
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isPrimary
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300 hover:text-slate-400",
                    )}
                  />
                </button>

                {/* Label select */}
                <Select
                  defaultValue={watchNumbers[idx]?.label ?? "mobile"}
                  onValueChange={(v) =>
                    setValue(`contactNumbers.${idx}.label`, v, {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger
                    className="h-8 w-28 text-xs shrink-0 border-0
                    bg-transparent focus:ring-0"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LABELS.map((l) => (
                      <SelectItem
                        key={l.value}
                        value={l.value}
                        className="text-xs"
                      >
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Prefix select */}
                <Select
                  defaultValue={watchNumbers[idx]?.code ?? "+91"}
                  onValueChange={(v) =>
                    setValue(`contactNumbers.${idx}.code`, v, {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger
                    className="h-8 w-16 text-xs shrink-0 border-0
                    bg-transparent focus:ring-0"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PHONE_PREFIXES.map((l) => (
                      <SelectItem
                        key={l.code}
                        value={l.code}
                        className="text-xs"
                      >
                        {l.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Number input */}
                <Input
                  {...register(`contactNumbers.${idx}.number`)}
                  placeholder="Phone number"
                  className="h-8 flex-1 border-0 bg-transparent focus-visible:ring-0
                    focus-visible:ring-offset-0 text-sm"
                  type="tel"
                />

                {/* Primary badge */}
                {isPrimary && (
                  <span
                    className="text-[10px] font-bold text-blue-600 bg-blue-100
                    px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap"
                  >
                    PRIMARY
                  </span>
                )}

                {/* Remove */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      // If removing primary, make the next one primary
                      if (isPrimary && fields.length > 1) {
                        const nextIdx = idx === 0 ? 1 : 0;
                        setValue(`contactNumbers.${nextIdx}.isPrimary`, true);
                      }
                      remove(idx);
                    }}
                    className="shrink-0 text-slate-400 hover:text-red-500 p-0.5
                      transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-1 ml-8">{error}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Root-level error */}
      {(errors as any)?.contactNumbers?.root?.message && (
        <p className="text-red-500 text-xs">
          {(errors as any).contactNumbers.root.message}
        </p>
      )}
      {typeof (errors as any)?.contactNumbers?.message === "string" && (
        <p className="text-red-500 text-xs">
          {(errors as any).contactNumbers.message}
        </p>
      )}
    </div>
  );
}
