'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user && user.role !== 'ADMINISTRATOR' && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user && user.role !== 'ADMINISTRATOR' && user.role !== 'admin') return null;

  const sidebarLinks = [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { name: 'Messages', icon: 'chat', path: '/admin/messages' },
    { name: 'Users', icon: 'group', path: '/admin/users' },
    { name: 'Courses', icon: 'school', path: '/admin/courses' },
    { name: 'Certificates', icon: 'workspace_premium', path: '/admin/certificates' },
    { name: 'Announcements', icon: 'campaign', path: '/admin/announcements' },
    { name: 'Analytics', icon: 'analytics', path: '/admin/analytics' },
    { name: 'Reports', icon: 'receipt_long', path: '/admin/reports' },
    { name: 'Settings', icon: 'settings_suggest', path: '/admin/settings' },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 overflow-x-hidden min-h-screen flex selection:bg-indigo-500/20 font-sans">
      
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="h-screen w-72 fixed left-0 top-0 bg-slate-50 border-r border-slate-200/80 z-50 flex flex-col py-8 px-5">
        <div className="mb-12 px-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
              A
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">Lumora</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Stewardship Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.name} href={link.path}>
                <div 
                  className={`w-full flex items-center px-4 py-3 rounded-2xl transition-colors duration-150 relative group overflow-hidden ${
                    isActive 
                      ? 'text-indigo-600 font-bold bg-indigo-50 border border-indigo-100' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined mr-4 relative z-10 text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", verticalAlign: 'middle' }}>{link.icon}</span>
                  <span className="text-sm relative z-10">{link.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm">
            <img className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" alt="Admin User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDB724ISuVK9wzGZOXljNO7BkVLd2Kf4yte-edBzZGuNDYfnwTO2ig8khUuxNUYadFI0YudWR0J-QnHFetLHh9713wbJiyaqNIQFjsWDXtKZ8qfHToyfqqjy9sN3_N3FtTWe7e7DcnflOzhQHg1sv9L079T7tqhvK__RLbrzONttnRlVazhv7UR1Ivk_jEZP1_3X_JSKU5X2cjwyzxCntJhgQ7A9hxVT-iWAQkLk3SPf7CS41q-zFch" />
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Admin User'}</p>
              <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{user?.email || 'admin@auramini.com'}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              router.push('/login');
              toast.success('Logged out successfully');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-2xl font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24" }}>logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CANVAS ---------------- */}
      <main className="ml-72 flex-1 min-h-screen pb-12">
        
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full h-20 flex justify-between items-center px-20 bg-slate-50/95 border-b border-slate-200/60">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 opacity-50"></div>
          
          <div className="flex items-center flex-1 relative z-10">
            <div className="relative w-96 max-w-full group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
              <input 
                className="w-full bg-white border border-slate-200/80 rounded-full pl-12 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm placeholder-slate-400" 
                placeholder="Search resources, users, or donations..." 
                type="text" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6 relative z-10">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:bg-slate-800 transition-all">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
              New Prayer Request
            </motion.button>
            <div className="flex items-center gap-2 text-slate-500">
              <button className="relative p-2.5 rounded-full hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>notifications</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-50"></span>
              </button>
              <button className="p-2.5 rounded-full hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chat_bubble</span>
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {children}

      </main>
    </div>
  );
}
