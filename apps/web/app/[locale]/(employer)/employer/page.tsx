import { setRequestLocale } from 'next-intl/server';
import EmployerDashboardClient from './EmployerDashboardClient';

export default async function EmployerDashboard({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <EmployerDashboardClient />;
}
