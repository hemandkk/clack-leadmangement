"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@leadpro/validators";
import { PHONE_PREFIXES } from "@leadpro/utils";
import { authApi } from "@leadpro/api-client";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    //watch,//It lets you read form values in real-time
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    defaultValues: {
      mobile: "",
      password: "",
      name: "",
      mobile_prefix: "+91",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await authApi.register(data);

      const { access_token, user /* features */, expires_in } = res.data;

      // Role-based redirect
      if (user.role === "super_admin") {
        router.push("/super-admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.log("err", JSON.stringify(err));
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Login failed. Please check your credentials.";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Full Name</label>

        <Input
          placeholder="Enter Full Name"
          id="name"
          type="text"
          {...register("name")}
          className="mt-1"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      {/* Email */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Email</label>

        <Input
          placeholder="test@test.com"
          id="email"
          type="email"
          {...register("email")}
          className="mt-1"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      {/* Mobile */}

      <div className="mb-4">
        <label className="text-sm text-gray-600">Mobile Number</label>
        <div className="flex mt-1">
          <select
            {...register("mobile_prefix")}
            className="px-3 py-2 border rounded-l-md text-gray-500"
          >
            {PHONE_PREFIXES.map((p) => (
              <option key={p.code} value={p.code}>
                {p.code}
              </option>
            ))}
          </select>

          <Input
            id="mobile"
            type="number"
            placeholder="Enter mobile number"
            {...register("mobile")}
            className="mt-1"
          />
        </div>
        {errors.mobile_prefix && (
          <p className="text-red-500 text-xs mt-1">
            {errors.mobile_prefix.message}
          </p>
        )}
        {errors.mobile && (
          <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Password</label>

        <Input
          placeholder="Enter password"
          id="password"
          type="password"
          {...register("password")}
          className="mt-1"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>
      {/* Confirm Password */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Confirm Password</label>

        <Input
          placeholder="Enter password"
          id="password_confirmation"
          type="password"
          {...register("password_confirmation")}
          className="mt-1"
        />
        {errors.password_confirmation && (
          <p className="text-red-500 text-xs mt-1">
            {errors.password_confirmation.message}
          </p>
        )}
      </div>

      <button
        className="w-full bg-orange-500 text-white py-2 rounded-md font-medium cursor-pointer"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
}
