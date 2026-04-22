import { getTranslations, setRequestLocale } from 'next-intl/server';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Link } from '@/routing';
import { cn } from '@/lib/utils';

export default async function SeekerDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('nav');

  const stats = [
    { label: 'Total Applications', value: '12', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Interviews', value: '3', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Accepted', value: '1', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Pending', value: '8', icon: Clock, color: 'bg-yellow-500' },
  ];

  const recentApplications = [
    { id: '1', title: 'Senior React Developer', company: 'Tech Cambodia', status: 'INTERVIEW', date: '2026-04-20', location: 'Phnom Penh' },
    { id: '2', title: 'UI Designer', company: 'Creative Hub', status: 'PENDING', date: '2026-04-18', location: 'Remote' },
    { id: '3', title: 'Marketing Lead', company: 'Angkor Solutions', status: 'REJECTED', date: '2026-04-15', location: 'Siem Reap' },
  ];

  return (
    <div className="flex bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, Seeker!</h1>
              <p className="mt-2 text-gray-600 font-medium">Keep track of your applications and discover new opportunities.</p>
            </div>
            <Link 
              href="/jobs"
              className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              Browse New Jobs
            </Link>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-shadow">
                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-100 transition-transform group-hover:scale-110`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900 leading-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                  <Link href="/applications" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentApplications.map((app) => (
                    <div key={app.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center border group-hover:bg-white transition-colors">
                          <Briefcase className="h-6 w-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">{app.title}</h4>
                          <p className="text-sm font-medium text-gray-500 mt-1">{app.company} • {app.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Applied</p>
                          <p className="text-sm font-bold text-gray-900 mt-0.5">{new Date(app.date).toLocaleDateString()}</p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border",
                          app.status === 'INTERVIEW' && "bg-purple-50 text-purple-700 border-purple-100",
                          app.status === 'PENDING' && "bg-yellow-50 text-yellow-700 border-yellow-100",
                          app.status === 'REJECTED' && "bg-red-50 text-red-700 border-red-100",
                        )}>
                          {app.status}
                        </span>
                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-8">
              <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-4 leading-tight">Complete your profile to get noticed!</h3>
                  <p className="text-indigo-100 font-medium mb-6 leading-relaxed">Profiles with CVs are 3x more likely to be contacted by employers.</p>
                  <Link 
                    href="/profile"
                    className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-indigo-50 transition-all transform hover:scale-105"
                  >
                    Update Profile
                  </Link>
                </div>
                <TrendingUp className="absolute bottom-[-20%] right-[-10%] h-48 w-48 text-indigo-500 opacity-30 transform -rotate-12 transition-transform group-hover:rotate-0 duration-500" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Job Recommendations</h3>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 border group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                        <Briefcase className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-all" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1">Product Manager</h4>
                        <p className="text-xs font-semibold text-gray-500 mt-1">Sihanoukville • $1k - $2k</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/jobs" className="mt-8 block text-center text-sm font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">View More Suggestions</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
