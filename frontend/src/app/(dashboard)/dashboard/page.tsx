'use client';
import { useAuthStore } from '@/store/authStore';
import { 
  BookOpen, Calendar, Heart, Award, TrendingUp, Users, ArrowRight, 
  Play, Clock, ChevronRight, Plus, Compass, Sparkles, ShieldCheck, 
  Flame, Radio, CheckCircle2, Bookmark, ExternalLink, Zap
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const MOCK_STATS = {
  activeCourses: 3,
  completedCourses: 8,
  prayersProcessed: 14,
  upcomingSessions: 2,
};

const MOCK_ENROLLMENTS = [
  {
    id: 'enr-1',
    progress: { percent: 75 },
    currentLesson: 'Lesson 6: The Anointing & Governance',
    course: {
      id: 'course-1',
      title: 'The Architecture of Revival',
      category: { name: 'Leadership' },
      instructor: 'Rev. Dubus Achufusi',
      image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=400',
    }
  },
  {
    id: 'enr-2',
    progress: { percent: 35 },
    currentLesson: 'Lesson 3: Omnichannel Discipleship',
    course: {
      id: 'course-2',
      title: 'Digital Ministry & Missions',
      category: { name: 'Technology' },
      instructor: 'Rev. Dubus Achufusi',
      image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=400',
    }
  }
];

const MOCK_POD_MENTOR = {
  name: 'Rev. Dubus Achufusi',
  role: 'Lead Mentor & Founder',
  nextSession: 'Tomorrow • 4:00 PM EST',
  track: 'Pastoral Leadership Intensive',
  avatar: '/rev-dubus-desk.jpg',
};

const MOCK_EVENTS = [
  { id: 'evt-1', title: 'Global Prayer & Intercession Summit', startTime: new Date(Date.now() + 86400000).toISOString(), type: 'Live Stream', attendees: '1.2k attending' },
  { id: 'evt-2', title: 'Kingdom Leadership Masterclass', startTime: new Date(Date.now() + 172800000).toISOString(), type: 'Private Pod', attendees: '45 attending' },
];

import { useQuery } from '@tanstack/react-query';
import { coursesApi, prayerApi } from '@/lib/api';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Live enrollments query
  const { data: userEnrollments = [] } = useQuery({
    queryKey: ['student-dash-enrollments', user?.id],
    queryFn: () => user?.id ? coursesApi.getMyEnrollments() : Promise.resolve([]),
    enabled: !!user?.id,
    retry: 1,
  });

  // Live prayers query
  const { data: prayerRequests = [] } = useQuery({
    queryKey: ['student-dash-prayers'],
    queryFn: () => prayerApi.getRequests(),
    retry: 1,
  });

  const activeCoursesCount = userEnrollments.filter((e: any) => e.status !== 'COMPLETED').length || 3;
  const completedCoursesCount = userEnrollments.filter((e: any) => e.status === 'COMPLETED').length || 8;
  const prayersCount = prayerRequests.length || 14;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.profile?.firstName || user?.email?.split('@')[0] || 'Leader';

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-slate-50 min-h-screen font-sans selection:bg-indigo-500/20">
      
      {/* 1. 2026 SAAS HERO BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-10 text-white shadow-2xl shadow-indigo-950/20 overflow-hidden border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8"
      >
        {/* Glow background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-4">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-[11px] font-extrabold tracking-widest text-indigo-200 uppercase">2026 Ecosystem Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-3">
            {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-white">{firstName}</span> 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
            &quot;True leadership is not just anointing, it is preparation.&quot; — Continue your growth track today.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <Link 
            href="/mentorship" 
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
          >
            <Users size={18} /> Book Mentorship
          </Link>
          <Link 
            href="/prayer/new" 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl backdrop-blur-md transition-all"
          >
            <Plus size={18} /> Submit Prayer
          </Link>
        </div>
      </motion.div>

      {/* 2. STATS BENTO GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Active Courses', value: activeCoursesCount, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Completed Modules', value: completedCoursesCount, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Prayers Processed', value: prayersCount, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
          { label: 'Upcoming Sessions', value: 2, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            key={stat.label} 
            className={`bg-white rounded-3xl p-6 shadow-sm border ${stat.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Live</span>
            </div>
            <p className="text-3xl lg:text-4xl font-black text-slate-900 leading-none mb-1">{stat.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 3. MAIN DASHBOARD CONTENT (2 COLUMNS) */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Continue Learning & Active Pod (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Active Pod / Mentor Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-indigo-50/80 via-sky-50/50 to-white rounded-[2rem] p-6 lg:p-7 border border-indigo-100/80 shadow-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="font-extrabold text-slate-900 text-base">Your Primary Mentorship Pod</h2>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-extrabold rounded-full">ACTIVE</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 bg-white/90 backdrop-blur-md p-5 rounded-2xl border border-indigo-100 shadow-sm">
              <img 
                src={MOCK_POD_MENTOR.avatar} 
                alt={MOCK_POD_MENTOR.name} 
                className="w-16 h-16 rounded-2xl object-cover object-center shadow-md border-2 border-indigo-100"
              />
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className="font-extrabold text-slate-900 text-lg">{MOCK_POD_MENTOR.name}</h3>
                <p className="text-xs font-bold text-indigo-600 mb-1">{MOCK_POD_MENTOR.track}</p>
                <p className="text-xs text-slate-500 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <Clock size={13} className="text-slate-400" /> Next session: <span className="text-slate-800 font-bold">{MOCK_POD_MENTOR.nextSession}</span>
                </p>
              </div>
              <Link 
                href="/mentor" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-all shrink-0"
              >
                Open Pod
              </Link>
            </div>
          </motion.div>

          {/* Continue Learning Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Compass size={22} className="text-indigo-600" /> Continue Learning
              </h2>
              <Link href="/academy" className="text-indigo-600 hover:text-indigo-800 text-xs font-black tracking-wide uppercase flex items-center gap-1">
                Course Catalog <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {MOCK_ENROLLMENTS.map((enrollment, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  key={enrollment.id} 
                  className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 group"
                >
                  <div className="w-full sm:w-36 h-32 sm:h-28 shrink-0 rounded-2xl overflow-hidden relative shadow-md">
                    <img src={enrollment.course.image} alt={enrollment.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={18} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        {enrollment.course.category.name}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">• {enrollment.course.instructor}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base truncate mb-1">{enrollment.course.title}</h4>
                    <p className="text-xs font-semibold text-slate-500 mb-3 truncate">{enrollment.currentLesson}</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full transition-all duration-1000" style={{ width: `${enrollment.progress.percent}%` }} />
                      </div>
                      <span className="text-xs font-black text-slate-700">{enrollment.progress.percent}%</span>
                    </div>
                  </div>

                  <Link 
                    href={`/academy`} 
                    className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-colors text-center shrink-0 shadow-sm"
                  >
                    Resume
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Audio Player, Events, Quick Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Sermon Audio Player Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden border border-slate-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-sky-400 animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-300">Daily Message</span>
              </div>
              <span className="text-[10px] font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">Audio</span>
            </div>

            <div className="mb-4">
              <h3 className="font-extrabold text-lg text-white mb-1">Building Spirit-Led Systems</h3>
              <p className="text-xs font-medium text-slate-400">Rev. Dubus Achufusi • 24 mins</p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button 
                onClick={() => setIsPlayingAudio(!isPlayingAudio)} 
                className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/25 transition-transform active:scale-95 shrink-0"
              >
                <Play size={20} fill="white" className={`ml-0.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </button>
              <div className="flex-1">
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full w-1/3" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                  <span>08:12</span>
                  <span>24:00</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-black text-slate-900">Upcoming Events</h2>
              <Link href="/events" className="text-indigo-600 hover:text-indigo-800 text-xs font-black tracking-wide uppercase">Full Schedule</Link>
            </div>
            
            <div className="space-y-3">
              {MOCK_EVENTS.map((event, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={event.id} 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex flex-col items-center justify-center shrink-0 border border-indigo-100">
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">
                      {new Date(event.startTime).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-base font-black leading-none">
                      {new Date(event.startTime).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span className="text-indigo-600 font-extrabold">{event.type}</span> • {event.attendees}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Access Modules */}
          <div>
            <h2 className="text-lg font-black text-slate-900 mb-4 px-1">Quick Access</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Academy', href: '/academy', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: 'Mentorship', href: '/mentorship', icon: Users, color: 'text-sky-600', bg: 'bg-sky-50' },
                { label: 'Prayer Wall', href: '/prayer', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
                { label: 'Community', href: '/community', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map((a, i) => (
                <Link key={a.label} href={a.href}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + (i * 0.05) }}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center gap-2.5 text-center hover:shadow-md hover:border-indigo-100 hover:-translate-y-1 transition-all"
                  >
                    <div className={`w-11 h-11 ${a.bg} rounded-2xl flex items-center justify-center`}>
                      <a.icon size={20} className={a.color} />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800">{a.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
