'use client';

import { useGetAdminStatsQuery, useGetAllUsersQuery, useGetAllAdminJobsQuery } from '@/store/api/adminApi';
import { Users, Briefcase, AlertTriangle, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from '@/routing';

export default function AdminDashboardClient() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: users, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: jobs, isLoading: jobsLoading } = useGetAllAdminJobsQuery();

  const isLoading = statsLoading || usersLoading || jobsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const recentUsers = [...(users || [])].slice(0, 5);
  const recentJobs = [...(jobs || [])].slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-indigo-600" />
          Admin Panel
        </h1>
        <p className="mt-2 text-gray-900 font-medium">Overview of the platform activity and moderation</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-400 shadow-xl shadow-indigo-200/20 flex items-center gap-4">
          <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs text-gray-900 font-black uppercase tracking-widest">Total Users</p>
            <h3 className="text-3xl font-black text-gray-900">{stats?.users || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-400 shadow-xl shadow-indigo-200/20 flex items-center gap-4">
          <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
            <Briefcase className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs text-gray-900 font-black uppercase tracking-widest">Live Jobs</p>
            <h3 className="text-3xl font-black text-gray-900">{stats?.jobs || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-400 shadow-xl shadow-indigo-200/20 flex items-center gap-4">
          <div className="h-14 w-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 shadow-inner">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs text-gray-900 font-black uppercase tracking-widest">Applications</p>
            <h3 className="text-3xl font-black text-gray-900">{stats?.applications || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-400 shadow-xl shadow-indigo-200/20 flex items-center gap-4">
          <div className="h-14 w-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs text-gray-900 font-black uppercase tracking-widest">Companies</p>
            <h3 className="text-3xl font-black text-gray-900">{0}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-400 shadow-xl shadow-indigo-200/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Users</h2>
            <Link href="/admin/users" className="text-indigo-600 font-bold text-sm hover:underline">View All &rarr;</Link>
          </div>
          <div className="space-y-6">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-300 flex items-center justify-center font-bold text-gray-900 border border-gray-400">
                    {user.profile?.firstName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">{user.profile?.firstName} {user.profile?.lastName}</p>
                    <p className="text-xs text-gray-900 mt-1">{user.email}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg bg-gray-300 text-[10px] font-black uppercase tracking-tighter border border-gray-400 ${
                  user.role === 'ADMIN' ? 'text-red-600' : 
                  user.role === 'EMPLOYER' ? 'text-indigo-600' : 
                  'text-gray-900'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <div className="py-10 text-center text-gray-900 text-sm font-medium">No users found.</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-400 shadow-xl shadow-indigo-200/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Jobs</h2>
            <Link href="/admin/jobs" className="text-indigo-600 font-bold text-sm hover:underline">View All &rarr;</Link>
          </div>
          <div className="space-y-6">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 border border-indigo-100 overflow-hidden">
                    {job.company?.logo ? <img src={job.company.logo} alt="" className="h-full w-full object-cover" /> : 'J'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none truncate max-w-[200px]">{job.title}</p>
                    <p className="text-xs text-gray-900 mt-1">{job.company?.name || 'Private'}</p>
                  </div>
                </div>
                <Link href={`/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-700 text-xs font-black uppercase tracking-widest">
                  View
                </Link>
              </div>
            ))}
            {recentJobs.length === 0 && (
              <div className="py-10 text-center text-gray-900 text-sm font-medium">No jobs found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

