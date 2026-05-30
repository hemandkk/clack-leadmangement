"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import {
  whatsappPhoneNumberSchema,
  type WhatsAppPhoneNumberInput,
} from "@leadpro/validators";
import type { WhatsAppPhoneNumber } from "@leadpro/types";
import {
  useAddWhatsAppPhoneNumber,
  useDeleteWhatsAppPhoneNumber,
  useWhatsAppPhoneNumbers,
} from "@/hooks/useSettings";
import { SettingsCard } from "../SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function WhatsAppPhoneNumbersPanel() {
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError } = useWhatsAppPhoneNumbers();
  const { mutate: addNumber, isPending } = useAddWhatsAppPhoneNumber();
  const { mutate: removeNumber } = useDeleteWhatsAppPhoneNumber();
  const numbers: WhatsAppPhoneNumber[] = data?.data ?? data ?? [];
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WhatsAppPhoneNumberInput>({
    resolver: zodResolver(whatsappPhoneNumberSchema),
    defaultValues: { isDefault: false },
  });

  const onSubmit = (values: WhatsAppPhoneNumberInput) => {
    addNumber(values, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  return (
    <SettingsCard
      title="Business phone numbers"
      description="Connect multiple Meta phone numbers and optionally assign each line to a staff member"
      action={
        <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" /> Add number
        </Button>
      }
    >
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-2"
        >
          <div>
            <Label>Phone Number ID</Label>
            <Input {...register("phoneNumberId")} placeholder="123456789012345" />
            {errors.phoneNumberId && (
              <p className="mt-1 text-xs text-red-500">
                {errors.phoneNumberId.message}
              </p>
            )}
          </div>
          <div>
            <Label>Display phone number</Label>
            <Input
              {...register("displayPhoneNumber")}
              placeholder="+91 98765 43210"
            />
            {errors.displayPhoneNumber && (
              <p className="mt-1 text-xs text-red-500">
                {errors.displayPhoneNumber.message}
              </p>
            )}
          </div>
          <div>
            <Label>Assigned staff ID</Label>
            <Input
              {...register("assignedStaffId")}
              placeholder="Optional staff UUID"
            />
          </div>
          <label className="flex items-center gap-2 self-end text-sm text-slate-600">
            <Checkbox
              onCheckedChange={(checked) =>
                setValue("isDefault", checked === true)
              }
            />
            Use as default outbound number
          </label>
          <div className="flex gap-2 md:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add number"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {isLoading && <p className="text-sm text-slate-400">Loading numbers...</p>}
      {isError && (
        <p className="text-sm text-red-600">Unable to load phone numbers.</p>
      )}
      {!isLoading && !isError && numbers.length === 0 && (
        <p className="py-3 text-sm text-slate-400">
          No additional numbers connected yet.
        </p>
      )}
      <div className="space-y-2">
        {numbers.map((number) => (
          <div
            key={number.id}
            className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800">
                {number.displayPhoneNumber}
                {number.isDefault && (
                  <span className="ml-2 text-xs text-green-600">Default</span>
                )}
              </p>
              <p className="text-xs text-slate-400">
                {number.verifiedName ?? "Meta phone number"} ·{" "}
                {number.assignedStaffName ?? "Unassigned"}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {number.status}
            </span>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => removeNumber(number.id)}
              aria-label={`Remove ${number.displayPhoneNumber}`}
            >
              <Trash2 className="text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}
