import { apiSlice } from './apiSlice';
import { Job, PaginatedResponse, Application, JobType } from '@shared/types';

export interface QueryJobsRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  location?: string;
  type?: JobType;
  salaryMin?: number | string;
  salaryMax?: number | string;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  type: JobType;
  category: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  deadline?: string;
}

export interface CreateApplicationRequest {
  coverNote?: string;
}

export const jobsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<PaginatedResponse<Job>, QueryJobsRequest>({
      query: (params) => ({
        url: '/jobs',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Job' as const, id })),
              { type: 'Job', id: 'LIST' },
            ]
          : [{ type: 'Job', id: 'LIST' }],
    }),
    getJob: builder.query<Job, string>({
      query: (id) => `/jobs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Job', id }],
    }),
    createJob: builder.mutation<Job, CreateJobRequest>({
      query: (job) => ({
        url: '/jobs',
        method: 'POST',
        body: job,
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    updateJob: builder.mutation<Job, { id: string; job: Partial<CreateJobRequest> }>({
      query: ({ id, job }) => ({
        url: `/jobs/${id}`,
        method: 'PATCH',
        body: job,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),
    deleteJob: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    applyToJob: builder.mutation<Application, { id: string; application: CreateApplicationRequest }>({
      query: ({ id, application }) => ({
        url: `/jobs/${id}/apply`,
        method: 'POST',
        body: application,
      }),
      invalidatesTags: ['Application'],
    }),
    getJobApplicants: builder.query<Application[], string>({
      query: (id) => `/jobs/${id}/applicants`,
      providesTags: ['Application'],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useApplyToJobMutation,
  useGetJobApplicantsQuery,
} = jobsApi;
