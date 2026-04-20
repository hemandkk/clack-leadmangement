'use client';

import { useUIStore } from '@/store/uiStore';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? '240px' : '64px' }}
      >
        <TopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}