import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://stitchdivineministryecosystem-production.up.railway.app';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('aura_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.warn('401 Unauthorized - Intercepted');
    }
    const data = error.response?.data;
    if (data) {
      return Promise.reject(data);
    }
    if (!error.response && error.message === 'Network Error') {
      return Promise.reject({
        message: 'Unable to connect to backend server. Please check NEXT_PUBLIC_API_URL in Vercel Environment Variables.'
      });
    }
    return Promise.reject(error);
  }
);

// Typed endpoints
export const authApi = {
  register: (data: any) => api.post('/auth/register', data).then(r => r.data),
  login: (data: any) => api.post('/auth/login', data).then(r => r.data),
  getMe: () => api.get('/auth/me').then(r => r.data),
};

export const coursesApi = {
  getAll: (search?: string) => api.get('/courses', { params: { search } }).then(r => r.data),
  getCategories: () => api.get('/courses/categories').then(r => r.data),
  getOne: (id: string) => api.get(`/courses/${id}`).then(r => r.data),
  create: (data: any) => api.post('/courses', data).then(r => r.data),
  enroll: (courseId: string) => api.post('/courses/enroll', { courseId }).then(r => r.data),
  getMyEnrollments: () => api.get('/courses/my/enrollments').then(r => r.data),
  updateProgress: (data: any) => api.post('/courses/progress', data).then(r => r.data),
};


export const eventsApi = {
  getAll: () => api.get('/events').then(r => r.data),
  getOne: (id: string) => api.get(`/events/${id}`).then(r => r.data),
  register: (id: string) => api.post(`/events/${id}/register`).then(r => r.data),
  getMyRegistrations: () => api.get('/events/my/registrations').then(r => r.data),
};

export const prayerApi = {
  getCategories: () => api.get('/prayer/categories').then(r => r.data),
  getRequests: () => api.get('/prayer').then(r => r.data),
  createRequest: (data: any) => api.post('/prayer', data).then(r => r.data),
  deleteRequest: (id: string) => api.delete(`/prayer/${id}`).then(r => r.data),
};

export const communityApi = {
  getPosts: (groupId?: string) => api.get('/community/posts', { params: { groupId } }).then(r => r.data),
  createPost: (data: any) => api.post('/community/posts', data).then(r => r.data),
  createComment: (data: any) => api.post('/community/comments', data).then(r => r.data),
  toggleLike: (postId: string) => api.post(`/community/posts/${postId}/like`).then(r => r.data),
  getGroups: () => api.get('/community/groups').then(r => r.data),
  createGroup: (data: any) => api.post('/community/groups', data).then(r => r.data),
};

export const mentorshipApi = {
  getMentors: () => api.get('/mentorship/mentors').then(r => r.data),
  getTracks: (mentorId?: string) => api.get('/mentorship/tracks', { params: { mentorId } }).then(r => r.data),
  createTrack: (data: any) => api.post('/mentorship/tracks', data).then(r => r.data),
  book: (data: any) => api.post('/mentorship/book', data).then(r => r.data),
  getMyBookings: () => api.get('/mentorship/my/bookings').then(r => r.data),
};

export const resourcesApi = {
  getAll: (search?: string) => api.get('/resources', { params: { search } }).then(r => r.data),
  download: (id: string) => api.post(`/resources/${id}/download`).then(r => r.data),
};

export const usersApi = {
  getAll: (search?: string, role?: string, status?: string, page = 1, limit = 10) =>
    api.get('/users', { params: { search, role, status, page, limit } }).then(r => r.data),
  create: (data: any) => api.post('/users', data).then(r => r.data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/users/${id}`).then(r => r.data),
  submitOnboarding: (data: any) => api.post('/users/onboarding', data).then(r => r.data),
  getOnboarding: (id: string) => api.get(`/users/${id}/onboarding`).then(r => r.data),
  // Mentor Assignment
  getMentors: () => api.get('/users/mentors/list').then(r => r.data),
  getAllAssignments: () => api.get('/users/assignments/all').then(r => r.data),
  assignMentor: (data: { studentId: string; mentorId: string; type: string; note?: string }) =>
    api.post('/users/assign-mentor', data).then(r => r.data),
  unassignMentor: (studentId: string) => api.delete(`/users/${studentId}/assignment`).then(r => r.data),
  recordProgress: (data: { mentorId: string; studentId: string; milestone: string; score: number; remarks: string; recommendation?: string }) =>
    api.post('/users/progress-reports', data).then(r => r.data),
  getProgressReports: (studentId?: string) =>
    api.get('/users/progress-reports', { params: { studentId } }).then(r => r.data),
};

export const analyticsApi = {
  getDashboard: (timeRange?: string) => api.get('/analytics/dashboard', { params: { timeRange } }).then(r => r.data),
};

export const messagesApi = {
  sendMessage: (data: { senderId: string; receiverId: string; content: string }) =>
    api.post('/messages', data).then(r => r.data),
  getUserMessages: (userId: string) => api.get(`/messages/user/${userId}`).then(r => r.data),
  getAdminMessages: () => api.get('/messages/admin/all').then(r => r.data),
  markAsRead: (id: string) => api.patch(`/messages/${id}/read`).then(r => r.data),
};

