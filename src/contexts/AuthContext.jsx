import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to access the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to check if data is being fetched from storage

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    console.log("Fetched from localStorage:", storedUser, storedToken);

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setUserToken(storedToken);
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setUserToken(null);
      setIsLoggedIn(false);
    }

    setLoading(false); // Set loading to false after checking storage
  };

  useEffect(() => {
    loadUserFromStorage(); // Call function on component mount
  }, []);

  // Log loading state changes
  useEffect(() => {
    console.log("Loading state has changed:", loading);
  }, [loading]);

  // Login method
  const login = (userData, token) => {
    console.log('Login called with:', userData, token); // Log login data
    setUser(userData);
    setUserToken(token);
    setIsLoggedIn(true);

    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      console.log("Stored in localStorage:", localStorage.getItem('user'), localStorage.getItem('token'));
    } catch (error) {
      console.error("Error storing in localStorage:", error); // Log any localStorage errors
    }
  };

  // Logout method
  const logout = () => {
    setUser(null);
    setUserToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log("User logged out and localStorage cleared");
  };

  return (
    <AuthContext.Provider value={{ user, userToken, isLoggedIn, login, logout, loading }}>
      {!loading && children} {/* Only render children when loading is false */}
    </AuthContext.Provider>
  );
};
