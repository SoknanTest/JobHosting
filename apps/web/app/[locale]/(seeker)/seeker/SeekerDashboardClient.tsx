'use client';

import { useGetMyApplicationsQuery } from '@/store/api/applicationsApi';
import { useGetMeQuery } from '@/store/api/usersApi';
import { useGetJobsQuery } from '@/store/api/jobsApi';
import { Briefcase, CheckCircle, Clock, MessageSquare, Loader2, MapPin, Calendar } from 'lucide-react';
import { Link, useRouter } from '@/routing';
import { useTranslations } from 'next-intl';

export default function SeekerDashboardClient() {
  const t = useTranslations('nav');
  const commonT = useTranslations('common');
  const jobT = useTranslations('job');
  const router = useRouter();
  
  const { data: user } = useGetMeQuery();
  const { data: applications, isLoading: isLoadingApps } = useGetMyApplicationsQuery();
  const { data: recommendedJobs, isLoading: isLoadingJobs } = useGetJobsQuery({ limit: 3 });

  if (isLoadingApps || isLoadingJobs) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const stats = {
    applied: applications?.length || 0,
    accepted: applications?.filter(a => a.status === 'ACCEPTED').length || 0,
    pending: applications?.filter(a => a.status === 'PENDING').length || 0,
    messages: 0, // Placeholder
  };

  const recentApplications = [...(applications || [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{jobT('appliedJobs')}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.applied}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{jobT('accepted')}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.accepted}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{jobT('pending')}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{jobT('newMessages')}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.messages}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{jobT('recentApplications')}</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{jobT('job')}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{jobT('company')}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{commonT('date')}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{commonT('status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentApplications.map((app) => {
                  if (!app.job) return null;
                  return (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      <Link href={`/jobs/${app.job.id}`} className="hover:text-indigo-600">{app.job.title}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.job.company?.name || jobT('privateEmployer')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase ${
                        app.status === 'ACCEPTED' ? 'bg-green-50 text-green-800 border-green-100' :
                        app.status === 'REJECTED' ? 'bg-red-50 text-red-800 border-red-100' :
                        app.status === 'REVIEWED' ? 'bg-blue-50 text-blue-800 border-blue-100' :
                        'bg-yellow-50 text-yellow-800 border-yellow-100'
                      }`}>
                        {jobT(`status.${app.status.toLowerCase()}` as any)}
                      </span>
                    </td>
                  </tr>
                  );
                })}
                {recentApplications.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 font-medium">
                      {jobT('noApplicationsYet')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Link href="/seeker/applications" className="inline-block text-indigo-600 font-bold text-sm hover:underline">
            {jobT('viewAllApplications')} &rarr;
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{jobT('recommendedJobs')}</h2>
          <div className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {recommendedJobs?.data.map((job: any) => (
              <div 
                key={job.id} 
                onClick={() => router.push(`/jobs/${job.id}`)}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-indigo-600 transition-all cursor-pointer group"
              >
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                <p className="text-xs text-indigo-600 mt-1">{job.company?.name || jobT('privateEmployer')}</p>
                <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <span>{job.location}</span>
                  <span>
                    {job.salaryMin && job.salaryMax 
                      ? `$${job.salaryMin} - $${job.salaryMax}` 
                      : job.salaryMin ? `$${job.salaryMin}+` : 'Salary N/A'}
                  </span>
                </div>
              </div>
            ))}
            {recommendedJobs?.data.length === 0 && (
              <p className="text-sm text-gray-500 italic">{jobT('noJobsFound')}</p>
            )}
          </div>
          <Link href="/jobs" className="inline-block text-indigo-600 font-bold text-sm hover:underline">
            {jobT('browseMoreJobs')} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
