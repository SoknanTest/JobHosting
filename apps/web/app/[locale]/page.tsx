import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/routing';
import { Search, Briefcase, Users, Building, ArrowRight } from 'lucide-react';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('nav');
  const jobT = await getTranslations('job');
  const commonT = await getTranslations('common');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700 border border-indigo-100 mb-8 animate-fade-in">
              🇰🇭 #1 Job Platform in Cambodia
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Find Your Dream Job in <span className="text-indigo-600">Cambodia</span>
            </h1>
            <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Connecting Cambodia's top talent with the best companies. 
              Browse thousands of jobs or post your opening for free.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/jobs"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
              >
                <Search className="h-5 w-5" />
                {t('jobs')}
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                {t('register')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-gray-400 grayscale opacity-70">
              <Building className="h-8 w-8" />
              <span className="font-bold text-xl">Trusted by 500+ Companies</span>
            </div>
          </div>
        </div>
        
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-24 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-4xl font-black text-gray-900">12,450+</h3>
              <p className="text-gray-600 font-medium uppercase tracking-widest text-sm">Active Jobs</p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-4xl font-black text-gray-900">85,000+</h3>
              <p className="text-gray-600 font-medium uppercase tracking-widest text-sm">Job Seekers</p>
            </div>
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center">
                <Building className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-4xl font-black text-gray-900">2,100+</h3>
              <p className="text-gray-600 font-medium uppercase tracking-widest text-sm">Top Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Popular Categories
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Browse jobs across the most in-demand industries
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Technology', 'Marketing', 'Finance', 'Design', 'Sales', 'Customer Service', 'Education', 'Healthcare'].map((cat) => (
              <Link 
                key={cat} 
                href={`/jobs?category=${cat}`}
                className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50 transition-all text-center group"
              >
                <div className="h-12 w-12 bg-indigo-50 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                  <Briefcase className="h-6 w-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{cat}</h4>
                <p className="text-xs text-gray-500 mt-2">150+ jobs available</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
