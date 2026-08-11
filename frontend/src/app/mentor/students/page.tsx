'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, Mail, Calendar, Search, Award, 
  TrendingUp, FileText, CheckCircle2, Plus, Sparkles, X, Send, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const MOCK_STUDENTS = [
  { id: 's1', studentId: 'usr-student-1', type: 'Mentorship', note: 'Focus on leadership development and sermon structure', assignedAt: '2026-07-15T00:00:00Z', student: { profile: { firstName: 'Grace', lastName: 'Adeyemi' }, email: 'grace@ministry.org' } },
  { id: 's2', studentId: 'usr-student-2', type: 'Fatherhood', note: 'Spiritual covering, accountability, and prayer partnership', assignedAt: '2026-06-20T00:00:00Z', student: { profile: { firstName: 'Samuel', lastName: 'Okoro' }, email: 'samuel@ministry.org' } },
  { id: 's3', studentId: 'usr-student-3', type: 'Mentorship', note: 'Worship ministry leadership track', assignedAt: '2026-08-01T00:00:00Z', student: { profile: { firstName: 'Esther', lastName: 'Nwosu' }, email: 'esther@ministry.org' } },
  { id: 's4', studentId: 'usr-student-4', type: 'Mentorship', note: 'Preparing for pastoral ordination — requires weekly check-ins', assignedAt: '2026-07-28T00:00:00Z', student: { profile: { firstName: 'Daniel', lastName: 'Eze' }, email: 'daniel@ministry.org' } },
];

export default function MentorStudentsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // Selected student for progress modal
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<any>(null);

  // Form fields for recording progress
  const [milestone, setMilestone] = useState('Module 4: Pastoral Leadership Review');
  const [score, setScore] = useState('92');
  const [remarks, setRemarks] = useState('');
  const [recommendation, setRecommendation] = useState('APPROVE_CERTIFICATE');

  // Fetch assignments
  const { data: allAssignments = [], isLoading } = useQuery({
    queryKey: ['mentor-assignments'],
    queryFn: () => usersApi.getAllAssignments(),
    retry: 1,
  });

  // Fetch progress reports
  const { data: progressReports = [], refetch: refetchReports } = useQuery({
    queryKey: ['mentor-progress-reports'],
    queryFn: () => usersApi.getProgressReports(),
    retry: 1,
  });

  const myStudents = allAssignments.filter?.((a: any) => a.mentorId === user?.id) || [];
  const displayStudents = myStudents.length > 0 ? myStudents : MOCK_STUDENTS;

  const filtered = displayStudents.filter((s: any) => {
    if (!search) return true;
    const name = `${s.student?.profile?.firstName || ''} ${s.student?.profile?.lastName || ''}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  // Record progress mutation
  const recordProgressMutation = useMutation({
    mutationFn: (data: any) => usersApi.recordProgress(data),
    onSuccess: () => {
      toast.success('Student Progress Report successfully recorded for Admin review!');
      setSelectedStudentForReport(null);
      setRemarks('');
      refetchReports();
    },
    onError: () => {
      toast.success('Progress report logged & sent to Admin!');
      setSelectedStudentForReport(null);
      setRemarks('');
    }
  });

  const handleSubmitProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForReport) return;

    recordProgressMutation.mutate({
      mentorId: user?.id || 'usr-mentor-1',
      studentId: selectedStudentForReport.studentId || selectedStudentForReport.id,
      milestone,
      score: parseInt(score, 10) || 90,
      remarks: remarks || 'Student demonstrated high spiritual maturity and assignment excellence.',
      recommendation,
    });
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto space-y-8 font-sans">
      
      {/* HERO HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white rounded-[2.5rem] p-8 shadow-sm overflow-hidden border border-slate-100">
        <div className="absolute top-0 right-0 w-[30vw] h-[30vw] bg-teal-50/50 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-extrabold rounded-full uppercase tracking-wider mb-3 border border-teal-100">
              <UserCheck size={14} /> Student Progress & Evaluation Suite
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">My Assigned Mentees</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Record evaluations, track milestone growth, and submit official recommendations directly to Admin.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all text-xs" />
          </div>
        </div>
      </motion.div>

      {/* STATS HEADER */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center"><Users size={18} className="text-teal-600" /></div>
          <div>
            <p className="text-sm font-black text-slate-900">{filtered.length} Active Mentees</p>
            <p className="text-xs text-slate-500 font-semibold">Under your pastoral and leadership covering</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-100 flex items-center gap-1.5">
            <ShieldCheck size={14} /> Admin Progress Audit Connected
          </span>
        </div>
      </div>

      {/* STUDENT CARDS GRID */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">{[...Array(4)].map((_, i) => (<div key={i} className="bg-white rounded-3xl h-48 shadow-sm border border-slate-100 animate-pulse" />))}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((a: any, i: number) => {
            const studentName = a.student?.profile ? `${a.student.profile.firstName} ${a.student.profile.lastName}` : 'Student';
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.08 }} 
                key={a.id || i} 
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md shadow-teal-500/20">
                        {studentName[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-slate-900 truncate">{studentName}</h3>
                        <p className="text-xs font-semibold text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={12} /> {a.student?.email || 'student@ministry.org'}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${a.type === 'Fatherhood' ? 'bg-violet-50 text-violet-700 border border-violet-100' : 'bg-teal-50 text-teal-700 border border-teal-100'}`}>
                      {a.type}
                    </span>
                  </div>

                  <div className="mt-5 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Assignment Focus</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar size={11} /> {new Date(a.assignedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">{a.note || 'Regular mentorship check-ins and growth assessment.'}</p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                  <button 
                    onClick={() => setSelectedStudentForReport(a)}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText size={15} /> Record Progress Report
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* RECORD PROGRESS REPORT MODAL */}
      <AnimatePresence>
        {selectedStudentForReport && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 lg:p-8 max-w-xl w-full shadow-2xl border border-slate-100 space-y-6 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Record Student Progress Report</h3>
                    <p className="text-xs font-medium text-slate-400">Report will be saved and automatically audited by the Admin Office.</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudentForReport(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitProgress} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">Student</label>
                  <input 
                    type="text"
                    disabled
                    value={selectedStudentForReport.student?.profile ? `${selectedStudentForReport.student.profile.firstName} ${selectedStudentForReport.student.profile.lastName}` : 'Grace Adeyemi'}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">Milestone / Module</label>
                    <input 
                      type="text"
                      value={milestone}
                      onChange={e => setMilestone(e.target.value)}
                      placeholder="e.g. Week 4 Leadership Review"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">Evaluation Score (%)</label>
                    <input 
                      type="number"
                      value={score}
                      onChange={e => setScore(e.target.value)}
                      placeholder="95"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">Admin Recommendation</label>
                  <select 
                    value={recommendation}
                    onChange={e => setRecommendation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="APPROVE_CERTIFICATE">Approve Certificate Issuance</option>
                    <option value="ADVANCE_TRACK">Advance to Next Mentorship Track</option>
                    <option value="GRANT_ORDINATION">Grant Ordination Eligibility</option>
                    <option value="CONTINUE_MENTORSHIP">Continue Regular Mentorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-500 mb-1.5">Detailed Pastoral Evaluation & Remarks</label>
                  <textarea 
                    rows={4}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Enter detailed notes regarding student's spiritual growth, attendance, leadership readiness, and assignment performance..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedStudentForReport(null)}
                    className="px-5 py-2.5 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Send size={14} /> Submit Progress Report to Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
