'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Search, Play, Volume2, Users, ArrowRight, 
  Sparkles, CheckCircle2, Clock, Layers, Filter, Eye, Plus
} from 'lucide-react';
import Link from 'next/link';

const MOCK_ACADEMY_COURSES = [
  {
    id: 'c1',
    title: 'Pastoral Leadership Intensive',
    description: 'An advanced 12-week blueprint covering servant leadership, church administration, governance, and crisis stewardship.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop',
    category: { name: 'Leadership' },
    format: 'VIDEO',
    modulesCount: 8,
    enrolledCount: 142,
    updatedAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'c2',
    title: 'Expository Preaching & Homiletics',
    description: 'Master the art of biblical sermon preparation, context analysis, rhetorical delivery, and transformative message structure.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
    category: { name: 'Homiletics' },
    format: 'BOTH',
    modulesCount: 6,
    enrolledCount: 98,
    updatedAt: '2026-07-20T00:00:00Z',
  },
  {
    id: 'c3',
    title: 'Systematic Theology & Doctrine',
    description: 'Deep dive into essential Christian doctrines, pneumatology, soteriology, and historical theological frameworks.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
    category: { name: 'Theology' },
    format: 'AUDIO',
    modulesCount: 10,
    enrolledCount: 215,
    updatedAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'c4',
    title: 'Worship Ministry Foundations',
    description: 'Cultivating spiritual depth, team dynamics, music arranging, and leading congregational worship experiences.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    category: { name: 'Worship' },
    format: 'VIDEO',
    modulesCount: 5,
    enrolledCount: 88,
    updatedAt: '2026-07-28T00:00:00Z',
  },
];

export default function MentorCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Fetch real courses from backend
  const { data: apiCourses = [] } = useQuery({
    queryKey: ['mentor-academy-courses'],
    queryFn: () => coursesApi.getAll(),
    retry: 1,
  });

  const courses = apiCourses.length > 0 ? apiCourses : MOCK_ACADEMY_COURSES;

  const categories = ['ALL', 'Leadership', 'Homiletics', 'Theology', 'Worship'];

  const filteredCourses = courses.filter((c: any) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || c.category?.name === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* 1. HERO HEADER */}
      <div className="relative bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl overflow-hidden border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-4">
            <BookOpen size={13} className="text-teal-300" />
            <span className="text-[11px] font-extrabold tracking-widest text-teal-200 uppercase">Academy Curriculum Library</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none mb-3">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-200">Academy Courses</span>
          </h1>
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            Review course material, audit video & audio lectures, and recommend specific modules to your active mentees.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Link 
            href="/academy" 
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-teal-500/30 hover:scale-105 transition-all"
          >
            <Eye size={18} /> Full Student View
          </Link>
        </div>
      </div>

      {/* 2. SEARCH & CATEGORY FILTERS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Search course title or topic..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:bg-white transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. COURSE GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course: any, i: number) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            key={course.id || i}
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-300 flex flex-col group"
          >
            {/* Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img 
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop'} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
                  {course.category?.name || 'Academy'}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-teal-500/90 text-white backdrop-blur-md uppercase tracking-wider flex items-center gap-1">
                  {course.format === 'BOTH' ? <><Play size={10} /><Volume2 size={10} /></> : course.format === 'AUDIO' ? <Volume2 size={10} /> : <Play size={10} />}
                  {course.format}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                <span className="flex items-center gap-1.5"><Users size={14} className="text-teal-300" /> {course.enrolledCount || 100}+ Enrolled</span>
                <span className="flex items-center gap-1.5"><Layers size={14} className="text-teal-300" /> {course.modulesCount || 8} Modules</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-600 transition-colors leading-snug mb-2">
                  {course.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/academy/${course.id}`}
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-extrabold text-xs tracking-wide uppercase group-hover:translate-x-1 transition-all"
                >
                  Review Course Content <ArrowRight size={14} />
                </Link>

                <button 
                  onClick={() => alert(`Assigned ${course.title} recommendation to your mentees!`)}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-100 text-[11px] font-extrabold transition-all flex items-center gap-1.5"
                >
                  <Plus size={13} /> Recommend
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
