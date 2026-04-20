import { useAuthStore } from "@/store/authStore";
import type { Feature } from "@leadpro/types";

export function useFeature(feature: Feature): boolean {
  return true;
  // return useAuthStore((s) => s.hasFeature(feature));
}
