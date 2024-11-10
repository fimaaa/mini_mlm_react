import React, { createContext, useState } from 'react';

export const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [headerText, setHeaderText] = useState('Default Header');
  const [headerBackButton, setHeaderBackButton] = useState(false);


  return (
    <HeaderContext.Provider value={{ headerText, setHeaderText, headerBackButton, setHeaderBackButton }}>
      {children}
    </HeaderContext.Provider>
  );
};