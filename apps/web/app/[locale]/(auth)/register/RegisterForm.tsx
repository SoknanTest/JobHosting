'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/routing';
import { useState } from 'react';
import { Eye, EyeOff, Loader2, User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRegisterMutation } from '@/store/api/authApi';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SEEKER', 'EMPLOYER'], {
    required_error: 'Please select a role',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const t = useTranslations('auth');
  const commonT = useTranslations('common');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'SEEKER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }).unwrap();
      
      router.push('/login');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
          {(error as any).data?.message || 'Registration failed. Please try again.'}
        </div>
      )}
      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('role')}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue('role', 'SEEKER')}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
              selectedRole === 'SEEKER' 
                ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                : "border-gray-200 hover:border-gray-300 text-gray-500"
            )}
          >
            <User className="h-6 w-6 mb-2" />
            <span className="text-sm font-semibold">{t('seeker')}</span>
          </button>
          <button
            type="button"
            onClick={() => setValue('role', 'EMPLOYER')}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
              selectedRole === 'EMPLOYER' 
                ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                : "border-gray-200 hover:border-gray-300 text-gray-500"
            )}
          >
            <Building2 className="h-6 w-6 mb-2" />
            <span className="text-sm font-semibold">{t('employer')}</span>
          </button>
        </div>
        {errors.role && (
          <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            {t('firstName')}
          </label>
          <div className="mt-1">
            <input
              {...register('firstName')}
              type="text"
              id="firstName"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            {t('lastName')}
          </label>
          <div className="mt-1">
            <input
              {...register('lastName')}
              type="text"
              id="lastName"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {commonT('email')}
        </label>
        <div className="mt-1">
          <input
            {...register('email')}
            type="email"
            id="email"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {commonT('password')}
        </label>
        <div className="mt-1 relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('register')}
        </button>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-600">{t('alreadyHaveAccount')} </span>
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          {t('login')}
        </Link>
      </div>
    </form>
  );
}
