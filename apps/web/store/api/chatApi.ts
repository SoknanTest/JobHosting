import { apiSlice } from './apiSlice';
import { Conversation, Message } from '@shared/types';

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => '/chat/conversations',
      providesTags: ['Conversation'],
    }),
    getMessages: builder.query<Message[], string>({
      query: (id) => `/chat/conversations/${id}/messages`,
      providesTags: (_result, _error, id) => [{ type: 'Message', id }, 'Conversation'],
    }),
    createConversation: builder.mutation<Conversation, { participantId: string }>({
      query: (body) => ({
        url: '/chat/conversations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Conversation'],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useCreateConversationMutation,
} = chatApi;
