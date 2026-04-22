'use client';

import { useState } from 'react';
import ConversationList from '@/components/chat/ConversationList';
import ChatWindow from '@/components/chat/ChatWindow';
import { useTranslations } from 'next-intl';

export default function ChatClient() {
  const t = useTranslations('nav');
  const [selectedConversation, setSelectedConversation] = useState<{ id: string; name: string } | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 h-[calc(100vh-140px)]">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex h-full">
        <ConversationList 
          selectedId={selectedConversation?.id} 
          onSelect={(id, name) => setSelectedConversation({ id, name })} 
        />
        
        {selectedConversation ? (
          <ChatWindow 
            conversationId={selectedConversation.id} 
            recipientName={selectedConversation.name} 
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30 text-gray-400">
            <div className="h-16 w-16 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">{t('chat')}</p>
            <p className="text-xs mt-2 font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
