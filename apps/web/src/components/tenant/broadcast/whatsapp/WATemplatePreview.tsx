"use client";

import { useWATemplate } from "@/hooks/useBroadcast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  templateId: string;
  onClose: () => void;
}

export function WATemplatePreview({ templateId, onClose }: Props) {
  const { data, isLoading } = useWATemplate(templateId);
  const tpl = data?.template;

  const preview = tpl?.body
    ?.replace(/\{\{lead_name\}\}/g, "John Doe")
    ?.replace(/\{\{company_name\}\}/g, "LeadPro")
    ?.replace(/\{\{staff_name\}\}/g, "Your Name")
    ?.replace(/\{\{follow_up_date\}\}/g, "15 Jan 2025")
    ?.replace(/\{\{product_name\}\}/g, "Premium Plan");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Preview: {tpl?.name}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="h-40 bg-slate-100 rounded animate-pulse" />
        ) : (
          <div className="space-y-4">
            <div className="bg-[#e5ddd5] rounded-xl p-4">
              <div className="bg-white rounded-xl rounded-tl-none shadow-sm overflow-hidden">
                {tpl?.headerText && (
                  <div className="px-3 pt-3 pb-1">
                    <p className="font-bold text-sm">{tpl.headerText}</p>
                  </div>
                )}
                <div className="px-3 py-2">
                  <p className="text-sm whitespace-pre-wrap">{preview}</p>
                </div>
                {tpl?.footer && (
                  <div className="px-3 pb-2">
                    <p className="text-xs text-slate-400">{tpl.footer}</p>
                  </div>
                )}
                {(tpl?.buttons ?? []).length > 0 && (
                  <div className="border-t border-slate-100">
                    {tpl!.buttons!.map((btn, i) => (
                      <div
                        key={i}
                        className="text-center text-sm text-blue-500
                        py-2 border-b border-slate-100 last:border-0 font-medium"
                      >
                        {btn.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close preview
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
