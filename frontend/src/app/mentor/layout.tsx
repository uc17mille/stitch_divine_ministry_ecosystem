'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user && user.role !== 'MENTOR') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (user && user.role !== 'MENTOR') return null;

  const sidebarLinks = [
    { name: 'Dashboard', icon: 'space_dashboard', path: '/mentor' },
    { name: 'Academy Courses', icon: 'menu_book', path: '/mentor/courses' },
    { name: 'Messages', icon: 'chat', path: '/mentor/messages' },
    { name: 'My Students', icon: 'school', path: '/mentor/students' },
    { name: 'Schedule', icon: 'calendar_month', path: '/mentor/schedule' },
    { name: 'Mentorship Tracks', icon: 'route', path: '/mentor/tracks' },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 overflow-x-hidden min-h-screen flex selection:bg-teal-500/20 font-sans">
      
      {/* ---------------- SIDEBAR (2026 SAAS) ---------------- */}
      <aside className="h-screen w-72 fixed left-0 top-0 bg-white/95 backdrop-blur-2xl border-r border-slate-200/80 z-50 flex flex-col py-6 px-4 shadow-xl shadow-slate-900/5">
        
        {/* LOGO */}
        <div className="mb-8 px-3">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform duration-300">
                M
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-teal-600 transition-colors">Lumora</h1>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100 rounded-md">
                  HUB
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Mentor Portal</p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
          <div className="px-3 pb-2">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Mentor Portal</p>
          </div>

          {sidebarLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.name} href={link.path}>
                <div 
                  className={`w-full flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 relative group overflow-hidden ${
                    isActive 
                      ? 'text-teal-700 font-extrabold bg-teal-50/80 border border-teal-100/80 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="mentorActivePill"
                      className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`material-symbols-outlined mr-3.5 text-[20px] transition-colors ${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-700'}`} style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24", verticalAlign: 'middle' }}>{link.icon}</span>
                  <span className="text-sm truncate relative z-10">{link.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER PROFILE */}
        <div className="mt-auto pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-xs shadow-md">
              {user?.profile?.firstName?.[0] || 'M'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-black text-slate-900 truncate">{user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Dr. Elias Thorne'}</p>
              <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">{user?.email || 'mentor@auramini.com'}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              router.push('/login');
              toast.success('Logged out successfully');
            }}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl font-bold text-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24" }}>logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CANVAS ---------------- */}
      <main className="ml-72 flex-1 min-h-screen pb-12">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-40 w-full h-20 flex justify-between items-center px-10 lg:px-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
          <div className="flex items-center flex-1 relative z-10">
            <div className="relative w-96 max-w-full group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-12 pr-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all shadow-inner placeholder-slate-400" 
                placeholder="Search students, sessions, or tracks..." 
                type="text" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-2.5 rounded-full font-extrabold text-xs shadow-md hover:shadow-lg shadow-teal-500/20 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24" }}>event</span>
              Schedule Session
            </motion.button>
            
            <div className="flex items-center gap-1 text-slate-500 border-l border-slate-200 pl-4">
              <button className="relative p-2.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>notifications</span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button className="p-2.5 rounded-full hover:bg-slate-100 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chat_bubble</span>
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
