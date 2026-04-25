"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Copy, Eye } from "lucide-react";
import {
  useEmailTemplates,
  useDeleteEmailTemplate,
} from "@/hooks/useBroadcast";
import { EmailTemplateFormModal } from "./EmailTemplateFormModal";
import { EmailTemplatePreview } from "./EmailTemplatePreview";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn, formatDate } from "@leadpro/utils";
import type { EmailTemplate } from "@leadpro/types";

const CATEGORY_COLORS: Record<string, string> = {
  follow_up: "bg-blue-50 text-blue-700",
  introduction: "bg-green-50 text-green-700",
  promotional: "bg-purple-50 text-purple-700",
  reminder: "bg-amber-50 text-amber-700",
  invoice: "bg-slate-100 text-slate-600",
  support: "bg-teal-50 text-teal-700",
  custom: "bg-slate-100 text-slate-500",
};

export function EmailTemplatesPage() {
  const router = useRouter();
  const [showCreate, setCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useEmailTemplates();
  const { mutate: deleteTpl } = useDeleteEmailTemplate();

  const templates: EmailTemplate[] = data?.templates ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {templates.length} email template{templates.length !== 1 ? "s" : ""}
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditId(null);
            setCreate(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1.5" /> New email template
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-52 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl">
          <p className="text-3xl mb-3">📧</p>
          <p className="text-slate-400 mb-4">No email templates yet</p>
          <Button variant="outline" onClick={() => setCreate(true)}>
            Create first template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden
                hover:shadow-sm hover:border-slate-300 transition-all group"
            >
              {/* Colored header strip */}
              <div className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500" />

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {tpl.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {tpl.subject}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "ml-2 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                      CATEGORY_COLORS[tpl.category] ?? CATEGORY_COLORS.custom,
                    )}
                  >
                    {tpl.category.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Body preview */}
                <div
                  className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3
                    max-h-20 overflow-hidden mb-3 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: tpl.bodyHtml }}
                />

                {/* Variables */}
                {tpl.variables.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tpl.variables.slice(0, 3).map((v) => (
                      <code
                        key={v.key}
                        className="text-[10px] bg-blue-50 text-blue-700
                          px-1.5 py-0.5 rounded font-mono"
                      >
                        {`{{${v.key}}}`}
                      </code>
                    ))}
                    {tpl.variables.length > 3 && (
                      <span className="text-[10px] text-slate-400">
                        +{tpl.variables.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div
                  className="flex items-center justify-between pt-3
                  border-t border-slate-100"
                >
                  <span className="text-[10px] text-slate-400">
                    {formatDate(tpl.updatedAt)}
                  </span>
                  <div
                    className="flex items-center gap-1
                    opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setPreviewId(tpl.id)}
                      title="Preview"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setEditId(tpl.id);
                        setCreate(true);
                      }}
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-600"
                      onClick={() => setDeleteId(tpl.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EmailTemplateFormModal
        open={showCreate}
        onClose={() => {
          setCreate(false);
          setEditId(null);
        }}
        editId={editId}
      />

      {previewId && (
        <EmailTemplatePreview
          templateId={previewId}
          onClose={() => setPreviewId(null)}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete email template?</AlertDialogTitle>
            <AlertDialogDescription>
              Broadcasts using this template will need to be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                deleteTpl(deleteId!);
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
