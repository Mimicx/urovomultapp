import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Picture {
  full_path: string;
  base64: string;
  text: string;
}

interface PicturesContextState {
  pictures: Picture[];
  addPictures: (values: Picture[]) => void;
  dropPictures: () => void;
  removePicture: (fullPath: string) => void;
}

const defaultValue: PicturesContextState = {
  pictures: [],
  addPictures: () => { },
  dropPictures: () => { },
  removePicture: () => { },
};

const PicturesContext = createContext<PicturesContextState>(defaultValue);

export const usePictures = () => useContext(PicturesContext);

interface PicturesProviderProps {
  children: ReactNode;
}

export const PicturesProvider = ({ children }: PicturesProviderProps) => {
  const [pictures, setPictures] = useState<Picture[]>([]);

  const addPictures = (values: Picture[]) => setPictures(values);
  const dropPictures = () => setPictures([]);
  const removePicture = (fullPath: string) => {
    setPictures(pictures.filter(picture => picture.full_path !== fullPath));
  };

  const value = { pictures, addPictures, dropPictures, removePicture };

  return <PicturesContext.Provider value={value}>{children}</PicturesContext.Provider>;
};
