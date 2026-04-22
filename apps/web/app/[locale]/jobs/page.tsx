import { getTranslations, setRequestLocale } from 'next-intl/server';
import JobsListClient from './JobsListClient';
import { JobType } from '@shared/types';

export default async function JobsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<any>;
}) {
  const { locale } = await params;
  const sParams = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations('nav');
  const jobT = await getTranslations('job');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('jobs')}
          </h1>
          <p className="mt-2 text-gray-600">
            {jobT('browseSubtitle')}
          </p>
        </div>
      </div>

      <JobsListClient 
        initialSearch={sParams.search}
        initialType={sParams.type as JobType}
        initialLocation={sParams.location}
        initialSalaryMin={sParams.salaryMin ? Number(sParams.salaryMin) : undefined}
        initialSalaryMax={sParams.salaryMax ? Number(sParams.salaryMax) : undefined}
      />
    </div>
  );
}
