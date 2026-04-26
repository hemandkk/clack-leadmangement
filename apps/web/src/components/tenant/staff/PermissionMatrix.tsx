"use client";

import { useState } from "react";
import { PERMISSION_GROUPS, ROLE_TEMPLATES } from "@/lib/permissions";
import { cn } from "@leadpro/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PermissionKey, StaffRole } from "@leadpro/types";

interface Props {
  value: PermissionKey[];
  onChange: (perms: PermissionKey[]) => void;
  disabled?: boolean;
  currentRole?: StaffRole;
}

export function PermissionMatrix({
  value,
  onChange,
  disabled,
  currentRole,
}: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (key: PermissionKey) => {
    if (disabled) return;
    onChange(
      value.includes(key) ? value.filter((k) => k !== key) : [...value, key],
    );
  };

  const toggleGroup = (group: string, keys: PermissionKey[]) => {
    if (disabled) return;
    const allOn = keys.every((k) => value.includes(k));
    if (allOn) {
      onChange(value.filter((k) => !keys.includes(k)));
    } else {
      const newSet = new Set([...value, ...keys]);
      onChange([...newSet] as PermissionKey[]);
    }
  };

  const applyRoleTemplate = (role: StaffRole) => {
    const tpl = ROLE_TEMPLATES.find((r) => r.role === role);
    if (tpl) onChange(tpl.permissions);
  };

  return (
    <div className="space-y-3">
      {/* Role template quick-fill */}
      {!disabled && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">
            Quick-fill from role template:
          </p>
          <div className="flex gap-2 flex-wrap">
            {ROLE_TEMPLATES.map((r) => (
              <button
                key={r.role}
                type="button"
                onClick={() => applyRoleTemplate(r.role)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  currentRole === r.role
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
                )}
              >
                {r.label}
                <span className="ml-1 text-slate-400 text-[10px]">
                  ({r.permissions.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Permission count summary */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {value.length} of{" "}
          {PERMISSION_GROUPS.reduce((s, g) => s + g.items.length, 0)}{" "}
          permissions selected
        </span>
        {!disabled && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onChange(
                  PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.key)),
                )
              }
              className="text-blue-600 hover:underline"
            >
              Select all
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-slate-400 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Permission groups */}
      <div className="space-y-2">
        {PERMISSION_GROUPS.map((group) => {
          const groupKeys = group.items.map((i) => i.key);
          const allOn = groupKeys.every((k) => value.includes(k));
          const someOn = groupKeys.some((k) => value.includes(k));
          const isOpen = !collapsed[group.group];

          return (
            <div
              key={group.group}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              {/* Group header */}
              <div
                className="flex items-center gap-3 px-4 py-3
                bg-slate-50 cursor-pointer select-none"
                onClick={() =>
                  setCollapsed((c) => ({
                    ...c,
                    [group.group]: !c[group.group],
                  }))
                }
              >
                {/* Group checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(group.group, groupKeys);
                  }}
                  className={cn(
                    "h-4 w-4 rounded border-2 flex items-center justify-center shrink-0",
                    "transition-colors",
                    disabled ? "cursor-default" : "cursor-pointer",
                    allOn
                      ? "bg-slate-900 border-slate-900"
                      : someOn
                        ? "bg-slate-400 border-slate-400"
                        : "border-slate-300",
                  )}
                >
                  {(allOn || someOn) && (
                    <span className="text-white text-[10px] leading-none font-bold">
                      {allOn ? "✓" : "−"}
                    </span>
                  )}
                </button>

                <span className="text-sm">{group.icon}</span>
                <span className="flex-1 text-sm font-semibold text-slate-800">
                  {group.group}
                </span>
                <span className="text-xs text-slate-400 mr-2">
                  {groupKeys.filter((k) => value.includes(k)).length}/
                  {groupKeys.length}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>

              {/* Permission items */}
              {isOpen && (
                <div className="divide-y divide-slate-100">
                  {group.items.map((item) => {
                    const checked = value.includes(item.key);
                    return (
                      <label
                        key={item.key}
                        className={cn(
                          "flex items-start gap-3 px-4 py-3 transition-colors",
                          disabled ? "cursor-default" : "cursor-pointer",
                          checked && !disabled
                            ? "bg-blue-50/40"
                            : "hover:bg-slate-50",
                        )}
                      >
                        <div
                          onClick={() => toggle(item.key)}
                          className={cn(
                            "h-4 w-4 rounded border-2 flex items-center justify-center",
                            "shrink-0 mt-0.5 transition-colors",
                            disabled ? "cursor-default" : "cursor-pointer",
                            checked
                              ? "bg-blue-600 border-blue-600"
                              : "border-slate-300",
                          )}
                        >
                          {checked && (
                            <span className="text-white text-[10px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              checked ? "text-blue-800" : "text-slate-700",
                            )}
                          >
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
