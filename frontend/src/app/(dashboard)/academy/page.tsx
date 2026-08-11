'use client';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { toast } from 'sonner';
import { Search, BookOpen, Users, Play, Clock, ChevronRight, Award, Sparkles, Tv, Headphones } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// High-fidelity mock data just in case the backend isn't running
const MOCK_COURSES = [
  {
    id: 'course-1',
    title: 'The Architecture of Revival',
    description: 'Learn the foundational pillars of sparking and sustaining a spiritual revival in modern communities.',
    category: { name: 'Leadership' },
    image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800',
    _count: { modules: 12, enrollments: 1240 },
    duration: '4h 30m',
  },
  {
    id: 'course-2',
    title: 'Digital Ministry Strategies',
    description: 'Master the art of translating the Gospel into the digital ecosystem effectively.',
    category: { name: 'Technology' },
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800',
    _count: { modules: 8, enrollments: 890 },
    duration: '3h 15m',
  },
  {
    id: 'course-3',
    title: 'Advanced Expository Preaching',
    description: 'Deep dive into structural hermeneutics and captivating sermon delivery.',
    category: { name: 'Theology' },
    image: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=800',
    _count: { modules: 15, enrollments: 2100 },
    duration: '6h 45m',
  },
  {
    id: 'course-4',
    title: 'Pastoral Counseling Foundations',
    description: 'Essential skills for navigating crisis, trauma, and spiritual guidance in ministry.',
    category: { name: 'Counseling' },
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
    _count: { modules: 10, enrollments: 1560 },
    duration: '5h 00m',
  },
];

export default function AcademyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  
  // Use React Query, but fallback to MOCK_COURSES if backend is down or empty
  const { data: apiCourses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => coursesApi.getAll(),
    retry: 1
  });

  // Fetch my enrollments
  const { data: myEnrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => coursesApi.getMyEnrollments(),
    retry: 1
  });

  const displayCourses = apiCourses?.length > 0 ? apiCourses : MOCK_COURSES;

  const isCourseEnrolled = (courseId: string) => {
    if (typeof window !== 'undefined' && localStorage.getItem(`enrolled_${courseId}`)) {
      return true;
    }
    return myEnrollments?.some((e: any) => e.courseId === courseId || e.id === courseId);
  };

  const handleEnroll = async (courseId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`enrolled_${courseId}`, 'true');
    }
    try {
      if (!courseId.startsWith('course-')) {
        await coursesApi.enroll(courseId);
      }
      toast.success('Enrolled successfully! Redirecting...');
    } catch {
      // Graceful fallback if already enrolled
    }
    queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
    router.push(`/academy/${courseId}`);
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen font-sans">
      
      {/* 1. Premium Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-sm overflow-hidden border border-slate-100"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-sky-100/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4 border border-blue-100">
              <Award size={14} /> Official Curriculum
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">Ministry Academy</h1>
            <p className="text-lg text-slate-500 max-w-xl font-medium">Elevate your spiritual leadership with masterclass-level courses designed for the modern minister.</p>
          </div>

          {/* Floating Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, mentor, or keyword..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 shadow-sm rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* 2. Course Grid */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Sparkles size={20} className="text-blue-600" /> Featured Masterclasses
        </h2>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-96 shadow-sm border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                key={course.id} 
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col group"
              >
                {/* Cinematic Thumbnail */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={course.image || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800'} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Category Badge */}
                  {course.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                      {course.category.name}
                    </div>
                  )}

                  {/* Format Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-blue-900/80 backdrop-blur-md border border-blue-800/40 text-white text-[10px] font-black rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                    {course.format === 'AUDIO' ? (
                      <>
                        <Headphones size={10} /> Audio Class
                      </>
                    ) : course.format === 'VIDEO' ? (
                      <>
                        <Tv size={10} /> Video Class
                      </>
                    ) : (
                      <>
                        <Sparkles size={10} className="text-yellow-300 fill-yellow-300" /> Dual-Format
                      </>
                    )}
                  </div>

                  {/* Play Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-black text-xl text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">{course.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-2 flex-1">{course.description}</p>
                  
                  {/* Meta Stats */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-6 pb-6 border-b border-slate-100">
                    <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-blue-400" /> {course._count?.modules || 12} Modules</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-sky-400" /> {course.duration || '4h 30m'}</span>
                    <span className="flex items-center gap-1.5"><Users size={14} className="text-emerald-400" /> {course._count?.enrollments || 1200}+</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-auto">
                    {isCourseEnrolled(course.id) ? (
                      <Link 
                        href={`/academy/${course.id}`}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Play size={16} fill="currentColor" /> Continue
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleEnroll(course.id)} 
                        className="flex-1 bg-blue-950 text-white font-bold text-sm py-3 rounded-xl hover:bg-blue-900 hover:shadow-lg hover:shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
                      >
                        Enroll Now
                      </button>
                    )}
                    <Link 
                      href={`/academy/${course.id}`} 
                      className="px-4 py-3 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center justify-center"
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
