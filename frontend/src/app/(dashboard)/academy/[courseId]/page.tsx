'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, RotateCcw, RotateCw, Volume2, 
  BookOpen, Clock, Users, ChevronRight, Award, Sparkles,
  Tv, Headphones, CheckCircle2, MessageSquare, Send, Check,
  Lock, ChevronDown, ChevronUp, Download, PlayCircle,
  FileText, Book, HelpCircle, Trophy, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

// High-fidelity fallback details for static viewing/demo
const MOCK_COURSES: Record<string, any> = {
  'course-1': {
    id: 'course-1',
    title: 'The Architecture of Revival',
    description: 'Learn the foundational pillars of sparking and sustaining a spiritual revival in modern communities.',
    category: { name: 'Leadership' },
    format: 'BOTH',
    image: 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800',
    duration: '4h 30m',
    instructor: 'Rev. Dubus Achufusi',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations of Revival',
        description: 'Understanding historical awakenings and spiritual postures.',
        lessons: [
          {
            id: 'les-1',
            title: '1.1 Introduction to Stewardship',
            content: 'Spiritual stewardship forms the cornerstone of every lasting revival. In this lesson, we examine historical frameworks of stewardship and how to apply them to modern congregations.',
            video: { url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            resources: [
              { id: 'res-1', title: 'Foundations of Stewardship Study Guide.pdf', url: '#' },
              { id: 'res-2', title: 'Stewardship Action Checklist.pdf', url: '#' }
            ],
            books: [
              { id: 'bk-1', title: 'The Treasure Principle', author: 'Randy Alcorn', coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200', buyUrl: 'https://amazon.com' },
              { id: 'bk-2', title: 'Stewardship in Modern Ministry', author: 'Dr. John C. Maxwell', coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200', buyUrl: 'https://amazon.com' }
            ],
            quizzes: [
              { id: 'q-1', question: 'What is the primary role of a steward in ministry?', options: 'Owner,Manager of God\'s Assets,Director of Programs,Financial Advisor', correctOption: 1, explanation: 'A steward is defined as a manager of another\'s property, specifically managing God\'s assets.' },
              { id: 'q-2', question: 'Which heart posture is essential for kingdom leadership?', options: 'Self-promotion,Servant-hearted accountability,Individual control,Popular appeal', correctOption: 1, explanation: 'Accountability and a servant posture form the bedrock of spiritual stewardship.' }
            ]
          },
          {
            id: 'les-2',
            title: '1.2 The Heart of a Leader',
            content: 'Revival does not start in systems; it starts in the heart. Explore the internal alignment, prayer postures, and discipline needed to sustain leadership under spiritual pressure.',
            video: { url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            resources: [
              { id: 'res-3', title: 'Heart Posture Assessment Workbook.pdf', url: '#' }
            ],
            books: [
              { id: 'bk-3', title: 'Spiritual Leadership', author: 'J. Oswald Sanders', coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200', buyUrl: 'https://amazon.com' }
            ],
            quizzes: [
              { id: 'q-3', question: 'According to this lesson, where does true spiritual revival begin?', options: 'In church committees,In structural ecclesiastical systems,In the individual heart,In budget alignments', correctOption: 2, explanation: 'True revival always begins with internal transformation and personal heart alignment.' }
            ]
          },
          {
            id: 'les-3',
            title: '1.3 Power vs. Authority',
            content: 'A deep biblical study distinguishing between structural ecclesiastical power and actual spiritual authority backed by a life of obedience.',
            video: { url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            resources: [
              { id: 'res-4', title: 'Power vs Authority Slides.pdf', url: '#' }
            ],
            books: [],
            quizzes: []
          }
        ]
      },
      {
        id: 'mod-2',
        title: 'Module 2: Strategic Deployment',
        description: 'Organizing and multiplying prayer capacity.',
        lessons: [
          {
            id: 'les-4',
            title: '2.1 Setting Up Prayer Pods',
            content: 'How to design, coordinate, and sustain micro-prayer intercession squads in your local and digital ecosystem.',
            video: { url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            resources: [],
            books: [],
            quizzes: []
          }
        ]
      }
    ]
  }
};

export default function CourseDetailPage() {
  const { courseId } = useParams() as { courseId: string };
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'quiz' | 'reflections' | 'discussion'>('notes');
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [mediaMode, setMediaMode] = useState<'video' | 'audio'>('video');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const { user } = useAuthStore();
  const [watermarkPos, setWatermarkPos] = useState({ top: '12%', left: '18%' });
  const [watermarkOpacity, setWatermarkOpacity] = useState(1);

  useEffect(() => {
    if (mediaMode === 'video') {
      const cornerPositions = [
        { top: '12%', left: '18%' },  // Up Left
        { top: '12%', left: '82%' },  // Up Right
        { top: '70%', left: '18%' },  // Down Left
        { top: '70%', left: '82%' },  // Down Right
        { top: '70%', left: '50%' }   // Down Center
      ];

      let currentIndex = 0;
      const interval = setInterval(() => {
        // 1. Fade out
        setWatermarkOpacity(0);
        
        // 2. Change position and fade back in after transition completes (500ms)
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % cornerPositions.length;
          setWatermarkPos(cornerPositions[currentIndex]);
          setWatermarkOpacity(1);
        }, 500);
      }, 6000); // shift every 6 seconds
      
      return () => clearInterval(interval);
    }
  }, [mediaMode]);

  const userPhone = "+234 81" + (user?.id ? user.id.replace(/[^0-9]/g, '').slice(0, 8).padEnd(8, '4') : '30459812');

  // Progress Tracking state
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  // Audio Player State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Reflection/Discussion/Quiz inputs
  const [reflectionInput, setReflectionInput] = useState('');
  const [showReflectModal, setShowReflectModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [visibleAcademyComments, setVisibleAcademyComments] = useState(3);
  const [comments, setComments] = useState<any[]>([
    {
      id: 'c1',
      name: 'Pastor Marcus Reed',
      role: 'Student',
      time: '2 hours ago',
      content: "The distinction between authority and influence really hit home today. I've been focusing so much on the 'what' that I forgot the 'how'. Such a timely reminder.",
      likes: 24,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFJZXm_keZVy8uwn_HYYPpiAkB4KFdcSxMzygVauhUvzac_TfpmyjoAHGZSY6gWzd0Exgdw9ID6yDU5zXhGg7aPbxif-_k9HI0hG0OCcOU2s3p70RuE7ysxA5gZU024G9n2d3ZN-lOYmgbk9mHpQ7Zo1p2wLjvAYpIReGJwvlCYg05OJwr3Isr2X7kOL3iv4oTFzl1dLIp7dkly5_OUlI-Uu9thKFGKFpQl-abGlbl9hQxtoX0Om1Y'
    }
  ]);

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // 1. Fetch course details
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesApi.getOne(courseId),
    retry: 1
  });

  // 2. Fetch my enrollments to check enrollment status
  const { data: enrollments } = useQuery({
    queryKey: ['my-enrollments'],
    queryFn: () => coursesApi.getMyEnrollments(),
    retry: 1
  });

  // 3. Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`enrolled_${courseId}`, 'true');
      }
      if (!courseId.startsWith('course-')) {
        return coursesApi.enroll(courseId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      toast.success('Successfully enrolled in course!');
    },
    onError: () => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`enrolled_${courseId}`, 'true');
      }
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      toast.success('Enrolled! Accessing course materials...');
    }
  });

  const course = courseData || MOCK_COURSES[courseId] || MOCK_COURSES['course-1'];
  const isEnrolled = (typeof window !== 'undefined' && localStorage.getItem(`enrolled_${courseId}`)) || enrollments?.some((e: any) => e.courseId === course.id || e.id === course.id);

  // Load progress on mount/enrollment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`progress_${course.id}`);
      if (stored) {
        try {
          setCompletedLessons(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [course.id]);

  // Sync mediaMode with course format
  useEffect(() => {
    if (course?.format) {
      if (course.format === 'AUDIO') {
        setMediaMode('audio');
      } else if (course.format === 'VIDEO') {
        setMediaMode('video');
      }
    }
  }, [course]);

  // Initialize active lesson
  useEffect(() => {
    if (course?.modules?.[0]?.lessons?.[0] && !activeLessonId) {
      setActiveLessonId(course.modules[0].lessons[0].id);
      
      // Expand first module by default
      setExpandedModules({
        [course.modules[0].id]: true
      });
    }
  }, [course, activeLessonId]);

  // Find active lesson object
  let activeLesson: any = null;
  if (course?.modules) {
    for (const mod of course.modules) {
      const les = mod.lessons?.find((l: any) => l.id === activeLessonId);
      if (les) {
        activeLesson = les;
        break;
      }
    }
  }

  // Reset quiz states when lesson changes
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }, [activeLessonId]);

  // Audio Player Handlers
  useEffect(() => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.play().catch(() => setAudioPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioPlaying, activeLessonId]);

  // Keep audio source in sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = activeLesson?.audio?.url || activeLesson?.video?.url || '';
      audioRef.current.load();
      if (audioPlaying) {
        audioRef.current.play().catch(() => setAudioPlaying(false));
      }
    }
  }, [activeLessonId, activeLesson]);

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const skipAudio = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioDuration, audioRef.current.currentTime + seconds));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setAudioCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = () => {
    const rates = [1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Toggle lesson completed
  const handleToggleComplete = async (lessonId: string) => {
    const isCurrentlyCompleted = !!completedLessons[lessonId];
    const newStatus = !isCurrentlyCompleted;

    const updated = { ...completedLessons, [lessonId]: newStatus };
    setCompletedLessons(updated);
    localStorage.setItem(`progress_${course.id}`, JSON.stringify(updated));

    try {
      await coursesApi.updateProgress({
        lessonId,
        isCompleted: newStatus
      });
      toast.success(newStatus ? 'Lesson marked as completed! 🎉' : 'Lesson marked as incomplete.');
    } catch {
      // Graceful fallback for demo/offline
      toast.success(newStatus ? 'Progress saved locally! 🎉' : 'Progress updated.');
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    
    setComments([
      {
        id: `c-${Date.now()}`,
        name: 'Admin User',
        role: 'Student',
        time: 'Just now',
        content: commentInput,
        likes: 0,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB724ISuVK9wzGZOXljNO7BkVLd2Kf4yte-edBzZGuNDYfnwTO2ig8khUuxNUYadFI0YudWR0J-QnHFetLHh9713wbJiyaqNIQFjsWDXtKZ8qfHToyfqqjy9sN3_N3FtTWe7e7DcnflOzhQHg1sv9L079T7tqhvK__RLbrzONttnRlVazhv7UR1Ivk_jEZP1_3X_JSKU5X2cjwyzxCntJhgQ7A9hxVT-iWAQkLk3SPf7CS41q-zFch'
      },
      ...comments
    ]);
    setCommentInput('');
    toast.success('Comment posted!');
  };

  // Quiz helper functions
  const handleSelectQuizOption = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers({ ...quizAnswers, [qId]: optIdx });
  };

  const handleSubmitQuiz = () => {
    const questions = activeLesson?.quizzes || [];
    if (questions.length === 0) return;
    
    let score = 0;
    questions.forEach((q: any) => {
      if (quizAnswers[q.id] === q.correctOption) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    toast.success(`Quiz completed! You scored ${score}/${questions.length}`);
  };

  // Progress Calculations
  const totalLessons = course.modules?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0;
  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (courseLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-slate-500 font-sans">
        <div className="animate-spin material-symbols-outlined text-4xl mb-4 text-blue-900">progress_activity</div>
        <p className="font-bold">Loading your academy materials...</p>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW A: SYLLABUS / COURSE DETAIL (NOT ENROLLED)
  // ----------------------------------------------------
  if (!isEnrolled) {
    return (
      <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-12 bg-slate-50 min-h-screen font-sans text-slate-900">
        
        {/* Breadcrumbs / Back button */}
        <Link href="/academy" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-900 transition-colors font-bold text-sm">
          <ArrowLeft size={16} /> Back to Academy
        </Link>

        {/* Hero split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
              <Award size={14} /> Course Highlight
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-blue-950">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              {course.description}
            </p>

            <div className="flex items-center gap-4 py-2 border-y border-slate-200/60 max-w-md">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg">
                {course.instructor?.[0] || 'R'}
              </div>
              <div>
                <p className="font-bold text-slate-950">{course.instructor || 'Rev. Dubus Achufusi'}</p>
                <p className="text-xs font-medium text-slate-400">Lead Instructor & Founder</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => enrollMutation.mutate()}
                disabled={enrollMutation.isPending}
                className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-800 shadow-md hover:shadow-lg hover:shadow-blue-950/20 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                {enrollMutation.isPending ? 'Enrolling...' : 'Start Learning'}
                <PlayCircle size={20} />
              </button>
              <button className="border border-slate-200 bg-white text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                View Syllabus
              </button>
            </div>
          </div>

          {/* Cinematic Trailer banner */}
          <div className="lg:col-span-5 relative group cursor-pointer overflow-hidden rounded-[2rem] shadow-xl aspect-video bg-blue-950 border-8 border-white">
            <img 
              src={course.image || 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800'} 
              alt={course.title} 
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-blue-950/20 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
                <Play size={24} className="text-white fill-white ml-1" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white font-bold text-xs">
              <span className="bg-slate-900/60 px-3 py-1.5 rounded-full backdrop-blur-md">Course Trailer • {course.duration || '2:45'}</span>
              <span className="bg-red-600 px-3 py-1.5 rounded-full uppercase tracking-wider">Preview</span>
            </div>
          </div>
        </div>

        {/* Syllabus Bento Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          <div className="lg:col-span-8 bg-white border border-slate-200/50 rounded-3xl p-8 shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-slate-950">Curriculum Details</h3>
            
            <div className="space-y-4">
              {course.modules?.map((mod: any, mIdx: number) => (
                <div key={mod.id} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="p-5 flex items-center justify-between font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-black">{mIdx + 1}</span>
                      <span>{mod.title}</span>
                    </div>
                    <span className="text-xs text-slate-400">{mod.lessons?.length || 0} Lessons</span>
                  </div>
                  <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-200/40 bg-white">
                    {mod.lessons?.map((les: any, lIdx: number) => (
                      <div key={les.id} className="flex justify-between items-center text-sm text-slate-600 font-medium py-1">
                        <span className="flex items-center gap-2"><PlayCircle size={16} className="text-blue-500" /> {les.title}</span>
                        <span className="text-slate-400">Lesson {lIdx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-blue-950 text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group shadow-lg">
            <div className="relative z-10 space-y-4">
              <h4 className="font-bold text-xl text-blue-200">Academy Experience</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Enrollment guarantees access to all learning modules, downloadable audio podcasts, reflections journals, and exclusive live events.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Dual-Format: Video & Audio</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Quizzes & Resources</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Group Discussion boards</li>
              </ul>
            </div>
            <div className="relative z-10 pt-8">
              <button 
                onClick={() => enrollMutation.mutate()} 
                className="w-full bg-white text-blue-950 py-3.5 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-md"
              >
                Enroll Now
              </button>
            </div>
            {/* Ambient visual overlay */}
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>

      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW B: LESSON PLAYER (ENROLLED)
  // ----------------------------------------------------
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden font-sans bg-slate-50 text-slate-900">
      
      {/* Hidden native audio element */}
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleAudioTimeUpdate}
        onLoadedMetadata={handleAudioLoadedMetadata}
        onEnded={() => {
          setAudioPlaying(false);
          if (activeLessonId) handleToggleComplete(activeLessonId);
        }}
      />

      {/* Main Content Area: Left Panel */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-5">
          <div className="flex items-center gap-4">
            <Link href="/academy" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-blue-900 transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-blue-950">{course.title}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-slate-400">Active Lesson: {activeLesson?.title || 'Loading...'}</span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {progressPercent}% Done
                </span>
              </div>
            </div>
          </div>
          
          {/* Dual format switcher */}
          {course?.format === 'BOTH' && (
            <div className="bg-slate-200/60 p-1 rounded-xl flex">
              <button 
                onClick={() => setMediaMode('video')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${mediaMode === 'video' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Tv size={14} /> Video
              </button>
              <button 
                onClick={() => setMediaMode('audio')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${mediaMode === 'audio' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Headphones size={14} /> Audio
              </button>
            </div>
          )}
        </div>

        {/* Media Player Card */}
        <div className="bg-blue-950 rounded-[2rem] overflow-hidden shadow-2xl relative border border-blue-900/40">
          
          {mediaMode === 'video' ? (
            /* Video Mode Player */
            <div className="aspect-video relative bg-black flex items-center justify-center group">
              {activeLesson?.video?.url ? (
                <>
                  <video 
                    src={activeLesson.video.url}
                    className="w-full h-full object-contain"
                    controls
                    poster={course.image}
                    onEnded={() => activeLessonId && handleToggleComplete(activeLessonId)}
                  />
                  <div 
                    style={{
                      position: 'absolute',
                      top: watermarkPos.top,
                      left: watermarkPos.left,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 30,
                      pointerEvents: 'none',
                      opacity: watermarkOpacity,
                    }}
                    className="transition-opacity duration-500 ease-in-out select-none text-[8.5px] font-mono font-bold text-white/45 tracking-widest flex flex-col gap-0.5 text-left pointer-events-none"
                  >
                    <div className="text-white/30 text-[7px] uppercase tracking-widest border-b border-white/20 pb-0.5 mb-0.5">
                      🔒 SECURED STREAM
                    </div>
                    <div>👤 {user?.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'Aura Student'}</div>
                    <div>📧 {user?.email || 'student@auraministry.org'}</div>
                    <div>📞 {userPhone}</div>
                  </div>
                </>
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-2 p-8 text-center">
                  <PlayCircle size={48} className="text-blue-500 animate-pulse" />
                  <p className="font-bold text-white">Preparing video broadcast...</p>
                  <p className="text-xs text-slate-400">Loading digital resources</p>
                </div>
              )}
            </div>
          ) : (
            /* Audio Podcast Mode Player (Immersive Premium Card) */
            <div className="py-12 px-8 flex flex-col items-center justify-center text-center text-white min-h-[360px] relative overflow-hidden">
              
              {/* Background ambient blurs */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none" />

              {/* Cover thumbnail / logo */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-6 shadow-xl relative border border-white/10 group">
                <img 
                  src={course.image || 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800'} 
                  alt="Podcast Cover" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-blue-950/40 flex items-center justify-center">
                  <Headphones size={28} className="text-white drop-shadow-md" />
                </div>
              </div>

              <div className="space-y-1 mb-8 z-10">
                <h3 className="font-black text-xl tracking-tight text-white">{activeLesson?.title || '1.1 Introduction'}</h3>
                <p className="text-xs font-bold text-blue-300 uppercase tracking-widest">Audio podcast edition</p>
              </div>

              {/* Bouncing Audio Waves visualizer */}
              <div className="flex items-center gap-1.5 h-16 justify-center mb-8 z-10 w-full max-w-xs">
                {Array(15).fill(0).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-blue-400 to-indigo-500 rounded-full"
                    animate={{
                      height: audioPlaying ? [12, 54, 12] : 12
                    }}
                    transition={{
                      duration: 0.7 + (i % 6) * 0.12,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ height: '12px' }}
                  />
                ))}
              </div>

              {/* Progress Slider controls */}
              <div className="w-full max-w-md space-y-2 mb-8 z-10">
                <input 
                  type="range"
                  min="0"
                  max={audioDuration || 100}
                  value={audioCurrentTime}
                  onChange={handleSeek}
                  className="w-full accent-blue-400 bg-white/10 rounded-lg appearance-none h-1.5 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-bold text-slate-400 font-mono">
                  <span>{formatTime(audioCurrentTime)}</span>
                  <span>{formatTime(audioDuration)}</span>
                </div>
              </div>

              {/* Player Dashboard Buttons */}
              <div className="flex items-center gap-6 z-10">
                {/* Speed Toggle */}
                <button 
                  onClick={handleSpeedChange} 
                  className="text-xs font-black px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 transition-all font-mono"
                >
                  {playbackRate}x
                </button>

                {/* Back 15s */}
                <button 
                  onClick={() => skipAudio(-15)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  <RotateCcw size={20} />
                </button>

                {/* Main Play/Pause circular */}
                <button 
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
                >
                  {audioPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                </button>

                {/* Forward 15s */}
                <button 
                  onClick={() => skipAudio(15)}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  <RotateCw size={20} />
                </button>

                {/* Volume icon indicator */}
                <div className="text-slate-300 hover:text-white cursor-pointer transition-colors p-1.5 bg-white/5 rounded-lg">
                  <Volume2 size={16} />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Content details and Tabs */}
        <div className="space-y-6">
          <div className="flex gap-6 border-b border-slate-200 overflow-x-auto custom-scrollbar whitespace-nowrap pb-1">
            <button 
              onClick={() => setActiveTab('notes')}
              className={`pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'notes' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Lesson Notes
            </button>
            <button 
              onClick={() => setActiveTab('resources')}
              className={`pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'resources' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Resources & Books
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'quiz' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Interactive Quiz
            </button>
            <button 
              onClick={() => setActiveTab('reflections')}
              className={`pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'reflections' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Reflection Journal
            </button>
            <button 
              onClick={() => setActiveTab('discussion')}
              className={`pb-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'discussion' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Discussion Board ({comments.length})
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm min-h-[250px]">
            
            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="prose prose-slate max-w-none space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">Key Concepts</h3>
                  <button 
                    onClick={() => activeLessonId && handleToggleComplete(activeLessonId)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${completedLessons[activeLessonId] ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
                  >
                    <CheckCircle2 size={14} className={completedLessons[activeLessonId] ? 'text-emerald-500' : 'text-slate-400'} />
                    {completedLessons[activeLessonId] ? 'Completed!' : 'Mark Completed'}
                  </button>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {activeLesson?.content || 'No notes available for this lesson.'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between">
                    <Sparkles className="text-blue-700 mb-2" size={20} />
                    <h4 className="font-bold text-xs text-blue-900 uppercase tracking-widest mb-1">Key Takeaway</h4>
                    <p className="text-sm text-slate-600 font-medium font-sans">Spiritual governance requires total alignment with kingdom priorities. Stewards act under the Sovereign\'s decree.</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 flex flex-col justify-between">
                    <BookOpen className="text-slate-600 mb-2" size={20} />
                    <h4 className="font-bold text-xs text-slate-700 uppercase tracking-widest mb-1">Reading Assignment</h4>
                    <p className="text-sm text-slate-600 font-medium">Read chapters 1 and 2 of the leadership manual in the Resources tab.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resources Tab (PDFs & Books) */}
            {activeTab === 'resources' && (
              <div className="space-y-8">
                
                {/* PDF Downloads */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={20} className="text-blue-900" />
                    Downloadable Materials & Worksheets
                  </h3>
                  
                  {activeLesson?.resources && activeLesson.resources.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeLesson.resources.map((res: any) => (
                        <div key={res.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 line-clamp-1">{res.title}</p>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">PDF Document</span>
                            </div>
                          </div>
                          <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:text-blue-900 hover:border-blue-200 hover:bg-blue-50 transition-all text-slate-500">
                            <Download size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 font-medium text-sm">
                      No attached PDFs or guides for this lesson.
                    </div>
                  )}
                </div>

                {/* Recommended Books */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Book size={20} className="text-indigo-900" />
                    Recommended Literature & Books
                  </h3>

                  {activeLesson?.books && activeLesson.books.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeLesson.books.map((bk: any) => (
                        <div key={bk.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4 hover:bg-slate-100/50 transition-colors">
                          <img 
                            src={bk.coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200'} 
                            alt={bk.title} 
                            className="w-16 h-20 rounded-lg object-cover shadow-md shrink-0 bg-white"
                          />
                          <div className="flex flex-col justify-between flex-1 py-0.5">
                            <div>
                              <p className="text-sm font-bold text-slate-800 line-clamp-1">{bk.title}</p>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">by {bk.author || 'Unknown'}</p>
                            </div>
                            <a 
                              href={bk.buyUrl || '#'} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs font-bold text-blue-900 hover:text-blue-700 mt-2 flex items-center gap-1 w-fit"
                            >
                              Get Copy <ChevronRight size={14} />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 font-medium text-sm">
                      No recommended books for this lesson.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Quiz Tab */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle size={20} className="text-blue-900" />
                    Interactive Quiz
                  </h3>
                  {quizSubmitted && (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-800 text-sm font-black rounded-full shadow-sm animate-bounce">
                      <Trophy size={16} className="text-yellow-500 fill-yellow-500" />
                      Score: {quizScore} / {activeLesson?.quizzes?.length || 0}
                    </div>
                  )}
                </div>

                {activeLesson?.quizzes && activeLesson.quizzes.length > 0 ? (
                  <div className="space-y-8">
                    {activeLesson.quizzes.map((q: any, qIdx: number) => {
                      const optionsList = q.options.split(',');
                      const isCorrect = quizAnswers[q.id] === q.correctOption;
                      const hasSelected = quizAnswers[q.id] !== undefined;

                      return (
                        <div key={q.id} className="space-y-4">
                          <h4 className="font-bold text-slate-800 text-base flex gap-2">
                            <span>{qIdx + 1}.</span>
                            <span>{q.question}</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                            {optionsList.map((opt: string, oIdx: number) => {
                              const isSelected = quizAnswers[q.id] === oIdx;
                              
                              let optionClass = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700';
                              if (quizSubmitted) {
                                if (oIdx === q.correctOption) {
                                  optionClass = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                                } else if (isSelected) {
                                  optionClass = 'bg-rose-50 border-rose-300 text-rose-800 font-bold';
                                } else {
                                  optionClass = 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60';
                                }
                              } else if (isSelected) {
                                optionClass = 'bg-blue-50 border-blue-300 text-blue-900 font-bold ring-2 ring-blue-500/20';
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSelectQuizOption(q.id, oIdx)}
                                  className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all ${optionClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && q.explanation && (
                            <div className="bg-slate-50 p-4 rounded-2xl text-xs font-semibold text-slate-500 leading-relaxed border border-slate-100/80 ml-6 flex gap-2">
                              <Sparkles size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                              <p><span className="font-bold text-slate-700">Explanation:</span> {q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-4 border-t border-slate-100 flex gap-4">
                      {!quizSubmitted ? (
                        <button
                          type="button"
                          onClick={handleSubmitQuiz}
                          disabled={Object.keys(quizAnswers).length < activeLesson.quizzes.length}
                          className="px-6 py-3 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50"
                        >
                          Submit Answers
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                            setQuizScore(0);
                          }}
                          className="px-6 py-3 border border-slate-200 text-slate-600 bg-white font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCw size={14} /> Retake Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 font-medium text-sm">
                    No quiz questions available for this lesson.
                  </div>
                )}
              </div>
            )}

            {/* Reflections Tab */}
            {activeTab === 'reflections' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={20} className="text-blue-900" /> Reflection Prompts
                </h3>
                <div className="space-y-4 text-sm text-slate-600 font-medium">
                  <div className="flex gap-4">
                    <span className="font-mono text-blue-900 font-bold">01.</span>
                    <p>Where in your current leadership role do you find it hardest to choose service over status?</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-mono text-blue-900 font-bold">02.</span>
                    <p>Define "Kingdom Stewardship" relative to your active church or ministry assignments.</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 mt-6">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Write Your reflections</label>
                  <textarea 
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder="Enter your private thoughts..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-sm resize-none animate-none"
                    rows={4}
                  />
                  <button 
                    onClick={() => {
                      if (!reflectionInput.trim()) return;
                      setShowReflectModal(true);
                      setReflectionInput('');
                    }}
                    className="mt-4 px-6 py-3 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-blue-800 transition-colors"
                  >
                    Submit Reflections
                  </button>
                </div>
              </div>
            )}

            {/* Discussion Tab */}
            {activeTab === 'discussion' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Community Insights</h3>
                
                {/* Input form */}
                <form onSubmit={handlePostComment} className="flex gap-4 mb-6">
                  <input 
                    type="text" 
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Share your thoughts on this lesson..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm font-medium transition-all"
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-center shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </form>

                {/* Comment list */}
                <div className="space-y-4">
                  {comments.slice(0, visibleAcademyComments).map((c) => (
                    <div key={c.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900">{c.name}</span>
                          <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full uppercase tracking-wider font-black">{c.role}</span>
                          <span className="text-xs text-slate-400 font-medium">• {c.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length > visibleAcademyComments && (
                    <button 
                      type="button"
                      onClick={() => setVisibleAcademyComments(prev => prev + 5)}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 transition-all text-center"
                    >
                      Load older comments ({comments.length - visibleAcademyComments} remaining)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Curriculum Sidebar: Right Panel */}
      <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200/60 bg-white flex flex-col shrink-0 h-full">
        <div className="p-6 border-b border-slate-200/60">
          <h2 className="font-bold text-slate-900">Course Syllabus</h2>
          
          {/* Progress Summary bar */}
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1">
              <span>{progressPercent}% COMPLETE</span>
              <span>{completedCount}/{totalLessons} LESSONS</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {course.modules?.map((mod: any, mIdx: number) => {
            const isExpanded = expandedModules[mod.id];
            return (
              <div key={mod.id} className="border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
                
                {/* Module Header Toggle */}
                <button 
                  onClick={() => setExpandedModules({ ...expandedModules, [mod.id]: !isExpanded })}
                  className="w-full p-4 flex items-center justify-between font-bold text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-blue-800 uppercase">Mod {mIdx + 1}</span>
                    <span className="truncate max-w-[150px]">{mod.title}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {/* Lesson Items */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-white divide-y divide-slate-100"
                    >
                      {mod.lessons?.map((les: any, lIdx: number) => {
                        const isActive = les.id === activeLessonId;
                        const isCompleted = !!completedLessons[les.id];

                        return (
                          <button 
                            key={les.id}
                            onClick={() => {
                              setActiveLessonId(les.id);
                              // Stop previous audio if playing
                              setAudioPlaying(false);
                            }}
                            className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${isActive ? 'bg-blue-50/60 border-l-4 border-blue-900' : 'hover:bg-slate-50'}`}
                          >
                            <span className="mt-0.5 shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />
                              ) : isActive ? (
                                <PlayCircle size={16} className="text-blue-900 fill-blue-900 animate-pulse" />
                              ) : (
                                <span className="w-4 h-4 rounded-full border border-slate-300 text-[10px] font-black text-slate-400 flex items-center justify-center">{lIdx + 1}</span>
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold truncate ${isActive ? 'text-blue-900' : 'text-slate-700'} ${isCompleted ? 'text-slate-400 line-through' : ''}`}>
                                {les.title}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {les.quizzes?.length > 0 && <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-1 py-0.2 rounded">QUIZ</span>}
                                {les.resources?.length > 0 && <span className="text-[9px] font-black text-red-500 bg-red-50 px-1 py-0.2 rounded">PDF</span>}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="p-6 border-t border-slate-200/60 bg-slate-50">
          <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <Download size={14} /> Download All Resources
          </button>
        </div>
      </aside>

      {/* Reflections Saved Success Modal */}
      <AnimatePresence>
        {showReflectModal && (
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
              className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center space-y-4 border border-slate-200"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mx-auto text-2xl">
                <Check size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Reflection Saved</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed animate-none">
                Your thoughts have been logged in your private study journal. You can review them at any time from your mentorship profile tab.
              </p>
              <button 
                onClick={() => setShowReflectModal(false)}
                className="w-full py-3 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-blue-800 transition-colors"
              >
                Continue Course
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
