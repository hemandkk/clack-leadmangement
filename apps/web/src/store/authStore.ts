import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthTokens, TenantFeatureMap } from "@leadpro/types";
import type { Feature } from "@leadpro/types";
import { setAuthToken /* setTenantId */ } from "@leadpro/api-client";

interface AuthStore {
  user: Partial<User> | null;
  tokens: AuthTokens | null;
  features?: Partial<TenantFeatureMap>;
  isAuthenticated: boolean;

  setAuth: (
    user: User,
    tokens: AuthTokens,
    features?: Partial<TenantFeatureMap>,
  ) => void;
  clearAuth: () => void;
  //hasFeature?: (feature: Feature) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      features: {},
      isAuthenticated: false,

      setAuth: (user, tokens, features) => {
        setAuthToken(tokens.accessToken);
        //setTenantId(user.tenantId ?? null);
        set({ user, tokens, features, isAuthenticated: true });
      },

      clearAuth: () => {
        setAuthToken(null);
        //setTenantId(null);
        set({ user: null, tokens: null, features: {}, isAuthenticated: false });
      },

      //hasFeature: (feature) => get().features[feature] === true,
    }),
    {
      name: "leadpro-auth",
      // Only persist what you need — never persist sensitive tokens to localStorage in prod
      // Use httpOnly cookies for tokens in production
      partialize: (state) => ({
        user: state.user,
        features: state.features,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
