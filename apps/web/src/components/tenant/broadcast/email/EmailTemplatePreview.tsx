"use client";

import { useEmailTemplate } from "@/hooks/useBroadcast";
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

export function EmailTemplatePreview({ templateId, onClose }: Props) {
  const { data, isLoading } = useEmailTemplate(templateId);
  const tpl = data?.template;

  // Fill preview variables with sample data
  const preview = tpl?.bodyHtml
    ?.replace(/\{\{lead_name\}\}/g, "John Doe")
    ?.replace(/\{\{lead_phone\}\}/g, "+91 98765 43210")
    ?.replace(/\{\{lead_email\}\}/g, "john@example.com")
    ?.replace(/\{\{staff_name\}\}/g, "Your Name")
    ?.replace(/\{\{company_name\}\}/g, "LeadPro")
    ?.replace(/\{\{follow_up_date\}\}/g, "15 Jan 2025")
    ?.replace(/\{\{product_name\}\}/g, "Premium Plan")
    ?.replace(/\{\{invoice_amount\}\}/g, "₹5,000")
    ?.replace(/\{\{appointment_time\}\}/g, "10:00 AM");

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preview: {tpl?.name}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="h-64 bg-slate-100 rounded animate-pulse" />
        ) : (
          <div className="space-y-3">
            {/* Email meta */}
            <div className="bg-slate-50 rounded-lg p-3 space-y-1 text-sm">
              <div className="flex gap-2">
                <span className="text-slate-400 w-16">From:</span>
                <span className="text-slate-700">
                  {tpl?.fromName ?? "LeadPro"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-slate-400 w-16">Subject:</span>
                <span className="font-medium text-slate-800">
                  {tpl?.subject}
                </span>
              </div>
              {tpl?.previewText && (
                <div className="flex gap-2">
                  <span className="text-slate-400 w-16">Preview:</span>
                  <span className="text-slate-500 italic text-xs">
                    {tpl.previewText}
                  </span>
                </div>
              )}
            </div>

            {/* Email body rendered */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <div className="flex gap-1.5">
                  {["bg-red-400", "bg-yellow-400", "bg-green-400"].map((c) => (
                    <div key={c} className={`h-2.5 w-2.5 rounded-full ${c}`} />
                  ))}
                </div>
              </div>
              <div
                className="p-6 prose prose-sm max-w-none max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: preview ?? "" }}
              />
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
