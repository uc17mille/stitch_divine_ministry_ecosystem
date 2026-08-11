'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function AdminCoursesPage() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => coursesApi.getAll(),
  });

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
      className="px-20 pt-8 pb-12 max-w-[1600px] mx-auto space-y-8"
    >
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Course Management</h2>
          <p className="text-slate-500 font-medium">Oversee your digital ministry curriculum, monitor student<br/>engagement, and publish new spiritual growth paths.</p>
        </div>
        <Link href="/admin/courses/new">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 bg-indigo-800 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-[0_4px_14px_rgba(55,48,163,0.3)] hover:bg-indigo-900 transition-colors">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add_circle</span>
            Create New Course
          </motion.button>
        </Link>
      </div>

      {/* KPI Cards (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between h-40">
          <p className="font-bold text-xs text-slate-500 mb-1 tracking-wide">Total Courses</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">{courses.length}</h3>
          <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1 mt-auto">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> Live on Platform
          </span>
        </motion.div>

        {/* KPI 2 */}
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between h-40">
          <p className="font-bold text-xs text-slate-500 mb-1 tracking-wide">Active Students</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">
            {courses.reduce((acc: number, c: any) => acc + (c._count?.enrollments || 0), 0)}
          </h3>
          <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1 mt-auto">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> Total Enrolled
          </span>
        </motion.div>

        {/* KPI 3 */}
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col justify-between h-40">
          <p className="font-bold text-xs text-slate-500 mb-1 tracking-wide">Avg. Completion Rate</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">76.4%</h3>
          <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1 mt-auto">
            <span className="material-symbols-outlined text-[14px]">check_circle</span> Maintain benchmark 75%
          </span>
        </motion.div>
      </div>

      {/* Filters & Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-4">
            <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 outline-none shadow-sm appearance-none pr-10 relative cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]">
              <option value="">All Categories</option>
              <option value="theology">Theology</option>
              <option value="family">Family & Marriage</option>
              <option value="leadership">Leadership</option>
            </select>
            <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 outline-none shadow-sm appearance-none pr-10 relative cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20fill%3D%22none%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]">
              <option value="">Status: All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">filter_list</span> Advanced Filters
            </button>
          </div>
          <span className="text-xs font-bold text-slate-400">Showing 1-{courses.length} of {courses.length} courses</span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-bold">Loading curriculum...</div>
          ) : courses.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold">No courses published yet. Click Create New Course to begin.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="border-b border-slate-200 text-slate-500 text-xs font-bold tracking-wide">
                  <th className="px-6 py-5 w-[35%]">Course Title</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Enrolled</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Last Updated</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants} initial="hidden" animate="show" className="text-sm font-medium">
                {courses.map((course: any) => {
                  const totalLessons = course.modules?.reduce((acc: number, mod: any) => acc + (mod._count?.lessons || 0), 0) || 0;
                  return (
                    <motion.tr variants={rowVariants} key={course.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center ring-1 ring-black/5 flex-shrink-0">
                            <span className="material-symbols-outlined">school</span>
                          </div>
                          <div>
                            <span className="text-slate-900 font-bold block mb-0.5">{course.title}</span>
                            <span className="text-slate-500 text-[11px] font-semibold">{totalLessons} Lessons</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold ring-1 bg-indigo-50 text-indigo-700 ring-indigo-200">
                          {course.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[12px] text-slate-700 font-bold">{course._count?.enrollments || 0} students</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span className="font-bold text-[12px] text-emerald-700">Published</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-500 font-semibold">
                        {new Date(course.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          )}
        </div>

        
        {/* Pagination */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-center bg-white">
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-800 text-white font-bold text-sm shadow-sm">1</button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-sm transition-colors">2</button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-sm transition-colors">3</button>
            <span className="text-slate-400 px-2 font-bold">...</span>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold text-sm transition-colors">6</button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

      </div>
    </motion.section>
  );
}
