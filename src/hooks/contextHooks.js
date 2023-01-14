import React, { useContext, createContext, useState, useEffect } from "react";

const AppContext = createContext();

const useAppContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  console.log("ContextProvider");

  //Load User
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Load user data
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {};

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContextProvider, useAppContext };
