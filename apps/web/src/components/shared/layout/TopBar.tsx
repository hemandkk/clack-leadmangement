"use client";

import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@leadpro/api-client";
import { Button } from "@/components/ui/button";
//import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopBar() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    clearAuth();
    document.cookie = "access_token=; Max-Age=0; path=/";
    document.cookie = "user_role=; Max-Age=0; path=/";
    document.cookie = "tenant_id=; Max-Age=0; path=/";
    router.push("/login");
  };

  return (
    <header className="h-16 border-b  border-slate-200 bg-white flex items-center justify-end px-6 gap-3">
      <Button variant="ghost" size="icon" className="cursor-pointer">
        <Bell className="h-4 w-4" />
      </Button>
      {/* <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs bg-slate-900 text-white">
          {user?.name?.charAt(0).toUpperCase() ?? 'U'}
        </AvatarFallback>
      </Avatar> */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="cursor-pointer"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </header>
  );
}
