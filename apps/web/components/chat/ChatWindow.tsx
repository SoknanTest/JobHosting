'use client';

import { useGetMessagesQuery } from '@/store/api/chatApi';
import { useSocket } from '@/components/providers/SocketProvider';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import { Message } from '@shared/types';
import { Send, MoreVertical, Paperclip, Loader2 } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface ChatWindowProps {
  conversationId: string;
  recipientName: string;
}

export default function ChatWindow({ conversationId, recipientName }: ChatWindowProps) {
  const user = useSelector(selectUser);
  const { chatSocket } = useSocket();
  const { data: initialMessages, isLoading } = useGetMessagesQuery(conversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!chatSocket) return;

    chatSocket.emit('joinConversation', conversationId);

    const handleNewMessage = (message: Message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    chatSocket.on('newMessage', handleNewMessage);

    return () => {
      chatSocket.off('newMessage', handleNewMessage);
    };
  }, [chatSocket, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatSocket) return;

    chatSocket.emit('sendMessage', {
      conversationId,
      content: newMessage,
    });

    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-300/40">
      {/* Header */}
      <div className="p-4 bg-white border-b flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {recipientName.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">{recipientName}</h3>
            <p className="text-[10px] text-green-500 font-black uppercase tracking-tighter">Online</p>
          </div>
        </div>
        <button className="text-gray-900 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-300 transition-all">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === user?.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-gray-300 p-2 rounded-2xl border border-gray-400 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
          <button type="button" className="p-2 text-gray-900 hover:text-indigo-600 transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-0"
          />
          <button type="submit" className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}


