'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  LayoutDashboard, BookOpen, Users, Heart, Calendar, 
  FolderOpen, Award, Bell, Settings, LogOut, GraduationCap,
  ChevronRight, Menu, X, Sparkles, ShieldCheck, Flame, Radio, Mail
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { href: '/messages', label: 'Messages', icon: Mail, badge: 'New' },
  { href: '/academy', label: 'Academy', icon: BookOpen, badge: 'Live' },
  { href: '/mentorship', label: 'Mentorship', icon: Users, badge: null },
  { href: '/community', label: 'Community', icon: GraduationCap, badge: 'Hot' },
  { href: '/prayer', label: 'Prayer Center', icon: Heart, badge: '3' },
  { href: '/events', label: 'Events & Summits', icon: Calendar, badge: null },
  { href: '/resources', label: 'Resource Hub', icon: FolderOpen, badge: null },
  { href: '/certificates', label: 'Certificates', icon: Award, badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ---------------- MOBILE TOGGLE ---------------- */}
      <button 
        onClick={() => setMobileOpen(!mobileOpen)} 
        className="fixed top-4 left-4 z-50 md:hidden p-3 bg-white/90 backdrop-blur-lg border border-slate-200 shadow-xl rounded-2xl text-slate-800 hover:bg-white transition-all active:scale-95"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ---------------- SIDEBAR CONTAINER (2026 SAAS) ---------------- */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-2xl border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-out shadow-2xl shadow-slate-900/5 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        
        {/* LOGO & BRANDING */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 flex items-center justify-center font-black text-white text-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-300">
                R
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-extrabold text-slate-900 tracking-tight text-lg group-hover:text-indigo-600 transition-colors">Lumora</p>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-tight">Ministry Ecosystem</p>
            </div>
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto scrollbar-hide">
          <div className="px-3 pb-2">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Platform Core</p>
          </div>

          {mainNavItems.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link 
                key={href} 
                href={href} 
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group ${
                  active 
                    ? 'text-indigo-600 bg-indigo-50/80 border border-indigo-100/80 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {active && (
                  <motion.div 
                    layoutId="activePill"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-500 to-sky-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={19} className={`transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-700'}`} />
                <span className="flex-1 truncate">{label}</span>
                {badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                    badge === 'Live' ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
                    badge === 'Hot' ? 'bg-amber-100 text-amber-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {badge}
                  </span>
                )}
                {active && <ChevronRight size={14} className="text-indigo-400" />}
              </Link>
            );
          })}

          {/* ROLE SPECIFIC SECTION */}
          {user?.role === 'ADMINISTRATOR' && (
            <div className="pt-6">
              <div className="px-3 pb-2">
                <p className="text-[10px] font-extrabold text-violet-500 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Admin Controls
                </p>
              </div>
              <Link 
                href="/admin" 
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  pathname.startsWith('/admin')
                    ? 'bg-violet-50 text-violet-700 border border-violet-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Settings size={19} className={pathname.startsWith('/admin') ? 'text-violet-600' : 'text-slate-400'} />
                <span className="flex-1 truncate">Admin Panel</span>
                <ChevronRight size={14} className="text-violet-400" />
              </Link>
            </div>
          )}

          {user?.role === 'MENTOR' && (
            <div className="pt-6">
              <div className="px-3 pb-2">
                <p className="text-[10px] font-extrabold text-teal-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} /> Mentor Portal
                </p>
              </div>
              <Link 
                href="/mentor" 
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  pathname.startsWith('/mentor')
                    ? 'bg-teal-50 text-teal-700 border border-teal-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Users size={19} className={pathname.startsWith('/mentor') ? 'text-teal-600' : 'text-slate-400'} />
                <span className="flex-1 truncate">Mentor Hub</span>
                <ChevronRight size={14} className="text-teal-400" />
              </Link>
            </div>
          )}
        </nav>

        {/* FOOTER USER CARD */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between px-2 py-1">
            <Link href="/notifications" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </Link>
            <Link href="/settings" className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-all">
              <Settings size={18} />
            </Link>
            <button 
              onClick={logout} 
              title="Sign Out"
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3 p-2.5 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-black text-sm shadow-md">
              {user?.profile?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">
                {user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user?.email || 'User'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.role?.toLowerCase() || 'student'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
