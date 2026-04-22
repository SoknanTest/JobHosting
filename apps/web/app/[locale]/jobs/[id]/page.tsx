import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { MapPin, Briefcase, Clock, DollarSign, Building2, Calendar, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@/routing';

async function getJob(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  
  try {
    const res = await fetch(`${baseUrl}/jobs/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    // Mock data for fallback
    if (id === '1') {
      return {
        id: '1',
        title: 'Senior React Developer',
        description: '## Job Description\nWe are looking for a Senior React Developer to lead our frontend team. You will be responsible for architecting and implementing high-quality web applications using React, Next.js, and TypeScript.\n\n### Requirements\n- 5+ years of experience with React\n- Strong proficiency in TypeScript\n- Experience with Next.js App Router\n- Knowledge of Tailwind CSS and shadcn/ui',
        type: 'FULL_TIME',
        location: 'Phnom Penh',
        category: 'Development',
        salaryMin: 1500,
        salaryMax: 2500,
        deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        createdAt: new Date().toISOString(),
        company: { 
          name: 'Tech Cambodia', 
          description: 'A leading tech company in Phnom Penh.',
          website: 'https://techcambodia.com',
          location: 'Phnom Penh'
        }
      };
    }
    return null;
  }
}

export default async function JobDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('job');
  const commonT = await getTranslations('common');
  
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
    : job.salaryMin 
      ? `From $${job.salaryMin.toLocaleString()}` 
      : job.salaryMax 
        ? `Up to $${job.salaryMax.toLocaleString()}` 
        : 'Salary not specified';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
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
                <div className="mt-4 flex flex-wrap items-center gap-6 text-gray-500 font-medium">
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
              <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border transition-all">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border transition-all">
                <Share2 className="h-5 w-5" />
              </button>
              <Link
                href={`/jobs/${id}/apply`}
                className="flex-1 md:flex-none text-center bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                {t('apply')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                Job Description
              </h2>
              <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
                {job.description.split('\n').map((line: string, i: number) => (
                  <p key={i} className="mb-4">{line}</p>
                ))}
              </div>
            </div>

            {job.company?.description && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  About the Company
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {job.company.description}
                </p>
                {job.company.website && (
                  <a 
                    href={job.company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center text-indigo-600 font-semibold hover:underline"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Job Summary</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Salary</p>
                    <p className="text-gray-900 font-bold">{formattedSalary}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Deadline</p>
                    <p className="text-gray-900 font-bold">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Category</p>
                    <p className="text-gray-900 font-bold">{job.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Location</p>
                    <p className="text-gray-900 font-bold">{job.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href={`/jobs/${id}/apply`}
                  className="block w-full text-center bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Apply for this Job
                </Link>
                <p className="mt-4 text-xs text-center text-gray-500 font-medium">
                  Be sure to mention JobCambodia when applying!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
