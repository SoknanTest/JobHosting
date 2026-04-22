import { getTranslations, setRequestLocale } from 'next-intl/server';
import EmployerSidebar from '@/components/dashboard/EmployerSidebar';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Eye, 
  Users, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { Link } from '@/routing';
import { cn } from '@/lib/utils';

export default async function EmployerJobsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('nav');
  const jobT = await getTranslations('job');

  const myJobs = [
    {
      id: '1',
      title: 'Senior React Developer',
      type: 'FULL_TIME',
      location: 'Phnom Penh',
      applicants: 45,
      views: 1200,
      status: 'active',
      createdAt: '2026-04-15'
    },
    {
      id: '2',
      title: 'UI/UX Designer',
      type: 'PART_TIME',
      location: 'Remote',
      applicants: 32,
      views: 850,
      status: 'active',
      createdAt: '2026-04-18'
    },
    {
      id: '3',
      title: 'Marketing Specialist',
      type: 'FREELANCE',
      location: 'Siem Reap',
      applicants: 12,
      views: 340,
      status: 'closed',
      createdAt: '2026-04-01'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <EmployerSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
              <p className="text-gray-500 mt-1">Manage and track your active job listings</p>
            </div>
            <Link
              href="/employer/jobs/new"
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100"
            >
              <Plus className="h-5 w-5" />
              Post New Job
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your jobs..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
              />
            </div>
            <div className="flex gap-4">
              <select className="px-4 py-2 rounded-xl border border-gray-100 text-sm font-medium focus:ring-2 focus:ring-indigo-100 outline-none">
                <option>All Status</option>
                <option>Active</option>
                <option>Closed</option>
                <option>Draft</option>
              </select>
            </div>
          </div>

          {/* Jobs List */}
          <div className="grid grid-cols-1 gap-6">
            {myJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                      job.status === 'active' ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"
                    )}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {jobT(`type.${job.type.toLowerCase().replace('_', '')}` as any)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Posted on {job.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 lg:px-8 lg:border-x border-gray-50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-indigo-600 font-bold mb-0.5">
                      <Users className="h-4 w-4" />
                      <span>{job.applicants}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applicants</span>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-gray-900 font-bold mb-0.5">
                      <Eye className="h-4 w-4" />
                      <span>{job.views}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Views</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link 
                    href={`/employer/jobs/${job.id}/applicants`}
                    className="flex-1 lg:flex-none text-center bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                  >
                    View Applicants
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
