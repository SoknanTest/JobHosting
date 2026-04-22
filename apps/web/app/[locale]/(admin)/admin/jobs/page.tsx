import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Search, Briefcase, MapPin, Trash2, ExternalLink } from 'lucide-react';
import { Link } from '@/routing';

export default async function AdminJobsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Job Moderation</h1>
          <p className="mt-2 text-gray-600 font-medium">Monitor and manage all job listings on the platform</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search jobs by title or company..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Details</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Employer</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">J</div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-none">Senior Developer role {i}</div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-tighter">
                        <MapPin className="h-2.5 w-2.5" />
                        Phnom Penh
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-700">Tech Cambodia</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">employer@example.com</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-black text-green-700 border border-green-100 uppercase tracking-tighter">
                    Live
                  </span>
                </td>
                <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500 font-medium">Oct 22, 2023</td>
                <td className="px-8 py-5 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/jobs/${i}`} className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-gray-100 shadow-sm">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-gray-100 shadow-sm">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
