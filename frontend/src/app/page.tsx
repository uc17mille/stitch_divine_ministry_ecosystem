'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Heart, Globe, Star, Sparkles, Play, ShieldCheck, Flame } from 'lucide-react';

const stats = [
  { label: 'GLOBAL LEADERS', value: '140+', desc: 'Pastors mentored globally.', icon: Globe, color: 'text-sky-500', bg: 'bg-sky-50' },
  { label: 'PRAYER VOLUME', value: '2.4M', desc: 'Petitions processed annually.', icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
  { label: 'ACADEMY HOURS', value: '85k', desc: 'Leadership content consumed.', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'SATISFACTION', value: '98%', desc: 'Retention in mentorship pods.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const features = [
  { icon: Users, title: '1-on-1 Mentorship', desc: 'Book private, dedicated sessions directly with Rev. Dubus Achufusi to accelerate your calling.', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', glow: 'shadow-blue-500/20' },
  { icon: BookOpen, title: 'Leadership Academy', desc: 'Access exclusive, world-class courses designed to build the modern pastoral heart.', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', glow: 'shadow-red-500/20' },
  { icon: Heart, title: 'Prayer Network', desc: 'A sacred digital space for communal intercession and spiritual breakthrough.', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100', glow: 'shadow-sky-500/20' },
  { icon: Globe, title: 'Global Community', desc: 'Join thousands of believers sharing, discussing, and growing together globally.', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', glow: 'shadow-emerald-500/20' },
];

const courses = [
  { title: 'The Modern Pastoral Heart', instructor: 'Rev. Dubus Achufusi', category: 'Leadership', lessons: 12, rating: 4.9, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800' },
  { title: 'Digital Ministry & Mission', instructor: 'Rev. Dubus Achufusi', category: 'Evangelism', lessons: 8, rating: 4.8, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800' },
  { title: 'Systematic Theology', instructor: 'Prof. James Whitfield', category: 'Theology', lessons: 24, rating: 5.0, image: 'https://images.unsplash.com/photo-1507676184212-70b1cb3b4c19?auto=format&fit=crop&q=80&w=800' },
  { title: 'Spiritual Formation', instructor: 'Grace Adeyemi', category: 'Worship', lessons: 10, rating: 4.9, image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800' },
];

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-blue-500/20 font-sans" ref={containerRef}>
      
      {/* Precision Navigation */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-lg font-bold text-white shadow-md">R</div>
            <span className="font-bold text-xl tracking-tight text-blue-950">Lumora</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            {['Academy', 'Mentorship', 'Community', 'Prayer'].map(item => (
              <Link 
                key={item} 
                href={item === 'Academy' ? '/academy-info' : `/${item.toLowerCase()}`} 
                className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-bold tracking-wide uppercase"
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 px-4 py-2 transition-colors">Sign In</Link>
            <Link href="/register" className="bg-blue-900 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-blue-800 hover:shadow-lg hover:shadow-blue-500/30 transition-all">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Personalized Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden bg-white">
        {/* Soft blue ambient glow in the background */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-sky-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-50" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-100/50 rounded-full blur-[120px] mix-blend-multiply opacity-60" />
        
        <motion.div 
          style={{ y }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center mt-12"
        >
          {/* Left Column: Text & CTA */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-8 shadow-sm"
            >
              <Sparkles size={14} className="text-blue-600" />
              <span className="text-xs font-bold tracking-widest text-blue-800 uppercase">Exclusive Mentorship Access</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
              className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight text-blue-950 mb-8"
            >
              Transform Your Ministry with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Rev. Dubus Achufusi.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-lg"
            >
              Step into a global discipleship and mentorship movement. Cultivate intimacy with God, develop Christlike character, and build a ministry that bears lasting fruit alongside a global family of Kingdom-minded leaders.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link href="/register" className="bg-red-600 text-white text-base font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/30 transition-all">
                Apply for Mentorship <ArrowRight size={18} />
              </Link>
              <Link href="/academy" className="bg-white border border-slate-200 text-slate-700 text-base font-bold px-8 py-4 rounded-full hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all flex items-center gap-2">
                <Play size={18} /> View Academy
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Featured Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white group"
          >
            {/* The image will be loaded from the public folder */}
            <img 
              src="/rev-dubus-desk.jpg" 
              alt="Rev. Dubus Achufusi" 
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                // Fallback styling if the image isn't moved yet
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800';
              }}
            />
            
            {/* Elegant gradient overlay at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/20 to-transparent pointer-events-none" />
            
            {/* Floating name badge */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-white font-black text-xl mb-1">Rev. Dubus Achufusi</p>
                  <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Lead Mentor & Founder</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/40">
                  <Star size={18} fill="currentColor" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Structural Marquee within Container Width */}
      <div className="w-full bg-blue-950 py-5 overflow-hidden relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            animate={{ x: [0, -1000] }} 
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex whitespace-nowrap items-center gap-12 text-sm font-bold uppercase tracking-[0.2em] text-blue-200/50"
          >
            {Array(10).fill('Lead • Mentor • Connect • Pray • Grow • ').map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Rebalanced Bento Grid */}
      <section className="w-full py-24 relative z-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-blue-950">The Mentorship Ecosystem.</h2>
            <p className="text-lg text-slate-500 font-medium">One unified platform for learning, mentorship, community, and prayer, designed with breathtaking clarity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[260px]">
            {/* Features Boxes */}
            {features.map((feature, i) => (
              <motion.div 
                key={feature.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`rounded-3xl bg-white border ${feature.border} p-8 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl ${feature.glow}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <feature.icon size={28} className={feature.color} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="rounded-3xl p-8 bg-white border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight text-slate-900 mb-1">{stat.value}</h3>
                  <p className="text-xs font-bold tracking-widest text-slate-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contained Curriculum Section with Imagery */}
      <section className="w-full py-24 border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-blue-950">Academy Highlights.</h2>
            <p className="text-lg text-slate-500 font-medium">Master leadership and theology with world-class mentors.</p>
          </div>
          <Link href="/academy" className="text-red-600 text-sm font-bold tracking-widest uppercase flex items-center gap-2 hover:text-red-800 transition-colors">
            View Full Catalog <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <motion.div 
                key={course.title}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-white border border-slate-200 overflow-hidden group hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300"
              >
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700">
                      <Star size={12} fill="currentColor" />
                      <span className="font-bold text-xs text-white">{course.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2 leading-tight text-slate-900 line-clamp-2">{course.title}</h4>
                  <p className="text-blue-600 text-sm font-bold mb-4">{course.instructor}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><BookOpen size={14}/> {course.lessons} Lessons</span>
                    <button className="text-red-600 hover:text-red-800 transition-colors">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibrant Contained CTA */}
      <section className="w-full py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div 
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            viewport={{ once: true }}
            className="rounded-[3rem] bg-blue-950 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 border border-blue-900"
          >
            {/* Abstract blended imagery inside the CTA */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=2000" 
                alt="CTA background" 
                className="w-full h-full object-cover opacity-20 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/80 to-transparent" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-white">
                Ready to answer <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">the call?</span>
              </h2>
              <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto font-medium">Join thousands of believers already using Lumora to grow, serve, and connect directly with Rev. Dubus Achufusi.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="bg-red-600 text-white text-lg font-bold px-10 py-4 rounded-full hover:bg-red-500 transition-colors shadow-lg shadow-red-500/25 flex items-center justify-center gap-2">
                  Apply for Mentorship <ArrowRight size={20} />
                </Link>
                <Link href="/login" className="bg-white/10 text-white border border-white/20 backdrop-blur-md text-lg font-bold px-10 py-4 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center">
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contained Footer */}
      <footer className="w-full bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-xs font-bold text-white shadow-md">R</div>
            <span className="font-bold tracking-tight text-blue-950">Lumora</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">© 2026 Rev. Dubus Mentorship Ecosystem. Built for the future.</p>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <Link href="#" className="hover:text-blue-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
