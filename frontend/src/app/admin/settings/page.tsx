'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Settings, Shield, Mail, CreditCard, GraduationCap, Building2, Save, Loader2, CheckCircle2 } from 'lucide-react';

const tabs = [
  { id: 'platform', label: 'Platform Profile', icon: Building2 },
  { id: 'email', label: 'Email & Integrations', icon: Mail },
  { id: 'security', label: 'Security & Access', icon: Shield },
  { id: 'course', label: 'Course & LMS', icon: GraduationCap },
  { id: 'billing', label: 'Billing & Subscriptions', icon: CreditCard },
] as const;

type TabId = typeof tabs[number]['id'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('platform');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['global-settings'],
    queryFn: () => api.get('/settings').then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: (newSettings: any) => api.put('/settings', newSettings).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['global-settings'] });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Parse booleans and numbers
    if (data.require2FA) data.require2FA = data.require2FA === 'true' ? true as any : false as any;
    if (data.enableGamification) data.enableGamification = data.enableGamification === 'true' ? true as any : false as any;
    if (data.sessionTimeoutMins) data.sessionTimeoutMins = parseInt(data.sessionTimeoutMins as string, 10) as any;
    if (data.smtpPort) data.smtpPort = parseInt(data.smtpPort as string, 10) as any;
    if (data.maxConcurrentSessions) data.maxConcurrentSessions = parseInt(data.maxConcurrentSessions as string, 10) as any;

    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto font-sans text-slate-900 pb-12 px-10 md:px-20 pt-8">
      
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-lg">
              <Settings size={24} />
            </div>
            Global Settings
          </h1>
          <p className="text-base font-medium text-slate-500 mt-2 max-w-xl">Configure platform branding, email integrations, and security policies for your entire ecosystem.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sticky Vertical Sidebar */}
        <div className="w-full lg:w-72 shrink-0 bg-white p-3 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-8">
          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Pane */}
        <div className="flex-1 w-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            
            <div className="p-8 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {/* TAB 1: PLATFORM */}
                  {activeTab === 'platform' && (
                    <div className="space-y-6 max-w-2xl">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl font-bold">Platform Profile</h2>
                        <p className="text-sm text-slate-500 font-medium">Your public-facing brand identity.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Ministry / Academy Name</label>
                          <input name="ministryName" defaultValue={settings?.ministryName} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Support Email</label>
                          <input name="supportEmail" defaultValue={settings?.supportEmail} type="email" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Primary Brand Color</label>
                            <div className="flex items-center gap-3">
                              <input name="primaryColor" defaultValue={settings?.primaryColor} type="color" className="w-10 h-10 rounded cursor-pointer" />
                              <span className="text-sm font-mono text-slate-500 uppercase">{settings?.primaryColor}</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Secondary Color</label>
                            <div className="flex items-center gap-3">
                              <input name="secondaryColor" defaultValue={settings?.secondaryColor} type="color" className="w-10 h-10 rounded cursor-pointer" />
                              <span className="text-sm font-mono text-slate-500 uppercase">{settings?.secondaryColor}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: EMAIL */}
                  {activeTab === 'email' && (
                    <div className="space-y-6 max-w-2xl">
                      <div className="border-b border-slate-100 pb-4 mb-6 flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold">Email & Integrations</h2>
                          <p className="text-sm text-slate-500 font-medium">SMTP settings for sending certificates and resets.</p>
                        </div>
                        <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">Requires Restart</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">SMTP Host</label>
                          <input name="smtpHost" defaultValue={settings?.smtpHost} placeholder="smtp.sendgrid.net" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">SMTP Port</label>
                          <input name="smtpPort" defaultValue={settings?.smtpPort} type="number" placeholder="587" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">SMTP User</label>
                          <input name="smtpUser" defaultValue={settings?.smtpUser} placeholder="apikey" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">SMTP Password / API Key</label>
                          <input name="smtpPassword" defaultValue={settings?.smtpPassword} type="password" placeholder="••••••••••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SECURITY */}
                  {activeTab === 'security' && (
                    <div className="space-y-6 max-w-2xl">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl font-bold">Security & Access</h2>
                        <p className="text-sm text-slate-500 font-medium">Protect your administrative ecosystem.</p>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Require 2FA for Administrators</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">Force all admin roles to use authenticator apps.</p>
                          </div>
                          <select name="require2FA" defaultValue={settings?.require2FA ? 'true' : 'false'} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none">
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Admin Session Timeout (Minutes)</label>
                          <input name="sessionTimeoutMins" defaultValue={settings?.sessionTimeoutMins} type="number" className="w-full max-w-[200px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                        </div>

                        <div className="border-t border-slate-100 pt-6 mt-6">
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Admin IP Whitelist</label>
                          <textarea name="adminIpWhitelist" defaultValue={settings?.adminIpWhitelist} placeholder="192.168.1.1, 10.0.0.5" rows={2} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                          <p className="text-xs font-medium text-slate-500 mt-1.5">Comma-separated list of approved IP addresses. Leave blank to allow access from any IP.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Max Concurrent Sessions (Students)</label>
                          <input name="maxConcurrentSessions" defaultValue={settings?.maxConcurrentSessions} type="number" placeholder="1" className="w-full max-w-[200px] px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                          <p className="text-xs font-medium text-slate-500 mt-1.5">Prevent account sharing by limiting simultaneous logins. Enter 0 for unlimited.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: COURSE */}
                  {activeTab === 'course' && (
                    <div className="space-y-6 max-w-2xl">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl font-bold">Course & LMS Defaults</h2>
                        <p className="text-sm text-slate-500 font-medium">Configure global behaviors for learning tracks.</p>
                      </div>
                      
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Certificate Issuing Authority</label>
                          <input name="certificateAuthority" defaultValue={settings?.certificateAuthority} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                          <p className="text-xs text-slate-400 font-medium mt-1.5">Appears at the bottom of dynamically generated PDF certificates.</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Enable Platform Gamification</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">Show leaderboards, points, and badges to students.</p>
                          </div>
                          <select name="enableGamification" defaultValue={settings?.enableGamification ? 'true' : 'false'} className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-bold outline-none">
                            <option value="true">Enabled</option>
                            <option value="false">Disabled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: BILLING */}
                  {activeTab === 'billing' && (
                    <div className="space-y-6 max-w-2xl">
                      <div className="border-b border-slate-100 pb-4 mb-6">
                        <h2 className="text-xl font-bold">Billing & Subscriptions</h2>
                        <p className="text-sm text-slate-500 font-medium">Configure Stripe for accepting payments and donations.</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Stripe Public Key</label>
                          <input name="stripePublicKey" defaultValue={settings?.stripePublicKey} placeholder="pk_live_..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1.5">Stripe Secret Key</label>
                          <input name="stripeSecretKey" defaultValue={settings?.stripeSecretKey} type="password" placeholder="sk_live_..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500" />
                        </div>
                      </div>

                      <div className="mt-8 p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <Shield className="text-emerald-400" size={20} />
                          Lumora Enterprise License
                        </h3>
                        <p className="text-slate-400 text-sm font-medium mt-1">Your platform is currently running on an active perpetual license. No further billing is required for core updates.</p>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Save Bar */}
            <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end items-center gap-4">
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100"
                  >
                    <CheckCircle2 size={18} /> Settings saved successfully
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
