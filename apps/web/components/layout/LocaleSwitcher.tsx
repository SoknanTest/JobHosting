'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/routing';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative inline-block text-left">
      <select
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
        className="block w-full rounded-md border-gray-600 py-1 pl-2 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
      >
        <option value="en">English 🇬🇧</option>
        <option value="km">ភាសាខ្មែរ 🇰🇭</option>
      </select>
    </div>
  );
}
