"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm } from "react-hook-form";

import { RichTextEditor } from "./Editor";

export function EmailTemplateFormModal({ open, onClose }: any) {
  const methods = useForm();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] !max-w-3xl w-full p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Create Email Template</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="flex flex-col flex-1 overflow-hidden">
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div>
                <label className="text-sm font-medium">Template name</label>
                <Input placeholder="Welcome email..." className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input placeholder="Subject line..." className="mt-1" />
              </div>

              {/* ✅ Editor */}
              <div className="border rounded-xl overflow-hidden h-[300px]">
                <RichTextEditor />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t bg-slate-50">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button>Create Template</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
