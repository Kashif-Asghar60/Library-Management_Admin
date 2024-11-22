import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, user } = useAuth();

  if (loading) {
    console.log("stuck in loading ", loading);
    console.log("IsLoggedIn ", isLoggedIn , "user" , user);

    return <div>Loading...</div>;  // This will display until `loading` is false
  }

  if (!isLoggedIn) {
    console.log("Not logged in, redirecting to login...");
    return <Navigate to="/login" />;
  }

  console.log("User is logged in, rendering protected route.");
  return <>{children}</>;
};

export default ProtectedRoute;
