'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { toast } from 'sonner';

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

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Onboarding modal states
  const [onboardingUser, setOnboardingUser] = useState<any>(null);
  const [onboardingDetails, setOnboardingDetails] = useState<any>(null);
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(false);
  const [activeOnboardingTab, setActiveOnboardingTab] = useState('personal');

  // Form State
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', role: 'STUDENT' });
  const [editFormData, setEditFormData] = useState({ role: 'STUDENT', isActive: true });

  // Mentor Assignment state
  const [assigningUser, setAssigningUser] = useState<any>(null);
  const [assignMentorId, setAssignMentorId] = useState('');
  const [assignType, setAssignType] = useState('Mentorship');
  const [assignNote, setAssignNote] = useState('');

  const { data: pageResult, isLoading } = useQuery({
    queryKey: ['admin-users', search, roleFilter, statusFilter, currentPage, pageLimit],
    queryFn: () => usersApi.getAll(search, roleFilter, statusFilter, currentPage, pageLimit),
    placeholderData: (prev: any) => prev,
  });

  const { data: mentorsList = [] } = useQuery({
    queryKey: ['mentors-list'],
    queryFn: () => usersApi.getMentors(),
  });

  const users: any[] = pageResult?.data ?? [];
  const totalPages: number = pageResult?.totalPages ?? 1;
  const total: number = pageResult?.total ?? 0;

  // Reset to page 1 whenever filters change
  const handleSearchChange = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleRoleChange = (val: string) => { setRoleFilter(val); setCurrentPage(1); };
  const handleStatusChange = (val: string) => { setStatusFilter(val); setCurrentPage(1); };

  const createMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsAddModalOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', role: 'STUDENT' });
      toast.success('User created successfully');
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to create user')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditingUser(null);
      toast.success('User updated successfully');
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to update user')
  });

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeletingUserId(null);
      toast.success('User deleted successfully');
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to delete user')
  });

  const assignMutation = useMutation({
    mutationFn: usersApi.assignMentor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setAssigningUser(null);
      setAssignMentorId('');
      setAssignNote('');
      toast.success('Mentor assigned successfully!');
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to assign mentor')
  });

  const unassignMutation = useMutation({
    mutationFn: usersApi.unassignMentor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Mentor unassigned.');
    },
    onError: (err: any) => toast.error(err?.message || 'Failed to unassign mentor')
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: editFormData });
    }
  };

  const handleViewOnboarding = async (user: any) => {
    setOnboardingUser(user);
    setIsLoadingOnboarding(true);
    setOnboardingDetails(null);
    setActiveOnboardingTab('personal');
    try {
      const res = await usersApi.getOnboarding(user.id);
      setOnboardingDetails(res);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load onboarding details');
    } finally {
      setIsLoadingOnboarding(false);
    }
  };

  const getInitials = (f: string, l: string) => `${(f || 'U')[0]}${(l || 'U')[0]}`.toUpperCase();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
      className="px-20 pt-8 pb-12 max-w-[1600px] mx-auto space-y-8 relative"
    >
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">User Management</h2>
          <p className="text-slate-500 font-medium">Manage all platform members, roles, and permissions.</p>
        </div>
        <motion.button 
          onClick={() => setIsAddModalOpen(true)}
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-[0_4px_14px_rgba(99,102,241,0.3)] hover:bg-indigo-700 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person_add</span>
          Add New User
        </motion.button>
      </div>

      {/* Filters & Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input 
                type="text" 
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-64 shadow-sm"
              />
            </div>
            <select 
              value={roleFilter} 
              onChange={(e) => handleRoleChange(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm appearance-none pr-10 relative cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="MENTOR">Mentor</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMINISTRATOR">Administrator</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm appearance-none pr-10 relative cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {total > 0 ? `${total} user${total === 1 ? '' : 's'} total` : ''}
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500 font-bold">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold">No users found.</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr className="border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants} initial="hidden" animate="show" className="text-sm font-medium">
                {users.map((u: any, i: number) => {
                  const initials = getInitials(u.profile?.firstName, u.profile?.lastName);
                  const colors = ['bg-indigo-50 text-indigo-600', 'bg-rose-50 text-rose-600', 'bg-emerald-50 text-emerald-600', 'bg-cyan-50 text-cyan-600', 'bg-violet-50 text-violet-600'];
                  const colorCls = colors[i % colors.length];

                  // Derive training package from onboardingDetails JSON
                  let trainingPackage: string | null = null;
                  if (u.onboardingDetails?.data) {
                    try {
                      const parsed = typeof u.onboardingDetails.data === 'string'
                        ? JSON.parse(u.onboardingDetails.data)
                        : u.onboardingDetails.data;
                      trainingPackage = parsed?.trainingPackage || null;
                    } catch { /* malformed JSON */ }
                  }
                  const isFatherhood = trainingPackage === 'Spiritual Fatherhood';
                  const isMentorship = trainingPackage === 'Mentorship';

                  return (
                    <motion.tr variants={rowVariants} key={u.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                      {/* User Cell */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl ${colorCls} flex items-center justify-center font-bold ring-1 ring-black/5`}>
                            {initials}
                          </div>
                          <div>
                            <span className="text-slate-900 font-bold block">{u.profile?.firstName} {u.profile?.lastName}</span>
                            <span className="text-slate-500 text-[11px] block mt-0.5">{u.email}</span>
                            {u.assignedMentor && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full ring-1 ring-violet-200">
                                <span className="material-symbols-outlined text-[11px]">person_pin</span>
                                {u.assignedMentor.mentor?.profile?.firstName} {u.assignedMentor.mentor?.profile?.lastName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-semibold">{u.role}</td>

                      {/* Package column */}
                      <td className="px-6 py-4">
                        {u.role === 'STUDENT' ? (
                          isFatherhood ? (
                            <span className="text-violet-600 font-bold text-sm">Fatherhood</span>
                          ) : isMentorship ? (
                            <span className="text-sky-500 font-bold text-sm">Mentorship</span>
                          ) : (
                            <span className="text-slate-300 text-sm">—</span>
                          )
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ring-1 ${
                          u.isActive ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 
                          'bg-rose-50 text-rose-700 ring-rose-200'
                        }`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-semibold">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {u.role === 'STUDENT' && (
                            <button 
                              onClick={() => handleViewOnboarding(u)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                              title="View Onboarding Details"
                            >
                              <span className="material-symbols-outlined text-[18px]">assignment</span>
                            </button>
                          )}
                          {u.role === 'STUDENT' && (
                            <button
                              onClick={() => {
                                setAssigningUser(u);
                                setAssignMentorId(u.assignedMentor?.mentorId || '');
                                setAssignType(u.assignedMentor?.type || (isFatherhood ? 'Fatherhood' : 'Mentorship'));
                                setAssignNote(u.assignedMentor?.note || '');
                              }}
                              className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors"
                              title="Assign Mentor"
                            >
                              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                            </button>
                          )}
                          {u.role === 'STUDENT' && u.assignedMentor && (
                            <button
                              onClick={() => unassignMutation.mutate(u.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Remove Mentor Assignment"
                            >
                              <span className="material-symbols-outlined text-[18px]">person_remove</span>
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setEditingUser(u);
                              setEditFormData({ role: u.role, isActive: u.isActive });
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button 
                            onClick={() => setDeletingUserId(u.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
            {/* Per-page selector */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <span>Rows per page:</span>
              <select
                value={pageLimit}
                onChange={(e) => { setPageLimit(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                {[5, 10, 20, 50].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <span className="material-symbols-outlined text-[16px]">first_page</span>
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              </button>

              {/* Page number pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-xs font-bold">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item as number)}
                      className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                        currentPage === item
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )
              }

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <span className="material-symbols-outlined text-[16px]">last_page</span>
              </button>
            </div>

            <span className="text-xs text-slate-400 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-6">Add New User</h3>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
                    <input required value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
                    <input required value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                  <select value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white">
                    <option value="STUDENT">Student</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending} className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex justify-center items-center">
                    {createMutation.isPending ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-6">Edit User</h3>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl mb-4">
                  <p className="font-bold text-slate-900">{editingUser.profile?.firstName} {editingUser.profile?.lastName}</p>
                  <p className="text-sm text-slate-500">{editingUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                  <select value={editFormData.role} onChange={e=>setEditFormData({...editFormData, role: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white">
                    <option value="STUDENT">Student</option>
                    <option value="MENTOR">Mentor</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select value={editFormData.isActive ? 'true' : 'false'} onChange={e=>setEditFormData({...editFormData, isActive: e.target.value === 'true'})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white">
                    <option value="true">Active</option>
                    <option value="false">Suspended</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                  <button type="submit" disabled={updateMutation.isPending} className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex justify-center items-center">
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete User Modal */}
      <AnimatePresence>
        {deletingUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px]">warning</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Delete User?</h3>
              <p className="text-slate-500 font-medium mb-8">This action cannot be undone. All associated data will be permanently removed from the system.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingUserId(null)} className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button 
                  onClick={() => deleteMutation.mutate(deletingUserId)} 
                  disabled={deleteMutation.isPending} 
                  className="flex-1 py-3 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors flex justify-center items-center"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Onboarding Details Modal */}
      <AnimatePresence>
        {onboardingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">Student Onboarding Profile</h3>
                  <p className="text-sm font-semibold text-slate-500">{onboardingUser.profile?.firstName} {onboardingUser.profile?.lastName} ({onboardingUser.email})</p>
                </div>
                <button 
                  onClick={() => setOnboardingUser(null)} 
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>

              {isLoadingOnboarding ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 font-bold">
                  <span className="material-symbols-outlined animate-spin text-[36px] text-indigo-600 mb-2">autorenew</span>
                  Loading profile details...
                </div>
              ) : !onboardingDetails ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 font-bold">
                  <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">assignment_late</span>
                  No onboarding details submitted yet.
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="grid grid-cols-5 border-b border-slate-200/80 pb-3 mb-6 gap-2 shrink-0 w-full">
                    {[
                      { id: 'personal', name: 'Personal' },
                      { id: 'spiritual', name: 'Journey' },
                      { id: 'ministry', name: 'Ministry' },
                      { id: 'heritage', name: 'Heritage' },
                      { id: 'package', name: 'Covenant' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveOnboardingTab(tab.id)}
                        className={`flex items-center justify-center py-2.5 text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all rounded-xl w-full text-center ${
                          activeOnboardingTab === tab.id
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-sm text-slate-700">
                    
                    {activeOnboardingTab === 'personal' && (
                      <div className="space-y-6">
                        {/* Personal Grid */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Personal Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Full Name</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.fullName || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Preferred Name</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.preferredName || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Gender</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.gender || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Date of Birth</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.dob || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Nationality</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.nationality || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Birth Country</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.birthCountry || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Origin (State / LGA)</span>
                              <span className="font-semibold text-slate-800">
                                {onboardingDetails.data?.originState || '-'} {onboardingDetails.data?.originLga ? `/ ${onboardingDetails.data?.originLga}` : ''}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Mobile Phone</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.mobileNumber || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">WhatsApp Number</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.whatsAppNumber || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Email Address</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.emailAddress || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Social Media Handles</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.socialMedia || '-'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Residence Address
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Residence Country / State</span>
                              <span className="font-semibold text-slate-800">
                                {onboardingDetails.data?.residenceCountry || '-'} {onboardingDetails.data?.residenceState ? `/ ${onboardingDetails.data?.residenceState}` : ''}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Residence City / LGA</span>
                              <span className="font-semibold text-slate-800">
                                {onboardingDetails.data?.residenceCity || '-'} {onboardingDetails.data?.residenceLga ? `/ ${onboardingDetails.data?.residenceLga}` : ''}
                              </span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Full Street Address</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.residenceAddress || '-'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Family Info */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Family & Marital Status
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Marital Status</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.maritalStatus || '-'}</span>
                            </div>
                            {onboardingDetails.data?.maritalStatus === 'Married' && (
                              <>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Spouse Name</span>
                                  <span className="font-semibold text-slate-800">{onboardingDetails.data?.spouseName || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Wedding Date</span>
                                  <span className="font-semibold text-slate-800">{onboardingDetails.data?.weddingDate || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Wedding Location</span>
                                  <span className="font-semibold text-slate-800">{onboardingDetails.data?.weddingLocation || '-'}</span>
                                </div>
                              </>
                            )}
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Number of Children</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.numChildren || '0'}</span>
                            </div>
                            {onboardingDetails.data?.numChildren > 0 && (
                              <div className="md:col-span-2">
                                <span className="text-[11px] font-bold text-slate-400 uppercase block">Children Names & Ages</span>
                                <span className="font-semibold text-slate-800 whitespace-pre-line">{onboardingDetails.data?.childrenDetails || '-'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeOnboardingTab === 'spiritual' && (
                      <div className="space-y-6">
                        {/* Spiritual Journey */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Spiritual Journey
                          </h4>
                          <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase block">New Birth/Salvation Date</span>
                                <span className="font-semibold text-slate-800">{onboardingDetails.data?.salvationDate || '-'}</span>
                              </div>
                              <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Calling Date</span>
                                <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryCallDate || '-'}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Salvation Testimony</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed text-xs shadow-sm whitespace-pre-wrap mt-1">
                                {onboardingDetails.data?.salvationTestimony || 'No testimony provided.'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Journey Description</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed text-xs shadow-sm whitespace-pre-wrap mt-1">
                                {onboardingDetails.data?.ministryJourney || 'No details provided.'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Education */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Educational Background
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Highest Qualification</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.highestQualification || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Institution Attended</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.institutionAttended || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Field of Study</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.fieldOfStudy || '-'}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Certifications & Licenses</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.certifications || '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeOnboardingTab === 'ministry' && (
                      <div className="space-y-6">
                        {/* Ministry Details */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Ministry Info
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Name</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryName || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Website/Link</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryWebsite || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Location</span>
                              <span className="font-semibold text-slate-800">
                                {onboardingDetails.data?.ministryCountry || '-'} {onboardingDetails.data?.ministryState ? `/ ${onboardingDetails.data?.ministryState}` : ''}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry City</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryCity || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Role</span>
                              <span className="font-semibold text-slate-800">
                                {onboardingDetails.data?.ministryRole === 'Other' ? onboardingDetails.data?.ministryRoleOther : onboardingDetails.data?.ministryRole || '-'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Start Year</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryStartYear || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Average Attendance</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryAvgAttendance || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Branches / Locations</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryBranches || '0'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Status</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryStatus || '-'}</span>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Facility</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.ministryFacility || '-'}</span>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Bi-Vocational Profession</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.biVocationalProfession || '-'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Vision & Focus */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Vision & Focus Areas
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Vision Statement</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed text-xs shadow-sm whitespace-pre-wrap mt-1">
                                {onboardingDetails.data?.ministryVision || '-'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Ministry Focus Areas</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed text-xs shadow-sm whitespace-pre-wrap mt-1">
                                {onboardingDetails.data?.ministryFocus || '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeOnboardingTab === 'heritage' && (
                      <div className="space-y-6">
                        {/* Spiritual Heritage */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Heritage & Oversight
                          </h4>
                          <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase block">Applicant Classification</span>
                                <span className="font-semibold text-slate-800">{onboardingDetails.data?.heritageType || '-'}</span>
                              </div>
                              <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase block">Under Spiritual Oversight?</span>
                                <span className="font-semibold text-slate-800">{onboardingDetails.data?.underSpiritualOversight || 'No'}</span>
                              </div>
                            </div>
                            
                            {onboardingDetails.data?.underSpiritualOversight === 'Yes' && (
                              <div>
                                <span className="text-[11px] font-bold text-slate-400 uppercase block">Oversight details</span>
                                <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1">
                                  {onboardingDetails.data?.oversightDetails || '-'}
                                </p>
                              </div>
                            )}

                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Requesting covering from Rev. Dubus?</span>
                              <span className="font-semibold text-slate-800">{onboardingDetails.data?.requestOversightFromDubus || 'No'}</span>
                            </div>

                            {/* Former Ministry details */}
                            {onboardingDetails.data?.formerMinistry && (
                              <div className="border-t border-slate-200/60 pt-4 mt-2">
                                <h5 className="font-bold text-slate-800 mb-2">Former Ministry Alignment</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Former Ministry Name</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.formerMinistry || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Pastor Name</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.formerPastorName || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Years Served</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.formerServiceYears || '-'}</span>
                                  </div>
                                  <div className="md:col-span-3">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Former Responsibilities</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.formerResponsibilities || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Ordained?</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.ordained || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Released/Sent forth?</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.released || '-'}</span>
                                  </div>
                                  {onboardingDetails.data?.releasedExplanation && (
                                    <div className="md:col-span-3">
                                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Release explanation</span>
                                      <span className="font-semibold text-slate-800">{onboardingDetails.data?.releasedExplanation || '-'}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Active Ministry details */}
                            {onboardingDetails.data?.activeMinistryName && (
                              <div className="border-t border-slate-200/60 pt-4 mt-2">
                                <h5 className="font-bold text-slate-800 mb-2">Active Ministry Service Details</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Active Ministry Name</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.activeMinistryName || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Active Pastor Name</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.activePastorName || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Service Years</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.activeServiceYears || '-'}</span>
                                  </div>
                                  <div className="md:col-span-3">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Active Responsibilities</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.activeResponsibilities || '-'}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        </div>

                        {/* Vision & Growth Goals */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Vision & Expected Mentorship Growth
                          </h4>
                          <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Goals for the Next 12 Months</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1">
                                {onboardingDetails.data?.goals12Months || '-'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Greatest Ministerial Challenge</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1">
                                {onboardingDetails.data?.greatestChallenge || '-'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Why seeking covering from this mentorship?</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1">
                                {onboardingDetails.data?.whySeekingCovering || '-'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Expectations from mentorship covering</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1">
                                {onboardingDetails.data?.expectedFromMentorship || '-'}
                              </p>
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block">Target growth/strengthening areas</span>
                              <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1">
                                {onboardingDetails.data?.growthAreas || '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeOnboardingTab === 'package' && (
                      <div className="space-y-6">
                        {/* Selected Package */}
                        <div>
                          <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                            Selected Training Pathway
                          </h4>
                          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <div>
                              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Training Package</span>
                              <span className={`inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ring-1 ${
                                onboardingDetails.data?.trainingPackage === 'Spiritual Fatherhood'
                                  ? 'bg-indigo-50 text-indigo-700 ring-indigo-200'
                                  : onboardingDetails.data?.trainingPackage === 'Mentorship'
                                  ? 'bg-blue-50 text-blue-700 ring-blue-200'
                                  : 'bg-slate-50 text-slate-500 ring-slate-200'
                              }`}>
                                {onboardingDetails.data?.trainingPackage || 'Mentorship (Default / Unselected)'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {onboardingDetails.data?.trainingPackage === 'Spiritual Fatherhood' && (
                          <>
                            {/* Understanding of Spiritual Fatherhood */}
                            <div>
                              <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                                Understanding of Spiritual Fatherhood
                              </h4>
                              <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Why seeking spiritual fatherhood rather than mentorship?</span>
                                  <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1 whitespace-pre-wrap leading-relaxed">
                                    {onboardingDetails.data?.fatherhoodReason || '-'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Understanding of biblical spiritual fatherhood</span>
                                  <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1 whitespace-pre-wrap leading-relaxed">
                                    {onboardingDetails.data?.fatherhoodUnderstanding || '-'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">What they believe God is asking of them</span>
                                  <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1 whitespace-pre-wrap leading-relaxed">
                                    {onboardingDetails.data?.fatherhoodGodAsking || '-'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Expectations of this relationship</span>
                                  <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1 whitespace-pre-wrap leading-relaxed">
                                    {onboardingDetails.data?.fatherhoodExpectations || '-'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Existing Spiritual Relationships */}
                            <div>
                              <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                                Existing Spiritual Relationships
                              </h4>
                              <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Currently has a spiritual father?</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.fatherhoodCurrentFather || '-'}</span>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Prayerfully discussed decision with leader?</span>
                                    <span className="font-semibold text-slate-800">{onboardingDetails.data?.fatherhoodLeaderDiscussed || '-'}</span>
                                  </div>
                                </div>
                                {onboardingDetails.data?.fatherhoodCurrentFather === 'Yes' && (
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Explanation for seeking fatherhood through Lumora</span>
                                    <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1 whitespace-pre-wrap leading-relaxed">
                                      {onboardingDetails.data?.fatherhoodCurrentFatherExplain || '-'}
                                    </p>
                                  </div>
                                )}
                                {onboardingDetails.data?.fatherhoodLeaderDiscussed === 'No' && (
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Explanation for not discussing</span>
                                    <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-100 text-xs shadow-sm mt-1 whitespace-pre-wrap leading-relaxed">
                                      {onboardingDetails.data?.fatherhoodLeaderDiscussedExplain || '-'}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Covenant & Stewardship Commitments */}
                            <div>
                              <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                                Covenant & Stewardship Commitments
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Willing to receive biblical correction?</span>
                                  <span className="font-semibold text-slate-800">{onboardingDetails.data?.fatherhoodCorrection || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Willing to live in accountability?</span>
                                  <span className="font-semibold text-slate-800">{onboardingDetails.data?.fatherhoodAccountability || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Willing to protect unity of family?</span>
                                  <span className="font-semibold text-slate-800">{onboardingDetails.data?.fatherhoodProtectUnity || '-'}</span>
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Willing to support vision & partnership?</span>
                                  <span className="font-semibold text-slate-800">{onboardingDetails.data?.fatherhoodSupportVision || '-'}</span>
                                </div>
                                <div className="md:col-span-2 border-t border-slate-200/60 pt-4 mt-2">
                                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Embrace stewardship commitment (tithes & offerings)?</span>
                                  <span className="font-semibold text-slate-800">{onboardingDetails.data?.fatherhoodStewardship || '-'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Signed Covenant Declaration */}
                            <div>
                              <h4 className="text-slate-900 font-extrabold mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                                Covenant Declaration
                              </h4>
                              <div className="bg-indigo-50/20 p-5 rounded-2xl border border-indigo-100/60 space-y-4">
                                <p className="text-xs italic text-slate-700 leading-relaxed font-serif bg-white p-3 rounded-xl border border-indigo-50/50">
                                  “I understand that spiritual fatherhood is a lifelong covenant relationship rather than a temporary mentorship arrangement. If accepted into this family, I commit myself to honor, humility, accountability, faithfulness, unity, biblical stewardship, and the pursuit of God’s purpose as I grow under the spiritual leadership entrusted to Reverend Dubus Achufusi.”
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Signature (Full Name)</span>
                                    <span className="font-bold text-slate-800 font-sans border-b-2 border-dashed border-slate-300 pb-1 inline-block mt-1">
                                      {onboardingDetails.data?.fatherhoodSignature || '-'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase block">Signing Date</span>
                                    <span className="font-semibold text-slate-800 mt-1 block">
                                      {onboardingDetails.data?.fatherhoodDate ? new Date(onboardingDetails.data.fatherhoodDate).toLocaleDateString() : '-'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                  </div>
                  <div className="pt-6 border-t border-slate-100 mt-6 flex justify-end">
                    <button 
                      onClick={() => setOnboardingUser(null)} 
                      className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Mentor Modal */}
      <AnimatePresence>
        {assigningUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200"
            >
              <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-2">Assign Mentor</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">
                Assign a dedicated mentor to <span className="text-slate-800 font-bold">{assigningUser.profile?.firstName} {assigningUser.profile?.lastName}</span>.
              </p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                assignMutation.mutate({
                  studentId: assigningUser.id,
                  mentorId: assignMentorId,
                  type: assignType,
                  note: assignNote
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Mentor</label>
                  <select 
                    required 
                    value={assignMentorId} 
                    onChange={e => setAssignMentorId(e.target.value)} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="">-- Choose Mentor --</option>
                    {mentorsList.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {m.profile?.firstName} {m.profile?.lastName} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Assignment Stream</label>
                  <select 
                    value={assignType} 
                    onChange={e => setAssignType(e.target.value)} 
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="Mentorship">Mentorship</option>
                    <option value="Fatherhood">Fatherhood</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Assignment Note (Optional)</label>
                  <textarea 
                    value={assignNote} 
                    onChange={e => setAssignNote(e.target.value)} 
                    placeholder="Enter any notes or special instructions for this assignment..."
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 resize-none h-24 text-sm"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setAssigningUser(null)} 
                    className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={assignMutation.isPending || !assignMentorId} 
                    className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {assignMutation.isPending ? 'Assigning...' : 'Assign Mentor'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
