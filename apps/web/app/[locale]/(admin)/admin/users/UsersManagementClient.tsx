'use client';

import { useGetAllUsersQuery, useToggleUserBanMutation, useUpdateUserRoleMutation } from '@/store/api/adminApi';
import { User, Mail, Shield, ShieldAlert, Loader2, Ban, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function UsersManagementClient() {
  const { data: users, isLoading } = useGetAllUsersQuery();
  const [toggleBan, { isLoading: isBanning }] = useToggleUserBanMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleToggleBan = async (id: string, isBanned: boolean) => {
    try {
      await toggleBan({ id, isBanned: !isBanned }).unwrap();
    } catch (err) {
      console.error('Failed to toggle ban:', err);
    }
  };

  const handleRoleChange = async (id: string, role: any) => {
    try {
      await updateRole({ id, role }).unwrap();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Shield className="h-8 w-8 text-indigo-600" />
          User Management
        </h1>
        <p className="mt-2 text-gray-900 font-medium">Manage user accounts, roles, and access</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-400 shadow-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-400">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-widest">Role</th>
              <th className="px-6 py-4 text-left text-xs font-black text-gray-900 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right text-xs font-black text-gray-900 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-400/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-300 flex items-center justify-center font-bold text-gray-900">
                      {user.profile?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-none">
                        {user.profile?.firstName} {user.profile?.lastName}
                      </div>
                      <div className="text-xs text-gray-900 mt-1 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="text-xs font-bold rounded-lg border-gray-500 bg-white py-1 px-2 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                    disabled={isUpdatingRole}
                  >
                    <option value="SEEKER">Seeker</option>
                    <option value="EMPLOYER">Employer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isBanned ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                      <ShieldAlert className="h-3 w-3" />
                      Banned
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleToggleBan(user.id, user.isBanned)}
                    disabled={isBanning}
                    className={`text-xs font-black uppercase tracking-widest flex items-center gap-1 ml-auto ${
                      user.isBanned ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    <Ban className="h-3.5 w-3.5" />
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users?.length === 0 && (
          <div className="py-20 text-center text-gray-900 font-medium">No users found.</div>
        )}
      </div>
    </div>
  );
}

