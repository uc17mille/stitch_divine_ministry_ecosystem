'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, Link as LinkIcon, Plus, Trash2, 
  GripVertical, PlayCircle, BookOpen, Save, CheckCircle2,
  Tv, Headphones, HelpCircle, FileText, Book
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  mediaType: 'upload' | 'embed';
  mediaUrl: string; // for video embed
  fileName: string; // for video upload
  audioMediaType: 'upload' | 'embed';
  audioUrl: string; // for audio embed
  audioFileName: string; // for audio upload

  // Optional nested assets
  pdfTitle?: string;
  pdfUrl?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookCoverUrl?: string;
  bookBuyUrl?: string;
  quizQuestion?: string;
  quizOptions?: string;
  quizCorrectOption?: number;
  quizExplanation?: string;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [courseFormat, setCourseFormat] = useState<'VIDEO' | 'AUDIO' | 'BOTH'>('VIDEO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const [modules, setModules] = useState<CourseModule[]>([
    { 
      id: 'module-1', 
      title: '', 
      description: '', 
      mediaType: 'upload', 
      mediaUrl: '', 
      fileName: '',
      audioMediaType: 'upload',
      audioUrl: '',
      audioFileName: '',
      pdfTitle: '',
      pdfUrl: '',
      bookTitle: '',
      bookAuthor: '',
      bookCoverUrl: '',
      bookBuyUrl: '',
      quizQuestion: '',
      quizOptions: '',
      quizCorrectOption: 0,
      quizExplanation: ''
    }
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const list = await coursesApi.getCategories();
        setCategoriesList(list);
        if (list.length > 0) {
          setSelectedCategoryId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        toast.error('Failed to load course categories.');
      }
    }
    loadCategories();
  }, []);

  const addModule = () => {
    setModules([
      ...modules, 
      { 
        id: `module-${Date.now()}`, 
        title: '', 
        description: '', 
        mediaType: 'upload', 
        mediaUrl: '', 
        fileName: '',
        audioMediaType: 'upload',
        audioUrl: '',
        audioFileName: '',
        pdfTitle: '',
        pdfUrl: '',
        bookTitle: '',
        bookAuthor: '',
        bookCoverUrl: '',
        bookBuyUrl: '',
        quizQuestion: '',
        quizOptions: '',
        quizCorrectOption: 0,
        quizExplanation: ''
      }
    ]);
  };

  const removeModule = (id: string) => {
    if (modules.length === 1) {
      toast.error('A course must have at least one module.');
      return;
    }
    setModules(modules.filter(m => m.id !== id));
  };

  const updateModule = (id: string, field: keyof CourseModule, value: any) => {
    setModules(modules.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > 100) {
        toast.error(`File size (${sizeMB.toFixed(1)}MB) exceeds the 100MB limit.`);
        return;
      }
      updateModule(id, 'fileName', file.name);
      toast.success(`Video file ${file.name} attached.`);
    }
  };

  const handleAudioFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > 100) {
        toast.error(`File size (${sizeMB.toFixed(1)}MB) exceeds the 100MB limit.`);
        return;
      }
      updateModule(id, 'audioFileName', file.name);
      toast.success(`Audio file ${file.name} attached.`);
    }
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      toast.success(`${file.name} selected for thumbnail.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) {
      toast.error('Course Title is required.');
      return;
    }
    if (!selectedCategoryId) {
      toast.error('Course Category is required.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        title: courseTitle,
        description: courseDesc || 'No description provided.',
        thumbnailUrl: thumbnailFile 
          ? `${process.env.NEXT_PUBLIC_API_URL || 'https://stitchdivineministryecosystem-production.up.railway.app'}/uploads/${thumbnailFile.name}` 
          : 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?auto=format&fit=crop&q=80&w=800',
        categoryId: selectedCategoryId,
        format: courseFormat,
        modules: modules.map((mod, index) => ({
          title: mod.title || `Module ${index + 1}`,
          description: mod.description || '',
          lessons: [
            {
              title: mod.title || `Lesson 1`,
              content: mod.description || `Welcome to ${mod.title || 'this module'}.`,
              videoUrl: (courseFormat === 'VIDEO' || courseFormat === 'BOTH') 
                ? (mod.mediaType === 'embed' ? mod.mediaUrl : (mod.fileName ? `${process.env.NEXT_PUBLIC_API_URL || 'https://stitchdivineministryecosystem-production.up.railway.app'}/uploads/${mod.fileName}` : undefined))
                : undefined,
              audioUrl: (courseFormat === 'AUDIO' || courseFormat === 'BOTH')
                ? (mod.audioMediaType === 'embed' ? mod.audioUrl : (mod.audioFileName ? `${process.env.NEXT_PUBLIC_API_URL || 'https://stitchdivineministryecosystem-production.up.railway.app'}/uploads/${mod.audioFileName}` : undefined))
                : undefined,
              resources: mod.pdfTitle && mod.pdfUrl ? {
                create: [
                  { title: mod.pdfTitle, url: mod.pdfUrl }
                ]
              } : undefined,
              books: mod.bookTitle ? {
                create: [
                  {
                    title: mod.bookTitle,
                    author: mod.bookAuthor || 'Unknown',
                    coverUrl: mod.bookCoverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200',
                    buyUrl: mod.bookBuyUrl || 'https://amazon.com'
                  }
                ]
              } : undefined,
              quizzes: mod.quizQuestion && mod.quizOptions ? {
                create: [
                  {
                    question: mod.quizQuestion,
                    options: mod.quizOptions,
                    correctOption: Number(mod.quizCorrectOption || 0),
                    explanation: mod.quizExplanation || ''
                  }
                ]
              } : undefined
            }
          ]
        }))
      };

      await coursesApi.create(payload);
      toast.success('Course created successfully!');
      router.push('/admin/courses');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to create course.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Create New Course</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Build a multi-module learning experience.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
            Save Draft
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-900 text-white font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-70 shadow-sm"
          >
            {isSubmitting ? <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span> : <CheckCircle2 size={18} />}
            {isSubmitting ? 'Publishing...' : 'Publish Course'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Course Meta Details */}
        <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <BookOpen size={20} className="text-blue-600" />
            Course Details
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Course Title</label>
              <input 
                type="text" 
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Foundations of Faith" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                <select 
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium appearance-none"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                  {categoriesList.length === 0 && (
                    <option value="">No categories available</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Course Format</label>
                <select 
                  value={courseFormat}
                  onChange={(e) => setCourseFormat(e.target.value as any)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium appearance-none"
                >
                  <option value="VIDEO">Video Masterclass</option>
                  <option value="AUDIO">Audio Message Series</option>
                  <option value="BOTH">Dual-Mode Class (Video & Audio)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Thumbnail Banner</label>
                <div className="relative w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className={`font-medium text-sm truncate pr-4 ${thumbnailFile ? 'text-slate-800' : 'text-slate-400'}`}>
                    {thumbnailFile ? thumbnailFile.name : 'Upload Image...'}
                  </span>
                  {thumbnailFile ? (
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  ) : (
                    <UploadCloud size={18} className="text-slate-400 shrink-0" />
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="What will students learn?" 
                rows={4}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium resize-none"
              ></textarea>
            </div>
          </div>
        </section>

        {/* Series Builder (Modules) */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <PlayCircle size={20} className="text-blue-600" />
              Course Curriculum (Series)
            </h2>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {modules.map((mod, index) => (
                <motion.div 
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm relative group"
                >
                  {/* Delete Button */}
                  <button 
                    type="button"
                    onClick={() => removeModule(mod.id)}
                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex gap-4">
                    <div className="pt-2 cursor-grab text-slate-300 hover:text-slate-500 hidden md:block">
                      <GripVertical size={20} />
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-black text-sm flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg">Module Setup</h3>
                      </div>

                      {/* Module Title */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Module Title</label>
                        <input 
                          type="text" 
                          value={mod.title}
                          onChange={(e) => updateModule(mod.id, 'title', e.target.value)}
                          placeholder="e.g. Introduction to the Series" 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-sm"
                        />
                      </div>

                      {/* Video Media Section */}
                      {(courseFormat === 'VIDEO' || courseFormat === 'BOTH') && (
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                            <Tv size={14} className="text-blue-600" /> Video Stream Source
                          </label>
                          
                          <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit">
                            <button 
                              type="button"
                              onClick={() => updateModule(mod.id, 'mediaType', 'upload')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${mod.mediaType === 'upload' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                            >
                              Upload MP4
                            </button>
                            <button 
                              type="button"
                              onClick={() => updateModule(mod.id, 'mediaType', 'embed')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${mod.mediaType === 'embed' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
                            >
                              Embed URL
                            </button>
                          </div>

                          {mod.mediaType === 'upload' ? (
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-white relative">
                              <input 
                                type="file" 
                                accept="video/mp4" 
                                onChange={(e) => handleFileUpload(mod.id, e)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <UploadCloud size={24} className="text-blue-500 mb-2" />
                              <p className="text-xs font-bold text-slate-700">
                                {mod.fileName ? mod.fileName : 'Browse MP4 Video file'}
                              </p>
                            </div>
                          ) : (
                            <input 
                              type="url" 
                              value={mod.mediaUrl}
                              onChange={(e) => updateModule(mod.id, 'mediaUrl', e.target.value)}
                              placeholder="e.g. https://youtube.com/watch?v=..." 
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                            />
                          )}
                        </div>
                      )}

                      {/* Audio Media Section */}
                      {(courseFormat === 'AUDIO' || courseFormat === 'BOTH') && (
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                            <Headphones size={14} className="text-indigo-600" /> Audio Message Source
                          </label>
                          
                          <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit">
                            <button 
                              type="button"
                              onClick={() => updateModule(mod.id, 'audioMediaType', 'upload')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${mod.audioMediaType === 'upload' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}
                            >
                              Upload MP3
                            </button>
                            <button 
                              type="button"
                              onClick={() => updateModule(mod.id, 'audioMediaType', 'embed')}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${mod.audioMediaType === 'embed' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'}`}
                            >
                              Embed Audio URL
                            </button>
                          </div>

                          {mod.audioMediaType === 'upload' ? (
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-white relative">
                              <input 
                                type="file" 
                                accept="audio/mp3,audio/mpeg,audio/wav" 
                                onChange={(e) => handleAudioFileUpload(mod.id, e)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <UploadCloud size={24} className="text-indigo-500 mb-2" />
                              <p className="text-xs font-bold text-slate-700">
                                {mod.audioFileName ? mod.audioFileName : 'Browse MP3/WAV Audio file'}
                              </p>
                            </div>
                          ) : (
                            <input 
                              type="url" 
                              value={mod.audioUrl}
                              onChange={(e) => updateModule(mod.id, 'audioUrl', e.target.value)}
                              placeholder="e.g. https://soundcloud.com/..." 
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                            />
                          )}
                        </div>
                      )}

                      {/* Extended Lesson Settings (PDFs, Recommended Books, Interactive Quiz) */}
                      <div className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
                        <div className="flex items-center gap-2 border-b border-slate-200/50 pb-3">
                          <BookOpen size={16} className="text-blue-900" />
                          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Lesson Resources & Interactive Quiz (Optional)</h4>
                        </div>

                        {/* PDF / Materials Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">PDF Resource Title</label>
                            <input 
                              type="text" 
                              value={mod.pdfTitle || ''}
                              onChange={(e) => updateModule(mod.id, 'pdfTitle', e.target.value)}
                              placeholder="e.g. Stewardship Study Guide.pdf" 
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">PDF Download URL</label>
                            <input 
                              type="url" 
                              value={mod.pdfUrl || ''}
                              onChange={(e) => updateModule(mod.id, 'pdfUrl', e.target.value)}
                              placeholder="e.g. https://domain.com/files/guide.pdf" 
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                        </div>

                        {/* Book Recommendation Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200/50 pt-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Recommended Book Title</label>
                            <input 
                              type="text" 
                              value={mod.bookTitle || ''}
                              onChange={(e) => updateModule(mod.id, 'bookTitle', e.target.value)}
                              placeholder="e.g. The Treasure Principle" 
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Book Author</label>
                            <input 
                              type="text" 
                              value={mod.bookAuthor || ''}
                              onChange={(e) => updateModule(mod.id, 'bookAuthor', e.target.value)}
                              placeholder="e.g. Randy Alcorn" 
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Book Buy URL</label>
                            <input 
                              type="url" 
                              value={mod.bookBuyUrl || ''}
                              onChange={(e) => updateModule(mod.id, 'bookBuyUrl', e.target.value)}
                              placeholder="e.g. https://amazon.com/..." 
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                        </div>

                        {/* Interactive Quiz Row */}
                        <div className="border-t border-slate-200/50 pt-3 space-y-3">
                          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                            <HelpCircle size={14} className="text-indigo-600" /> Lesson Quiz Question
                          </label>
                          <input 
                            type="text" 
                            value={mod.quizQuestion || ''}
                            onChange={(e) => updateModule(mod.id, 'quizQuestion', e.target.value)}
                            placeholder="e.g. What is the primary role of a steward?" 
                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Answer Options (Comma-separated, max 4)</label>
                              <input 
                                type="text" 
                                value={mod.quizOptions || ''}
                                onChange={(e) => updateModule(mod.id, 'quizOptions', e.target.value)}
                                placeholder="Owner,Manager of Assets,Director,Advisor" 
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Correct Option (Select option order)</label>
                              <select 
                                value={mod.quizCorrectOption || 0}
                                onChange={(e) => updateModule(mod.id, 'quizCorrectOption', Number(e.target.value))}
                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                              >
                                <option value={0}>Option 1 (first)</option>
                                <option value={1}>Option 2 (second)</option>
                                <option value={2}>Option 3 (third)</option>
                                <option value={3}>Option 4 (fourth)</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Explanation for correct answer</label>
                            <input 
                              type="text" 
                              value={mod.quizExplanation || ''}
                              onChange={(e) => updateModule(mod.id, 'quizExplanation', e.target.value)}
                              placeholder="e.g. A steward is a manager of another's assets." 
                              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Add Module Button */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={addModule}
              className="w-full p-5 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all gap-2 bg-white"
            >
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-inherit border border-slate-100">
                <Plus size={20} />
              </div>
              <span className="font-bold text-sm">Add Another Lesson</span>
            </motion.button>

          </div>
        </section>

      </form>
    </div>
  );
}
