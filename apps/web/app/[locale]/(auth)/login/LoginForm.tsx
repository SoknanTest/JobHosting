'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useRouter } from '@/routing';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLoginMutation } from '@/store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useTranslations } from 'next-intl';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const t = useTranslations('auth');
  const commonT = useTranslations('common');
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials({ user: response.user, token: response.access_token }));
      
      const role = response.user.role;
      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'EMPLOYER') router.push('/employer');
      else router.push('/seeker');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
          {(error as any).data?.message || 'Invalid email or password.'}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
          {commonT('email')}
        </label>
        <div className="mt-1">
          <input
            {...register('email')}
            type="email"
            id="email"
            className="block w-full appearance-none rounded-md border border-gray-600 px-3 py-2 placeholder-gray-600 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
          {commonT('password')}
        </label>
        <div className="mt-1 relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="block w-full appearance-none rounded-md border border-gray-600 px-3 py-2 placeholder-gray-600 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            {t('forgotPassword')}
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('login')}
        </button>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-900">{t('dontHaveAccount')} </span>
        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          {t('register')}
        </Link>
      </div>
    </form>
  );
}

