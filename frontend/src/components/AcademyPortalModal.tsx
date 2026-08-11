'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, Heart, Flame, ShieldCheck, 
  Award, History, Users, Compass, Quote, ArrowRight, BookOpen
} from 'lucide-react';

interface AcademyPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PILLARS = [
  { id: 1, name: 'Mentorship', desc: 'Intentional, relational discipleship.', icon: Users },
  { id: 2, name: 'Spiritual Fatherhood', desc: 'Covering, accountability, and guidance.', icon: ShieldCheck },
  { id: 3, name: 'Spiritual Inheritance', desc: 'Impartation and the transfer of Kingdom values.', icon: History },
  { id: 4, name: 'Formation', desc: 'Christlike maturity and intimacy with God.', icon: Heart },
  { id: 5, name: 'Demonstration', desc: 'Equipping ministers to minister in the Holy Spirit’s power.', icon: Flame },
  { id: 6, name: 'Community', desc: 'Covenant relationships and Kingdom collaboration.', icon: Compass },
  { id: 7, name: 'Legacy', desc: 'Raising leaders who will disciple and mentor others.', icon: Award },
];

const CORE_VALUES = [
  {
    id: 1,
    title: 'Intimacy with the Holy Spirit',
    subtitle: 'We minister from God’s presence before we minister to people.',
    desc: 'We believe that lasting Kingdom impact begins in the secret place. Before God entrusts us with influence, He calls us into relationship. We pursue intimacy with Christ as the foundation of every ministry assignment.',
    quote: '“Apart from Me you can do nothing.” — John 15:5',
    icon: Flame,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30'
  },
  {
    id: 2,
    title: 'Christlikeness',
    subtitle: 'Character is greater than charisma.',
    desc: 'We are committed to becoming like Christ before becoming known by people. We value humility, holiness, integrity, faithfulness, and love as the true marks of spiritual maturity. Our goal is not simply to raise gifted ministers, but ministers whose lives reveal Jesus.',
    quote: null,
    icon: ShieldCheck,
    color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30'
  },
  {
    id: 3,
    title: 'Passion for God’s Power',
    subtitle: 'We depend on the Holy Spirit’s wisdom and power.',
    desc: 'We believe ministry should be both biblically grounded and supernaturally empowered. We expect the Holy Spirit to teach, guide, heal, deliver, restore, impart gifts, and confirm the Gospel through His power with miracles, signs and wonders! We train ministers not only to understand Scripture but also to minister in the power of the Holy Spirit.',
    quote: null,
    icon: Sparkles,
    color: 'from-red-500/20 to-rose-500/20 text-rose-400 border-rose-500/30'
  },
  {
    id: 4,
    title: 'Spiritual Fatherhood',
    subtitle: 'We grow through covenant relationships.',
    desc: 'We believe no minister was designed to fulfill God’s calling alone. Mentorship, spiritual fatherhood, accountability, and spiritual inheritance are God’s pattern for raising healthy leaders who will faithfully serve future generations.',
    quote: null,
    icon: Users,
    color: 'from-purple-500/20 to-fuchsia-500/20 text-purple-400 border-purple-500/30'
  },
  {
    id: 5,
    title: 'Kingdom Collaboration/Covenant',
    subtitle: 'We choose collaboration over competition.',
    desc: 'We celebrate what God is doing through others. We reject division, jealousy, and denominational pride. We are one Kingdom, one family, one mission. Together we can accomplish more for Christ than we ever could alone.',
    quote: null,
    icon: Compass,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
  },
  {
    id: 6,
    title: 'Excellence',
    subtitle: 'We honor God by giving Him our very best.',
    desc: 'Excellence is not perfection. It is stewardship. We pursue excellence in leadership, ministry, communication, administration, relationships, and personal growth because the King deserves our best.',
    quote: null,
    icon: Award,
    color: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30'
  },
  {
    id: 7,
    title: 'Legacy',
    subtitle: 'We build for generations.',
    desc: 'Everything we do is designed to outlive us. We intentionally raise, release, and empower others to carry the Gospel farther than we ever could. Our success is measured not only by what we build, but by what we faithfully pass on.',
    quote: null,
    icon: History,
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30'
  }
];

export default function AcademyPortalModal({ isOpen, onClose }: AcademyPortalModalProps) {
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<'pillars' | 'values'>('pillars');
  const [activeValue, setActiveValue] = useState<number>(1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none font-sans">
          
          {/* Backblur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
          />

          {/* Premium Immersive Screen Canvas */}
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 180 }}
            className="relative w-full h-full md:w-[94vw] md:h-[90vh] md:rounded-[3rem] bg-slate-900 border border-slate-800 flex flex-col text-slate-100 overflow-hidden shadow-2xl z-10"
          >
            
            {/* Ambient Background Aura Lights */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Top Minimal Navigation */}
            <div className="relative z-10 shrink-0 border-b border-slate-800/80 px-8 py-5 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 shadow-lg shadow-orange-500/10">
                  <BookOpen size={18} className="stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-500 tracking-[0.2em] uppercase block">REV. DUBUS ACHUFUSI MENTORSHIP</span>
                  <h2 className="text-base font-black tracking-tight text-white uppercase">LUMORA ACADEMY</h2>
                </div>
              </div>

              {/* Selector Tabs */}
              <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setSelectedTab('pillars')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    selectedTab === 'pillars'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-orange-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mission & Pillars
                </button>
                <button
                  onClick={() => setSelectedTab('values')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    selectedTab === 'values'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-orange-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  7 Core Values
                </button>
              </div>

              {/* Floating Close */}
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center border border-slate-700/80 text-slate-300 hover:text-white transition-all shadow-md"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main Immersive Area */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12">
              <AnimatePresence mode="wait">
                
                {/* TAB 1: MISSION & PILLARS */}
                {selectedTab === 'pillars' && (
                  <motion.div
                    key="pillars"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch h-full"
                  >
                    
                    {/* Left editorial column (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                      <div className="space-y-6">
                        <span className="text-[10px] font-black text-amber-500 tracking-[0.25em] uppercase block">THE CALLING</span>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight uppercase">
                          Our Covenant <br/>
                          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Mission.</span>
                        </h1>
                        
                        <div className="relative p-8 bg-slate-950/60 rounded-[2rem] border border-slate-800/80 shadow-2xl overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                          <Quote className="text-amber-500/10 absolute top-6 left-6" size={70} />
                          <p className="text-base leading-relaxed text-slate-350 italic font-medium font-serif pt-4 relative z-10">
                            &quot;To mentor, spiritually father, and equip Kingdom ministers to know God intimately, demonstrate the Holy Spirit’s power, build healthy Kingdom ministries, and leave a lasting spiritual inheritance.&quot;
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                        <Sparkles className="text-amber-500 shrink-0" size={18} />
                        <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                          {"Hover on any pillar on the right to focus the spiritual architecture of Rev. Dubus Achufusi's mentorship framework."}
                        </p>
                      </div>
                    </div>

                    {/* Right column: The Pillars timeline layout (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                      <div className="space-y-4">
                        {PILLARS.map((pillar) => {
                          const Icon = pillar.icon;
                          const isHovered = hoveredPillar === pillar.id;

                          return (
                            <motion.div
                              key={pillar.id}
                              onMouseEnter={() => setHoveredPillar(pillar.id)}
                              onMouseLeave={() => setHoveredPillar(null)}
                              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                                isHovered 
                                  ? 'bg-slate-950 border-amber-500/40 shadow-xl shadow-amber-500/5 translate-x-2' 
                                  : 'bg-slate-950/30 border-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-5">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                                  isHovered 
                                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 shadow-lg shadow-orange-500/20' 
                                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                                }`}>
                                  <Icon size={18} />
                                </div>
                                <div>
                                  <span className={`text-[9px] font-black tracking-widest block uppercase transition-colors ${
                                    isHovered ? 'text-amber-500' : 'text-slate-500'
                                  }`}>Pillar 0{pillar.id}</span>
                                  <h4 className="text-sm font-extrabold text-white">{pillar.name}</h4>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                {isHovered && (
                                  <motion.p 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[11px] text-slate-400 font-medium text-right max-w-[240px] font-sans"
                                  >
                                    {pillar.desc}
                                  </motion.p>
                                )}
                                <ArrowRight size={14} className={`text-slate-600 transition-colors ${isHovered ? 'text-amber-500' : ''}`} />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* TAB 2: 7 CORE VALUES */}
                {selectedTab === 'values' && (
                  <motion.div
                    key="values"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch h-full"
                  >
                    
                    {/* Left column: values selector vertical timeline (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-amber-500 tracking-[0.25em] uppercase block">THE BLUEPRINT</span>
                        <h1 className="text-4xl font-black text-white leading-tight uppercase">
                          Our Seven <br/>
                          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Core Values.</span>
                        </h1>
                      </div>

                      <div className="space-y-2.5 flex-1 py-4 overflow-y-auto">
                        {CORE_VALUES.map((val) => {
                          const isActive = activeValue === val.id;
                          const Icon = val.icon;

                          return (
                            <button
                              key={val.id}
                              onClick={() => setActiveValue(val.id)}
                              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                                isActive 
                                  ? 'bg-slate-950 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                                  : 'bg-slate-950/20 border-slate-800/40 hover:bg-slate-900/60'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-500 border border-slate-800'
                                }`}>
                                  <Icon size={14} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                  {val.title}
                                </span>
                              </div>
                              <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-amber-500' : 'text-slate-650'}`}>
                                0{val.id}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right column: detailed value presentation box (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {CORE_VALUES.map((val) => {
                          if (val.id !== activeValue) return null;
                          const Icon = val.icon;

                          return (
                            <motion.div
                              key={val.id}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -15 }}
                              transition={{ duration: 0.25 }}
                              className="bg-slate-950 border border-slate-800/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]"
                            >
                              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                              
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <div className={`px-4 py-2 rounded-xl border bg-slate-900 text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-slate-800 text-slate-300`}>
                                    <Icon size={14} className="text-amber-500" />
                                    <span>Core Value 0{val.id}</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h3 className="text-2xl font-black text-white tracking-tight uppercase">{val.title}</h3>
                                  <p className="text-sm font-bold text-amber-500 leading-snug">{val.subtitle}</p>
                                </div>

                                <p className="text-sm text-slate-350 leading-relaxed font-sans font-medium">
                                  {val.desc}
                                </p>
                              </div>

                              {val.quote && (
                                <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs font-bold text-amber-400 leading-snug italic font-serif flex items-center gap-3">
                                  <Quote size={15} className="shrink-0 text-amber-500" />
                                  <span>{val.quote}</span>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Immersive Footer Bar */}
            <div className="relative z-10 shrink-0 bg-slate-950 border-t border-slate-800/80 py-4 px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>LUMORA COVENANT NETWORK • REV. DUBUS ACHUFUSI</span>
              <span>© 2026-2027 ECOSYSTEM ALL RIGHTS RESERVED</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
