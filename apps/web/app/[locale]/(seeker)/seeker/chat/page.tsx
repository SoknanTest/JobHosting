import { setRequestLocale } from 'next-intl/server';
import ChatLayout from '@/components/chat/ChatLayout';

export default async function SeekerChatPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ChatLayout />;
}
