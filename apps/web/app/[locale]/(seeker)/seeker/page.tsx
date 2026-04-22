import { setRequestLocale } from 'next-intl/server';
import SeekerDashboardClient from './SeekerDashboardClient';

export default async function SeekerDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SeekerDashboardClient />;
}
