import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SearchContextState {
  text: string;
  search: (word:string) => void;

}

const defaultValue: SearchContextState = {
  text: '',
  search: () => { },
};

const SearchContext = createContext<SearchContextState>(defaultValue);

export const useSearch = () => useContext(SearchContext);

interface SearchProviderProps {
  children: ReactNode; // Esto permite cualquier componente React válido
}

export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [text, setText] = useState<string>('');

  const search = (text: any) => setText(text);


  // Aquí pasamos las funciones showModal y hideModal junto con el estado modalVisible
  const value = { text, search };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
