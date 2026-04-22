'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectToken } from '@/store/slices/authSlice';

interface SocketContextType {
  chatSocket: Socket | null;
  notificationSocket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  chatSocket: null,
  notificationSocket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useSelector(selectToken);
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [notificationSocket, setNotificationSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      if (chatSocket) chatSocket.disconnect();
      if (notificationSocket) notificationSocket.disconnect();
      setChatSocket(null);
      setNotificationSocket(null);
      setIsConnected(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const chat = io(`${apiUrl}/chat`, {
      auth: { token: `Bearer ${token}` },
    });

    const notifications = io(`${apiUrl}/notifications`, {
      auth: { token: `Bearer ${token}` },
    });

    chat.on('connect', () => setIsConnected(true));
    chat.on('disconnect', () => setIsConnected(false));

    setChatSocket(chat);
    setNotificationSocket(notifications);

    return () => {
      chat.disconnect();
      notifications.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ chatSocket, notificationSocket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
