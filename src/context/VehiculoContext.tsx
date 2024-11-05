import React, { createContext, useState, useContext, ReactNode } from 'react';


interface VehiculoContextState {
  vehiculos: [];
  addVehiculos: (values:any) => void;

}

const defaultValue: VehiculoContextState = {
  vehiculos: [],
  addVehiculos: () => {},
};

const VehiculoContext = createContext<VehiculoContextState>(defaultValue);

export const useVehiculo = () => useContext(VehiculoContext);

interface VehiculoProviderProps {
  children: ReactNode; // Esto permite cualquier componente React válido
}

export const VehiculoProvider = ({ children }: VehiculoProviderProps) => {
  const [vehiculos, setVehiculos] = useState<[]>([]);

  const addVehiculos = (values:any) => setVehiculos(values);


  const value:any = { vehiculos, addVehiculos };

  return <VehiculoContext.Provider value={value}>{children}</VehiculoContext.Provider>;
};
