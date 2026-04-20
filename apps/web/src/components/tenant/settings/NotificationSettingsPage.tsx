"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  notificationSettingsSchema,
  type NotificationSettingsInput,
} from "@leadpro/validators";
import { useTenantSettings, useUpdateSettings } from "@/hooks/useSettings";
import { SettingsCard } from "./SettingsCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SwitchRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

function SwitchRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: SwitchRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function NotificationSettingsPage() {
  const { data: settings } = useTenantSettings();
  const { mutate: save, isPending } = useUpdateSettings();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<NotificationSettingsInput>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      whatsappNotifications: false,
      notifyOnNewLead: true,
      notifyOnLeadAssigned: true,
      notifyOnLeaveApplied: true,
    },
  });

  useEffect(() => {
    if (settings)
      reset({
        emailNotifications: settings.emailNotifications,
        whatsappNotifications: settings.whatsappNotifications,
        notifyOnNewLead: settings.notifyOnNewLead,
        notifyOnLeadAssigned: settings.notifyOnLeadAssigned,
        notifyOnLeaveApplied: settings.notifyOnLeaveApplied,
      });
  }, [settings, reset]);

  return (
    <form onSubmit={handleSubmit((d) => save(d))} className="space-y-6">
      <SettingsCard
        title="Notification channels"
        description="Choose how your team receives alerts"
      >
        <Controller
          name="emailNotifications"
          control={control}
          render={({ field }) => (
            <SwitchRow
              id="email-notifs"
              label="Email notifications"
              description="Send alerts via email to staff members"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Controller
          name="whatsappNotifications"
          control={control}
          render={({ field }) => (
            <SwitchRow
              id="wa-notifs"
              label="WhatsApp notifications"
              description="Send alerts via WhatsApp (requires WhatsApp integration)"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </SettingsCard>

      <SettingsCard
        title="Notification triggers"
        description="Select which events trigger a notification"
      >
        <Controller
          name="notifyOnNewLead"
          control={control}
          render={({ field }) => (
            <SwitchRow
              id="notify-new-lead"
              label="New lead created"
              description="Alert manager when a new lead enters the system"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Controller
          name="notifyOnLeadAssigned"
          control={control}
          render={({ field }) => (
            <SwitchRow
              id="notify-assigned"
              label="Lead assigned"
              description="Alert staff member when a lead is assigned to them"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Controller
          name="notifyOnLeaveApplied"
          control={control}
          render={({ field }) => (
            <SwitchRow
              id="notify-leave"
              label="Leave applied"
              description="Alert manager when a staff member applies for leave"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </SettingsCard>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
