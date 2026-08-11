'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prayerApi } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Plus, X, Lock, Globe, Loader2, 
  Sparkles, Search, Filter, BookOpen, 
  UserCheck, AlertCircle, Compass, Flame,
  TrendingUp, Clock, ShieldAlert, Award
} from 'lucide-react';

export default function PrayerFocusPage() {
  const qc = useQueryClient();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Agreement states synced with localStorage
  const [agreedRequests, setAgreedRequests] = useState<Record<string, boolean>>({});
  const [dailyAgreed, setDailyAgreed] = useState(false);
  const [dailyAgreedCount, setDailyAgreedCount] = useState(184);

  // New features: Answered state and prophetic encouragements
  const [answeredPrayers, setAnsweredPrayers] = useState<Record<string, string>>({});
  const [propheticEncouragements, setPropheticEncouragements] = useState<Record<string, Array<{ author: string, role: string, content: string }>>>({});
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ANSWERED'>('ACTIVE');

  // Modal / Input states
  const [testimonyModalOpen, setTestimonyModalOpen] = useState(false);
  const [selectedPrayerForTestimony, setSelectedPrayerForTestimony] = useState<string | null>(null);
  const [testimonyText, setTestimonyText] = useState('');
  const [selectedPrayerForEncouragement, setSelectedPrayerForEncouragement] = useState<string | null>(null);
  const [encouragementText, setEncouragementText] = useState('');

  // Load state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('agreed_prayers');
      if (stored) {
        try { setAgreedRequests(JSON.parse(stored)); } catch (e) { console.error(e); }
      }
      const dailyStored = localStorage.getItem('daily_agreed');
      if (dailyStored === 'true') {
        setDailyAgreed(true);
        setDailyAgreedCount(185);
      }
      const storedAnswered = localStorage.getItem('answered_prayers_data');
      if (storedAnswered) {
        try { setAnsweredPrayers(JSON.parse(storedAnswered)); } catch (e) { console.error(e); }
      }
      const storedEncouragements = localStorage.getItem('prophetic_encouragements_data');
      if (storedEncouragements) {
        try { setPropheticEncouragements(JSON.parse(storedEncouragements)); } catch (e) { console.error(e); }
      } else {
        // Pre-seed some default encouragements for existing items
        const initial = {
          'health-healing': [
            { author: 'Dr. Elias Thorne', role: 'Senior Mentor', content: 'Stand firm in alignment. The spirit of grace is working mightily on your behalf. Breakthrough is close!' }
          ]
        };
        setPropheticEncouragements(initial);
      }
    }
  }, []);

  // Fetch categories & prayer focuses
  const { data: prayers = [], isLoading } = useQuery({ 
    queryKey: ['prayers'], 
    queryFn: prayerApi.getRequests 
  });
  
  const { data: categories = [] } = useQuery({ 
    queryKey: ['prayerCategories'], 
    queryFn: prayerApi.getCategories 
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
    defaultValues: {
      isPrivate: 'false'
    }
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: prayerApi.createRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prayers'] });
      reset();
      setShowForm(false);
      toast.success('Your Prayer Focus target has been shared! ✨');
    },
    onError: () => toast.error('Failed to submit prayer focus'),
  });

  const deleteMutation = useMutation({
    mutationFn: prayerApi.deleteRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prayers'] });
      toast.success('Prayer target removed.');
    },
    onError: () => toast.error('Could not remove request.'),
  });

  const handleToggleAgree = (prayerId: string) => {
    const isAgreed = !agreedRequests[prayerId];
    const updated = { ...agreedRequests, [prayerId]: isAgreed };
    setAgreedRequests(updated);
    localStorage.setItem('agreed_prayers', JSON.stringify(updated));
    
    if (isAgreed) {
      toast.success('Amen! Standing in covenant agreement. ✨');
    }
  };

  const handleDailyAgree = () => {
    if (dailyAgreed) return;
    setDailyAgreed(true);
    setDailyAgreedCount(prev => prev + 1);
    localStorage.setItem('daily_agreed', 'true');
    toast.success('Covenant Alignment Activated! 🙌');
  };

  const handleAddEncouragement = (prayerId: string) => {
    if (!encouragementText.trim()) return;

    const newEnc = {
      author: user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : (user?.email || 'Aura Pastor'),
      role: user?.role === 'MENTOR' || user?.role === 'ADMINISTRATOR' ? 'Senior Mentor' : 'Prayer Partner',
      content: encouragementText.trim()
    };

    const currentList = propheticEncouragements[prayerId] || [];
    const updated = {
      ...propheticEncouragements,
      [prayerId]: [...currentList, newEnc]
    };
    setPropheticEncouragements(updated);
    localStorage.setItem('prophetic_encouragements_data', JSON.stringify(updated));
    setEncouragementText('');
    setSelectedPrayerForEncouragement(null);
    toast.success('Prophetic encouragement shared! 🕊️');
  };

  const handleMarkAnswered = (prayerId: string, testimony: string) => {
    const updated = {
      ...answeredPrayers,
      [prayerId]: testimony || 'Breakthrough manifested to the glory of God!'
    };
    setAnsweredPrayers(updated);
    localStorage.setItem('answered_prayers_data', JSON.stringify(updated));
    setTestimonyModalOpen(false);
    setSelectedPrayerForTestimony(null);
    setTestimonyText('');
    toast.success('Glory to God! Prayer request marked as answered testimony! 🎉');
  };

  // Date Formatting Helper
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  };

  // Filter & Search Logic
  const filteredPrayers = prayers.filter((p: any) => {
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    const isAnswered = !!answeredPrayers[p.id];
    if (activeTab === 'ACTIVE') {
      return matchesCategory && matchesSearch && !isAnswered;
    } else {
      return matchesCategory && matchesSearch && isAnswered;
    }
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-sans bg-slate-50 min-h-screen text-slate-900">
      
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-rose-200/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Page Title Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/60 pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-blue-950 via-indigo-900 to-rose-900 bg-clip-text text-transparent flex items-center gap-3">
            <Flame size={36} className="text-rose-500 fill-rose-100 animate-pulse" />
            Prayer Focus Hub
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5">
            Intercede in unity, declare breakthrough, and align with global kingdom directives.
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="relative group overflow-hidden bg-blue-950 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-900/10 active:scale-[0.98] transition-all text-xs flex items-center gap-1.5 shrink-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Plus size={16} className="relative z-10" /> 
          <span className="relative z-10">Add Prayer Focus</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Stats & Weekly Devotional (8-Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Featured Weekly Covenant Card */}
          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 text-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-6">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-rose-300">
                  <Sparkles size={12} className="animate-spin" style={{ animationDuration: '6s' }} /> Weekly Focal Agreement
                </span>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">The Prayer of Consensus</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Agreeing Today</p>
                  <p className="text-lg font-black text-rose-300 font-mono">{dailyAgreedCount} Partners</p>
                </div>
                <button
                  onClick={handleDailyAgree}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${dailyAgreed ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {dailyAgreed ? <UserCheck size={20} /> : <Heart size={20} className="fill-transparent" />}
                </button>
              </div>
            </div>

            <div className="relative z-10 pt-6 space-y-4">
              <p className="text-sm md:text-base font-semibold leading-relaxed text-slate-200">
                "Again, truly I tell you that if two of you on earth agree about anything they ask for, it will be done for them by my Father in heaven."
              </p>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400 font-serif font-medium">— Matthew 18:19</span>
                <span className="text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full uppercase tracking-wider text-[9px]">Breakthrough focus</span>
              </div>
            </div>
          </div>

          {/* Filtration & Search Dashboard */}
          <div className="bg-white/70 backdrop-blur-md border border-white/60 p-4 rounded-3xl shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              
              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find prayer target..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900/5 focus:bg-white text-xs font-semibold transition-all"
                />
              </div>

              {/* Reset filter */}
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all ${!selectedCategory ? 'bg-blue-950 text-white' : 'text-slate-400 hover:text-slate-700'}`}
              >
                Clear Focuses
              </button>
            </div>

            {/* Curated Category Filter Pills */}
            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100/60">
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${selectedCategory === cat.id ? 'bg-blue-900 text-white shadow-md shadow-blue-950/10' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                >
                  <Filter size={10} className={selectedCategory === cat.id ? 'text-white' : 'text-slate-400'} />
                  {cat.name}
                </button>
              ))}
            </div>

          </div>

          {/* Active / Answered Tabs */}
          <div className="flex border-b border-slate-200/60 pb-1 gap-6">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'ACTIVE' ? 'text-indigo-900 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Active Targets
              {activeTab === 'ACTIVE' && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-900" />}
            </button>
            <button
              onClick={() => setActiveTab('ANSWERED')}
              className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'ANSWERED' ? 'text-indigo-900 font-extrabold' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Answered Breakthroughs
              {activeTab === 'ANSWERED' && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-900" />}
            </button>
          </div>

          {/* Dynamic Grid of Focus Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white h-48 rounded-[2rem] border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredPrayers.length === 0 ? (
            <div className="bg-white border border-slate-200/50 rounded-[2rem] p-16 text-center shadow-sm">
              <Flame size={48} className="text-slate-200 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800">{activeTab === 'ACTIVE' ? 'No active prayer targets' : 'No breakthroughs tracked yet'}</h3>
              <p className="text-slate-500 text-xs mt-1">{activeTab === 'ACTIVE' ? 'Be the first to declare consensus in this category.' : 'Mark your active requests as answered to display them here!'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrayers.map((prayer: any) => {
                const isAgreed = !!agreedRequests[prayer.id];
                const isMyRequest = user?.id === prayer.userId || !prayer.userId; // Default seeded requests modifiable for convenience
                const initials = prayer.user?.profile?.firstName?.[0] || 'U';

                return (
                  <div 
                    key={prayer.id} 
                    className={`bg-white border rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group ${activeTab === 'ANSWERED' ? 'border-amber-200 bg-gradient-to-b from-white to-amber-50/10' : 'border-slate-200/40'}`}
                  >
                    
                    <div className="space-y-4">
                      
                      {/* Top Row: Category tag and privacy status */}
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                          {prayer.category?.name || 'Weekly Target'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {activeTab === 'ANSWERED' && (
                            <span className="text-[8px] bg-amber-100 text-amber-800 font-extrabold uppercase px-2 py-0.5 rounded flex items-center gap-0.5">
                              🎉 Breakthrough Answered
                            </span>
                          )}
                          <span className="text-slate-400">
                            {prayer.isPrivate ? <Lock size={12} className="text-amber-500" /> : <Globe size={12} />}
                          </span>
                        </div>
                      </div>

                      {/* Header details */}
                      <div className="space-y-1.5">
                        <h3 className="font-black text-sm text-slate-900 group-hover:text-blue-950 transition-colors leading-snug">
                          {prayer.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                          {prayer.content}
                        </p>
                      </div>

                      {/* Answered Testimony details */}
                      {activeTab === 'ANSWERED' && answeredPrayers[prayer.id] && (
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-[11px] font-semibold text-amber-900 italic">
                          <span className="font-black not-italic block mb-0.5 text-[9px] uppercase tracking-wider text-amber-700">🙌 Testimony:</span>
                          "{answeredPrayers[prayer.id]}"
                        </div>
                      )}

                    </div>

                    {/* Bottom Metadata & Intercede Actions */}
                    <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                      
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <div className="flex items-center gap-2">
                          <div className="w-5.5 h-5.5 rounded-lg bg-slate-100 text-blue-900 font-black flex items-center justify-center text-[9px] border border-slate-200">
                            {initials}
                          </div>
                          <span className="truncate max-w-[120px]">
                            {prayer.user?.profile ? `${prayer.user.profile.firstName} ${prayer.user.profile.lastName}` : (prayer.user?.email || 'Aura Minister')}
                          </span>
                        </div>
                        <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(prayer.createdAt)}</span>
                      </div>

                      {/* Controls */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleAgree(prayer.id)}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 ${isAgreed ? 'bg-rose-500 text-white shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-100'}`}
                          >
                            <Heart size={12} className={isAgreed ? 'fill-white' : ''} />
                            {isAgreed ? 'Amen / Attuned' : 'Pray for this Request'}
                          </button>

                          {activeTab === 'ACTIVE' && isMyRequest && (
                            <button
                              onClick={() => {
                                setSelectedPrayerForTestimony(prayer.id);
                                setTestimonyModalOpen(true);
                              }}
                              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 shadow-sm"
                            >
                              Mark Answered
                            </button>
                          )}

                          {isMyRequest && (
                            <button
                              onClick={() => deleteMutation.mutate(prayer.id)}
                              className="p-2.5 border border-slate-100 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors flex items-center justify-center shrink-0"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>

                        {/* Prophetic Encouragement section inside card */}
                        <div className="space-y-2 pt-3 mt-1 border-t border-slate-100/60">
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <Sparkles size={10} className="text-indigo-600" /> Prophetic Encouragements
                          </p>
                          
                          {/* List of encouragements */}
                          {(propheticEncouragements[prayer.id] || []).length > 0 ? (
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                              {(propheticEncouragements[prayer.id] || []).map((enc, idx) => (
                                <div key={idx} className="p-2 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                                  <div className="flex justify-between items-center text-[8px] font-bold text-indigo-950">
                                    <span>{enc.author}</span>
                                    <span className="text-[7px] text-slate-400 bg-slate-200/50 px-1 py-0.2 rounded font-extrabold">{enc.role}</span>
                                  </div>
                                  <p className="text-[10px] font-medium text-slate-600 leading-relaxed italic">
                                    "{enc.content}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[9px] text-slate-400 italic">No prophetic encouraging words received yet.</p>
                          )}

                          {/* Add encouragement toggler or input */}
                          {selectedPrayerForEncouragement === prayer.id ? (
                            <div className="flex gap-1 pt-1">
                              <input 
                                type="text"
                                value={encouragementText}
                                onChange={(e) => setEncouragementText(e.target.value)}
                                placeholder="Write prophetic guidance word..."
                                className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[9px] focus:outline-none focus:ring-1 focus:ring-blue-900 font-medium"
                              />
                              <button
                                onClick={() => handleAddEncouragement(prayer.id)}
                                className="bg-blue-950 text-white px-2 rounded-lg text-[8px] font-bold hover:bg-blue-800 transition-colors"
                              >
                                Send
                              </button>
                              <button
                                onClick={() => setSelectedPrayerForEncouragement(null)}
                                className="text-slate-400 hover:text-slate-600 text-[9px] px-1"
                              >
                                X
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedPrayerForEncouragement(prayer.id)}
                              className="text-[9px] font-black text-indigo-700 hover:text-indigo-950 flex items-center gap-1 transition-colors bg-indigo-50/50 border border-indigo-100/50 px-2.5 py-1 rounded-lg w-fit"
                            >
                              🕊️ Leave Encouragement
                            </button>
                          )}
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Insights & Live Encouragements (4-Cols) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Stats Breakdown Box */}
          <div className="bg-white border border-slate-200/50 rounded-[2rem] p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Consensus Statistics</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Targets</span>
                <p className="text-xl font-black text-slate-800 mt-1">{prayers.length}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">My Agreements</span>
                <p className="text-xl font-black text-rose-500 mt-1">{Object.keys(agreedRequests).length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/40 text-[10px] font-bold text-indigo-800">
              <TrendingUp size={16} />
              <span>Consensus rate increased by 14% this week!</span>
            </div>
          </div>

          {/* Ministry Focal Instructions */}
          <div className="bg-blue-900 text-white rounded-[2rem] p-6 shadow-md relative overflow-hidden space-y-4">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex gap-2 items-center text-rose-300">
              <ShieldAlert size={16} />
              <h4 className="font-bold text-xs uppercase tracking-widest">Protocol of Agreeing</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Consensus agreement is more than a checklist item. Please read each focus target, declare consensus internally, and stand in spiritual solidarity.
            </p>
          </div>

          {/* Breakthrough reports widget */}
          <div className="bg-white border border-slate-200/50 rounded-[2rem] p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Breakthrough Reports</h4>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100/40 text-xs font-semibold">
                <p className="text-slate-600 leading-relaxed">"The consensus request for pastoral wisdom has resulted in a new campus ministry alignment. Glory to God!"</p>
                <p className="text-[9px] font-bold text-emerald-700 mt-2 text-right">— Sis. Sarah</p>
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* Request Focus Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full p-6 md:p-8 rounded-[2rem] shadow-xl space-y-5 border border-slate-200/60"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Add Prayer Focus Target</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Submit your consensus point so partners can join in alignment.</p>
                </div>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Focus Target Title</label>
                  <input 
                    {...register('title', { required: 'Title is required' })} 
                    placeholder="e.g. Consensus for upcoming Leadership Assembly" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-xs font-semibold transition-all"
                  />
                  {errors.title && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.title.message as string}</p>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Details for Agreement</label>
                  <textarea 
                    {...register('content', { required: 'Content is required' })} 
                    rows={4} 
                    placeholder="Specify the specific breakthrough points we are standing for..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-xs font-medium transition-all resize-none"
                  />
                  {errors.content && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.content.message as string}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                    <select 
                      {...register('categoryId', { required: 'Select a category' })} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-xs font-bold transition-all text-slate-600"
                    >
                      <option value="">Select category...</option>
                      {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    {errors.categoryId && <p className="text-rose-500 text-[10px] mt-1 font-bold">{errors.categoryId.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Visibility</label>
                    <select 
                      {...register('isPrivate')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-xs font-bold transition-all text-slate-600"
                    >
                      <option value="false">Public — Shared with Focus Board</option>
                      <option value="true">Private — Only Me & Mentors</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={createMutation.isPending}
                    className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-bold text-xs hover:bg-blue-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Heart size={14} />} 
                    Submit Target
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimony Breakthrough Modal */}
      <AnimatePresence>
        {testimonyModalOpen && selectedPrayerForTestimony && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full p-6 md:p-8 rounded-[2rem] shadow-xl space-y-5 border border-slate-200/60"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">🎉 Record Answered Breakthrough</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Share the testimony of how God answered this consensus request.</p>
                </div>
                <button onClick={() => { setTestimonyModalOpen(false); setSelectedPrayerForTestimony(null); }} className="text-slate-400 hover:text-slate-600 p-1"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-sans">Breakthrough Testimony</label>
                  <textarea 
                    value={testimonyText}
                    onChange={(e) => setTestimonyText(e.target.value)}
                    rows={4} 
                    placeholder="Describe how this prayer was answered to inspire and build faith in the community..." 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-xs font-medium transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => { setTestimonyModalOpen(false); setSelectedPrayerForTestimony(null); }}
                    className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleMarkAnswered(selectedPrayerForTestimony, testimonyText)}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl font-bold text-xs hover:from-amber-600 hover:to-yellow-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    Submit Testimony 🎉
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
