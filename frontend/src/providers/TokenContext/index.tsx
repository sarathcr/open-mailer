'use client'; // Ensure this file is used in a client component

import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext({
  token: '',
  // eslint-disable-next-line no-unused-vars
  setToken: (token: string) => {},
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState('');

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
