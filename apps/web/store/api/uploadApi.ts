import { apiSlice } from './apiSlice';

export interface UploadResponse {
  url: string;
}

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: '/upload/image',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadPdf: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: '/upload/pdf',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useUploadImageMutation,
  useUploadPdfMutation,
} = uploadApi;
