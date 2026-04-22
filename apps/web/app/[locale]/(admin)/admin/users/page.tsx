import { setRequestLocale } from 'next-intl/server';
import UsersManagementClient from './UsersManagementClient';

export default async function AdminUsersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UsersManagementClient />;
}
