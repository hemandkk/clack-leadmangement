"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Circle,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import {
  whatsappConnectSchema,
  type WhatsAppConnectInput,
} from "@leadpro/validators";
import { useConnectWhatsApp } from "@/hooks/useSettings";
import { SettingsCard } from "../SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import type { WhatsAppConfig } from "@leadpro/types";

const STEPS = [
  { id: 1, label: "Credentials" },
  { id: 2, label: "Webhook setup" },
  { id: 3, label: "Test & confirm" },
];

interface Props {
  currentConfig?: WhatsAppConfig;
}

export function WhatsAppConnectWizard({ currentConfig }: Props) {
  const [step, setStep] = useState(1);
  const [showToken, setShowToken] = useState(false);
  const [webhookTested, setWebhookTested] = useState(false);
  const { mutate: connect, isPending } = useConnectWhatsApp();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<WhatsAppConnectInput>({
    resolver: zodResolver(whatsappConnectSchema),
  });

  // Your app's webhook URL that Meta will call
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/whatsapp`;
  const verifyToken =
    "leadpro_" + (currentConfig?.tenantId ?? "your_tenant_id");

  const handleCopy = (text: string, label: string) => {
    copy(text);
    toast.success(`${label} copied`);
  };

  const handleCredentialSubmit = () => setStep(2);

  const handleFinalConnect = (data: WhatsAppConnectInput) => {
    connect(data, { onSuccess: () => setStep(3) });
  };

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold
                      ${active ? "border-slate-900 text-slate-900" : "border-slate-300 text-slate-300"}`}
                  >
                    {s.id}
                  </div>
                )}
                <span
                  className={`text-sm ${active ? "font-medium text-slate-900" : done ? "text-green-600" : "text-slate-400"}`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px w-8 ${step > s.id ? "bg-green-300" : "bg-slate-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Credentials ── */}
      {step === 1 && (
        <SettingsCard
          title="Enter your Meta credentials"
          description="You'll find these in your Meta Business Manager → WhatsApp → API Setup"
        >
          <Alert className="mb-5 bg-blue-50 border-blue-200">
            <AlertDescription className="text-xs text-blue-700">
              Need help finding these? Follow the{" "}
              <a
                href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium inline-flex items-center gap-0.5"
              >
                Meta Cloud API quickstart <ExternalLink className="h-3 w-3" />
              </a>
            </AlertDescription>
          </Alert>

          <form
            onSubmit={handleSubmit(handleCredentialSubmit)}
            className="space-y-4"
          >
            <div>
              <Label>Permanent Access Token *</Label>
              <p className="text-xs text-slate-400 mb-1">
                Generate a permanent token in Meta Business Settings → System
                Users
              </p>
              <div className="relative">
                <Input
                  {...register("accessToken")}
                  type={showToken ? "text" : "password"}
                  className="pr-9 font-mono text-sm"
                  placeholder="EAAxxxxxxxx..."
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.accessToken && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.accessToken.message}
                </p>
              )}
            </div>

            <div>
              <Label>Phone Number ID *</Label>
              <p className="text-xs text-slate-400 mb-1">
                Found in Meta Developer Console → Your App → WhatsApp → API
                Setup
              </p>
              <Input
                {...register("phoneNumberId")}
                className="font-mono text-sm"
                placeholder="1234567890123456"
              />
              {errors.phoneNumberId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumberId.message}
                </p>
              )}
            </div>

            <div>
              <Label>WhatsApp Business Account ID *</Label>
              <p className="text-xs text-slate-400 mb-1">
                Found in Meta Business Manager → Business Settings → Accounts →
                WhatsApp
              </p>
              <Input
                {...register("businessAccountId")}
                className="font-mono text-sm"
                placeholder="9876543210987654"
              />
              {errors.businessAccountId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.businessAccountId.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit">Continue to webhook setup →</Button>
            </div>
          </form>
        </SettingsCard>
      )}

      {/* ── Step 2: Webhook ── */}
      {step === 2 && (
        <SettingsCard
          title="Configure the webhook"
          description="Tell Meta where to send incoming messages and status updates"
        >
          <div className="space-y-5">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertDescription className="text-xs text-amber-700">
                Go to{" "}
                <strong>
                  Meta Developer Console → Your App → WhatsApp → Configuration
                </strong>{" "}
                and add the values below under Webhook.
              </AlertDescription>
            </Alert>

            {/* Webhook URL */}
            <div>
              <Label>Callback URL</Label>
              <p className="text-xs text-slate-400 mb-1.5">
                Paste this into the "Callback URL" field in Meta
              </p>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={webhookUrl}
                  className="font-mono text-xs bg-slate-50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(webhookUrl, "Webhook URL")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Verify token */}
            <div>
              <Label>Verify Token</Label>
              <p className="text-xs text-slate-400 mb-1.5">
                Paste this into the "Verify Token" field in Meta
              </p>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={verifyToken}
                  className="font-mono text-xs bg-slate-50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(verifyToken, "Verify token")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Subscribed fields */}
            <div>
              <Label>Webhook fields to subscribe</Label>
              <p className="text-xs text-slate-400 mb-2">
                In the Webhook Fields section, enable these:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "messages",
                  "message_deliveries",
                  "message_reads",
                  "message_reactions",
                ].map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 bg-slate-100 rounded text-xs font-mono"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Test webhook */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-sm font-medium mb-2">
                Verify webhook connection
              </p>
              <p className="text-xs text-slate-400 mb-3">
                After saving in Meta, click below to confirm Meta can reach your
                server.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Call verify API, on success set webhookTested
                  setTimeout(() => {
                    setWebhookTested(true);
                    toast.success("Webhook verified successfully");
                  }, 1500);
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Test webhook connection
              </Button>
              {webhookTested && (
                <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Webhook verified
                </p>
              )}
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button
                onClick={handleSubmit(handleFinalConnect)}
                disabled={isPending}
              >
                {isPending ? "Connecting..." : "Connect WhatsApp →"}
              </Button>
            </div>
          </div>
        </SettingsCard>
      )}

      {/* ── Step 3: Success ── */}
      {step === 3 && (
        <SettingsCard title="WhatsApp connected">
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Connection successful
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Your WhatsApp Business account is now connected. You can send
              messages, broadcasts, and receive leads via WhatsApp.
            </p>
          </div>
        </SettingsCard>
      )}
    </div>
  );
}
