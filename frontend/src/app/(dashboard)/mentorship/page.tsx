'use client';
import { useAuthStore } from '@/store/authStore';
import { Search, CalendarDays, MessageSquare, ChevronRight, Clock, Filter, Calendar } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MentorshipPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2">
        <h1 className="text-2xl font-black text-blue-950 tracking-tight whitespace-nowrap">Spiritual Mentorship</h1>
        
        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Find a mentor or topic..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border-0 shadow-sm rounded-full text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none placeholder:text-slate-400 text-slate-700"
          />
        </div>

        {/* User Profile Snippet */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="font-bold text-sm text-slate-900 leading-none">{user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Alex Grayson'}</p>
            <p className="text-xs font-medium text-slate-500 mt-1">Level 4 Mentee</p>
          </div>
          <img src="https://ui-avatars.com/api/?name=Alex+Grayson&background=0D8ABC&color=fff&rounded=true" alt="User" className="w-10 h-10 rounded-full shadow-sm" />
        </div>
      </div>

      {/* 2. Top Bento Grid (Hero Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Assigned Mentor Card (col-span-8) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm flex flex-col md:flex-row gap-8 relative overflow-hidden"
        >
          {/* subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl -z-0 opacity-60" />
          
          <div className="w-full md:w-64 h-64 shrink-0 rounded-3xl overflow-hidden shadow-md relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
              alt="Dr. Sarah Jenkins" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col justify-center relative z-10 w-full">
            <div className="flex justify-between items-start mb-2">
              <span className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full uppercase tracking-wider">Assigned Mentor</span>
              <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:shadow-sm transition-all">
                <CalendarDays size={18} />
              </button>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mt-2">Dr. Sarah Jenkins</h2>
            <p className="text-blue-600 font-bold text-sm mt-1 mb-4">Theology & Faith Transitions</p>
            
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 max-w-md">
              Helping leaders navigate deep spiritual formation for over 15 years. Specializing in the intersection of traditional theology and modern digital ministry ecosystems.
            </p>
            
            <div className="flex items-center gap-4 mt-auto">
              <button className="bg-blue-950 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-900 transition-colors">
                <MessageSquare size={16} /> Message
              </button>
              <button className="text-slate-600 font-bold px-4 py-2.5 hover:text-blue-600 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        </motion.div>

        {/* Progress Card (col-span-4) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-white rounded-[2rem] p-8 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h3 className="font-bold text-slate-700 mb-6">Your Progress</h3>
            
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Hours</p>
                <p className="text-4xl font-black text-blue-600">24.5</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock size={24} />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-slate-700">Growth Milestone</span>
                <span className="text-sm font-bold text-slate-900">82%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-950 rounded-full w-[82%]" />
              </div>
              <p className="text-xs font-medium text-slate-400 mt-3">4.5 hours until next level certificate</p>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t border-slate-100 pt-6">
            <div>
              <p className="text-xs font-bold text-slate-400">Sessions</p>
              <p className="text-xl font-black text-slate-900">12</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Topics</p>
              <p className="text-xl font-black text-slate-900">4</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Lower Section Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mt-4">
        <div className="lg:col-span-4 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Upcoming Sessions</h3>
          <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
        </div>
        <div className="lg:col-span-8 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Mentor Directory</h3>
          <button className="text-slate-500 text-xs font-bold flex items-center gap-1 hover:text-slate-900"><Filter size={14}/> Filter by Specialty</button>
        </div>
      </div>

      {/* 4. Lower Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Sessions List (col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          {[
            { date: 'OCT', day: '12', title: 'Theology of Work', time: '10:00 AM • Zoom', active: true },
            { date: 'OCT', day: '19', title: 'Leadership Foundations', time: '02:30 PM • Office', active: false },
          ].map((session, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              key={i} 
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ${session.active ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-500'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{session.date}</span>
                <span className="text-lg font-black leading-none">{session.day}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate">{session.title}</h4>
                <p className="text-xs font-medium text-slate-500 mt-1">{session.time}</p>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </motion.div>
          ))}
          
          {/* Pagination / Dots */}
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2 pl-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
            <span className="text-xs font-bold text-slate-400">2/4 Scheduled</span>
          </div>
        </div>

        {/* Mentor Directory (col-span-8) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              name: 'Marcus Chen', 
              specialty: 'Youth Ministry', 
              img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
              desc: 'Expert in digital outreach strategies for Gen Z and community building.',
              status: 'Available Now',
              statusColor: 'bg-emerald-400',
              btn: 'Book Session',
              btnStyle: 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            },
            { 
              name: 'Rev. Elena Vance', 
              specialty: 'Organizational Leadership', 
              img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
              desc: 'Leading non-profit transformations and global ecclesiastical structures.',
              status: 'Waitlist',
              statusColor: 'bg-amber-400',
              btn: 'Join Waitlist',
              btnStyle: 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }
          ].map((mentor, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              key={i} 
              className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={mentor.img} alt={mentor.name} className="w-14 h-14 rounded-full object-cover shadow-sm" />
                <div>
                  <h4 className="font-bold text-slate-900">{mentor.name}</h4>
                  <p className="text-blue-600 text-xs font-bold mt-0.5">{mentor.specialty}</p>
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 flex-1">
                {mentor.desc}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${mentor.statusColor}`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{mentor.status}</span>
                </div>
                <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${mentor.btnStyle}`}>
                  {mentor.btn}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
