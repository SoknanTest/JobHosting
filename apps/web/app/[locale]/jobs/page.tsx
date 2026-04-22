import { getTranslations, setRequestLocale } from 'next-intl/server';
import JobCard from '@/components/jobs/JobCard';
import { Search, MapPin, Filter } from 'lucide-react';

async function getJobs(searchParams: any) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const query = new URLSearchParams(searchParams).toString();
  
  try {
    const res = await fetch(`${baseUrl}/jobs?${query}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Fallback data for preview
    return {
      data: [
        {
          id: '1',
          title: 'Senior React Developer',
          description: 'Looking for an experienced React developer to join our team in Phnom Penh.',
          type: 'FULL_TIME',
          location: 'Phnom Penh',
          salaryMin: 1500,
          salaryMax: 2500,
          createdAt: new Date().toISOString(),
          company: { name: 'Tech Cambodia', logo: '' }
        },
        {
          id: '2',
          title: 'Marketing Specialist',
          description: 'Join our marketing team to help grow our brand presence.',
          type: 'PART_TIME',
          location: 'Siem Reap',
          salaryMin: 500,
          salaryMax: 1000,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          company: { name: 'Angkor Solutions', logo: '' }
        },
        {
          id: '3',
          title: 'UI/UX Designer',
          description: 'Design beautiful interfaces for our next-gen mobile app.',
          type: 'FREELANCE',
          location: 'Remote',
          salaryMin: 2000,
          salaryMax: 4000,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          company: { name: 'Creative Hub', logo: '' }
        }
      ],
      meta: { total: 3, page: 1, limit: 10, totalPages: 1 }
    };
  }
}

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
  const commonT = await getTranslations('common');
  
  const { data: jobs, meta } = await getJobs(sParams);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('jobs')}
          </h1>
          <p className="mt-2 text-gray-600">
            Discover your next career move in Cambodia
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder={commonT('search')}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold">
              <Filter className="h-5 w-5 text-indigo-600" />
              <h2>Filters</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Job Type</label>
                <div className="space-y-2">
                  {['FULL_TIME', 'PART_TIME', 'FREELANCE', 'INTERNSHIP'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300 transition-all" />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{jobT(`type.${type.toLowerCase().replace('_', '')}` as any)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Location</label>
                <select className="block w-full rounded-lg border border-gray-200 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                  <option>All Locations</option>
                  <option>Phnom Penh</option>
                  <option>Siem Reap</option>
                  <option>Sihanoukville</option>
                  <option>Battambang</option>
                  <option>Remote</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Salary Range</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
              </div>

              <button className="w-full bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{jobs.length}</span> jobs
            </span>
            <select className="text-sm border-none bg-transparent font-medium text-gray-700 focus:ring-0 cursor-pointer">
              <option>Newest First</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job: any) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50">Previous</button>
              <span className="text-sm font-medium">Page {meta.page} of {meta.totalPages}</span>
              <button className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
