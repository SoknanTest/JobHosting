import { setRequestLocale } from 'next-intl/server';
import EmployerSidebar from '@/components/dashboard/EmployerSidebar';
import JobForm from '@/components/jobs/JobForm';

export default async function NewJobPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex min-h-screen bg-gray-300/50">
      <EmployerSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
            <p className="text-gray-900 mt-1">Fill in the details to find your next great hire</p>
          </div>

          <JobForm />
        </div>
      </main>
    </div>
  );
}

