// FirebaseContext.js
import React, { createContext, useContext } from 'react';

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children, value }) => (
  <FirebaseContext.Provider value={value}>
    {children}
  </FirebaseContext.Provider>
);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
