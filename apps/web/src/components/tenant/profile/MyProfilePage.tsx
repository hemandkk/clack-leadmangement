"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  type UpdateProfileInput,
  MOBILE_PREFIXES,
} from "@leadpro/validators";
import {
  useMyProfile,
  useUpdateMyProfile,
  useChangePassword,
} from "@/hooks/useStaffManagement";
import { useAuthStore } from "@/store/authStore";
import { staffMgmtApi } from "@leadpro/api-client";
import { PermissionMatrix } from "@/components/tenant/staff/PermissionMatrix";
import { SettingsCard } from "@/components/tenant/settings/SettingsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import type { PermissionKey } from "@leadpro/types";

export function MyProfilePage() {
  const { data, isLoading } = useMyProfile();
  const { mutate: save, isPending } = useUpdateMyProfile();
  const { mutate: changePwd, isPending: changingPwd } = useChangePassword();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [uploading, setUploading] = useState(false);

  const profile = data?.profile;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
  });

  const pwdForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        mobilePrefix: profile.mobilePrefix ?? "+91",
        phone: profile.phone ?? "",
        designation: profile.designation ?? "",
        department: profile.department ?? "",
      });
      setAvatarPreview(profile.avatar);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      await staffMgmtApi.uploadAvatar(fd);
      toast.success("Profile photo updated");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmitProfile = (d: UpdateProfileInput) => save(d);

  const onSubmitPassword = (d: any) => {
    if (d.newPassword !== d.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    changePwd(d, { onSuccess: () => pwdForm.reset() });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">My profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your personal details
        </p>
      </div>

      {/* Avatar */}
      <SettingsCard title="Profile photo">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              className="h-20 w-20 rounded-2xl bg-slate-900 flex items-center
              justify-center text-white text-2xl font-bold overflow-hidden"
            >
              {avatarPreview ? (
                <img src={avatarPreview} className="h-20 w-20 object-cover" />
              ) : (
                profile?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full
                bg-white border-2 border-slate-200 flex items-center justify-center
                hover:bg-slate-50 shadow-sm"
              disabled={uploading}
            >
              <Camera className="h-3.5 w-3.5 text-slate-600" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{profile?.name}</p>
            <p className="text-sm text-slate-400">{profile?.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              JPG, PNG or GIF · max 2MB
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* Personal info */}
      <form onSubmit={handleSubmit(onSubmitProfile)}>
        <SettingsCard title="Personal information">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Full name</Label>
              <Input {...register("name")} className="mt-1" />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <Label>Mobile number</Label>
              <div className="flex gap-2 mt-1">
                <Select
                  defaultValue={profile?.mobilePrefix ?? "+91"}
                  onValueChange={(v) =>
                    setValue("mobilePrefix", v, { shouldDirty: true })
                  }
                >
                  <SelectTrigger className="w-36 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOBILE_PREFIXES.map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        <span className="font-mono">{p.code}</span>
                        <span className="text-slate-400 ml-2 text-xs">
                          {p.country}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  {...register("phone")}
                  type="tel"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div>
              <Label>Designation</Label>
              <Input
                {...register("designation")}
                className="mt-1"
                placeholder="Sales Executive"
              />
            </div>
            <div>
              <Label>Department</Label>
              <Input
                {...register("department")}
                className="mt-1"
                placeholder="Sales"
              />
            </div>

            {/* Read-only fields */}
            <div>
              <Label>Email</Label>
              <Input
                value={profile?.email ?? ""}
                readOnly
                className="mt-1 bg-slate-50"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={profile?.role?.replace(/_/g, " ") ?? ""}
                readOnly
                className="mt-1 bg-slate-50 capitalize"
              />
            </div>
          </div>
        </SettingsCard>

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={!isDirty || isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>

      {/* My permissions (read-only view) */}
      {profile?.permissions && (
        <SettingsCard
          title="My permissions"
          description="Assigned by your manager — contact them to change"
        >
          <PermissionMatrix
            value={profile.permissions as PermissionKey[]}
            onChange={() => {}}
            disabled
          />
        </SettingsCard>
      )}

      {/* Change password */}
      <form onSubmit={pwdForm.handleSubmit(onSubmitPassword)}>
        <SettingsCard title="Change password">
          <div className="space-y-3">
            <div>
              <Label>Current password</Label>
              <Input
                {...pwdForm.register("currentPassword")}
                type="password"
                className="mt-1"
                autoComplete="current-password"
              />
            </div>
            <div>
              <Label>New password</Label>
              <Input
                {...pwdForm.register("newPassword")}
                type="password"
                className="mt-1"
                autoComplete="new-password"
              />
              <p className="text-xs text-slate-400 mt-1">
                Min 8 chars, one uppercase, one number
              </p>
            </div>
            <div>
              <Label>Confirm new password</Label>
              <Input
                {...pwdForm.register("confirmPassword")}
                type="password"
                className="mt-1"
                autoComplete="new-password"
              />
            </div>
          </div>
        </SettingsCard>

        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={changingPwd} variant="outline">
            {changingPwd ? "Changing..." : "Change password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
