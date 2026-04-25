"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useTelephonySettings,
  useUpdateTelephonySettings,
  useTestTelephonyConnection,
} from "@/hooks/useTelephony";
import { SettingsCard } from "@/components/tenant/settings/SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

export function TelephonySettingsPage() {
  const { data, isLoading } = useTelephonySettings();
  const { mutate: save, isPending } = useUpdateTelephonySettings();
  const { mutate: testConn, isPending: testing } = useTestTelephonyConnection();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      provider: "bonvoice",
      apiKey: "",
      apiSecret: "",
      webhookUrl: "",
      callRecordingEnabled: false,
      recordingStorageDays: 90,
      clickToCallEnabled: false,
    },
  });

  useEffect(() => {
    if (data?.settings) reset(data.settings);
  }, [data]);

  return (
    <form
      onSubmit={handleSubmit((d) => save(d))}
      className="space-y-5 max-w-2xl"
    >
      <SettingsCard
        title="Provider"
        description="Choose your telephony provider"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Provider</Label>
            <Select
              defaultValue="bonvoice"
              onValueChange={(v) =>
                setValue("provider", v, { shouldDirty: true })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bonvoice">Bonvoice</SelectItem>
                <SelectItem value="twilio">Twilio</SelectItem>
                <SelectItem value="exotel">Exotel</SelectItem>
                <SelectItem value="knowlarity">Knowlarity</SelectItem>
                <SelectItem value="ozonetel">Ozonetel</SelectItem>
                <SelectItem value="custom">Custom / Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>API key</Label>
            <Input
              {...register("apiKey")}
              className="mt-1 font-mono text-sm"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <div>
            <Label>API secret</Label>
            <Input
              {...register("apiSecret")}
              className="mt-1 font-mono text-sm"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div className="col-span-2">
            <Label>Webhook URL</Label>
            <p className="text-xs text-slate-400 mb-1">
              Configure this URL in your provider to receive call events
            </p>
            <Input
              {...register("webhookUrl")}
              className="font-mono text-sm"
              readOnly
              value={`${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/calls`}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => testConn()}
            disabled={testing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1.5 ${testing ? "animate-spin" : ""}`}
            />
            {testing ? "Testing..." : "Test connection"}
          </Button>
        </div>
      </SettingsCard>

      <SettingsCard title="Call recording">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable call recording</Label>
              <p className="text-xs text-slate-400 mt-0.5">
                Record all calls automatically
              </p>
            </div>
            <Switch
              checked={watch("callRecordingEnabled")}
              onCheckedChange={(v) =>
                setValue("callRecordingEnabled", v, { shouldDirty: true })
              }
            />
          </div>

          {watch("callRecordingEnabled") && (
            <div>
              <Label>Retain recordings for (days)</Label>
              <Input
                {...register("recordingStorageDays", { valueAsNumber: true })}
                type="number"
                min={1}
                max={365}
                className="mt-1 w-28"
              />
            </div>
          )}
        </div>
      </SettingsCard>

      <SettingsCard title="Click-to-call">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable click-to-call</Label>
            <p className="text-xs text-slate-400 mt-0.5">
              Initiate calls directly from lead profiles
            </p>
          </div>
          <Switch
            checked={watch("clickToCallEnabled")}
            onCheckedChange={(v) =>
              setValue("clickToCallEnabled", v, { shouldDirty: true })
            }
          />
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || isPending}>
          {isPending ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
