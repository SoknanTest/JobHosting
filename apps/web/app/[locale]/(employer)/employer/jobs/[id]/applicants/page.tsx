import { setRequestLocale } from 'next-intl/server';
import EmployerSidebar from '@/components/dashboard/EmployerSidebar';
import { 
  Mail, 
  Phone, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowLeft,
  Download,
  ExternalLink
} from 'lucide-react';
import { Link } from '@/routing';
import { cn } from '@/lib/utils';

export default async function JobApplicantsPage({
  params
}: {
  params: Promise<{ locale: string, id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const applicants = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+855 12 345 678',
      status: 'PENDING',
      appliedAt: '2026-04-20',
      resumeUrl: '#',
      coverNote: 'I am highly interested in this position and have 5 years of experience in React development.'
    },
    {
      id: '2',
      name: 'Sok San',
      email: 'sok.san@example.com',
      phone: '+855 99 888 777',
      status: 'REVIEWED',
      appliedAt: '2026-04-21',
      resumeUrl: '#',
      coverNote: 'Please find my attached resume. I have worked on several large-scale projects.'
    },
    {
      id: '3',
      name: 'Ly Na',
      email: 'lyna@example.com',
      phone: '+855 10 111 222',
      status: 'ACCEPTED',
      appliedAt: '2026-04-22',
      resumeUrl: '#',
      coverNote: 'I am looking for new opportunities and your company seems like a great fit.'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <EmployerSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href="/employer/jobs" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
            <p className="text-gray-500 mt-1">Reviewing candidates for <span className="text-indigo-600 font-bold">Senior React Developer</span></p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-xl border-2 border-white shadow-sm">
                          {applicant.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{applicant.name}</h3>
                          <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Applied on {applicant.appliedAt}
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        applicant.status === 'ACCEPTED' ? "bg-green-50 text-green-700" :
                        applicant.status === 'REVIEWED' ? "bg-blue-50 text-blue-700" :
                        applicant.status === 'REJECTED' ? "bg-red-50 text-red-700" :
                        "bg-gray-100 text-gray-600"
                      )}>
                        {applicant.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {applicant.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {applicant.phone}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Cover Note</h4>
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        "{applicant.coverNote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Download className="h-4 w-4" />
                        Download CV
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <ExternalLink className="h-4 w-4" />
                        View Profile
                      </button>
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-col gap-3 justify-center">
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100">
                      <CheckCircle className="h-4 w-4" />
                      Accept
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-gray-700 border border-gray-100 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
                      <Clock className="h-4 w-4" />
                      Shortlist
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-red-600 border border-red-50 rounded-xl text-sm font-bold hover:bg-red-50 transition-all shadow-sm">
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
