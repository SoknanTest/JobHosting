import { Link } from '@/routing';
import { getTranslations } from 'next-intl/server';
import { BriefcaseBusiness, Mail, MapPin, Phone } from 'lucide-react';

export default async function Footer() {
  const t = await getTranslations('nav');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <BriefcaseBusiness className="h-6 w-6" />
              <span>JobCambodia</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Connecting Cambodia's best talent with top companies.
              Free for seekers and employers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  {t('jobs')}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                  {t('login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>support@jobcambodia.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Phnom Penh, Cambodia</span>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-4 text-sm text-gray-600">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookies Policy</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} JobCambodia Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
