"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { broadcastSchema, type BroadcastInput } from "@leadpro/validators";
import {
  useCreateBroadcast,
  useEmailTemplates,
  useWATemplates,
} from "@/hooks/useBroadcast";
import { useLeadsList } from "@/hooks/useLeads";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TemplateChannel } from "@leadpro/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateBroadcastModal({ open, onClose }: Props) {
  const { mutate: create, isPending } = useCreateBroadcast();
  const [channel, setChannel] = useState<TemplateChannel>("email");

  const { data: emailTpls } = useEmailTemplates();
  const { data: waTpls } = useWATemplates();
  const { data: leadsData } = useLeadsList({ page: 1, perPage: 200 });

  const templates =
    channel === "email"
      ? (emailTpls?.templates ?? [])
      : (waTpls?.templates ?? []).filter((t: any) => t.status === "approved");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BroadcastInput>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: { channel: "email", audienceType: "all" },
  });

  const audienceType = watch("audienceType");

  const onSubmit = (d: BroadcastInput) =>
    create(d, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle>Create broadcast</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="max-h-[65vh]">
            <div className="p-6 space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  {...register("name")}
                  className="mt-1"
                  placeholder="e.g. June newsletter"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Channel */}
              <div>
                <Label className="mb-2 block">Channel *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["email", "whatsapp"] as TemplateChannel[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setChannel(c);
                        setValue("channel", c);
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2
                        font-medium text-sm transition-all
                        ${
                          channel === c
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      <span>{c === "email" ? "📧" : "💬"}</span>
                      {c === "email" ? "Email" : "WhatsApp"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template */}
              <div>
                <Label>Template *</Label>
                <Select onValueChange={(v) => setValue("templateId", v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.length === 0 ? (
                      <div className="py-4 text-center text-xs text-slate-400">
                        No {channel === "whatsapp" ? "approved " : ""}templates.
                        Create one first.
                      </div>
                    ) : (
                      templates.map((t: any) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                          {t.status && (
                            <span className="ml-2 text-slate-400 text-xs capitalize">
                              ({t.status})
                            </span>
                          )}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.templateId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.templateId.message}
                  </p>
                )}
              </div>

              {/* Audience */}
              <div>
                <Label>Audience *</Label>
                <Select
                  defaultValue="all"
                  onValueChange={(v) => setValue("audienceType", v as any)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All leads</SelectItem>
                    <SelectItem value="manual">Specific leads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Schedule */}
              <div>
                <Label>Schedule</Label>
                <Input
                  {...register("scheduledAt")}
                  type="datetime-local"
                  className="mt-1"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Leave empty to send immediately
                </p>
              </div>
            </div>
          </ScrollArea>
          <div
            className="flex justify-end gap-2 px-6 py-4
            border-t border-slate-100 bg-slate-50"
          >
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create broadcast"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
