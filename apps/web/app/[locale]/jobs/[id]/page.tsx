import { setRequestLocale } from 'next-intl/server';
import JobDetailClient from './JobDetailClient';

export default async function JobDetailPage({
  params
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <JobDetailClient id={id} />;
}
