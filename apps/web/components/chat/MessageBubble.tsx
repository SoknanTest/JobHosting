'use client';

import { Message } from '@shared/types';
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
}

export default function MessageBubble({ message, isMe }: MessageBubbleProps) {
  const senderInitial = (message as any).sender?.profile?.firstName?.charAt(0) || 'U';

  if (isMe) {
    return (
      <div className="flex items-end gap-3 max-w-[80%] ml-auto flex-row-reverse">
        <div className="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {senderInitial}
        </div>
        <div className="bg-indigo-600 p-4 rounded-2xl rounded-br-none text-white shadow-lg shadow-indigo-200/50">
          <p className="text-sm leading-relaxed font-medium">
            {message.content}
          </p>
          <span className="text-[9px] text-indigo-200 font-bold uppercase mt-2 block">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 max-w-[80%]">
      <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
        {senderInitial}
      </div>
      <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm shadow-indigo-50/20">
        <p className="text-sm text-gray-700 leading-relaxed">
          {message.content}
        </p>
        <span className="text-[9px] text-gray-400 font-bold uppercase mt-2 block">
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
