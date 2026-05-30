"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
export function OnboardingStep({ onSubmit, onBack }: any) {
  const { register, handleSubmit, watch, setValue } = useForm();

  const orgName = watch("organization_name");
  const subdomain = watch("subdomain");

  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const debouncedSubdomain = useDebounce(subdomain, 500);

  // auto-generate subdomain
  useEffect(() => {
    if (!orgName) return;

    const generated = orgName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    setValue("subdomain", generated);
  }, [orgName, setValue]);

  // check availability
  useEffect(() => {
    if (!debouncedSubdomain) return;

    const check = async () => {
      try {
        setStatus("checking");

        const res = await authApi.checkSubdomain(debouncedSubdomain);

        setStatus(res.data.available ? "available" : "taken");
      } catch {
        setStatus("idle");
      }
    };

    check();
  }, [debouncedSubdomain]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("organization_name")}
        placeholder="Organization Name"
      />

      <Input {...register("subdomain")} placeholder="Subdomain" />

      {/* Status UI */}
      <p className="text-sm mt-1">
        {status === "checking" && "Checking..."}
        {status === "available" && "✅ Available"}
        {status === "taken" && "❌ Already taken"}
      </p>

      <Input
        type="number"
        {...register("expected_user_count")}
        placeholder="Expected Users"
      />

      <button disabled={status === "taken"}>Complete Setup</button>

      <button type="button" onClick={onBack}>
        Back
      </button>
    </form>
  );
}
