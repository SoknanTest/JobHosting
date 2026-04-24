'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from '@/routing';
import { Loader2, Save } from 'lucide-react';
import { useCreateJobMutation, useUpdateJobMutation } from '@/store/api/jobsApi';
import { useTranslations } from 'next-intl';

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'FREELANCE', 'INTERNSHIP']),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().min(1, 'Please select a location'),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  deadline: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function JobForm({ initialData }: { initialData?: any }) {
  const t = useTranslations('job');
  const commonT = useTranslations('common');
  const router = useRouter();
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData || {
      type: 'FULL_TIME',
      category: 'Technology',
      location: 'Phnom Penh',
    },
  });

  const onSubmit = async (data: JobFormValues) => {
    try {
      if (initialData) {
        await updateJob({ id: initialData.id, job: data }).unwrap();
      } else {
        await createJob(data).unwrap();
      }
      router.push('/employer/jobs');
    } catch (error) {
      console.error('Failed to post job:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl border border-gray-400 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold text-gray-900 mb-2">{t('title')}</label>
          <input
            {...register('title')}
            placeholder={t('titlePlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
          {errors.title && <p className="mt-1 text-xs text-red-600 font-bold">{errors.title.message}</p>}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold text-gray-900 mb-2">{t('description')}</label>
          <textarea
            {...register('description')}
            rows={6}
            placeholder={t('descriptionPlaceholder')}
            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
          />
          {errors.description && <p className="mt-1 text-xs text-red-600 font-bold">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t('type.label')}</label>
          <select
            {...register('type')}
            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          >
            <option value="FULL_TIME">{t('type.fullTime')}</option>
            <option value="PART_TIME">{t('type.partTime')}</option>
            <option value="FREELANCE">{t('type.freelance')}</option>
            <option value="INTERNSHIP">{t('type.internship')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t('category')}</label>
          <select
            {...register('category')}
            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          >
            <option value="Technology">Technology</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Design">Design</option>
            <option value="Sales">Sales</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{commonT('location')}</label>
          <select
            {...register('location')}
            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          >
            <option value="Phnom Penh">Phnom Penh</option>
            <option value="Siem Reap">Siem Reap</option>
            <option value="Sihanoukville">Sihanoukville</option>
            <option value="Battambang">Battambang</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t('deadline')}</label>
          <input
            {...register('deadline')}
            type="date"
            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t('salaryMin')}</label>
          <input
            {...register('salaryMin', { valueAsNumber: true })}
            type="number"
            placeholder="e.g. 1000"
            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">{t('salaryMax')}</label>
          <input
            {...register('salaryMax', { valueAsNumber: true })}
            type="number"
            placeholder="e.g. 2000"
            className="w-full px-4 py-3 rounded-xl border border-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-400">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-400 transition-all"
        >
          {commonT('cancel')}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {initialData ? t('update') : t('post')}
        </button>
      </div>
    </form>
  );
}


