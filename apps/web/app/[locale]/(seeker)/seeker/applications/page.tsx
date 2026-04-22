import { setRequestLocale, getTranslations } from 'next-intl/server';
import ApplicationsListClient from './ApplicationsListClient';

export default async function SeekerApplications({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('job');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('recentApplications')}</h1>
        <p className="mt-2 text-gray-600">Track and manage your job applications</p>
      </div>
      
      <ApplicationsListClient />
    </div>
  );
}
