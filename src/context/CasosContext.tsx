import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SelectedState {
  sitio: boolean;
  licencia: boolean;
  placa: boolean;
  nacional: boolean;
  amparo: boolean;
}

interface CasosContextState {
  isSelected: SelectedState;
  changeData: (key: keyof SelectedState) => void;
  offData: (key: keyof SelectedState) => void;
  changeStatus: (key: keyof SelectedState, value: boolean) => void;
}

const defaultValue: CasosContextState = {
  isSelected: {
    sitio: false,
    licencia: false,
    placa: false,
    nacional: false,
    amparo: false,
  },
  changeData: () => { },
  offData: () => { },
  changeStatus: () => { },
};

const CasosContext = createContext<CasosContextState>(defaultValue);

export const useCasos = () => useContext(CasosContext);

interface CasosProviderProps {
  children: ReactNode;
}

export const CasosProvider = ({ children }: CasosProviderProps) => {
  const [isSelected, setSelection] = useState<SelectedState>(defaultValue.isSelected);

  const changeData = (key: keyof SelectedState) => {
    setSelection(prevState => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };


  const changeStatus = (key: keyof SelectedState, value: boolean) => {
    setSelection(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };



  const offData = (key: keyof SelectedState) => {
    setSelection(prevState => ({
      ...prevState,
      [key]: false,
    }));
  };




  const value = { isSelected, changeData, offData, changeStatus };

  return <CasosContext.Provider value={value}>{children}</CasosContext.Provider>;
};
