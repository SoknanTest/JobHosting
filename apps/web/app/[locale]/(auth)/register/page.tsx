import { getTranslations, setRequestLocale } from 'next-intl/server';
import RegisterForm from './RegisterForm';

export default async function RegisterPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('auth');

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {t('registerTitle')}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('registerSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
