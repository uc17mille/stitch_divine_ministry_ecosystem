'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Users, Mail, Smartphone, Globe, 
  History, Eye, Clock, CheckCircle2 
} from 'lucide-react';

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

export default function AnnouncementsPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Multi-Channel State
  const [pushInApp, setPushInApp] = useState(true);
  const [pushEmail, setPushEmail] = useState(false);
  const [pushSms, setPushSms] = useState(false);
  
  // Target Audience State
  const [targetAudience, setTargetAudience] = useState('All Users');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send
    alert(`Broadcast Sent to ${targetAudience} via ${[pushInApp && 'In-App', pushEmail && 'Email', pushSms && 'SMS'].filter(Boolean).join(', ')}`);
  };

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8 font-sans text-slate-900 pb-12"
    >
      
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Broadcast Hub</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Multi-channel communication and announcement management.</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: The Composer (8 Cols) */}
        <motion.div variants={itemVariants} className="xl:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <Send size={20} className="text-blue-600" />
              Compose Broadcast
            </h2>
            
            <form onSubmit={handleBroadcast} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Subject / Title</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Important Update: Sunday Service Time Change" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message Body</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your announcement here..." 
                  rows={8}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                ></textarea>
                
                {/* Rich Text Toolbar Mock */}
                <div className="flex gap-2 mt-3 px-2 text-slate-400">
                  <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-slate-600">format_bold</span>
                  <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-slate-600">format_italic</span>
                  <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-slate-600">format_list_bulleted</span>
                  <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-slate-600">link</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                  <Send size={18} /> Send Broadcast
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Right Column: Targeting & Channels (4 Cols) */}
        <motion.div variants={itemVariants} className="xl:col-span-4 space-y-6">
          
          {/* Target Audience */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Users size={16} /> Target Audience
            </h3>
            
            <div className="space-y-3">
              {[
                { id: 'All Users', desc: 'Everyone registered on the platform.' },
                { id: 'Mentorship Students', desc: 'Users enrolled in active mentorships.' },
                { id: 'Active Donors', desc: 'Users who donated in the last 30 days.' },
                { id: 'Specific Region', desc: 'Filter by continent or country.' }
              ].map(audience => (
                <label key={audience.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${targetAudience === audience.id ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="audience" 
                    checked={targetAudience === audience.id} 
                    onChange={() => setTargetAudience(audience.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{audience.id}</p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{audience.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Multi-Channel Push */}
          <div className="bg-[#0a1e64] p-6 rounded-3xl shadow-md text-white">
            <h3 className="text-sm font-bold text-blue-200 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Globe size={16} /> Delivery Channels
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/5 cursor-pointer hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-blue-200" />
                  <span className="font-bold text-sm">In-App Notification</span>
                </div>
                <input type="checkbox" checked={pushInApp} onChange={(e) => setPushInApp(e.target.checked)} className="w-4 h-4 accent-blue-500" />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/5 cursor-pointer hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-200" />
                  <span className="font-bold text-sm">Email Blast</span>
                </div>
                <input type="checkbox" checked={pushEmail} onChange={(e) => setPushEmail(e.target.checked)} className="w-4 h-4 accent-blue-500" />
              </label>
              
              <label className="flex items-center justify-between p-4 bg-white/10 rounded-xl border border-white/5 cursor-pointer hover:bg-white/20 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-blue-200">sms</span>
                  <span className="font-bold text-sm">SMS Alert</span>
                </div>
                <input type="checkbox" checked={pushSms} onChange={(e) => setPushSms(e.target.checked)} className="w-4 h-4 accent-blue-500" />
              </label>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Broadcast History Table */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <History size={20} className="text-blue-600" />
            Broadcast History
          </h2>
          <button className="text-sm font-bold text-blue-600 hover:underline">View Full Log</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="pb-4">Subject</th>
                <th className="pb-4">Audience</th>
                <th className="pb-4">Channels</th>
                <th className="pb-4">Date</th>
                <th className="pb-4 text-right">Engagement</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {[
                { title: 'New Course: Architectural Revival', aud: 'All Users', chan: ['In-App', 'Email'], date: '2 days ago', eng: '68% Open Rate' },
                { title: 'Thank You for Your Generosity', aud: 'Active Donors', chan: ['Email'], date: '1 week ago', eng: '92% Open Rate' },
                { title: 'Emergency Service Cancellation', aud: 'Specific Region', chan: ['In-App', 'SMS'], date: '2 weeks ago', eng: '98% Delivery' },
              ].map((log, i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 font-bold text-slate-900">{log.title}</td>
                  <td className="py-4 text-slate-500">{log.aud}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {log.chan.map(c => (
                        <span key={c} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 text-slate-400 font-semibold text-xs flex items-center gap-1.5"><Clock size={12}/> {log.date}</td>
                  <td className="py-4 text-right text-emerald-600 font-bold text-xs">{log.eng}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.section>
  );
}
