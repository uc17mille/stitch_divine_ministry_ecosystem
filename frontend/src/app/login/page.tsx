'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const fillCredentials = (role: 'admin' | 'mentor' | 'user') => {
    if (role === 'admin') {
      setValue('email', 'admin@auramini.com');
      setValue('password', 'Admin@12345');
    } else if (role === 'mentor') {
      setValue('email', 'mentor@auramini.com');
      setValue('password', 'Mentor@12345');
    } else {
      setValue('email', 'student@auramini.com');
      setValue('password', 'Student@12345');
    }
    setFormError('');
    const labels: Record<string, string> = { admin: 'Admin', mentor: 'Mentor', user: 'Student' };
    setFormSuccess(`${labels[role]} credentials loaded! Click Sign In.`);
  };

  const onSubmit = async (data: FormData) => {
    setFormError('');
    setFormSuccess('');
    try {
      await login(data.email, data.password);
      setFormSuccess('Welcome back to the sanctuary.');
      
      const { user } = useAuthStore.getState();
      if (user?.role === 'ADMINISTRATOR' || user?.role === 'admin') {
        router.push('/admin');
      } else if (user?.role === 'MENTOR') {
        router.push('/mentor');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setFormError(err?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans">
      
      {/* Left Panel: The Mentor Portrait (2026 Aesthetic) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden bg-slate-50 border-r border-slate-200"
      >
        {/* The Image */}
        <div className="absolute inset-0">
          <img 
            src="/rev-dubus-login.jpg" 
            alt="Rev. Dubus Achufusi" 
            className="w-full h-full object-cover object-top opacity-90"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent" />
        </div>

        {/* Branding */}
        <div className="relative p-12 z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-xl text-white shadow-lg group-hover:scale-105 transition-transform">R</div>
            <span className="font-bold text-2xl text-white drop-shadow-sm">Lumora</span>
          </Link>
        </div>

        {/* Quote & Social Proof */}
        <div className="relative p-12 z-10 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-sm">
            <Sparkles size={14} className="text-sky-300" />
            <span className="text-xs font-bold tracking-widest text-sky-100 uppercase">Private Mentorship</span>
          </div>
          <blockquote className="text-4xl font-black leading-[1.15] tracking-tight mb-8">
            &quot;True leadership is not just anointing, it is <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-200">preparation.</span>&quot;
          </blockquote>
          
          <div className="flex items-center gap-4 border-t border-white/20 pt-6">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 border-2 border-blue-900 shadow-md" />
              ))}
            </div>
            <p className="text-blue-100 text-sm font-medium">Join <span className="text-white font-bold">12,000+</span> leaders globally.</p>
          </div>
        </div>
      </motion.div>

      {/* Right Panel: The 2026 Glassmorphic Form */}
      <div className="flex-1 flex flex-col justify-center p-6 lg:p-12 relative bg-white">
        {/* Soft background ambient light */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-sky-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto relative z-10"
        >
          <div className="mb-10">
            <Link href="/" className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center font-bold text-lg text-white shadow-md">R</div>
              <span className="font-bold text-xl text-blue-950">Lumora</span>
            </Link>
            <h1 className="text-4xl font-black mb-3 text-slate-900 tracking-tight">Access the Sanctuary.</h1>
            <p className="text-slate-500 text-lg font-medium mb-6">Sign in to continue your mentorship journey.</p>
            
            {/* Quick Login Buttons for Demo/Testing */}
            <div className="flex gap-3">
              <button 
                onClick={() => fillCredentials('admin')}
                className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Fast Login: Admin
              </button>
              <button 
                onClick={() => fillCredentials('mentor')}
                className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-100 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Fast Login: Mentor
              </button>
              <button 
                onClick={() => fillCredentials('user')}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Fast Login: Student
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Inline Notifications */}
            {formError && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-bold flex items-center gap-2">
                <Sparkles size={16} /> {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-bold flex items-center gap-2">
                <Sparkles size={16} /> {formSuccess}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Email Address</label>
              <input 
                {...register('email')} 
                type="email" 
                placeholder="name@ministry.com" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" 
              />
              {errors.email && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1.5"><Sparkles size={12}/> {errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-blue-600 text-xs font-bold hover:text-blue-800 transition-colors">Recover password?</Link>
              </div>
              <div className="relative">
                <input 
                  {...register('password')} 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm pr-12" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1.5"><Sparkles size={12}/> {errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-blue-950 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-900 hover:shadow-xl hover:shadow-blue-900/20 transition-all disabled:opacity-70 disabled:hover:scale-100 mt-4 group"
            >
              {isLoading ? <Loader2 size={22} className="animate-spin" /> : <>Sign In Securely <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              {"Don't have an account yet? "}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Apply for Mentorship</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
