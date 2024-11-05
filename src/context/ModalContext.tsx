import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextState {
  modalVisible: boolean;
  showModal: () => void;
  hideModal: () => void;
}

const defaultValue: ModalContextState = {
  modalVisible: false,
  showModal: () => {},
  hideModal: () => {},
};

const ModalContext = createContext<ModalContextState>(defaultValue);

export const useModal = () => useContext(ModalContext);

interface ModalProviderProps {
  children: ReactNode; // Esto permite cualquier componente React válido
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  // Aquí pasamos las funciones showModal y hideModal junto con el estado modalVisible
  const value = { modalVisible, showModal, hideModal };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
