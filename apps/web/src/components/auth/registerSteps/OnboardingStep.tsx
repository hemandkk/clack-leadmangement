"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { authApi } from "@leadpro/api-client";
import { setupTenantSchema, type SetupTenantInput } from "@leadpro/validators";
import { ArrowLeft } from "lucide-react";

interface Props {
  onSubmit: (data: SetupTenantInput) => void | Promise<void>;
  onBack: () => void;
}

export function OnboardingStep({ onSubmit, onBack }: Props) {
  const { register, handleSubmit, control, setValue } =
    useForm<SetupTenantInput>({
      resolver: zodResolver(setupTenantSchema),
    });
  const [subdomainEdited, setSubdomainEdited] = useState(false);
  const orgName = useWatch({
    control,
    name: "organization_name",
  });

  const subdomain = useWatch({
    control,
    name: "subdomain",
  });

  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const debouncedSubdomain = useDebounce(subdomain, 500);

  // auto-generate subdomain

  useEffect(() => {
    if (!orgName || subdomainEdited) return;

    const generated = orgName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    setValue("subdomain", generated);
  }, [orgName, subdomainEdited, setValue]);
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

  const handleSetup = async (data: SetupTenantInput) => {
    const res = await authApi.setupTenant(data);

    const subdomain = res.data.tenant_subdomain;

    window.location.href = `https://${subdomain}.yourapp.com/login`;
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Input
          {...register("organization_name")}
          placeholder="Organization Name"
        />
      </div>
      <div className="mb-4">
        <Input
          {...register("subdomain")}
          placeholder="Subdomain"
          onChange={(e) => {
            setSubdomainEdited(true);
            setValue("subdomain", e.target.value);
          }}
        />
        {/* Status UI */}
        <p className="text-sm mt-1">
          {status === "checking" && "Checking..."}
          {status === "available" && "✅ Available"}
          {status === "taken" && "❌ Already taken"}
        </p>
      </div>
      <div className="mb-4">
        <Input
          type="number"
          {...register("expected_user_count", { valueAsNumber: true })}
          placeholder="Expected Users"
        />
      </div>
      <button
        className="w-full bg-orange-500 text-white py-2 rounded-md font-medium cursor-pointer"
        disabled={status === "taken"}
      >
        Complete Setup
      </button>

      {/* Back */}

      <button
        type="button"
        onClick={onBack}
        className="mt-4 flex items-center gap-1 text-sm text-gray-600 hover:text-black cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>
    </form>
  );
}
