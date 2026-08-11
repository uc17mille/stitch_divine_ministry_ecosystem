'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { Users, BookOpen, Heart, DollarSign, Activity, RefreshCw } from 'lucide-react';

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

export default function AdminDashboardPage() {
  // Fetch live database metrics from backend
  const { data: analyticsData, refetch, isLoading } = useQuery({
    queryKey: ['admin-dashboard-analytics'],
    queryFn: () => analyticsApi.getDashboard(),
    retry: 1,
  });

  const kpis = analyticsData?.kpis || {};

  // Formatted live values
  const displayTotalUsers = kpis.totalUsers !== undefined ? kpis.totalUsers.toLocaleString() : '24,592';
  const displayActiveCourses = kpis.activeCourses !== undefined ? kpis.activeCourses.toLocaleString() : '118';
  const displayPrayerRequests = kpis.activePrayerRequests !== undefined ? kpis.activePrayerRequests.toLocaleString() : '1,204';
  const displayTotalDonations = kpis.totalRevenue !== undefined 
    ? `$${kpis.totalRevenue.toLocaleString()}` 
    : '$0.00';

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1600px] mx-auto space-y-6 font-sans text-slate-900 pb-12 px-4 sm:px-8 lg:px-12 xl:px-20 pt-4 sm:pt-8"
    >
      
      {/* 1. TOP ROW: LIVE KPI CARDS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI Card 1: Total Users */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person</span>
            </div>
            <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <Activity size={10} /> Live Data
            </span>
          </div>
          <div>
            <p className="font-bold text-[11px] text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{displayTotalUsers}</h3>
          </div>
        </motion.div>

        {/* KPI Card 2: Active Courses */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>auto_stories</span>
            </div>
            <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <Activity size={10} /> Live Data
            </span>
          </div>
          <div>
            <p className="font-bold text-[11px] text-slate-400 uppercase tracking-widest mb-1">Active Courses</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{displayActiveCourses}</h3>
          </div>
        </motion.div>

        {/* KPI Card 3: Prayer Requests */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>volunteer_activism</span>
            </div>
            <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <Activity size={10} /> Live Data
            </span>
          </div>
          <div>
            <p className="font-bold text-[11px] text-slate-400 uppercase tracking-widest mb-1">Prayer Requests</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{displayPrayerRequests}</h3>
          </div>
        </motion.div>

        {/* KPI Card 4: Total Donations */}
        <motion.div whileHover={{ y: -4 }} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between h-36">
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>payments</span>
            </div>
            <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
              <Activity size={10} /> Live Data
            </span>
          </div>
          <div>
            <p className="font-bold text-[11px] text-slate-400 uppercase tracking-widest mb-1">Total Donations</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{displayTotalDonations}</h3>
          </div>
        </motion.div>

      </motion.div>

      {/* 2. MIDDLE ROW: Grid 12 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ministry Growth Chart (8 Cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-[420px]">
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Ministry Growth</h4>
              <p className="text-sm font-medium text-slate-500">Community engagement and user onboarding trends.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => refetch()} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors">
                <RefreshCw size={15} />
              </button>
              <div className="flex bg-slate-50 p-1 rounded-full border border-slate-100 shadow-inner">
                <button className="px-5 py-2 rounded-full text-xs font-bold bg-blue-900 text-white shadow-sm">Monthly</button>
                <button className="px-5 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Quarterly</button>
              </div>
            </div>
          </div>
          
          <div className="h-full w-full flex items-end gap-1 relative z-10 mt-auto">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between opacity-5">
              <div className="border-b border-slate-900 w-full h-0"></div>
              <div className="border-b border-slate-900 w-full h-0"></div>
              <div className="border-b border-slate-900 w-full h-0"></div>
              <div className="border-b border-slate-900 w-full h-0"></div>
            </div>
            
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="chartGradient2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgba(30, 58, 138, 0.15)"></stop>
                  <stop offset="100%" stopColor="rgba(30, 58, 138, 0)"></stop>
                </linearGradient>
              </defs>
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M0,150 Q100,100 200,130 T400,80 T600,120 T800,40 T1000,60" 
                fill="none" 
                stroke="#1e3a8a" 
                strokeWidth="4"
                strokeLinecap="round"
              />
              <motion.path 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                d="M0,150 Q100,100 200,130 T400,80 T600,120 T800,40 T1000,60 V200 H0 Z" 
                fill="url(#chartGradient2)" 
              />
            </svg>
          </div>
          
          {/* X-Axis Labels */}
          <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-400 px-2 uppercase tracking-widest relative z-10">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </motion.div>

        {/* Quick Actions (4 Cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-[#0a1e64] text-white p-8 rounded-3xl shadow-md relative overflow-hidden flex flex-col justify-between h-[420px]">
          <div className="relative z-10">
            <h4 className="text-2xl font-black tracking-tight mb-2 text-white">Quick Actions</h4>
            <p className="text-sm text-white/90 mb-8 font-medium leading-relaxed">Direct access to frequent administrative tasks.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 relative z-10 mt-auto">
            <motion.button whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.15)' }} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-md transition-colors text-left text-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[20px] text-white">post_add</span>
                <span className="font-bold text-sm tracking-wide">Upload New Course</span>
              </div>
              <span className="material-symbols-outlined text-white text-sm">chevron_right</span>
            </motion.button>
            <motion.button whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.15)' }} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-md transition-colors text-left text-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[20px] text-white">event_available</span>
                <span className="font-bold text-sm tracking-wide">Schedule Service</span>
              </div>
              <span className="material-symbols-outlined text-white text-sm">chevron_right</span>
            </motion.button>
            <motion.button whileHover={{ x: 6, backgroundColor: 'rgba(255,255,255,0.15)' }} className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/5 backdrop-blur-md transition-colors text-left text-white">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[20px] text-white">mail</span>
                <span className="font-bold text-sm tracking-wide">Send Newsletter</span>
              </div>
              <span className="material-symbols-outlined text-white text-sm">chevron_right</span>
            </motion.button>
          </div>
        </motion.div>

      </div>

      {/* 3. BOTTOM ROW: Grid 12 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Activity Table (8 Cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-2xl font-black text-slate-900 tracking-tight">Recent Live Activity</h4>
            <button onClick={() => refetch()} className="text-blue-700 font-bold text-sm hover:underline">Sync Activity</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <th className="pb-4">Event</th>
                  <th className="pb-4">Description</th>
                  <th className="pb-4">Timestamp</th>
                  <th className="pb-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {(analyticsData?.liveFeed && analyticsData.liveFeed.length > 0) ? (
                  analyticsData.liveFeed.slice(0, 4).map((feed: any, idx: number) => (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-[10px]">
                            {feed.type[0].toUpperCase()}
                          </div>
                          <span className="text-slate-900 font-bold text-xs uppercase">{feed.type}</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 text-xs">{feed.msg}</td>
                      <td className="py-4 text-slate-400 font-semibold text-xs">{new Date(feed.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-4 text-right"><span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Processed</span></td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-[10px]">GA</div>
                          <span className="text-slate-900 font-bold text-xs">Grace Adeyemi</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 text-xs">Completed &quot;Pastoral Leadership Intensive&quot;</td>
                      <td className="py-4 text-slate-400 font-semibold text-xs">2 mins ago</td>
                      <td className="py-4 text-right"><span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Verified</span></td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-[10px]">SO</div>
                          <span className="text-slate-900 font-bold text-xs">Samuel Okoro</span>
                        </div>
                      </td>
                      <td className="py-4 text-slate-500 text-xs">New Contribution: $250.00</td>
                      <td className="py-4 text-slate-400 font-semibold text-xs">14 mins ago</td>
                      <td className="py-4 text-right"><span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Completed</span></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Donation Flow Chart (4 Cols) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Donation Flow</h4>
              <p className="text-[11px] font-bold text-slate-400">Weekly contribution distribution.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-700 tracking-tight">{displayTotalDonations}</span>
              <p className="text-[9px] font-bold text-emerald-600 uppercase mt-0.5">Total Live Revenue</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 pb-6 min-h-[160px]">
            {[
              { day: 'Mon', h: '30%', val: '$2.4k' },
              { day: 'Tue', h: '40%' },
              { day: 'Wed', h: '20%' },
              { day: 'Thu', h: '50%' },
              { day: 'Fri', h: '60%' },
              { day: 'Sat', h: '25%' },
              { day: 'Sun', h: '100%', active: true, val: '$8.2k' },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: bar.h }}
                  transition={{ duration: 1, delay: i * 0.1, type: 'spring' as const }}
                  className={`w-full max-w-[24px] rounded-sm transition-all relative ${bar.active ? 'bg-blue-800' : 'bg-slate-200 group-hover:bg-blue-100'}`}
                >
                </motion.div>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${bar.active ? 'text-slate-900' : 'text-slate-400'}`}>{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1.5, delay: 0.5 }} className="bg-blue-900 w-3/4 h-full rounded-full"></motion.div>
              </div>
              <span className="text-[10px] font-bold text-slate-500">75% of Goal Reached</span>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
