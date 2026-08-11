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
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(2, 'At least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setFormError('');
    setFormSuccess('');
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
      setFormSuccess('Account created successfully!');
      // Require onboarding and route to the flow
      localStorage.setItem('lumora_require_onboarding', 'true');
      localStorage.removeItem('lumora_onboarding_completed');
      router.push('/onboarding');
    } catch (err: any) {
      setFormError(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* 2026 Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-sky-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 pointer-events-none" />
      
      {/* Centered Glassmorphic Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-8 md:p-12 relative z-10"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center font-bold text-lg text-white shadow-md group-hover:scale-105 transition-transform">R</div>
            <span className="font-bold text-xl text-blue-950">Lumora</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 tracking-tight">Apply for Mentorship</h1>
          <p className="text-slate-500 font-medium">Create your account to step into the sanctuary and connect with Rev. Dubus Achufusi.</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">First Name</label>
              <input 
                {...register('firstName')} 
                type="text" 
                placeholder="John" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" 
              />
              {errors.firstName && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1.5"><Sparkles size={12}/> {errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">Last Name</label>
              <input 
                {...register('lastName')} 
                type="text" 
                placeholder="Doe" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm" 
              />
              {errors.lastName && <p className="text-red-500 text-xs font-medium flex items-center gap-1 mt-1.5"><Sparkles size={12}/> {errors.lastName.message}</p>}
            </div>
          </div>

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
            <label className="block text-sm font-bold text-slate-700">Password</label>
            <div className="relative">
              <input 
                {...register('password')} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="At least 8 characters" 
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
            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 hover:shadow-xl hover:shadow-red-500/20 transition-all disabled:opacity-70 disabled:hover:scale-100 mt-4 group"
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : <>Continue to Profile <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-xs font-medium">
          By signing up, you agree to our{' '}
          <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Terms</Link> and{' '}
          <Link href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Privacy Policy</Link>
        </p>

        <div className="mt-6 text-center border-t border-slate-100 pt-6">
          <p className="text-slate-500 text-sm font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
