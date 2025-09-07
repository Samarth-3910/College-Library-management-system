// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

// 1. Create the context
const AuthContext = createContext();

// 2. Create a "Provider" component
// This component will hold the state and provide it to its children
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // The value object is what all children can access
  const value = {
    currentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Export the context itself so other components can use it
export default AuthContext;