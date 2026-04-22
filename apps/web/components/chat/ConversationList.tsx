'use client';

import { useGetConversationsQuery } from '@/store/api/chatApi';
import { Conversation } from '@shared/types';
import { Search, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';

interface ConversationListProps {
  selectedId?: string;
  onSelect: (id: string, name: string) => void;
}

export default function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const user = useSelector(selectUser);
  const { data: conversations, isLoading } = useGetConversationsQuery();
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  const filteredConversations = conversations?.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.userId !== user?.id);
    const name = (otherParticipant as any)?.user?.profile?.firstName || 'Unknown';
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="w-80 border-r flex flex-col bg-white">
      <div className="p-6 border-b">
        <h2 className="text-xl font-black text-gray-900 mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => {
          const otherParticipant = conv.participants.find(p => p.userId !== user?.id);
          const name = (otherParticipant as any)?.user?.profile?.firstName || 'Unknown';
          const lastMessage = conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;

          return (
            <div 
              key={conv.id} 
              onClick={() => onSelect(conv.id, name)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === conv.id ? 'bg-indigo-50/50' : ''}`}
            >
              <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{name}</h4>
                  {lastMessage && (
                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                      {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {lastMessage ? lastMessage.content : 'No messages yet'}
                </p>
              </div>
            </div>
          );
        })}
        {filteredConversations.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm font-medium">
            No conversations found.
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
