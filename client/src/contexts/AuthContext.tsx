
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  height?: number;
  weight?: number;
  fitnessGoal?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  height?: number;
  weight?: number;
  fitnessGoal?: string;
}

const API_URL = "http://localhost:5000/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('fitnessAppToken');
    const storedUser = localStorage.getItem('fitnessAppUser');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Set default Authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      // Save to state
      setToken(token);
      setUser(user);
      
      // Save to localStorage
      localStorage.setItem('fitnessAppToken', token);
      localStorage.setItem('fitnessAppUser', JSON.stringify(user));
      
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success("Logged in successfully");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to login';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      const { token, user } = response.data;
      
      // Save to state
      setToken(token);
      setUser(user);
      
      // Save to localStorage
      localStorage.setItem('fitnessAppToken', token);
      localStorage.setItem('fitnessAppUser', JSON.stringify(user));
      
      // Set default Authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      toast.success("Registration successful!");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!token || !user?._id) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.put(`${API_URL}/users/profile`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const updatedUser = response.data;
      
      // Update state
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('fitnessAppUser', JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to update profile';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove from state
    setUser(null);
    setToken(null);
    
    // Remove from localStorage
    localStorage.removeItem('fitnessAppToken');
    localStorage.removeItem('fitnessAppUser');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      error,
      login,
      register,
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
