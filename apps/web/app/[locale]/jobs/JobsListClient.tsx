'use client';

import { useState } from 'react';
import { useGetJobsQuery } from '@/store/api/jobsApi';
import JobCard from '@/components/jobs/JobCard';
import { Search, MapPin, Filter, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { JobType } from '@shared/types';

interface JobsListClientProps {
  initialSearch?: string;
  initialType?: JobType | JobType[];
  initialLocation?: string;
  initialSalaryMin?: number;
  initialSalaryMax?: number;
}

export default function JobsListClient({
  initialSearch = '',
  initialType,
  initialLocation = '',
  initialSalaryMin,
  initialSalaryMax,
}: JobsListClientProps) {
  const t = useTranslations('job');
  const commonT = useTranslations('common');
  
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState<JobType | undefined>(
    Array.isArray(initialType) ? initialType[0] : initialType
  );
  const [location, setLocation] = useState(initialLocation);
  const [salaryMin, setSalaryMin] = useState<number | undefined>(initialSalaryMin);
  const [salaryMax, setSalaryMax] = useState<number | undefined>(initialSalaryMax);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetJobsQuery({
    search,
    type,
    location,
    salaryMin,
    salaryMax,
    page,
    limit: 10,
  });

  const jobs = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as JobType;
    setType(prev => prev === value ? undefined : value);
    setPage(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
            <Filter className="h-5 w-5 text-indigo-600" />
            <h2>{t('filters')}</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-3">{t('type.label')}</label>
              <div className="space-y-2">
                {['FULL_TIME', 'PART_TIME', 'FREELANCE', 'INTERNSHIP'].map((jobType) => (
                  <label key={jobType} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      value={jobType}
                      checked={type === jobType}
                      onChange={handleTypeChange}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300 transition-all" 
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                      {t(`type.${jobType.toLowerCase().replace('_', '')}` as any)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-3">{commonT('location')}</label>
              <select 
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                className="block w-full rounded-lg border border-gray-200 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">{t('allLocations')}</option>
                <option value="Phnom Penh">Phnom Penh</option>
                <option value="Siem Reap">Siem Reap</option>
                <option value="Sihanoukville">Sihanoukville</option>
                <option value="Battambang">Battambang</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-3">{t('salaryRange')}</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={salaryMin || ''}
                  onChange={(e) => { setSalaryMin(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
                  placeholder="Min" 
                  className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500" 
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  value={salaryMax || ''}
                  onChange={(e) => { setSalaryMax(e.target.value ? Number(e.target.value) : undefined); setPage(1); }}
                  placeholder="Max" 
                  className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="lg:col-span-3">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 max-w-lg">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={commonT('search')}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm shadow-sm transition-all"
              />
            </form>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              {t('showingJobs', { count: meta.total })}
            </span>
            {(isLoading || isFetching) && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="bg-white p-12 rounded-xl border border-dashed text-center">
              <p className="text-gray-500 font-medium">{t('noJobsFound')}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button 
              disabled={meta.page <= 1 || isFetching} 
              onClick={() => setPage(prev => prev - 1)}
              className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              {commonT('previous')}
            </button>
            <span className="text-sm font-medium">{t('pageInfo', { current: meta.page, total: meta.totalPages })}</span>
            <button 
              disabled={meta.page >= meta.totalPages || isFetching} 
              onClick={() => setPage(prev => prev + 1)}
              className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              {commonT('next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
