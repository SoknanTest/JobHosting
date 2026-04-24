'use client';

import { useGetMyApplicationsQuery } from '@/store/api/applicationsApi';
import { Briefcase, Calendar, MapPin, Clock, Loader2 } from 'lucide-react';
import { Link } from '@/routing';
import { useTranslations } from 'next-intl';

export default function ApplicationsListClient() {
  const t = useTranslations('job');
  const commonT = useTranslations('common');
  
  const { data: applications, isLoading } = useGetMyApplicationsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications && applications.length > 0 ? (
        applications.map((app) => {
          if (!app.job) return null;
          return (
          <div key={app.id} className="bg-white p-6 rounded-2xl border border-gray-400 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-2xl flex-shrink-0 border border-indigo-100 overflow-hidden">
                  {app.job.company?.logo ? (
                    <img src={app.job.company.logo} alt={app.job.company.name} className="h-full w-full object-cover" />
                  ) : (
                    app.job.company?.name.charAt(0) || 'J'
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{app.job.title}</h3>
                  <p className="text-indigo-600 font-medium mt-1">{app.job.company?.name || t('privateEmployer')}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-900">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      <span>{app.job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{t('applied')} {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold border uppercase tracking-wide ${
                  app.status === 'ACCEPTED' ? 'bg-green-50 text-green-700 border-green-100' :
                  app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-100' :
                  app.status === 'REVIEWED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  'bg-yellow-50 text-yellow-700 border-yellow-100'
                }`}>
                  {t(`status.${app.status.toLowerCase()}` as any)}
                </span>
                <Link 
                  href={`/jobs/${app.job.id}`}
                  className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  {t('viewDetails')} &rarr;
                </Link>
              </div>
            </div>
          </div>
          );
        })
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-dashed text-center">
          <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">{t('noApplicationsYet')}</h3>
          <p className="text-gray-900 mt-1 mb-6">Start your career journey today by applying to jobs.</p>
          <Link href="/jobs" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">
            {t('browseSubtitle')}
          </Link>
        </div>
      )}
    </div>
  );
}

