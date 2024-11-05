// ConnectionContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NetInfo from "@react-native-community/netinfo";

interface ConnectionContextState {
  isConnected: boolean;
}

const defaultValue: ConnectionContextState = {
  isConnected: false,
};

const ConnectionContext = createContext<ConnectionContextState>(defaultValue);

interface ConnectionProviderProps {
  children: ReactNode;
}

export const ConnectionProvider = ({ children }: ConnectionProviderProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected || false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ConnectionContext.Provider value={{ isConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = (): ConnectionContextState => useContext(ConnectionContext);
