"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  whatsappTemplateSchema,
  type WhatsAppTemplateInput,
} from "@leadpro/validators";
import {
  useCreateWATemplate,
  useUpdateWATemplate,
  useWATemplate,
} from "@/hooks/useBroadcast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";

const VARIABLES = [
  "lead_name",
  "lead_phone",
  "company_name",
  "staff_name",
  "follow_up_date",
  "product_name",
];

interface Props {
  open: boolean;
  onClose: () => void;
  editId?: string | null;
}

export function WATemplateFormModal({ open, onClose, editId }: Props) {
  const isEdit = !!editId;
  const { data: existing } = useWATemplate(editId ?? "");
  const { mutate: create, isPending: creating } = useCreateWATemplate();
  const { mutate: update, isPending: updating } = useUpdateWATemplate(
    editId ?? "",
  );
  const isPending = creating || updating;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<WhatsAppTemplateInput>({
    resolver: zodResolver(whatsappTemplateSchema),
    defaultValues: {
      language: "en_US",
      waCategory: "MARKETING",
      headerType: "NONE",
      buttons: [],
    },
  });

  const {
    fields: btnFields,
    append: addBtn,
    remove: removeBtn,
  } = useFieldArray({ control, name: "buttons" });

  const headerType = watch("headerType");
  const bodyText = watch("body") ?? "";

  // Live preview: replace variables with sample data
  const previewBody = bodyText
    .replace(/\{\{lead_name\}\}/g, "John Doe")
    .replace(/\{\{lead_phone\}\}/g, "+91 98765 43210")
    .replace(/\{\{company_name\}\}/g, "LeadPro")
    .replace(/\{\{staff_name\}\}/g, "Your Name")
    .replace(/\{\{follow_up_date\}\}/g, "15 Jan 2025")
    .replace(/\{\{product_name\}\}/g, "Premium Plan");

  useEffect(() => {
    if (open && existing?.template) {
      const t = existing.template;
      reset({
        name: t.name,
        category: t.category,
        waCategory: t.waCategory,
        language: t.language,
        headerType: t.headerType ?? "NONE",
        headerText: t.headerText,
        body: t.body,
        footer: t.footer,
        buttons: t.buttons ?? [],
      });
    } else if (open && !isEdit) {
      reset({
        language: "en_US",
        waCategory: "MARKETING",
        headerType: "NONE",
        buttons: [],
      });
    }
  }, [open, existing, isEdit]);

  const onSubmit = (d: WhatsAppTemplateInput) => {
    if (isEdit) update(d, { onSuccess: onClose });
    else create(d, { onSuccess: onClose });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <DialogTitle>
            {isEdit ? "Edit WhatsApp template" : "New WhatsApp template"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex flex-1 min-h-0">
            {/* Left: settings */}
            <ScrollArea className="w-72 shrink-0 border-r border-slate-100">
              <div className="p-5 space-y-4">
                <div>
                  <Label>Template name *</Label>
                  <Input
                    {...register("name")}
                    className="mt-1 font-mono text-sm"
                    placeholder="follow_up_day_1"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Lowercase, numbers, underscores only
                  </p>
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select
                      onValueChange={(v) => setValue("category", v as any)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "follow_up",
                          "introduction",
                          "promotional",
                          "reminder",
                          "invoice",
                          "support",
                          "custom",
                        ].map((c) => (
                          <SelectItem key={c} value={c} className="capitalize">
                            {c.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Meta category *</Label>
                    <Select
                      defaultValue="MARKETING"
                      onValueChange={(v) => setValue("waCategory", v as any)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                        <SelectItem value="UTILITY">Utility</SelectItem>
                        <SelectItem value="AUTHENTICATION">
                          Authentication
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select
                      defaultValue="en_US"
                      onValueChange={(v) => setValue("language", v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en_US">English (US)</SelectItem>
                        <SelectItem value="en_GB">English (UK)</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Header */}
                <div>
                  <Label>Header type</Label>
                  <Select
                    defaultValue="NONE"
                    onValueChange={(v) => setValue("headerType", v as any)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">No header</SelectItem>
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="IMAGE">Image</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="DOCUMENT">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {headerType === "TEXT" && (
                  <div>
                    <Label>Header text</Label>
                    <Input
                      {...register("headerText")}
                      className="mt-1"
                      placeholder="Your order is confirmed"
                    />
                  </div>
                )}

                {/* Variable helper */}
                <div>
                  <Label className="mb-2 block">Insert variable</Label>
                  <div className="flex flex-wrap gap-1">
                    {VARIABLES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          const cur = watch("body") ?? "";
                          setValue("body", cur + `{{${v}}}`, {
                            shouldDirty: true,
                          });
                        }}
                        className="text-[10px] bg-green-50 text-green-700
                          hover:bg-green-100 px-1.5 py-0.5 rounded font-mono
                          transition-colors"
                      >
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Right: body + preview */}
            <div className="flex-1 flex flex-col min-w-0">
              <ScrollArea className="flex-1">
                <div className="p-5 space-y-4">
                  {/* Body */}
                  <div>
                    <Label>
                      Message body *
                      <span className="ml-2 text-xs text-slate-400">
                        {bodyText.length}/1024
                      </span>
                    </Label>
                    <Textarea
                      {...register("body")}
                      className="mt-1 resize-none font-mono text-sm"
                      rows={6}
                      maxLength={1024}
                      placeholder={`Hi {{lead_name}},\n\nThank you for your interest in {{product_name}}.\n\nBest regards,\n{{staff_name}}`}
                    />
                    {errors.body && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.body.message}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div>
                    <Label>Footer text</Label>
                    <Input
                      {...register("footer")}
                      className="mt-1"
                      placeholder="Reply STOP to unsubscribe"
                    />
                  </div>

                  {/* Buttons */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Buttons</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() =>
                          addBtn({ type: "QUICK_REPLY", text: "" })
                        }
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add button
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {btnFields.map((field, i) => (
                        <div
                          key={field.id}
                          className="flex items-start gap-2
                          p-2 border border-slate-200 rounded-lg"
                        >
                          <Select
                            defaultValue={field.type}
                            onValueChange={(v) =>
                              setValue(`buttons.${i}.type`, v as any)
                            }
                          >
                            <SelectTrigger className="h-8 w-32 text-xs shrink-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="QUICK_REPLY">
                                Quick reply
                              </SelectItem>
                              <SelectItem value="URL">URL button</SelectItem>
                              <SelectItem value="PHONE">Call button</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            {...register(`buttons.${i}.text`)}
                            placeholder="Button text"
                            className="h-8 flex-1 text-sm"
                          />
                          {watch(`buttons.${i}.type`) !== "QUICK_REPLY" && (
                            <Input
                              {...register(`buttons.${i}.value`)}
                              placeholder={
                                watch(`buttons.${i}.type`) === "URL"
                                  ? "https://..."
                                  : "+91..."
                              }
                              className="h-8 flex-1 text-sm"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeBtn(i)}
                            className="text-red-400 hover:text-red-600 mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live preview */}
                  <div>
                    <Label className="mb-2 block">Live preview</Label>
                    <div className="bg-[#e5ddd5] rounded-xl p-4">
                      <div
                        className="bg-white rounded-xl rounded-tl-none
                        shadow-sm max-w-[280px] overflow-hidden"
                      >
                        {/* Header */}
                        {headerType === "TEXT" && watch("headerText") && (
                          <div className="px-3 pt-3 pb-1">
                            <p className="font-bold text-sm text-slate-900">
                              {watch("headerText")}
                            </p>
                          </div>
                        )}
                        {["IMAGE", "VIDEO", "DOCUMENT"].includes(
                          headerType ?? "",
                        ) && (
                          <div
                            className="h-32 bg-slate-100 flex items-center
                            justify-center text-slate-400 text-xs"
                          >
                            {headerType} placeholder
                          </div>
                        )}
                        {/* Body */}
                        <div className="px-3 py-2">
                          <p className="text-sm text-slate-800 whitespace-pre-wrap">
                            {previewBody || "Your message will appear here..."}
                          </p>
                        </div>
                        {/* Footer */}
                        {watch("footer") && (
                          <div className="px-3 pb-2">
                            <p className="text-xs text-slate-400">
                              {watch("footer")}
                            </p>
                          </div>
                        )}
                        {/* Buttons */}
                        {btnFields.length > 0 && (
                          <div className="border-t border-slate-100">
                            {btnFields.map((_, i) => (
                              <div
                                key={i}
                                className="text-center text-sm text-blue-500
                                  py-2 border-b border-slate-100 last:border-0
                                  font-medium"
                              >
                                {watch(`buttons.${i}.text`) || "Button text"}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>

          <div
            className="flex justify-end gap-2 px-6 py-4
            border-t border-slate-100 bg-slate-50 shrink-0"
          >
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Create template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
