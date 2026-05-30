"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@leadpro/api-client";
import { RegisterStep } from "@leadpro/types";
import { RegisterFormStep } from "./registerSteps/RegisterFormStep";
import { OTPFormStep } from "./registerSteps/OTPFormStep";
import { OnboardingStep } from "./registerSteps/OnboardingStep";
import { useRegisterStore } from "@/store/registerStore";
import {
  type RegisterInput,
  RegisterOTPInput,
  SetupTenantInput,
} from "@leadpro/validators";
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

  // STEP 1 → REGISTER
  const handleRegister = async (data: RegisterInput) => {
    try {
      await authApi.register(data);

      setRegisterData(data);
      setStep(RegisterStep.VERIFY_OTP);

      toast.success("OTP sent successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Register failed");
    }
  };

  // STEP 2 → VERIFY OTP
  const handleVerifyOTP = async (data: RegisterOTPInput) => {
    try {
      const res = await authApi.verifyOtp(data);
      setOnboardingToken(res.data.onboarding_token);
      setStep(RegisterStep.ONBOARD);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResendOTP = async (data: RegisterOTPInput) => {
    try {
      const res = await authApi.verifyOtp(data);
      setOnboardingToken(res.data.onboarding_token);
      setStep(RegisterStep.ONBOARD);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP");
    }
  };

  // STEP 3 → ONBOARD
  const handleOnboard = async (data: SetupTenantInput) => {
    try {
      await authApi.setupTenant(data);
      toast.success("Account setup complete");
      // Redirect to subdomain login
      router.push(`https://${data.subdomain}.yourdomain.com/login`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Onboarding failed");
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
