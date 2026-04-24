'use client';

import { useGetJobQuery, useApplyToJobMutation } from '@/store/api/jobsApi';
import { useGetMeQuery } from '@/store/api/usersApi';
import { MapPin, Briefcase, Clock, DollarSign, Building2, Calendar, Share2, Bookmark, Loader2, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/routing';

interface JobDetailClientProps {
  id: string;
}

export default function JobDetailClient({ id }: JobDetailClientProps) {
  const t = useTranslations('job');
  const commonT = useTranslations('common');
  
  const { data: job, isLoading, error } = useGetJobQuery(id);
  const { data: user } = useGetMeQuery();
  const [apply, { isLoading: isApplying, isSuccess: isApplied }] = useApplyToJobMutation();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverNote, setCoverNote] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">{t('jobNotFound')}</h2>
        <Link href="/jobs" className="mt-4 text-indigo-600 hover:underline">{t('backToJobs')}</Link>
      </div>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apply({ id, application: { coverNote } }).unwrap();
      setShowApplyForm(false);
    } catch (err) {
      console.error('Failed to apply:', err);
    }
  };

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
    : job.salaryMin 
      ? t('fromSalary', { amount: job.salaryMin.toLocaleString() })
      : job.salaryMax 
        ? t('upToSalary', { amount: job.salaryMax.toLocaleString() })
        : t('salaryNotSpecified');

  return (
    <div className="bg-gray-300 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-3xl border border-indigo-100 shadow-sm overflow-hidden flex-shrink-0">
                {job.company?.logo ? (
                  <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-cover" />
                ) : (
                  job.company?.name.charAt(0) || 'J'
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {job.title}
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-100 uppercase">
                    {t(`type.${job.type.toLowerCase().replace('_', '')}` as any)}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-6 text-gray-900 font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    <span className="text-gray-900">{job.company?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-3 text-gray-900 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border transition-all">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-3 text-gray-900 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border transition-all">
                <Share2 className="h-5 w-5" />
              </button>
              
              {isApplied ? (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold border border-green-100">
                  <CheckCircle className="h-5 w-5" />
                  {t('applied')}
                </div>
              ) : user?.role === 'SEEKER' ? (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  {t('apply')}
                </button>
              ) : !user ? (
                <Link
                  href="/login"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  {t('loginToApply')}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {showApplyForm && (
              <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-indigo-600 animate-in fade-in zoom-in duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('applyForJob', { title: job.title })}</h2>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">{t('coverNote')}</label>
                    <textarea
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl border-gray-500 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      placeholder={t('coverNotePlaceholder')}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowApplyForm(false)}
                      className="px-6 py-2 text-sm font-bold text-gray-900 hover:bg-gray-400 rounded-lg transition-colors"
                    >
                      {commonT('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {isApplying && <Loader2 className="h-4 w-4 animate-spin" />}
                      {t('submitApplication')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-400">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                {t('description')}
              </h2>
              <div className="prose prose-indigo max-w-none text-gray-900 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {job.company?.description && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-400">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  {t('aboutCompany')}
                </h2>
                <p className="text-gray-900 leading-relaxed">
                  {job.company.description}
                </p>
                {job.company.website && (
                  <a 
                    href={job.company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center text-indigo-600 font-semibold hover:underline"
                  >
                    {t('visitWebsite')}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-400 sticky top-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{t('summary')}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 uppercase tracking-wider">{t('salary')}</p>
                    <p className="text-gray-900 font-bold">{formattedSalary}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 uppercase tracking-wider">{t('deadline')}</p>
                    <p className="text-gray-900 font-bold">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : t('noDeadline')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 uppercase tracking-wider">{t('category')}</p>
                    <p className="text-gray-900 font-bold">{job.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 uppercase tracking-wider">{commonT('location')}</p>
                    <p className="text-gray-900 font-bold">{job.location}</p>
                  </div>
                </div>
              </div>

              {!isApplied && user?.role === 'SEEKER' && (
                <div className="mt-10">
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="block w-full text-center bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                  >
                    {t('applyNow')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


