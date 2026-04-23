'use client';

import { useTranslations } from 'next-intl';
import { Settings, User, Bell, Shield, Lock, Save } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('nav');
  const commonT = useTranslations('common');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Settings className="h-8 w-8 text-indigo-600" />
          Settings
        </h1>
        <p className="mt-2 text-gray-600 font-medium">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Nav */}
        <div className="md:col-span-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 transition-all">
            <User className="h-4 w-4" />
            Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all text-left">
            <Bell className="h-4 w-4" />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all text-left">
            <Shield className="h-4 w-4" />
            Privacy
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all text-left">
            <Lock className="h-4 w-4" />
            Password
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Account Preferences</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Basic settings for your account</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Email Notifications</h4>
                  <p className="text-xs text-gray-500 font-medium">Receive updates about your applications via email</p>
                </div>
                <div className="h-6 w-11 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Public Profile</h4>
                  <p className="text-xs text-gray-500 font-medium">Make your profile visible to all employers</p>
                </div>
                <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95">
                  <Save className="h-4 w-4" />
                  {commonT('save')}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-red-50 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-red-50 bg-red-50/10">
              <h2 className="text-xl font-black text-red-600 tracking-tight">Danger Zone</h2>
              <p className="text-sm text-red-400 font-medium mt-1">Irreversible account actions</p>
            </div>
            <div className="p-8">
              <button className="text-sm font-black text-red-600 hover:text-red-700 underline underline-offset-4 decoration-2">
                Delete account and all data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
