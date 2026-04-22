'use client';

import { Link, usePathname } from '@/routing';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle,
  Users,
  MessageSquare, 
  Bell, 
  Building,
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/employer' },
  { icon: Briefcase, label: 'My Jobs', href: '/employer/jobs' },
  { icon: PlusCircle, label: 'Post a Job', href: '/employer/jobs/new' },
  { icon: Users, label: 'Applicants', href: '/employer/applicants' },
  { icon: MessageSquare, label: 'Messages', href: '/chat' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Building, label: 'Company Profile', href: '/employer/company' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function EmployerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r h-[calc(100vh-64px)] sticky top-16 hidden md:flex flex-col">
      <div className="flex-1 py-6 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                isActive 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                {item.label}
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <button className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
