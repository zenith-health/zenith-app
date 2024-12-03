import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import * as jwt_decode from 'jwt-decode';

// Define a type for the user
interface User {
  _id: string;
  email: string;
}

// Define the context value type
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to get user info
        const decodedToken = jwt_decode<{ _id: string; email: string }>(token);

        // Set user info from decoded token
        setUser({
          _id: decodedToken._id,
          email: decodedToken.email,
        });

        setLoading(false);
      } catch (error) {
        setError('Failed to decode token.');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
  }), [user, loading, error]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
