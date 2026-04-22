'use client';

import { Link } from '@/routing';
import { useTranslations } from 'next-intl';
import { LogIn, UserPlus, UserCircle, LogOut, LayoutDashboard, Briefcase, MessageSquare } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { useLogoutMutation } from '@/store/api/authApi';
import NotificationBell from '../notifications/NotificationBell';

export default function UserNav() {
  const t = useTranslations('nav');
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch(logout()); // Ensure local logout even if API fails
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>{t('login')}</span>
        </Link>
        <Link
          href="/register"
          className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          <span>{t('register')}</span>
        </Link>
      </div>
    );
  }

  const dashboardHref = user?.role === 'ADMIN' ? '/admin' : user?.role === 'EMPLOYER' ? '/employer' : '/seeker';

  return (
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <NotificationBell />
      
      {/* Messages */}
      <Link href={`${dashboardHref}/chat`} className="text-gray-500 hover:text-indigo-600 transition-colors">
        <MessageSquare className="h-5 w-5" />
      </Link>

      <div className="h-6 w-px bg-gray-200" />

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <Link
          href={dashboardHref}
          className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">{t('dashboard')}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}
