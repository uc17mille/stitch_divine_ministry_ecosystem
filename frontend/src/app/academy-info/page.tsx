'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Sparkles, Flame, ShieldCheck, 
  Heart, Compass, Award, History, Quote, ChevronRight 
} from 'lucide-react';

const PILLARS = [
  { id: 1, name: 'Mentorship', desc: 'Intentional, relational discipleship.', icon: Heart },
  { id: 2, name: 'Spiritual Fatherhood', desc: 'Covering, accountability, and guidance.', icon: ShieldCheck },
  { id: 3, name: 'Spiritual Inheritance', desc: 'Impartation and the transfer of Kingdom values.', icon: History },
  { id: 4, name: 'Formation', desc: 'Christlike maturity and intimacy with God.', icon: Sparkles },
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
  },
  {
    id: 2,
    title: 'Christlikeness',
    subtitle: 'Character is greater than charisma.',
    desc: 'We are committed to becoming like Christ before becoming known by people. We value humility, holiness, integrity, faithfulness, and love as the true marks of spiritual maturity. Our goal is not simply to raise gifted ministers, but ministers whose lives reveal Jesus.',
    quote: null,
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: 'Passion for God’s Power',
    subtitle: 'We depend on the Holy Spirit’s wisdom and power.',
    desc: 'We believe ministry should be both biblically grounded and supernaturally empowered. We expect the Holy Spirit to teach, guide, heal, deliver, restore, impart gifts, and confirm the Gospel through His power with miracles, signs and wonders! We train ministers not only to understand Scripture but also to minister in the power of the Holy Spirit.',
    quote: null,
    icon: Sparkles,
  },
  {
    id: 4,
    title: 'Spiritual Fatherhood',
    subtitle: 'We grow through covenant relationships.',
    desc: 'We believe no minister was designed to fulfill God’s calling alone. Mentorship, spiritual fatherhood, accountability, and spiritual inheritance are God’s pattern for raising healthy leaders who will faithfully serve future generations.',
    quote: null,
    icon: Heart,
  },
  {
    id: 5,
    title: 'Kingdom Collaboration/Covenant',
    subtitle: 'We choose collaboration over competition.',
    desc: 'We celebrate what God is doing through others. We reject division, jealousy, and denominational pride. We are one Kingdom, one family, one mission. Together we can accomplish more for Christ than we ever could alone.',
    quote: null,
    icon: Compass,
  },
  {
    id: 6,
    title: 'Excellence',
    subtitle: 'We honor God by giving Him our very best.',
    desc: 'Excellence is not perfection. It is stewardship. We pursue excellence in leadership, ministry, communication, administration, relationships, and personal growth because the King deserves our best.',
    quote: null,
    icon: Award,
  },
  {
    id: 7,
    title: 'Legacy',
    subtitle: 'We build for generations.',
    desc: 'Everything we do is designed to outlive us. We intentionally raise, release, and empower others to carry the Gospel farther than we ever could. Our success is measured not only by what we build, but by what we faithfully pass on.',
    quote: null,
    icon: History,
  }
];

export default function AcademyInfoPage() {
  const [activeTab, setActiveTab] = useState<'mission' | 'values'>('mission');
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const [activeValue, setActiveValue] = useState<number>(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-500/20 font-sans flex flex-col">
      
      {/* Precision Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 transition-all shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
              <BookOpen size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black text-blue-600 tracking-wider block uppercase">LUMORA ACADEMY</span>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase">Mission & Values</h2>
            </div>
          </div>
        </div>
      </header>

      {/* Main Tabbed Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-10 md:py-16 flex flex-col gap-8">
        
        {/* Tab Selection Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              The Lumora Blueprint
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              Explore the calling, foundations, and values of our covenant mentorship.
            </p>
          </div>

          {/* Premium Pill Tabs selector */}
          <div className="flex bg-slate-200/60 p-1 rounded-2xl border border-slate-350/45">
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'mission'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mission & Pillars
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'values'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Core Values
            </button>
          </div>
        </div>

        {/* Tab content body */}
        <div className="flex-1 bg-white border border-slate-200/80 rounded-[2.5rem] p-6 md:p-12 shadow-xl shadow-slate-100/50 min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: MISSION & PILLARS */}
            {activeTab === 'mission' && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full items-stretch"
              >
                {/* Left side: Mission statement */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase block">THE ASSIGNMENT</span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                      Spiritual Covering <br/>
                      <span className="text-blue-600">& Mentorship.</span>
                    </h2>
                    
                    <div className="relative p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-[2rem] overflow-hidden">
                      <Quote className="text-blue-600/5 absolute top-6 left-6" size={80} />
                      <p className="text-base leading-relaxed text-slate-700 italic font-medium font-serif pt-2 relative z-10">
                        "To mentor, spiritually father, and equip Kingdom ministers to know God intimately, demonstrate the Holy Spirit’s power, build healthy Kingdom ministries, and leave a lasting spiritual inheritance."
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3.5">
                    <Sparkles className="text-blue-600 shrink-0 mt-0.5" size={16} />
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Lumora's covenant network represents structured, intentional discipleship. Hover or click on the right to examine our seven operational pillars.
                    </p>
                  </div>
                </div>

                {/* Right side: 7 Pillars List */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <div className="space-y-3.5">
                    {PILLARS.map((pillar) => {
                      const Icon = pillar.icon;
                      const isHovered = hoveredPillar === pillar.id;

                      return (
                        <div
                          key={pillar.id}
                          onMouseEnter={() => setHoveredPillar(pillar.id)}
                          onMouseLeave={() => setHoveredPillar(null)}
                          className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                            isHovered 
                              ? 'bg-slate-50 border-blue-300 shadow-md translate-x-2' 
                              : 'bg-white border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              isHovered ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Pillar 0{pillar.id}</span>
                              <h4 className="text-sm font-extrabold text-slate-900">{pillar.name}</h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {isHovered && (
                              <motion.span 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[11px] text-slate-500 font-medium"
                              >
                                {pillar.desc}
                              </motion.span>
                            )}
                            <ChevronRight size={14} className="text-slate-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: 7 CORE VALUES */}
            {activeTab === 'values' && (
              <motion.div
                key="values"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch h-full"
              >
                {/* Left side selector list (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase block">THE DNA</span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase">
                      Culture & <br/>
                      <span className="text-blue-600">Core Values.</span>
                    </h2>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto pr-2 py-4">
                    {CORE_VALUES.map((val) => {
                      const isActive = activeValue === val.id;
                      const Icon = val.icon;

                      return (
                        <button
                          key={val.id}
                          onClick={() => setActiveValue(val.id)}
                          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isActive 
                              ? 'bg-blue-50 border-blue-300 shadow-sm' 
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              <Icon size={14} />
                            </div>
                            <span className={`text-xs font-black uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-550'}`}>
                              {val.title}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                            0{val.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right side details card (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {CORE_VALUES.map((val) => {
                      if (val.id !== activeValue) return null;
                      const Icon = val.icon;

                      return (
                        <motion.div
                          key={val.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 shadow-sm flex flex-col justify-between min-h-[350px]"
                        >
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                                Value 0{val.id}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">{val.title}</h3>
                              <p className="text-xs font-bold text-blue-700 leading-snug">{val.subtitle}</p>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                              {val.desc}
                            </p>
                          </div>

                          {val.quote && (
                            <div className="mt-8 p-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 leading-snug italic font-serif flex items-center gap-3">
                              <Quote size={14} className="shrink-0 text-blue-600" />
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

        {/* CTA Banner */}
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 text-center space-y-5 relative overflow-hidden shrink-0 shadow-lg">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          <h3 className="text-lg md:text-xl font-black uppercase tracking-wide">Enter Covenant Mentorship</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Begin the spiritual covering registration under Reverend Dubus Achufusi by filling the onboarding covenant request.
          </p>
          <div className="pt-2">
            <Link 
              href="/onboarding"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider"
            >
              Apply for Mentorship
            </Link>
          </div>
        </div>

      </main>

      {/* Footer bar */}
      <footer className="shrink-0 bg-white border-t border-slate-200/80 py-6 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        © 2026-2027 Lumora Covenant Network • All Rights Reserved
      </footer>

    </div>
  );
}
