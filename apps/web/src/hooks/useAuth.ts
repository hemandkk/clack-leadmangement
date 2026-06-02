import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@leadpro/api-client";

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,

    onSuccess: () => {
      toast.success("OTP sent");
    },

    onError: () => {
      toast.error("Registration failed");
    },
  });
}
export function useVerifyOtp() {
  return useMutation({
    mutationFn: authApi.verifyOtp,

    onSuccess: () => {
      toast.success("OTP verified");
    },

    onError: () => {
      toast.error("Invalid OTP");
    },
  });
}
export function useSetupTenant() {
  return useMutation({
    mutationFn: authApi.setupTenant,

    onSuccess: () => {
      toast.success("Setup complete");
    },

    onError: () => {
      toast.error("Setup failed");
    },
  });
}
