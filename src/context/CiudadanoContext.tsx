import React, { createContext, useState, useContext, ReactNode } from 'react';


interface CiudadanoContextState {
  ciudadanos: [];
  addCiudadanos: (values:any) => void;

}

const defaultValue: CiudadanoContextState = {
  ciudadanos: [],
  addCiudadanos: () => {},
  
};

const CiudadanoContext = createContext<CiudadanoContextState>(defaultValue);

export const useCiudadano = () => useContext(CiudadanoContext);

interface CiudadanoProviderProps {
  children: ReactNode; // Esto permite cualquier componente React válido
}

export const CiudadanoProvider = ({ children }: CiudadanoProviderProps) => {
  const [ciudadanos, setCiudadanos] = useState<[]>([]);

  const addCiudadanos = (values:any) => setCiudadanos(values);


  // Aquí pasamos las funciones showModal y hideModal junto con el estado modalVisible
  const value = { ciudadanos, addCiudadanos };

  return <CiudadanoContext.Provider value={value}>{children}</CiudadanoContext.Provider>;
};
