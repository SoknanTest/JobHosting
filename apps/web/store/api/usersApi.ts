import { apiSlice } from './apiSlice';
import { User, Profile } from '@shared/types';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  cvUrl?: string;
  avatar?: string;
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<Profile, UpdateProfileRequest>({
      query: (profile) => ({
        url: '/users/me',
        method: 'PATCH',
        body: profile,
      }),
      invalidatesTags: ['User'],
    }),
    updateAvatar: builder.mutation<Profile, { url: string }>({
      query: (body) => ({
        url: '/users/me/avatar',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    updateCv: builder.mutation<Profile, { url: string }>({
      query: (body) => ({
        url: '/users/me/cv',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useUpdateCvMutation,
} = usersApi;
