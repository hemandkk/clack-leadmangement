"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  generalSettingsSchema,
  type GeneralSettingsInput,
} from "@leadpro/validators";
import { useTenantSettings, useUpdateSettings } from "@/hooks/useSettings";
import { SettingsCard } from "./SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "UTC",
];

const CURRENCIES = ["INR", "USD", "AED", "GBP", "EUR"];

export function GeneralSettingsPage() {
  const { data: settings, isLoading } = useTenantSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<GeneralSettingsInput>({
    resolver: zodResolver(generalSettingsSchema),
  });

  // Populate form once data loads
  useEffect(() => {
    if (settings)
      reset({
        companyName: settings.companyName,
        timezone: settings.timezone,
        dateFormat: settings.dateFormat,
        currency: settings.currency,
      });
  }, [settings, reset]);

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <form
      onSubmit={handleSubmit((d) => updateSettings(d))}
      className="space-y-6"
    >
      <SettingsCard
        title="Company information"
        description="Basic details about your organisation"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Company name</Label>
            <Input {...register("companyName")} className="mt-1" />
            {errors.companyName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <Label>Timezone</Label>
            <Select
              defaultValue={settings?.timezone}
              onValueChange={(v) =>
                setValue("timezone", v, { shouldDirty: true })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Currency</Label>
            <Select
              defaultValue={settings?.currency}
              onValueChange={(v) =>
                setValue("currency", v, { shouldDirty: true })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date format</Label>
            <Select
              defaultValue={settings?.dateFormat}
              onValueChange={(v) =>
                setValue("dateFormat", v, { shouldDirty: true })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function SettingsPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
      <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );
}
