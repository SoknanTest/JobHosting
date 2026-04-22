import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Bell, Briefcase, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default async function NotificationsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifications</h1>
        <button className="text-sm font-bold text-indigo-600 hover:underline">Mark all as read</button>
      </div>
      
      <div className="space-y-4">
        {[
          { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50', title: 'New Application', desc: 'Someone applied for your "Senior React Developer" position.', time: '2 mins ago', unread: true },
          { icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50', title: 'New Message', desc: 'John Doe sent you a message regarding the interview.', time: '1 hour ago', unread: true },
          { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', title: 'Job Approved', desc: 'Your job listing "UI/UX Designer" has been approved and is now live.', time: '5 hours ago', unread: false },
          { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Application Deadline', desc: 'The deadline for "Marketing Specialist" is approaching in 24 hours.', time: '1 day ago', unread: false },
        ].map((n, i) => (
          <div key={i} className={`p-5 rounded-2xl border transition-all cursor-pointer ${n.unread ? 'bg-white border-indigo-100 shadow-lg shadow-indigo-50/50' : 'bg-gray-50/50 border-gray-100'}`}>
            <div className="flex gap-4">
              <div className={`h-12 w-12 rounded-xl ${n.bg} flex items-center justify-center ${n.color} flex-shrink-0`}>
                <n.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-sm font-black ${n.unread ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h3>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{n.time}</span>
                </div>
                <p className={`text-sm mt-1 leading-relaxed ${n.unread ? 'text-gray-700' : 'text-gray-500'}`}>{n.desc}</p>
              </div>
              {n.unread && <div className="h-2 w-2 rounded-full bg-indigo-600 mt-2" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
