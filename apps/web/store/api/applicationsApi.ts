import { apiSlice } from './apiSlice';
import { Application, ApplicationStatus } from '@shared/types';

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
}

export const applicationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyApplications: builder.query<Application[], void>({
      query: () => '/applications/mine',
      providesTags: ['Application'],
    }),
    updateApplicationStatus: builder.mutation<Application, { id: string; status: ApplicationStatus }>({
      query: ({ id, status }) => ({
        url: `/applications/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Application', 'Job'],
    }),
  }),
});

export const {
  useGetMyApplicationsQuery,
  useUpdateApplicationStatusMutation,
} = applicationsApi;
