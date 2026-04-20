"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@leadpro/validators";
import { PHONE_PREFIXES } from "@leadpro/utils";
import { authApi } from "@leadpro/api-client";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const {
    register,
    handleSubmit,
    //watch,//It lets you read form values in real-time
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    defaultValues: {
      mobile: "",
      password: "",
      mobile_prefix: "+91",
    },
    resolver: zodResolver(loginSchema),
  });
  //const email = watch('email');console.log(email);
  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await authApi.login(data);
      console.log("resss", res.data);
      const { access_token, user /* features */ } = res.data;
      if (!access_token) {
        throw new Error("Invalid token response");
      }
      // Store in Zustand
      setAuth(user, access_token /* , features */);

      // Set cookies for middleware (in production use httpOnly cookies via API)
      document.cookie = `access_token=${access_token}; path=/`;
      document.cookie = `user_role=${user.role}; path=/`;
      if (user.tenantId) {
        document.cookie = `tenant_id=${user.tenantId}; path=/`;
      }

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

          {errors.mobile && (
            <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
          )}
        </div>
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

      <div className="text-right text-xs text-gray-500 mb-4 cursor-pointer">
        Forgot Password?
      </div>

      <button
        className="w-full bg-orange-500 text-white py-2 rounded-md font-medium cursor-pointer"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-xs mt-4 text-gray-500">
        Don't have an account?{" "}
        <span className="text-orange-500 cursor-pointer">Signup</span>
      </p>
    </form>
  );
}
