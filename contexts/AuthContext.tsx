import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'learner' | 'educator') => Promise<void>;
  logout: () => void;
  purchaseBook: (price: number) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('qm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: 'learner' | 'educator') => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'User',
      email,
      role,
      balance: role === 'educator' ? 150.00 : 50.00, // Educators get more starting balance for demo
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };

    setUser(newUser);
    localStorage.setItem('qm_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qm_user');
  };

  const purchaseBook = async (price: number): Promise<boolean> => {
    if (!user) return false;
    if (user.balance < price) return false;

    // Simulate transaction
    const newBalance = Number((user.balance - price).toFixed(2));
    const updatedUser = { ...user, balance: newBalance };

    setUser(updatedUser);
    localStorage.setItem('qm_user', JSON.stringify(updatedUser));
    return true;
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('qm_user', JSON.stringify(updatedUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      purchaseBook,
      updateProfile,
      isAuthenticated: !!user,
      isLoading
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