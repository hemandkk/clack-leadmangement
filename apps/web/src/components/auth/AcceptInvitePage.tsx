"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  acceptInviteSchema,
  type AcceptInviteInput,
} from "@leadpro/validators";
import { staffMgmtApi } from "@leadpro/api-client";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";

interface Props {
  token: string;
}

export function AcceptInvitePage({ token }: Props) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [inviteInfo, setInviteInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [done, setDone] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AcceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: { token },
  });

  useEffect(() => {
    if (!token) {
      setInvalid(true);
      setLoading(false);
      return;
    }
    staffMgmtApi
      .getInviteInfo(token)
      .then((res) => {
        setInviteInfo(res.data);
        setLoading(false);
      })
      .catch(() => {
        setInvalid(true);
        setLoading(false);
      });
  }, [token]);

  const onSubmit = async (data: AcceptInviteInput) => {
    const res = await staffMgmtApi.acceptInvite(data);
    const { user, tokens, features } = res.data;
    await setAuth(user, tokens.accessToken, features ?? {});
    // Set cookies
    document.cookie = `access_token=${tokens.accessToken}; path=/`;
    document.cookie = `user_role=${user.role}; path=/`;
    if (user.tenantId) document.cookie = `tenant_id=${user.tenantId}; path=/`;
    setDone(true);
    setTimeout(() => router.replace("/dashboard"), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div
          className="h-8 w-8 border-2 border-slate-900 border-t-transparent
          rounded-full animate-spin"
        />
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div
          className="bg-white rounded-2xl border border-slate-200 p-8 max-w-sm
          w-full text-center"
        >
          <p className="text-3xl mb-3">⚠️</p>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Invalid or expired invite
          </h2>
          <p className="text-sm text-slate-500">
            This invite link is invalid or has expired. Contact your manager to
            resend the invite.
          </p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div
          className="bg-white rounded-2xl border border-slate-200 p-8 max-w-sm
          w-full text-center"
        >
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Account created!
          </h2>
          <p className="text-sm text-slate-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div
        className="bg-white rounded-2xl border border-slate-200 p-8
        max-w-md w-full"
      >
        {/* Company / tenant info */}
        {inviteInfo?.tenantName && (
          <div
            className="flex items-center gap-3 mb-6 p-3 bg-blue-50
            border border-blue-200 rounded-xl"
          >
            <div
              className="h-10 w-10 rounded-lg bg-blue-600 flex items-center
              justify-center text-white font-bold shrink-0"
            >
              {inviteInfo.tenantName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">
                {inviteInfo.tenantName}
              </p>
              <p className="text-xs text-blue-600">
                You've been invited to join
              </p>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Set up your account
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Hi <strong>{inviteInfo?.name}</strong>! Create a password to activate
          your account.
        </p>

        {/* User info (read-only) */}
        <div className="bg-slate-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Name</span>
            <span className="font-medium">{inviteInfo?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Email</span>
            <span className="font-medium">{inviteInfo?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Role</span>
            <span className="font-medium capitalize">
              {inviteInfo?.role?.replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("token")} />

          <div>
            <Label>
              New password <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Input
                {...register("password")}
                type={showPwd ? "text" : "password"}
                placeholder="Min 8 chars, uppercase, number"
                className="pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-slate-400 hover:text-slate-600"
              >
                {showPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label>
              Confirm password <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("confirmPassword")}
              type="password"
              className="mt-1"
              placeholder="Re-enter password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password rules */}
          <div className="bg-slate-50 rounded-lg p-3 space-y-1">
            {[
              {
                label: "At least 8 characters",
                test: (p: string) => p.length >= 8,
              },
              {
                label: "One uppercase letter (A-Z)",
                test: (p: string) => /[A-Z]/.test(p),
              },
              {
                label: "One number (0-9)",
                test: (p: string) => /[0-9]/.test(p),
              },
            ].map((rule) => {
              const pwd = register("password");
              return (
                <p
                  key={rule.label}
                  className="text-xs flex items-center gap-1.5
                  text-slate-400"
                >
                  <span>•</span> {rule.label}
                </p>
              );
            })}
          </div>

          <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span
                  className="h-4 w-4 border-2 border-white/30 border-t-white
                  rounded-full animate-spin mr-2"
                />
                Setting up...
              </>
            ) : (
              "Activate my account"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
