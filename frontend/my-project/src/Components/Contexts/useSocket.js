import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children, token }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = io('http://localhost:4000', {
      auth: { token },
      withCredentials: true,
      autoConnect: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};