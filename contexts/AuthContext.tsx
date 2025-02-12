import React, { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();


  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        await fetchUserProfile(token);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get(
        'https://api.escuelajs.co/api/v1/auth/profile',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUser(response.data);
    } catch (error) {
      console.log('Error fetching user profile: ', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        'https://api.escuelajs.co/api/v1/auth/login',
        {
          email,
          password
        }
      );
      const { access_token } = response.data;
      await SecureStore.setItemAsync('access_token', access_token);
      await fetchUserProfile(access_token);
      router.replace('/products');
    } catch (error) {
      console.log('Login failed: ', error);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('access_token');
    setUser(null);
    router.replace('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};