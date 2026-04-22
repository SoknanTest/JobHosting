import { Link } from '@/routing';
import { getTranslations } from 'next-intl/server';
import LocaleSwitcher from './LocaleSwitcher';
import { BriefcaseBusiness, UserCircle, LogIn, UserPlus } from 'lucide-react';

export default async function Navbar() {
  const t = await getTranslations('nav');

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <BriefcaseBusiness className="h-8 w-8" />
              <span className="hidden sm:inline">JobCambodia</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-4">
              <Link href="/jobs" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                {t('jobs')}
              </Link>
            </div>
          </div>

          {/* Right side: Auth & Locale */}
          <div className="flex items-center gap-4">
            <LocaleSwitcher />
            
            <div className="h-6 w-px bg-gray-200 mx-2" />

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>{t('login')}</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
              >
                <UserPlus className="h-4 w-4" />
                <span>{t('register')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
