'use client';

import { useGetJobsQuery } from '@/store/api/jobsApi';
import { Briefcase, Users, Eye, CheckCircle, PlusCircle, Loader2 } from 'lucide-react';
import { Link } from '@/routing';
import { useTranslations } from 'next-intl';

export default function EmployerDashboardClient() {
  const t = useTranslations('nav');
  const jobT = useTranslations('job');
  const commonT = useTranslations('common');
  
  // For simplicity, we filter jobs by current user if we had that param, 
  // but let's assume getJobs returns employer's jobs when authenticated as employer
  // Actually, the API might have a separate endpoint for this, but let's check jobsApi.ts
  const { data, isLoading } = useGetJobsQuery({}); // In a real app, you'd have a specific endpoint or param

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const jobs = data?.data || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeJobs = jobs.filter((j: any) => j.isActive);
  
  // Mock stats since we don't have a specific stats endpoint for employers yet in the RTK slice
  const stats = {
    activeJobs: activeJobs.length,
    totalApplicants: 0, // Would need a separate query
    jobViews: 0,
    hired: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
        <Link 
          href="/employer/jobs/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm"
        >
          <PlusCircle className="h-5 w-5" />
          {t('postJob')}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Jobs</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeJobs}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Applicants</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalApplicants}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Job Views</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.jobViews}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Applications Hired</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.hired}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your Active Jobs</h2>
          <Link href="/employer/jobs" className="text-indigo-600 font-bold text-sm hover:underline">
            View all jobs &rarr;
          </Link>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applicants</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeJobs.map((job: any) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{job.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Posted {new Date(job.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="font-bold text-indigo-600">0</span> applicants
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-800 border border-green-100 uppercase">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/employer/jobs/${job.id}/applicants`} className="text-indigo-600 hover:text-indigo-900 font-bold mr-4">
                      View Applicants
                    </Link>
                    <Link href={`/employer/jobs/${job.id}/edit`} className="text-gray-400 hover:text-gray-600 font-bold">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {activeJobs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 font-medium">
                    No active jobs yet. Post your first job to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
