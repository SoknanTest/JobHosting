'use client';

import { useState, useEffect } from 'react';
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '@/store/api/notificationsApi';
import { useSocket } from '@/components/providers/SocketProvider';
import { Bell, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@/routing';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function NotificationBell() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: notifications, isLoading, refetch } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const { notificationSocket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  const notificationsHref = user?.role === 'ADMIN' ? '/admin/notifications' : 
                         user?.role === 'EMPLOYER' ? '/employer/notifications' : 
                         '/seeker/notifications';

  useEffect(() => {
    if (!notificationSocket) return;

    notificationSocket.on('newNotification', () => {
      refetch();
    });

    return () => {
      notificationSocket.off('newNotification');
    };
  }, [notificationSocket, refetch]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-900 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl border border-gray-400 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b flex items-center justify-between px-6 bg-gray-300/60">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
              ) : notifications && notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={`p-4 border-b last:border-0 hover:bg-gray-400 transition-colors cursor-pointer relative ${!notification.isRead ? 'bg-indigo-50/20' : ''}`}
                  >
                    {!notification.isRead && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    )}
                    <div className="pl-2">
                      <p className="text-sm text-gray-900 font-bold leading-tight mb-1">{notification.message}</p>
                      <p className="text-[10px] text-gray-900 font-black uppercase tracking-tighter">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="h-12 w-12 bg-gray-300 rounded-2xl flex items-center justify-center text-gray-600 mb-3 border border-gray-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-gray-900 font-bold uppercase tracking-widest leading-none">All caught up!</p>
                  <p className="text-[10px] text-gray-900 mt-2 font-medium">No new notifications at the moment.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t text-center bg-gray-300/40">
              <Link 
                href={notificationsHref} 
                onClick={() => setIsOpen(false)}
                className="text-[10px] font-black text-gray-900 hover:text-gray-900 uppercase tracking-widest"
              >
                View all activity
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


