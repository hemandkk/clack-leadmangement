"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@leadpro/api-client";
import { RegisterStep } from "@leadpro/types";
import { RegisterFormStep } from "./registerSteps/RegisterFormStep";
import { OTPFormStep } from "./registerSteps/OTPFormStep";
import { OnboardingStep } from "./registerSteps/OnboardingStep";
import { useRegisterStore } from "@/store/registerStore";
import { useRegister } from "@/hooks/useAuth";
import {
  type RegisterInput,
  type RegisterOTPInput,
  type SetupTenantInput,
} from "@leadpro/validators";
import { getApiErrorMessage } from "@/lib/apiError";
export function RegisterFormShell() {
  const router = useRouter();
  const {
    step,
    setStep,
    registerData,
    setRegisterData,
    onboardingToken,
    setOnboardingToken,
    reset,
  } = useRegisterStore();

  const registerMutation = useRegister();

  // STEP 1 → REGISTER
  const handleRegister = async (data: RegisterInput) => {
    try {
      await authApi.register(data);

      setRegisterData(data);
      setStep(RegisterStep.VERIFY_OTP);

      toast.success("OTP sent successfully");
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Register failed"));
    }
  };

  const handleRegister1 = async (data: RegisterInput) => {
    await registerMutation.mutateAsync(data);
    setStep(RegisterStep.VERIFY_OTP);
  };

  // STEP 2 → VERIFY OTP
  const handleVerifyOTP = async (data: RegisterOTPInput) => {
    try {
      const res = await authApi.verifyOtp(data);
      setOnboardingToken(res.data.onboarding_token);
      setStep(RegisterStep.ONBOARD);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Invalid OTP"));
    }
  };

  const handleResendOTP = async (data: RegisterOTPInput) => {
    try {
      const res = await authApi.verifyOtp(data);
      setOnboardingToken(res.data.onboarding_token);
      setStep(RegisterStep.ONBOARD);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to resend OTP"));
    }
  };

  // STEP 3 → ONBOARD

  const handleOnboard = async (data: SetupTenantInput) => {
    try {
      const res = await authApi.setupTenant(data);
      toast.success("Account setup complete");
      const subdomain = res.data.tenant_subdomain;
      const isDev = window.location.hostname.includes("localhost");
      const url = isDev
        ? `http://${subdomain}.lvh.me:3000/login`
        : `https://${subdomain}.yourdomain.com/login`;

      window.location.href = url;
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Onboarding failed"));
    }
  };

  if (step === RegisterStep.ONBOARD && !onboardingToken) {
    setStep(RegisterStep.REGISTER);
  }
  return (
    <>
      {step === RegisterStep.REGISTER && (
        <RegisterFormStep onSubmit={handleRegister} />
      )}

      {step === RegisterStep.VERIFY_OTP && (
        <OTPFormStep
          onSubmit={handleVerifyOTP}
          reSendOTP={handleResendOTP}
          onBack={() => setStep(RegisterStep.REGISTER)}
        />
      )}

      {step === RegisterStep.ONBOARD && (
        <OnboardingStep
          onSubmit={handleOnboard}
          onBack={() => setStep(RegisterStep.VERIFY_OTP)}
        />
      )}
    </>
  );
}
