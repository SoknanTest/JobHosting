import { setRequestLocale } from 'next-intl/server';
import ProfileClient from './ProfileClient';

export default async function SeekerProfile({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProfileClient />;
}
