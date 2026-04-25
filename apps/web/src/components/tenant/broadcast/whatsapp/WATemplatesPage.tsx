"use client";

import { useState } from "react";
import {
  useWATemplates,
  useDeleteWATemplate,
  useSubmitWAForApproval,
  useSyncWATemplates,
} from "@/hooks/useBroadcast";
import { WATemplateFormModal } from "./WATemplateFormModal";
import { WATemplatePreview } from "./WATemplatePreview";
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
import {
  Plus,
  Edit2,
  Trash2,
  Send,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { cn, formatDate } from "@leadpro/utils";
import type { WhatsAppTemplate } from "@leadpro/types";

const STATUS_CFG = {
  draft: { label: "Draft", icon: Clock, cls: "bg-slate-100 text-slate-500" },
  pending_approval: {
    label: "Pending approval",
    icon: Clock,
    cls: "bg-yellow-50 text-yellow-700",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    cls: "bg-green-50 text-green-700",
  },
  rejected: {
    label: "Rejected",
    icon: AlertCircle,
    cls: "bg-red-50 text-red-600",
  },
};

const WA_CATEGORY_CFG = {
  MARKETING: { label: "Marketing", bg: "bg-purple-50 text-purple-700" },
  UTILITY: { label: "Utility", bg: "bg-blue-50 text-blue-700" },
  AUTHENTICATION: { label: "Authentication", bg: "bg-green-50 text-green-700" },
};

export function WATemplatesPage() {
  const [showCreate, setCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useWATemplates();
  const { mutate: deleteTpl } = useDeleteWATemplate();
  const { mutate: submit, isPending: submitting } = useSubmitWAForApproval();
  const { mutate: sync, isPending: syncing } = useSyncWATemplates();

  const templates: WhatsAppTemplate[] = data?.templates ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {templates.length} WhatsApp template
          {templates.length !== 1 ? "s" : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sync()}
            disabled={syncing}
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-1.5", syncing && "animate-spin")}
            />
            {syncing ? "Syncing..." : "Sync from Meta"}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditId(null);
              setCreate(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1.5" /> New template
          </Button>
        </div>
      </div>

      {/* Status guide */}
      <div
        className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50
        border border-amber-200 rounded-lg px-3 py-2"
      >
        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
        WhatsApp templates must be approved by Meta before use. Submit for
        approval after creating.
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-60 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl">
          <p className="text-3xl mb-3">💬</p>
          <p className="text-slate-400 mb-4">No WhatsApp templates yet</p>
          <Button variant="outline" onClick={() => setCreate(true)}>
            Create first template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((tpl) => {
            const sc = STATUS_CFG[tpl.status];
            const waC = WA_CATEGORY_CFG[tpl.waCategory];
            const Icon = sc.icon;

            return (
              <div
                key={tpl.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden
                  hover:shadow-sm hover:border-slate-300 transition-all group"
              >
                {/* WA green header */}
                <div className="h-1.5 bg-gradient-to-r from-green-400 to-green-600" />

                <div className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {tpl.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            sc.cls,
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <Icon className="h-2.5 w-2.5" />
                            {sc.label}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-medium px-2 py-0.5 rounded-full",
                            waC.bg,
                          )}
                        >
                          {waC.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Header preview */}
                  {tpl.headerType &&
                    tpl.headerType !== "NONE" &&
                    tpl.headerText && (
                      <p className="text-xs font-bold text-slate-800 mb-1">
                        {tpl.headerText}
                      </p>
                    )}

                  {/* Body */}
                  <div className="bg-green-50 rounded-xl rounded-tl-none p-3 mb-3">
                    <p className="text-xs text-slate-700 line-clamp-4 whitespace-pre-wrap">
                      {tpl.body}
                    </p>
                    {tpl.footer && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        {tpl.footer}
                      </p>
                    )}
                  </div>

                  {/* Buttons preview */}
                  {(tpl.buttons ?? []).length > 0 && (
                    <div className="space-y-1 mb-3">
                      {tpl.buttons!.map((btn, i) => (
                        <div
                          key={i}
                          className="text-center text-xs text-blue-600 border border-slate-200
                            rounded-lg py-1.5 font-medium"
                        >
                          {btn.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rejection reason */}
                  {tpl.rejectionReason && (
                    <p className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 mb-2">
                      Rejected: {tpl.rejectionReason}
                    </p>
                  )}

                  {/* Actions */}
                  <div
                    className="flex items-center justify-between pt-3
                    border-t border-slate-100"
                  >
                    <span className="text-[10px] text-slate-400">
                      {formatDate(tpl.updatedAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Submit for approval */}
                      {(tpl.status === "draft" ||
                        tpl.status === "rejected") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] text-green-700 border-green-200
                            hover:bg-green-50"
                          onClick={() => submit(tpl.id)}
                          disabled={submitting}
                        >
                          <Send className="h-3 w-3 mr-1" /> Submit
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7
                        opacity-0 group-hover:opacity-100"
                        onClick={() => setPreviewId(tpl.id)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7
                        opacity-0 group-hover:opacity-100"
                        onClick={() => {
                          setEditId(tpl.id);
                          setCreate(true);
                        }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600
                          opacity-0 group-hover:opacity-100"
                        onClick={() => setDeleteId(tpl.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <WATemplateFormModal
        open={showCreate}
        onClose={() => {
          setCreate(false);
          setEditId(null);
        }}
        editId={editId}
      />

      {previewId && (
        <WATemplatePreview
          templateId={previewId}
          onClose={() => setPreviewId(null)}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete WhatsApp template?</AlertDialogTitle>
            <AlertDialogDescription>
              If approved on Meta, it will not be removed from Meta — only from
              LeadPro.
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
