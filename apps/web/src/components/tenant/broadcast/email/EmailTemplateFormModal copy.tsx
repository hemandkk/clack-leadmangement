"use client";
import dynamic from "next/dynamic";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailTemplateSchema,
  type EmailTemplateInput,
} from "@leadpro/validators";
import {
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
  useEmailTemplate,
} from "@/hooks/useBroadcast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
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
import { cn } from "@leadpro/utils";

// Template variables available
const TEMPLATE_VARIABLES = [
  { key: "lead_name", label: "Lead name" },
  { key: "lead_phone", label: "Lead phone" },
  { key: "lead_email", label: "Lead email" },
  { key: "staff_name", label: "Staff name" },
  { key: "company_name", label: "Company name" },
  { key: "follow_up_date", label: "Follow-up date" },
  { key: "product_name", label: "Product name" },
  { key: "invoice_amount", label: "Invoice amount" },
  { key: "appointment_time", label: "Appointment time" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  editId?: string | null;
}

export function EmailTemplateFormModal({ open, onClose, editId }: Props) {
  const isEdit = !!editId;
  const { data: existingData } = useEmailTemplate(editId ?? "");
  const { mutate: create, isPending: creating } = useCreateEmailTemplate();
  const { mutate: update, isPending: updating } = useUpdateEmailTemplate(
    editId ?? "",
  );
  const isPending = creating || updating;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmailTemplateInput>({
    resolver: zodResolver(emailTemplateSchema),
  });

  // ── Rich text editor ─────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your email body here..." }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setValue("bodyHtml", editor.getHTML(), { shouldDirty: true });
      setValue("bodyText", editor.getText(), { shouldDirty: true });
    },
  });

  // Populate form on edit
  useEffect(() => {
    if (open && existingData?.template) {
      const t = existingData.template;
      reset({
        name: t.name,
        category: t.category,
        subject: t.subject,
        bodyHtml: t.bodyHtml,
        bodyText: t.bodyText,
        previewText: t.previewText,
        fromName: t.fromName,
      });
      editor?.commands.setContent(t.bodyHtml ?? "");
    } else if (open && !isEdit) {
      reset({});
      editor?.commands.clearContent();
    }
  }, [open, existingData, isEdit]);

  const insertVariable = useCallback(
    (key: string) => {
      editor?.chain().focus().insertContent(`{{${key}}}`).run();
    },
    [editor],
  );

  const onSubmit = (data: EmailTemplateInput) => {
    if (isEdit) {
      update(data, { onSuccess: onClose });
    } else {
      create(data, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <DialogTitle>
            {isEdit ? "Edit email template" : "New email template"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex flex-1 min-h-0">
            {/* Left: form fields */}
            <ScrollArea className="w-72 shrink-0 border-r border-slate-100">
              <div className="p-5 space-y-4">
                <div>
                  <Label>Template name *</Label>
                  <Input
                    {...register("name")}
                    className="mt-1"
                    placeholder="Monthly newsletter"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Category *</Label>
                  <Select onValueChange={(v) => setValue("category", v as any)}>
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
                  <Label>From name</Label>
                  <Input
                    {...register("fromName")}
                    className="mt-1"
                    placeholder="Your company"
                  />
                </div>

                <div>
                  <Label>Subject line *</Label>
                  <Input
                    {...register("subject")}
                    className="mt-1"
                    placeholder="Hey {{lead_name}}, ..."
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Preview text</Label>
                  <Input
                    {...register("previewText")}
                    className="mt-1"
                    placeholder="Short preview shown in inbox"
                  />
                </div>

                {/* Variable inserter */}
                <div>
                  <Label className="mb-2 block">Insert variable</Label>
                  <div className="flex flex-col gap-1">
                    {TEMPLATE_VARIABLES.map((v) => (
                      <button
                        key={v.key}
                        type="button"
                        onClick={() => insertVariable(v.key)}
                        className="text-left text-xs px-2.5 py-1.5 rounded-lg
                          bg-slate-50 hover:bg-blue-50 hover:text-blue-700
                          text-slate-600 transition-colors flex items-center
                          justify-between group"
                      >
                        <span>{v.label}</span>
                        <code
                          className="text-[10px] font-mono text-slate-400
                          group-hover:text-blue-500"
                        >
                          {`{{${v.key}}}`}
                        </code>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Right: rich editor */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Toolbar */}
              <div
                className="flex items-center gap-0.5 px-3 py-2 border-b
                border-slate-100 flex-wrap"
              >
                {[
                  {
                    label: "B",
                    action: () => editor?.chain().focus().toggleBold().run(),
                    active: editor?.isActive("bold"),
                  },
                  {
                    label: "I",
                    action: () => editor?.chain().focus().toggleItalic().run(),
                    active: editor?.isActive("italic"),
                  },
                  {
                    label: "U",
                    action: () =>
                      editor?.chain().focus().toggleUnderline().run(),
                    active: editor?.isActive("underline"),
                  },
                  {
                    label: "H1",
                    action: () =>
                      editor?.chain().focus().toggleHeading({ level: 1 }).run(),
                    active: editor?.isActive("heading", { level: 1 }),
                  },
                  {
                    label: "H2",
                    action: () =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run(),
                    active: editor?.isActive("heading", { level: 2 }),
                  },
                  {
                    label: "• ",
                    action: () =>
                      editor?.chain().focus().toggleBulletList().run(),
                    active: editor?.isActive("bulletList"),
                  },
                  {
                    label: "1.",
                    action: () =>
                      editor?.chain().focus().toggleOrderedList().run(),
                    active: editor?.isActive("orderedList"),
                  },
                  {
                    label: "« »",
                    action: () =>
                      editor?.chain().focus().toggleBlockquote().run(),
                    active: editor?.isActive("blockquote"),
                  },
                  {
                    label: "⟵",
                    action: () => editor?.chain().focus().undo().run(),
                    active: false,
                  },
                  {
                    label: "⟶",
                    action: () => editor?.chain().focus().redo().run(),
                    active: false,
                  },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={btn.action}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-mono transition-colors",
                      btn.active
                        ? "bg-slate-900 text-white"
                        : "hover:bg-slate-100 text-slate-600",
                    )}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Editor area */}
              <div className="flex-1 overflow-auto p-5">
                <EditorContent
                  editor={editor}
                  className="prose prose-sm max-w-none min-h-full
                    [&_.ProseMirror]:min-h-64 [&_.ProseMirror]:outline-none
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-slate-400
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
                    [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
                />
              </div>

              {errors.bodyHtml && (
                <p className="text-red-500 text-xs px-5 pb-2">
                  {errors.bodyHtml.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
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
