"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadSchema, type CreateLeadInput } from "@leadpro/validators";
import { useCreateLead } from "@/hooks/useLeads";
import { LeadSource } from "@leadpro/types";
import { useAuthStore } from "@/store/authStore";
import { LEAD_SOURCES, LEAD_PRIORITY } from "@leadpro/utils";
import {
  UserRound,
  NotebookText,
  ClipboardPenLine,
  Phone,
  Store,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
import { FormSection } from "./form/FormSection";
const today = new Date().toISOString().split("T")[0];
interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<CreateLeadInput>;
}
const SECTIONS = "px-6";
export function CreateLeadSheet({ open, onClose, defaultValues }: Props) {
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[1200px] max-w-[90vw]  p-0 overflow-hidden"
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <SheetTitle className="text-lg font-bold">Add new lead</SheetTitle>
        </SheetHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[75vh] overflow-y-auto px-6 pb-6 ">
              <div className="py-5 space-y-6 ">
                {/* ── Section 1: Basic info ──────────────────── */}

                <div className={cn(SECTIONS, "space-y-4")}>
                  <FormSection title="Customer Details" icon={UserRound} />

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
                    {/* Full name */}
                    <div>
                      <Label>
                        Customer Name<span className="text-red-500">*</span>
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
                    {/* company_name */}
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        {...register("company_name")}
                        className="mt-1"
                        placeholder="Company Name"
                        autoFocus
                      />
                      {errors.company_name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.company_name.message}
                        </p>
                      )}
                    </div>
                    {/* Email */}
                    <div>
                      <Label>Email</Label>
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
                    {/* address */}
                    <div>
                      <Label>Address</Label>
                      <Input
                        {...register("address")}
                        type="text"
                        className="mt-1"
                        placeholder="Address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <ContactNumbersField />

                    <SalesOwnerField />
                  </div>

                  {/* Contact numbers — full component */}
                </div>

                {/* ── Divider ───────────────────────────────── */}
                <div className="border-t border-slate-100" />

                {/* ── Section 2: Lead details ───────────────── */}
                <div className={cn(SECTIONS, "space-y-4")}>
                  <FormSection title="Lead Infomation" icon={NotebookText} />
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
                        <SelectTrigger
                          className={cn(
                            "flex w-full items-center mt-1 justify-between ...",
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border shadow-lg p-2 bg-white">
                          {LEAD_SOURCES.map((s) => (
                            <SelectItem
                              key={s.value}
                              value={s.value}
                              className=" text-sm  font-medium py-2  px-3  rounded-md  hover:bg-slate-100  focus:bg-slate-100 "
                            >
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
                        <SelectTrigger
                          className={cn(
                            "flex w-full items-center mt-1 justify-between ...",
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border shadow-lg p-2 bg-white">
                          {LEAD_PRIORITY.map((s) => (
                            <SelectItem
                              key={s.value}
                              value={s.value}
                              className=" text-sm  font-medium py-2  px-3  rounded-md  hover:bg-slate-100  focus:bg-slate-100 "
                            >
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* Type — Radio style */}
                  <div>
                    <Label>Lead type</Label>
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
                            "flex-1 flex items-start gap-2.5 p-3 rounded-xl border-2 cursor-pointer",
                            "text-left transition-all",
                            leadType === opt.value
                              ? "border-primary/70 bg-slate-50"
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

                  {/* Expected closure date + Deal value row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Expected closure date</Label>
                      <Input
                        {...register("expectedClosureDate")}
                        type="date"
                        className="mt-1"
                        min={today}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value < today) {
                            e.target.value = today;
                            setValue("expectedClosureDate", today);
                          }
                        }}
                      />
                    </div>

                    <div>
                      <Label>Deal value (₹)</Label>
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

                {/* ── Section 4: Organisation & Products ───── */}
                <div className={cn(SECTIONS, "space-y-4")}>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider"></p>
                  <FormSection title="Organisation & products" icon={Store} />
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
                    <OrganisationField />
                    <ProductSelector />
                  </div>
                </div>

                {/* ── Divider ───────────────────────────────── */}
                <div className="border-t border-slate-100" />

                {/* ── Section 5: Notes ─────────────────────── */}
                <div className={cn(SECTIONS, "space-y-4")}>
                  <FormSection
                    title=" Additional info"
                    icon={ClipboardPenLine}
                  />
                  <div>
                    <Label>Notes</Label>
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
            <div className="sticky  bottom-0  border-t  bg-white  px-8  py-4 flex  justify-end gap-2 ">
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
      </SheetContent>
    </Sheet>
  );
}
