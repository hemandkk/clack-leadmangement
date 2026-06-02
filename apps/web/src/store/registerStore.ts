import { create } from "zustand";
import { RegisterStep } from "@leadpro/types";
import type { RegisterInput } from "@leadpro/validators";

type RegisterState = {
  step: RegisterStep;
  registerData: RegisterInput | null;
  onboardingToken: string | null;

  setStep: (step: RegisterStep) => void;
  setRegisterData: (data: RegisterInput) => void;
  setOnboardingToken: (token: string) => void;
  reset: () => void;
};

export const useRegisterStore = create<RegisterState>((set) => ({
  step: RegisterStep.ONBOARD,
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
}));
