'use client';

import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { mentorshipApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

const MOCK_SESSIONS = [
  { id: 'b1', startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(), status: 'SCHEDULED', track: { name: 'Pastoral Leadership Intensive' }, student: { profile: { firstName: 'Grace', lastName: 'Adeyemi' } } },
  { id: 'b2', startTime: new Date(Date.now() + 172800000).toISOString(), endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(), status: 'SCHEDULED', track: { name: 'Pastoral Leadership Intensive' }, student: { profile: { firstName: 'Samuel', lastName: 'Okoro' } } },
  { id: 'b3', startTime: new Date(Date.now() + 345600000).toISOString(), endTime: new Date(Date.now() + 345600000 + 3600000).toISOString(), status: 'SCHEDULED', track: { name: 'Worship Ministry Foundations' }, student: { profile: { firstName: 'Esther', lastName: 'Nwosu' } } },
  { id: 'b4', startTime: new Date(Date.now() - 86400000).toISOString(), endTime: new Date(Date.now() - 86400000 + 3600000).toISOString(), status: 'COMPLETED', track: { name: 'Pastoral Leadership Intensive' }, student: { profile: { firstName: 'Daniel', lastName: 'Eze' } } },
  { id: 'b5', startTime: new Date(Date.now() - 172800000).toISOString(), endTime: new Date(Date.now() - 172800000 + 3600000).toISOString(), status: 'COMPLETED', track: { name: 'Worship Ministry Foundations' }, student: { profile: { firstName: 'Joy', lastName: 'Umeh' } } },
  { id: 'b6', startTime: new Date(Date.now() - 345600000).toISOString(), endTime: new Date(Date.now() - 345600000 + 3600000).toISOString(), status: 'CANCELED', track: { name: 'Pastoral Leadership Intensive' }, student: { profile: { firstName: 'Grace', lastName: 'Adeyemi' } } },
];

const statusConfig: Record<string, { icon: any; color: string; bg: string; border: string }> = {
  SCHEDULED: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  COMPLETED: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  CANCELED: { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
};

export default function MentorSchedulePage() {
  const { data: myBookings = [] } = useQuery({
    queryKey: ['mentor-bookings'],
    queryFn: () => mentorshipApi.getMyBookings(),
    retry: 1,
  });

  const displaySessions = myBookings.length > 0 ? myBookings : MOCK_SESSIONS;
  const now = new Date();
  const upcoming = displaySessions.filter((b: any) => new Date(b.startTime) > now && b.status !== 'CANCELED');
  const past = displaySessions.filter((b: any) => new Date(b.startTime) <= now || b.status === 'CANCELED');

  const SessionCard = ({ session, i }: { session: any; i: number }) => {
    const cfg = statusConfig[session.status] || statusConfig.SCHEDULED;
    const StatusIcon = cfg.icon;
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.06 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all flex items-center gap-5"
      >
        <div className="w-14 h-14 rounded-xl bg-teal-50 text-teal-700 flex flex-col items-center justify-center shrink-0 border border-teal-100">
          <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-0.5">
            {new Date(session.startTime).toLocaleString('en-US', { month: 'short' })}
          </span>
          <span className="text-lg font-black leading-none">
            {new Date(session.startTime).getDate()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 truncate">
            {session.student?.profile ? `${session.student.profile.firstName} ${session.student.profile.lastName}` : 'Student'}
          </h4>
          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
            <Clock size={12} />
            {new Date(session.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} — {new Date(session.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-xs font-medium text-slate-400 mt-0.5 truncate">{session.track?.name || 'Session'}</p>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.color} ${cfg.border} border shrink-0`}>
          <StatusIcon size={12} /> {session.status}
        </span>
      </motion.div>
    );
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white rounded-[2rem] p-8 shadow-sm overflow-hidden border border-slate-100">
        <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-amber-50/50 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider mb-3 border border-amber-100">
            <Calendar size={14} /> Session Management
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">My Schedule</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your mentorship sessions and bookings.</p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Upcoming', value: upcoming.length, color: 'text-amber-600', bg: 'bg-amber-100', icon: AlertCircle },
          { label: 'Completed', value: past.filter((b: any) => b.status === 'COMPLETED').length, color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle2 },
          { label: 'Canceled', value: past.filter((b: any) => b.status === 'CANCELED').length, color: 'text-rose-600', bg: 'bg-rose-100', icon: XCircle },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}><s.icon size={18} className={s.color} /></div>
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-bold text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2"><Sparkles size={18} className="text-amber-500" /> Upcoming Sessions</h2>
          <div className="space-y-3">{upcoming.map((s: any, i: number) => <SessionCard key={s.id} session={s} i={i} />)}</div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-slate-400" /> Past Sessions</h2>
          <div className="space-y-3">{past.map((s: any, i: number) => <SessionCard key={s.id} session={s} i={i} />)}</div>
        </div>
      )}
    </div>
  );
}
