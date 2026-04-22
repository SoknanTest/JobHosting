import { apiSlice } from './apiSlice';
import { User, Job, Role } from '@shared/types';

export interface AdminStats {
  users: number;
  jobs: number;
  applications: number;
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),
    toggleUserBan: builder.mutation<User, { id: string; isBanned: boolean }>({
      query: ({ id, isBanned }) => ({
        url: `/admin/users/${id}/ban`,
        method: 'PATCH',
        body: { isBanned },
      }),
      invalidatesTags: ['User'],
    }),
    updateUserRole: builder.mutation<User, { id: string; role: Role }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    getAllAdminJobs: builder.query<Job[], void>({
      query: () => '/admin/jobs',
      providesTags: ['Job'],
    }),
    deleteAdminJob: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Job'],
    }),
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useToggleUserBanMutation,
  useUpdateUserRoleMutation,
  useGetAllAdminJobsQuery,
  useDeleteAdminJobMutation,
  useGetAdminStatsQuery,
} = adminApi;
