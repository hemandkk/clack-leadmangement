"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadSchema, type CreateLeadInput } from "@leadpro/validators";
import { useCreateLead } from "@/hooks/useLeads";
import { LeadSource } from "@leadpro/types";
import { useAuthStore } from "@/store/authStore";
import { LEAD_SOURCES } from "@leadpro/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Sub-components
import { ContactNumbersField } from "./form/ContactNumbersField";
import { ProductSelector } from "./form/ProductSelector";
import { OrganisationField } from "./form/OrganisationField";
import { SalesOwnerField } from "./form/SalesOwnerField";
import { cn } from "@leadpro/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<CreateLeadInput>;
}
const SECTIONS = "px-6";
export function CreateLeadModal({ open, onClose, defaultValues }: Props) {
  const { mutate: createLead, isPending } = useCreateLead();
  const currentUser = useAuthStore((s) => s.user);

  const methods = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      type: "new",
      priority: "medium",
      source: "manual",
      assignedTo: currentUser?.id,
      productIds: [],
      contactNumbers: [{ number: "", label: "mobile", isPrimary: true }],
      ...defaultValues,
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  // Reset when opened
  useEffect(() => {
    if (open) {
      reset({
        type: "new",
        priority: "medium",
        source: "manual",
        assignedTo: currentUser?.id,
        productIds: [],
        contactNumbers: [{ number: "", label: "mobile", isPrimary: true }],
        ...defaultValues,
      });
    }
  }, [open]);
  {
    /* <form
  onSubmit={handleSubmit(
    (data) => {
      console.log("SUCCESS", data);
    },
    (errors) => {
      console.log("ERRORS", errors);
    }
  )}
> */
  }
  const onSubmit = (data: CreateLeadInput) => {
    console.log("dataaaaa", data);
    createLead(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };
  const leadType = watch("type");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] !max-w-3xl w-full p-0 gap-0 overflow-hidden pb-4">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-bold">Add new lead</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[75vh] overflow-y-auto px-6 pb-6 ">
              <div className="py-5 space-y-6 ">
                {/* ── Section 1: Basic info ──────────────────── */}

                <div className={cn(SECTIONS, "space-y-4")}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Basic information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3">
                    {/* Full name */}
                    <div>
                      <Label>
                        Full name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("name")}
                        className="mt-1"
                        placeholder="John Doe"
                        autoFocus
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label>
                        Email
                        <span className="ml-1 text-xs font-normal text-slate-400">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        {...register("email")}
                        type="email"
                        className="mt-1"
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact numbers — full component */}
                  <ContactNumbersField />
                </div>

                {/* ── Divider ───────────────────────────────── */}
                <div className="border-t border-slate-100" />

                {/* ── Section 2: Lead details ───────────────── */}
                <div className={cn(SECTIONS, "space-y-4")}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Lead details
                  </p>

                  {/* Type — Radio style */}
                  <div>
                    <Label>
                      Lead type
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        (optional)
                      </span>
                    </Label>
                    <div className="flex gap-3 mt-1.5">
                      {(
                        [
                          {
                            value: "new",
                            label: "New customer",
                            desc: "First time enquiry",
                            icon: "✨",
                          },
                          {
                            value: "existing",
                            label: "Existing customer",
                            desc: "Has purchased before",
                            icon: "🔄",
                          },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setValue("type", opt.value, { shouldDirty: true })
                          }
                          className={cn(
                            "flex-1 flex items-start gap-2.5 p-3 rounded-xl border-2",
                            "text-left transition-all",
                            leadType === opt.value
                              ? "border-slate-900 bg-slate-50"
                              : "border-slate-200 hover:border-slate-300 bg-white",
                          )}
                        >
                          {/* Custom radio circle */}
                          <div
                            className={cn(
                              "mt-0.5 h-4 w-4 rounded-full border-2 shrink-0",
                              "flex items-center justify-center",
                              leadType === opt.value
                                ? "border-slate-900 bg-slate-900"
                                : "border-slate-300",
                            )}
                          >
                            {leadType === opt.value && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "text-sm font-semibold",
                                leadType === opt.value
                                  ? "text-slate-900"
                                  : "text-slate-600",
                              )}
                            >
                              {opt.icon} {opt.label}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Source + Priority row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>
                        Source <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        defaultValue="manual"
                        onValueChange={(v) =>
                          setValue("source", v as LeadSource, {
                            shouldDirty: true,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEAD_SOURCES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.source && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.source.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Priority</Label>
                      <Select
                        defaultValue="medium"
                        onValueChange={(v) =>
                          setValue("priority", v as "low" | "medium" | "high", {
                            shouldDirty: true,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-red-500" />
                              High
                            </span>
                          </SelectItem>
                          <SelectItem value="medium">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-yellow-400" />
                              Medium
                            </span>
                          </SelectItem>
                          <SelectItem value="low">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-slate-400" />
                              Low
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Expected closure date + Deal value row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>
                        Expected closure date
                        <span className="ml-1 text-xs font-normal text-slate-400">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        {...register("expectedClosureDate")}
                        type="date"
                        className="mt-1"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div>
                      <Label>
                        Deal value (₹)
                        <span className="ml-1 text-xs font-normal text-slate-400">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        {...register("value", { valueAsNumber: true })}
                        type="number"
                        min={0}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Divider ───────────────────────────────── */}
                <div className="border-t border-slate-100" />

                {/* ── Section 3: Assignment ─────────────────── */}
                <div className={cn(SECTIONS, "space-y-4")}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Assignment
                  </p>

                  {/* Sales owner — role-aware */}
                  <SalesOwnerField />
                </div>

                {/* ── Divider ───────────────────────────────── */}
                <div className="border-t border-slate-100" />

                {/* ── Section 4: Organisation & Products ───── */}
                <div className={cn(SECTIONS, "space-y-4")}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Organisation & products
                  </p>

                  <OrganisationField />
                  <ProductSelector />
                </div>

                {/* ── Divider ───────────────────────────────── */}
                <div className="border-t border-slate-100" />

                {/* ── Section 5: Notes ─────────────────────── */}
                <div className={cn(SECTIONS, "space-y-4")}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Additional info
                  </p>

                  <div>
                    <Label>
                      Notes
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      {...register("notes")}
                      className="mt-1 resize-none"
                      rows={3}
                      placeholder="Any context, requirements, or background info..."
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-6 py-2
              border-t border-slate-100 bg-slate-50"
            >
              <p className="text-xs text-slate-400">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create lead"}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
