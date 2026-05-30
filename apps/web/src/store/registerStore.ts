import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum RegisterStep {
  REGISTER = "REGISTER",
  VERIFY_OTP = "VERIFY_OTP",
  ONBOARD = "ONBOARD",
}
type RegisterData = {
  name: string;
  email: string;
  password: string;
  mobile_prefix: string;
  mobile: string;
  otp: string;
  onboardingToken: string;
  organization_name: string;
  subdomain: string;
  expected_user_count: number;
};
type RegisterState = {
  step: RegisterStep;
  registerData: RegisterData;
  onboardingToken: string | null;

  setStep: (step: RegisterStep) => void;
  setRegisterData: (data: any) => void;
  setOnboardingToken: (token: string) => void;
  reset: () => void;
};

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set) => ({
      step: RegisterStep.REGISTER,
      registerData: null,
      onboardingToken: null,

      setStep: (step) => set({ step }),
      setRegisterData: (data) => set({ registerData: data }),
      setOnboardingToken: (token) => set({ onboardingToken: token }),

      reset: () =>
        set({
          step: RegisterStep.REGISTER,
          registerData: null,
          onboardingToken: null,
        }),
    }),
    {
      name: "register-flow",
    },
  ),
);
