'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // 30-minute session timeout logic (1,800,000 ms)
    const SESSION_LIMIT = 30 * 60 * 1000;
    const { loginTime, logout } = useAuthStore.getState();

    if (loginTime) {
      const timeElapsed = Date.now() - loginTime;
      const timeLeft = SESSION_LIMIT - timeElapsed;

      if (timeLeft <= 0) {
        // Session already expired
        logout();
        router.replace('/login');
      } else {
        // Set a timer to automatically log out when 5 minutes is up
        const timeout = setTimeout(() => {
          logout();
          router.replace('/login');
        }, timeLeft);

        return () => clearTimeout(timeout);
      }
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
}
