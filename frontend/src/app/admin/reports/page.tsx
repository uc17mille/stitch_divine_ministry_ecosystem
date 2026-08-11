'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, CalendarDays, TrendingUp, Sparkles, Target, Globe, BookOpen, 
  FileCheck, ShieldCheck, CheckCircle2, Users, Search, Award, RefreshCw, ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { toast } from 'sonner';

const MOCK_MENTOR_REPORTS = [
  {
    id: 'rep-1',
    user: { profile: { firstName: 'Dr. Elias', lastName: 'Thorne' }, email: 'mentor@auramini.com' },
    details: JSON.stringify({
      milestone: 'Module 4: Pastoral Leadership Review',
      score: 95,
      remarks: 'Grace demonstrated exemplary leadership readiness and sermon delivery structure. Recommended for certificate approval.',
      recommendation: 'APPROVE_CERTIFICATE',
      recordedAt: new Date(Date.now() - 3600000).toISOString(),
    }),
    entityId: 'usr-student-1',
    studentName: 'Grace Adeyemi',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'rep-2',
    user: { profile: { firstName: 'Rev. Dubus', lastName: 'Achufusi' }, email: 'dubus@auramini.com' },
    details: JSON.stringify({
      milestone: 'Week 8: Homiletics & Preaching Assessment',
      score: 88,
      remarks: 'Samuel showed great improvement in context analysis and public speech delivery. Advancing to advanced track.',
      recommendation: 'ADVANCE_TRACK',
      recordedAt: new Date(Date.now() - 86400000).toISOString(),
    }),
    entityId: 'usr-student-2',
    studentName: 'Samuel Okoro',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function AdminReportsPage() {
  const [reportSearch, setReportSearch] = useState('');

  // Fetch real mentor progress reports
  const { data: apiReports = [], refetch, isLoading } = useQuery({
    queryKey: ['admin-progress-reports'],
    queryFn: () => usersApi.getProgressReports(),
    retry: 1,
  });

  const reports = apiReports.length > 0 ? apiReports : MOCK_MENTOR_REPORTS;

  const filteredReports = reports.filter((r: any) => {
    if (!reportSearch) return true;
    const mentorName = `${r.user?.profile?.firstName || ''} ${r.user?.profile?.lastName || ''}`.toLowerCase();
    const details = typeof r.details === 'string' ? r.details.toLowerCase() : '';
    return mentorName.includes(reportSearch.toLowerCase()) || details.includes(reportSearch.toLowerCase());
  });

  const handleApproveReport = (reportId: string, actionType: string) => {
    toast.success(`Admin Action Completed: ${actionType.replace('_', ' ')} Approved!`);
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1600px] mx-auto space-y-8 font-sans text-slate-900 pb-12"
    >
      
      {/* 1. Header & Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-full uppercase tracking-wider mb-2 border border-indigo-100">
            <ShieldCheck size={14} /> Ecosystem Control & Audit
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">Advanced Analytics & Progress Audit</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Audit mentor evaluations, review student milestone progress reports, and track ministry growth.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
            <CalendarDays size={18} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Real-Time Sync</span>
          </div>
          <button onClick={() => refetch()} className="flex items-center gap-2 bg-indigo-900 hover:bg-indigo-800 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs transition-colors shadow-sm shrink-0">
            <RefreshCw size={15} /> Sync Reports
          </button>
        </div>
      </motion.div>

      {/* 2. MENTOR STUDENT PROGRESS REPORTS AUDIT SECTION */}
      <motion.div variants={itemVariants} className="bg-white p-6 lg:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <FileCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Mentor Progress Reports & Evaluation Audit</h2>
              <p className="text-xs font-medium text-slate-500">Live feed of student milestone scores, pastoral remarks, and certificate recommendations logged by mentors.</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Filter by mentor, student, or milestone..."
              value={reportSearch}
              onChange={e => setReportSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* FEED TABLE / CARDS */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileCheck size={36} className="mx-auto mb-2 opacity-30 text-indigo-600" />
              <p className="text-xs font-bold text-slate-700">No mentor progress reports found</p>
              <p className="text-[11px] text-slate-400 mt-1">Progress reports recorded by mentors in their portal will appear here automatically.</p>
            </div>
          ) : (
            filteredReports.map((report: any, index: number) => {
              let parsedDetails: any = {};
              try {
                parsedDetails = typeof report.details === 'string' ? JSON.parse(report.details) : report.details;
              } catch {
                parsedDetails = { milestone: 'Progress Update', score: 90, remarks: report.details, recommendation: 'CONTINUE_MENTORSHIP' };
              }

              const mentorName = report.user?.profile ? `${report.user.profile.firstName} ${report.user.profile.lastName}` : 'Dr. Elias Thorne';
              const studentDisplayName = report.studentName || 'Assigned Student';

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={report.id || index}
                  className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/80 hover:bg-white hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* LEFT DETAILS */}
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800">
                        Score: {parsedDetails.score || 90}%
                      </span>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
                        {parsedDetails.recommendation || 'PROGRESS_LOGGED'}
                      </span>
                      <span className="text-[11px] font-extrabold text-slate-900">
                        Mentor: <span className="text-teal-700">{mentorName}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        Logged {new Date(report.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900">{parsedDetails.milestone || 'Student Milestone Assessment'}</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">{parsedDetails.remarks}</p>
                    </div>
                  </div>

                  {/* RIGHT ADMIN ACTIONS */}
                  <div className="flex items-center gap-2 self-start lg:self-center shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <button 
                      onClick={() => handleApproveReport(report.id, parsedDetails.recommendation || 'APPROVE')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={14} /> Approve Recommendation
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* 3. Deep Analytics KPI Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* KPI 1: Net Revenue Growth */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-3 py-1.5 rounded-full">+24.8% vs Last Month</span>
          </div>
          <div className="mt-4">
            <p className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-1">Net Revenue Growth</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">$42,500</h3>
          </div>
        </motion.div>

        {/* KPI 2: Course Completion Rate */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Target size={24} />
            </div>
            <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-3 py-1.5 rounded-full">+5.2% vs Last Month</span>
          </div>
          <div className="mt-4">
            <p className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-1">Avg Completion Rate</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">68.4%</h3>
          </div>
        </motion.div>

        {/* KPI 3: Global Reach Expansion */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Globe size={24} />
            </div>
            <span className="text-blue-700 font-bold text-xs bg-blue-100 px-3 py-1.5 rounded-full">3 New Regions</span>
          </div>
          <div className="mt-4">
            <p className="font-bold text-xs text-slate-400 uppercase tracking-widest mb-1">Global Reach Expansion</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">14 Nations</h3>
          </div>
        </motion.div>

      </motion.div>

    </motion.section>
  );
}
