'use client';

import { useGetEmployerApplicationsQuery, useUpdateApplicationStatusMutation } from '@/store/api/applicationsApi';
import { 
  Mail, 
  Phone, 
  Clock,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  Users
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@shared/types';

export default function EmployerApplicantsPage() {
  const t = useTranslations('job');
  const commonT = useTranslations('common');
  const { data: applications, isLoading } = useGetEmployerApplicationsQuery();
  const [updateStatus] = useUpdateApplicationStatusMutation();

  const handleUpdateStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8 text-indigo-600" />
          All Applicants
        </h1>
        <p className="mt-2 text-gray-600 font-medium">Review and manage all candidates who applied to your jobs</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applications && applications.length > 0 ? (
          applications.map((app) => (
            <div key={app.id} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden group hover:border-indigo-100 transition-all">
              <div className="p-8 flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-2xl border-2 border-white shadow-inner">
                        {app.seeker?.profile?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 leading-none">
                          {app.seeker?.profile?.firstName} {app.seeker?.profile?.lastName}
                        </h3>
                        <p className="text-sm text-indigo-600 font-bold mt-2 flex items-center gap-1.5">
                          <span className="text-gray-400 font-medium">Applied for:</span> {app.job?.title}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      app.status === 'ACCEPTED' ? "bg-green-50 text-green-700 border-green-100" :
                      app.status === 'REVIEWED' ? "bg-blue-50 text-blue-700 border-blue-100" :
                      app.status === 'REJECTED' ? "bg-red-50 text-red-700 border-red-100" :
                      "bg-yellow-50 text-yellow-700 border-yellow-100"
                    )}>
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      {app.seeker?.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {app.coverNote && (
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50 mb-6">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cover Note</h4>
                      <p className="text-sm text-gray-700 leading-relaxed italic">
                        "{app.coverNote}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95">
                      <Download className="h-4 w-4" />
                      Resume
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95">
                      <ExternalLink className="h-4 w-4" />
                      Profile
                    </button>
                  </div>
                </div>

                <div className="lg:w-56 flex flex-col gap-3 justify-center border-l border-gray-50 lg:pl-8">
                  <button 
                    onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(app.id, 'REVIEWED')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white text-gray-700 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                  >
                    <Clock className="h-4 w-4" />
                    Shortlist
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-white text-red-600 border border-red-50 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm active:scale-95"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center shadow-inner">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Users className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No applicants yet</h3>
            <p className="text-gray-500 mt-2 font-medium max-w-xs mx-auto">When candidates apply to your job postings, they will appear here for your review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
