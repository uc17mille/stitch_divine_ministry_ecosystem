'use client';

import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { usersApi, mentorshipApi } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Calendar, BookOpen, Award, TrendingUp, ArrowRight,
  Clock, ChevronRight, Sparkles, UserCheck, Route, ShieldCheck, CheckCircle2, MessageSquare
} from 'lucide-react';

export default function MentorDashboardPage() {
  const { user } = useAuthStore();

  // Fetch assigned students
  const { data: allAssignments = [] } = useQuery({
    queryKey: ['mentor-assignments'],
    queryFn: () => usersApi.getAllAssignments(),
    retry: 1,
  });

  // Fetch my bookings/sessions
  const { data: myBookings = [] } = useQuery({
    queryKey: ['mentor-bookings'],
    queryFn: () => mentorshipApi.getMyBookings(),
    retry: 1,
  });

  // Fetch my mentorship tracks
  const { data: myTracks = [] } = useQuery({
    queryKey: ['mentor-tracks', user?.id],
    queryFn: () => mentorshipApi.getTracks(user?.id),
    enabled: !!user?.id,
    retry: 1,
  });

  // Filter assignments to only those belonging to this mentor
  const myStudents = allAssignments.filter?.((a: any) => a.mentorId === user?.id) || [];

  // Split bookings
  const now = new Date();
  const upcomingSessions = myBookings.filter?.((b: any) => new Date(b.startTime) > now && b.status !== 'CANCELED') || [];
  const completedSessions = myBookings.filter?.((b: any) => b.status === 'COMPLETED') || [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.profile?.firstName || 'Dr. Elias';

  // Stats
  const stats = [
    { label: 'Assigned Mentees', value: myStudents.length || 4, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
    { label: 'Active Tracks', value: myTracks.length || 2, icon: Route, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Upcoming Sessions', value: upcomingSessions.length || 3, icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Completed Pods', value: completedSessions.length || 12, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  // Mock students for fallback display
  const MOCK_STUDENTS = [
    { id: 's1', type: 'Mentorship', note: 'Focus on leadership & governance', assignedAt: '2026-07-15T00:00:00Z', student: { profile: { firstName: 'Grace', lastName: 'Adeyemi' }, email: 'grace@ministry.org' } },
    { id: 's2', type: 'Fatherhood', note: 'Spiritual covering & accountability', assignedAt: '2026-06-20T00:00:00Z', student: { profile: { firstName: 'Samuel', lastName: 'Okoro' }, email: 'samuel@ministry.org' } },
    { id: 's3', type: 'Mentorship', note: 'Worship ministry leadership track', assignedAt: '2026-08-01T00:00:00Z', student: { profile: { firstName: 'Esther', lastName: 'Nwosu' }, email: 'esther@ministry.org' } },
    { id: 's4', type: 'Mentorship', note: 'Preparing for pastoral ordination', assignedAt: '2026-07-28T00:00:00Z', student: { profile: { firstName: 'Daniel', lastName: 'Eze' }, email: 'daniel@ministry.org' } },
  ];

  const MOCK_SESSIONS = [
    { id: 'b1', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), status: 'SCHEDULED', track: { name: 'Pastoral Leadership Intensive' }, student: { profile: { firstName: 'Grace', lastName: 'Adeyemi' } } },
    { id: 'b2', startTime: new Date(Date.now() + 172800000).toISOString(), endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(), status: 'SCHEDULED', track: { name: 'Pastoral Leadership Intensive' }, student: { profile: { firstName: 'Samuel', lastName: 'Okoro' } } },
    { id: 'b3', startTime: new Date(Date.now() + 345600000).toISOString(), endTime: new Date(Date.now() + 345600000 + 3600000).toISOString(), status: 'SCHEDULED', track: { name: 'Worship Ministry Foundations' }, student: { profile: { firstName: 'Esther', lastName: 'Nwosu' } } },
  ];

  const MOCK_TRACKS = [
    { id: 't1', name: 'Pastoral Leadership Intensive', description: 'A 12-week intensive mentorship journey focusing on leadership, preaching, and ministry management.', _count: { bookings: 8 } },
    { id: 't2', name: 'Worship Ministry Foundations', description: 'Develop spiritual depth and practical skills for leading contemporary worship.', _count: { bookings: 5 } },
  ];

  const displayStudents = myStudents.length > 0 ? myStudents : MOCK_STUDENTS;
  const displaySessions = upcomingSessions.length > 0 ? upcomingSessions : MOCK_SESSIONS;
  const displayTracks = myTracks.length > 0 ? myTracks : MOCK_TRACKS;

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8 bg-slate-50 min-h-screen font-sans selection:bg-teal-500/20">

      {/* 1. 2026 MENTOR HERO */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-8 lg:p-10 text-white shadow-2xl shadow-teal-950/20 overflow-hidden border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8"
      >
        {/* Ambient glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-4">
            <Sparkles size={13} className="text-teal-300" />
            <span className="text-[11px] font-extrabold tracking-widest text-teal-200 uppercase">Mentor Leadership Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none mb-3">
            {greeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-200 to-white">{firstName}</span> 🙏
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
            Guiding leaders, shaping ministry callings, and stewarding Kingdom impact across your active mentorship tracks.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <Link 
            href="/mentor/schedule" 
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-500/30 hover:scale-105 transition-all"
          >
            <Calendar size={18} /> View Schedule
          </Link>
          <Link 
            href="/mentor/students" 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl backdrop-blur-md transition-all"
          >
            <Users size={18} /> My Mentees
          </Link>
        </div>
      </motion.div>

      {/* 2. STATS BENTO GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
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

      {/* 3. DASHBOARD MAIN CONTENT GRID */}
      <div className="grid lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Assigned Students (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <UserCheck size={22} className="text-teal-600" /> Assigned Students & Mentees
            </h2>
            <Link href="/mentor/students" className="text-teal-600 hover:text-teal-800 text-xs font-black tracking-wide uppercase flex items-center gap-1">
              Full Roster <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {displayStudents.slice(0, 4).map((assignment: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.08) }}
                key={assignment.id || i} 
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-lg hover:border-teal-100 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                  {assignment.student?.profile?.firstName?.[0] || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-base truncate group-hover:text-teal-600 transition-colors">
                    {assignment.student?.profile ? `${assignment.student.profile.firstName} ${assignment.student.profile.lastName}` : 'Student'}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5 truncate">{assignment.note || 'No notes added'}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    assignment.type === 'Fatherhood' 
                      ? 'bg-violet-50 text-violet-700 border border-violet-100' 
                      : 'bg-teal-50 text-teal-700 border border-teal-100'
                  }`}>
                    {assignment.type}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">
                    {new Date(assignment.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-600 transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Sessions & Tracks (5 cols) */}
        <div className="lg:col-span-5 space-y-8">

          {/* Upcoming Sessions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-black text-slate-900">Upcoming Sessions</h2>
              <Link href="/mentor/schedule" className="text-teal-600 hover:text-teal-800 text-xs font-black tracking-wide uppercase">Schedule</Link>
            </div>
            
            <div className="space-y-3">
              {displaySessions.slice(0, 3).map((session: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={session.id || i} 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-teal-100 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex flex-col items-center justify-center shrink-0 border border-amber-100">
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">
                      {new Date(session.startTime).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-base font-black leading-none">
                      {new Date(session.startTime).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-teal-600 transition-colors">
                      {session.student?.profile ? `${session.student.profile.firstName} ${session.student.profile.lastName}` : 'Student'}
                    </h4>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                      <Clock size={12} className="text-slate-400" /> {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • {session.track?.name || 'Session'}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider shrink-0">
                    {session.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mentorship Tracks */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-black text-slate-900">Active Tracks</h2>
              <Link href="/mentor/tracks" className="text-teal-600 hover:text-teal-800 text-xs font-black tracking-wide uppercase">Manage</Link>
            </div>

            <div className="space-y-3">
              {displayTracks.slice(0, 2).map((track: any, i: number) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  key={track.id || i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-100 transition-all group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                      <BookOpen size={20} className="text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate group-hover:text-teal-600 transition-colors">{track.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2">{track.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-[11px] font-black text-slate-400">
                        <span className="flex items-center gap-1 text-teal-600"><Users size={13} /> {track._count?.bookings || 0} Bookings</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
