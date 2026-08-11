'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Sidebar } from '@/components/Sidebar';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useRequireAuth();
  const { user } = useAuthStore();
  const router = useRouter();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role?.toUpperCase();
      if (role === 'ADMINISTRATOR' || role === 'ADMIN' || role === 'MENTOR') {
        setHasOnboarded(true);
        return;
      }
      const requireOnboarding = localStorage.getItem('lumora_require_onboarding') === 'true';
      if (requireOnboarding) {
        setHasOnboarded(false);
        router.replace('/onboarding');
      } else {
        setHasOnboarded(true);
      }
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) return null;
  if (hasOnboarded === null) return null;
  if (!hasOnboarded) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 md:ml-72 min-h-screen w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
