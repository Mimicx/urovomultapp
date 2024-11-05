import React, { createContext, useState, useContext, ReactNode, ReactElement } from 'react';

// Definir una interfaz para los objetos individuales en el arreglo
interface DataItem {
  id: number;
  name: string;
  render: () => ReactElement;
}

// Definir la interfaz para el contexto que usa un arreglo de esos objetos
interface RenderContextState {
  data: DataItem[];
  updateData: (updatedItems: DataItem[]) => void;
}

const defaultValue: RenderContextState = {
  data: [
    { id: 0, name: 'sitio', render: () => <></>},  // Debes reemplazar estos placeholders con los componentes reales
    { id: 1, name: 'licencia', render: () => <></>},
    { id: 2, name: 'placa', render: () => <></>},
    { id: 3, name: 'nacional', render: () => <></>},
    { id: 4, name: 'amparo', render: () => <></>},
    
  ],
  updateData: () => {},
};

const RenderContext = createContext<RenderContextState>(defaultValue);

export const useRenderContext = () => useContext(RenderContext);

interface RenderProviderProps {
  children: ReactNode;
}

export const RenderProvider = ({ children }: RenderProviderProps) => {
  const [data, setData] = useState<DataItem[]>(defaultValue.data);

  const updateData = (updatedItems: DataItem[]) => {
    setData(updatedItems);
  };

  const value = { data, updateData };

  return <RenderContext.Provider value={value}>{children}</RenderContext.Provider>;
};
