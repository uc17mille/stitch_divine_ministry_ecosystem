'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Search, UploadCloud, Plus, Download, LayoutTemplate, MoreVertical, BadgeCheck, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

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

export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState<'ledger' | 'templates'>('ledger');
  
  // Data Fetching
  const { data: ledger, isLoading: isLoadingLedger } = useQuery({
    queryKey: ['certificates-ledger'],
    queryFn: () => api.get('/certificates/issued').then(res => res.data),
    enabled: activeTab === 'ledger'
  });

  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['certificates-templates'],
    queryFn: () => api.get('/certificates/templates').then(res => res.data),
    enabled: activeTab === 'templates'
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1600px] mx-auto space-y-6 font-sans text-slate-900 pb-12 px-20 pt-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            Certificate Authority
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage course certificates, design templates, and verify issued credentials.</p>
        </div>
        
        <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'ledger' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Issued Ledger
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'templates' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Templates
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-white px-6 py-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Issued</p>
            <h3 className="text-3xl font-black text-slate-900">{ledger?.length || 0}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <BadgeCheck size={24} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white px-6 py-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:shadow-md transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Templates</p>
            <h3 className="text-3xl font-black text-slate-900">{templates?.length || 0}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <LayoutTemplate size={24} />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-emerald-600 text-white px-6 py-5 rounded-3xl shadow-md flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="relative z-10">
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-1">Authenticity Validated</p>
            <h3 className="text-2xl font-black leading-tight">100% Secured</h3>
            <p className="text-xs font-medium text-emerald-200 mt-1">Unique QR Verification</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/50 flex items-center justify-center shrink-0 relative z-10 border border-emerald-400/30">
            <FileText size={24} />
          </div>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[500px]">
        
        {/* LEDGER TAB */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BadgeCheck className="text-amber-500" size={20} />
                Issued Ledger
              </h2>
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by name or code..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {isLoadingLedger ? (
              <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Loading Ledger...</div>
            ) : ledger?.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No certificates issued yet</h3>
                <p className="text-slate-500 font-medium text-sm mt-1">Students will appear here once they complete courses.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Student</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Course Completed</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Date Issued</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Code</th>
                      <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger?.map((cert: any) => (
                      <tr key={cert.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                              {cert.user.profile?.firstName?.[0] || cert.user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900">{cert.user.profile?.firstName} {cert.user.profile?.lastName}</p>
                              <p className="text-xs text-slate-500 font-medium">{cert.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100/50">
                            {cert.course.title}
                          </span>
                        </td>
                        <td className="py-4 text-sm font-medium text-slate-600">
                          {new Date(cert.issuedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                            {cert.verificationCode}
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg">
                            <Download size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutTemplate className="text-indigo-500" size={20} />
                Certificate Templates
              </h2>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                <Plus size={18} /> New Template
              </button>
            </div>

            {isLoadingTemplates ? (
              <div className="py-20 text-center text-slate-400 font-bold animate-pulse">Loading Templates...</div>
            ) : templates?.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="w-16 h-16 bg-white text-indigo-500 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No templates designed yet</h3>
                <p className="text-slate-500 font-medium text-sm mt-1 max-w-sm mx-auto mb-6">Upload a background image and map dynamic text fields to automatically issue certificates.</p>
                <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                  Create First Template
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates?.map((tpl: any) => (
                  <div key={tpl.id} className="border border-slate-200 rounded-2xl overflow-hidden group hover:shadow-md transition-all">
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      {tpl.backgroundUrl ? (
                        <img src={`http://localhost:3001${tpl.backgroundUrl}`} alt={tpl.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <LayoutTemplate size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                    </div>
                    <div className="p-4 bg-white flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm truncate">{tpl.name}</h4>
                        <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{tpl.course.title}</p>
                      </div>
                      <button className="text-slate-400 hover:text-slate-900 transition-colors p-1.5 hover:bg-slate-100 rounded-lg">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </motion.div>
    </motion.div>
  );
}
