'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Users, Smartphone, Monitor, Map, 
  TrendingDown, ArrowUpRight, ChevronDown, ListFilter,
  CheckCircle2, BookOpen, GraduationCap, DollarSign,
  Heart, Calendar, MessageSquare, Download, Trophy
} from 'lucide-react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';

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

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['admin-analytics', timeRange],
    queryFn: () => analyticsApi.getDashboard(timeRange),
    placeholderData: keepPreviousData,
  });

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 font-bold animate-pulse">Loading Analytics Dashboard...</div>
      </div>
    );
  }

  if (error || !data || !data.kpis || !data.ministryImpact || !data.platformUsage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-rose-500 font-bold bg-rose-50 px-6 py-4 rounded-xl">Failed to load analytics data. Please check backend connection.</div>
      </div>
    );
  }

  const exportToCSV = () => {
    if (!data) return;
    
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Members', data.kpis.totalUsers],
      ['Active Enrollments', data.kpis.activeEnrollments],
      ['Total Revenue', data.kpis.totalRevenue],
      ['Completion Rate', `${data.kpis.completionRate}%`],
      ['Prayer Requests', data.ministryImpact.activePrayerRequests],
      ['Mentorship Bookings', data.ministryImpact.mentorshipBookings],
      ['Community Posts', data.ministryImpact.communityPosts],
    ];

    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `lumora_analytics_${timeRange}.csv`);
    a.click();
  };

  const kpis = [
    { title: 'Total Members', value: data.kpis.totalUsers, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12% this week', trendColor: 'text-emerald-500' },
    { title: 'Active Enrollments', value: data.kpis.activeEnrollments, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5% this week', trendColor: 'text-emerald-500' },
    { title: 'Total Revenue', value: `$${data.kpis.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+18% this month', trendColor: 'text-emerald-500' },
    { title: 'Completion Rate', value: `${data.kpis.completionRate}%`, icon: GraduationCap, color: 'text-violet-600', bg: 'bg-violet-50', trend: 'Stable', trendColor: 'text-slate-400' },
  ];

  const impactMetrics = [
    { title: 'Prayer Requests', value: data.ministryImpact.activePrayerRequests, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Mentorship Bookings', value: data.ministryImpact.mentorshipBookings, icon: Calendar, color: 'text-sky-600', bg: 'bg-sky-50' },
    { title: 'Community Posts', value: data.ministryImpact.communityPosts, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`max-w-[1600px] mx-auto space-y-6 font-sans text-slate-900 pb-12 px-20 pt-8 transition-opacity duration-300 ${isFetching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}
    >
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Platform Analytics</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time insights across your entire digital ministry ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl font-bold text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Download size={18} /> Export CSV
          </button>

          <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ListFilter size={18} /> 
            {timeRange === '7' ? 'Last 7 Days' : timeRange === '30' ? 'Last 30 Days' : 'All Time'}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
              <button 
                onClick={() => { setTimeRange('7'); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-slate-50 transition-colors ${timeRange === '7' ? 'text-indigo-600' : 'text-slate-600'}`}
              >
                Last 7 Days
              </button>
              <button 
                onClick={() => { setTimeRange('30'); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-slate-50 transition-colors ${timeRange === '30' ? 'text-indigo-600' : 'text-slate-600'}`}
              >
                Last 30 Days
              </button>
              <button 
                onClick={() => { setTimeRange('all'); setIsDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-slate-50 transition-colors ${timeRange === 'all' ? 'text-indigo-600' : 'text-slate-600'}`}
              >
                All Time
              </button>
            </div>
          )}
        </div>
        </div>
      </motion.div>

      {/* --- The "North Star" KPI Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div variants={itemVariants} key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.title}</p>
              <h3 className="text-3xl font-black text-slate-900 mb-1">{kpi.value}</h3>
              <p className={`text-xs font-bold ${kpi.trendColor}`}>{kpi.trend}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0`}>
              <kpi.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- The "Ministry Impact" Row --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {impactMetrics.map((metric, i) => (
          <motion.div variants={itemVariants} key={i} className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-default">
            <div className={`w-10 h-10 rounded-xl ${metric.bg} ${metric.color} flex items-center justify-center shrink-0`}>
              <metric.icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{metric.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{metric.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid Layout (Advanced Charts) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-4">
        
        {/* Left Column: Retention & Heatmap (8 Cols) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Content Retention Curve */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-[400px] flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h4 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <TrendingDown size={20} className="text-rose-500" />
                  Course Retention Curve
                </h4>
                <p className="text-xs font-medium text-slate-500">Average completion drop-off across all 4-module courses.</p>
              </div>
              <div className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-100">
                Critical Drop: Mod 3
              </div>
            </div>
            
            <div className="flex-1 w-full flex items-end gap-4 relative z-10">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
                <div className="border-b border-slate-900 w-full h-0"></div>
                <div className="border-b border-slate-900 w-full h-0"></div>
                <div className="border-b border-slate-900 w-full h-0"></div>
                <div className="border-b border-slate-900 w-full h-0"></div>
              </div>
              
              {/* Bars */}
              {data.retention?.map((bar: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div className="w-full flex justify-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{bar.val}</span>
                  </div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: bar.h }}
                    transition={{ duration: 1.2, delay: i * 0.1, type: 'spring' as const }}
                    className={`w-full max-w-[60px] rounded-t-xl ${bar.color} transition-all duration-300`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-4 text-center">{bar.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active User Heatmap Placeholder */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h4 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Activity size={20} className="text-indigo-500" />
              Weekly Engagement Heatmap
            </h4>
            
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex gap-1 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <div className="w-12"></div>
                  {['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'].map(t => (
                    <div key={t} className="flex-1 text-center">{t}</div>
                  ))}
                </div>
                
                {data.heatmap?.map((row: any, i: number) => (
                  <div key={row.day} className="flex gap-1 mb-1 items-center">
                    <div className="w-12 text-xs font-bold text-slate-500">{row.day}</div>
                    {row.active.map((activeCount: number, col: number) => {
                      // Normalize active count to opacity (assuming max is around 120)
                      let opacity = Math.min(1, activeCount / 120);
                      
                      return (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (i * 0.05) + (col * 0.05) }}
                          key={col} 
                          className="flex-1 h-8 rounded-md bg-indigo-600 transition-colors hover:bg-indigo-500 cursor-pointer"
                          style={{ opacity: Math.max(0.05, opacity) }}
                          title={`${activeCount} active users`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Devices & Live Feed (4 Cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Device & Platform Split */}
          <motion.div variants={itemVariants} className="bg-[#0a1e64] p-8 rounded-3xl shadow-md text-white h-[400px] flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-bold text-white mb-1">Platform Usage</h4>
              <p className="text-xs font-medium text-blue-200/80">Where are users logging in from?</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center relative">
              {/* Simulated Donut Chart */}
              <div className="w-48 h-48 rounded-full border-[16px] border-blue-900 relative flex items-center justify-center">
                <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-blue-400 border-r-blue-400 rotate-45"></div>
                <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-b-sky-300 -rotate-12"></div>
                
                <div className="text-center">
                  <span className="block text-3xl font-black">{data.platformUsage.mobile}%</span>
                  <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Mobile</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-blue-400" />
                <div>
                  <p className="text-sm font-bold">Mobile App</p>
                  <p className="text-xs text-blue-200">{data.platformUsage.mobile}% (iOS/Android)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Monitor size={16} className="text-sky-300" />
                <div>
                  <p className="text-sm font-bold">Desktop</p>
                  <p className="text-xs text-blue-200">{data.platformUsage.desktop}% (Web)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Live User Feed */}
          <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold flex items-center gap-2 text-slate-900">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                Live Event Feed
              </h4>
            </div>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {data.liveFeed?.map((evt: any, i: number) => {
                const isSignup = evt.type === 'signup';
                const icon = isSignup ? Users : CheckCircle2;
                const c = isSignup ? 'text-indigo-500' : 'text-emerald-500';
                const bg = isSignup ? 'bg-indigo-50' : 'bg-emerald-50';
                const timeDiff = new Date().getTime() - new Date(evt.date).getTime();
                const mins = Math.max(0, Math.floor(timeDiff / 60000));
                const timeStr = mins < 1 ? 'Just now' : mins < 60 ? `${mins}m ago` : `${Math.floor(mins/60)}h ago`;

                const IconComponent = icon;

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1) }}
                    key={i} 
                    className="flex gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full ${bg} ${c} flex items-center justify-center shrink-0 mt-0.5`}>
                      <IconComponent size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{evt.msg}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{timeStr}</p>
                    </div>
                  </motion.div>
                );
              })}
              {(!data.liveFeed || data.liveFeed.length === 0) && (
                <div className="text-center text-sm font-bold text-slate-400 py-8">
                  No recent events recorded.
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Top Performing Courses */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mt-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-bold flex items-center gap-2">
            <Trophy size={20} className="text-amber-500" />
            Top Performing Courses
          </h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Rank</th>
                <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Course Title</th>
                <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Enrollments</th>
              </tr>
            </thead>
            <tbody>
              {data.topCourses?.map((course: any, idx: number) => (
                <tr key={course.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-100 text-slate-700' : idx === 2 ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-slate-500'}`}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td className="py-4 font-bold text-slate-900">{course.title}</td>
                  <td className="py-4 text-sm text-slate-500 font-medium">
                    <span className="bg-slate-100 px-3 py-1 rounded-full">{course.category}</span>
                  </td>
                  <td className="py-4 text-right font-black text-indigo-600">{course.enrollments}</td>
                </tr>
              ))}
              {(!data.topCourses || data.topCourses.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-bold">No courses found for this period.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  );
}
