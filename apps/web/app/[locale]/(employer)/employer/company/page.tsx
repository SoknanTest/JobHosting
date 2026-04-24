'use client';

import { useTranslations } from 'next-intl';
import { Building, Globe, MapPin, Mail, Save, Loader2 } from 'lucide-react';
import { useGetMeQuery } from '@/store/api/usersApi';

export default function CompanyProfilePage() {
  const t = useTranslations('job');
  const commonT = useTranslations('common');
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const company = user?.company;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Building className="h-8 w-8 text-indigo-600" />
          Company Profile
        </h1>
        <p className="mt-2 text-gray-900 font-medium">Manage your company details and how they appear to candidates</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-400 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-600 bg-gray-300/30">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="h-32 w-32 rounded-3xl bg-white border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-900 group hover:border-indigo-300 transition-all cursor-pointer overflow-hidden shadow-inner">
              {company?.logo ? (
                <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
              ) : (
                <Building className="h-10 w-10 group-hover:scale-110 transition-transform" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Company Name</label>
                <input 
                  type="text" 
                  defaultValue={company?.name || ''} 
                  placeholder="e.g. Tech Cambodia"
                  className="w-full px-4 py-3 bg-white border border-gray-400 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold text-gray-900"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-900" />
                    <input 
                      type="url" 
                      defaultValue={company?.website || ''} 
                      placeholder="https://example.com"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-400 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-900" />
                    <input 
                      type="text" 
                      defaultValue={company?.location || ''} 
                      placeholder="e.g. Phnom Penh"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-400 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2">About the Company</label>
            <textarea 
              rows={6}
              defaultValue={company?.description || ''}
              placeholder="Tell job seekers about your company culture, mission, and what it's like to work there..."
              className="w-full px-4 py-3 bg-white border border-gray-400 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
              <Save className="h-4 w-4" />
              {commonT('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

