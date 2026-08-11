'use client';

import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { mentorshipApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { BookOpen, Users, Plus, Route, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const MOCK_TRACKS = [
  { id: 't1', name: 'Pastoral Leadership Intensive', description: 'A 12-week intensive mentorship journey focusing on leadership, preaching, and ministry management. Designed for emerging senior pastors.', createdAt: '2026-06-01T00:00:00Z', _count: { bookings: 8 } },
  { id: 't2', name: 'Worship Ministry Foundations', description: 'Develop spiritual depth and practical skills for leading contemporary worship teams and music ministry departments.', createdAt: '2026-07-10T00:00:00Z', _count: { bookings: 5 } },
  { id: 't3', name: 'Evangelism & Outreach Strategy', description: 'Modern approaches to community engagement, digital evangelism, and culturally relevant outreach programming.', createdAt: '2026-08-01T00:00:00Z', _count: { bookings: 3 } },
];

export default function MentorTracksPage() {
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [newTrack, setNewTrack] = useState({ name: '', description: '' });

  const { data: myTracks = [], refetch } = useQuery({
    queryKey: ['mentor-tracks', user?.id],
    queryFn: () => mentorshipApi.getTracks(user?.id),
    enabled: !!user?.id,
    retry: 1,
  });

  const displayTracks = myTracks.length > 0 ? myTracks : MOCK_TRACKS;

  const handleCreateTrack = async () => {
    if (!newTrack.name.trim()) {
      toast.error('Track name is required');
      return;
    }
    try {
      await mentorshipApi.createTrack(newTrack);
      toast.success('Track created successfully!');
      setNewTrack({ name: '', description: '' });
      setShowForm(false);
      refetch();
    } catch {
      toast.error('Failed to create track. Using mock mode.');
      setShowForm(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white rounded-[2rem] p-8 shadow-sm overflow-hidden border border-slate-100">
        <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-blue-50/50 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider mb-3 border border-blue-100">
              <Route size={14} /> Track Management
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Mentorship Tracks</h1>
            <p className="text-slate-500 font-medium mt-1">Create and manage your mentorship programs.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-sm">
            <Plus size={18} /> New Track
          </button>
        </div>
      </motion.div>

      {/* Create Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-5">
          <h3 className="text-lg font-bold text-slate-900">Create New Mentorship Track</h3>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Track Name</label>
            <input value={newTrack.name} onChange={(e) => setNewTrack({ ...newTrack, name: e.target.value })} placeholder="e.g., Advanced Pastoral Counseling" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea value={newTrack.description} onChange={(e) => setNewTrack({ ...newTrack, description: e.target.value })} placeholder="Describe the goals, duration, and structure of this mentorship track..." rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-sm resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreateTrack} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all text-sm">Create Track</button>
            <button onClick={() => setShowForm(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all text-sm">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><BookOpen size={18} className="text-blue-600" /></div>
        <div>
          <p className="text-sm font-bold text-slate-900">{displayTracks.length} Tracks</p>
          <p className="text-xs text-slate-500 font-medium">Active mentorship programs</p>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTracks.map((track: any, i: number) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            key={track.id || i}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white mb-5 shadow-md shadow-blue-500/20">
              <BookOpen size={22} />
            </div>
            <h3 className="font-black text-lg text-slate-900 mb-2 leading-tight">{track.name}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5 flex-1 line-clamp-3">{track.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Users size={14} className="text-teal-500" /> {track._count?.bookings || track.bookings?.length || 0} Bookings</span>
              <span className="text-[11px] font-bold text-slate-400">
                {track.createdAt ? new Date(track.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
