import { Link } from '@/routing';
import { useTranslations } from 'next-intl';
import { MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    type: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    createdAt: string;
    company?: {
      name: string;
      logo?: string;
    };
  };
}

export default function JobCard({ job }: JobCardProps) {
  const t = useTranslations('job');
  const commonT = useTranslations('common');

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
    : job.salaryMin 
      ? `From $${job.salaryMin.toLocaleString()}` 
      : job.salaryMax 
        ? `Up to $${job.salaryMax.toLocaleString()}` 
        : 'Salary not specified';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl flex-shrink-0 border border-indigo-100 overflow-hidden">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={job.company.name} className="h-full w-full object-cover" />
            ) : (
              job.company?.name.charAt(0) || 'J'
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {job.title}
            </h3>
            <p className="text-indigo-600 font-medium text-sm mt-1">
              {job.company?.name || 'Private Employer'}
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100 uppercase">
            {t(`type.${job.type.toLowerCase().replace('_', '')}` as any)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-4 w-4" />
          <span>{formattedSalary}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase className="h-4 w-4" />
          <span>{t(`type.${job.type.toLowerCase().replace('_', '')}` as any)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t pt-4">
        <Link 
          href={`/jobs/${job.id}`}
          className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
        >
          View Details
        </Link>
        <Link
          href={`/jobs/${job.id}`}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
        >
          {t('apply')}
        </Link>
      </div>
    </div>
  );
}
