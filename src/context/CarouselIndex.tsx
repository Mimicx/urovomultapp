import React, { createContext, useState, useContext, ReactNode } from 'react';

interface IndexContextState {
  carouselIndex: number;
  addIndex: () => void;
  dropIndex: () => void;
  resetIndex: () => void;

}

const defaultValue: IndexContextState = {
  carouselIndex: 0,
  addIndex: () => {},
  dropIndex: () => {},
  resetIndex: () => {},

};

const IndexContext = createContext<IndexContextState>(defaultValue);

export const useCarouselIndex = () => useContext(IndexContext);

interface IndexProviderProps {
  children: ReactNode; // Esto permite cualquier componente React válido
}

export const IndexProvider = ({ children }: IndexProviderProps) => {
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const addIndex = () => setCarouselIndex(carouselIndex => carouselIndex + 1);
  const dropIndex = () => setCarouselIndex(carouselIndex => carouselIndex - 1);
  const resetIndex = () => setCarouselIndex(0);

  // Aquí pasamos las funciones showModal y hideModal junto con el estado modalVisible
  const value = { carouselIndex, addIndex, dropIndex, resetIndex};

  return <IndexContext.Provider value={value}>{children}</IndexContext.Provider>;
};
