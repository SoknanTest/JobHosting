import { Link } from '@/routing';
import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from './LocaleSwitcher';
import UserNav from './UserNav';
import { BriefcaseBusiness, PlusCircle } from 'lucide-react';

export default async function Navbar() {
  const t = await getTranslations('nav');

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-black text-indigo-600 tracking-tight">
              <BriefcaseBusiness className="h-8 w-8" />
              <span className="hidden sm:inline">JobCambodia</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/jobs" className="text-gray-900 hover:text-indigo-600 font-bold transition-colors text-sm uppercase tracking-wide">
                {t('jobs')}
              </Link>
              <Link href="/employer/jobs/new" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold transition-colors text-sm uppercase tracking-wide">
                <PlusCircle className="h-4 w-4" />
                {t('postJob')}
              </Link>
            </div>
          </div>

          {/* Right side: User Nav & Locale */}
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            
            <div className="h-6 w-px bg-gray-400 mx-1" />

            <UserNav />
          </div>
        </div>
      </div>
    </nav>
  );
}


