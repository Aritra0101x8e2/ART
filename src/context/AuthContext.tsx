import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

interface User {
  username: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedUser = localStorage.getItem('artchain_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = async (username: string, email: string, password: string) => {
    const existingUsers = JSON.parse(localStorage.getItem('artchain_users') || '[]') as User[];
    if (existingUsers.find(u => u.email === email)) {
      toast({ variant: 'destructive', title: 'Signup Failed', description: 'Email already exists' });
      throw new Error('Email already exists');
    }

    const newUser: User = { username, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('artchain_users', JSON.stringify(existingUsers));
    toast({ title: 'Account created!', description: 'You can now log in.' });
  };

  const login = async (email: string, password: string) => {
    const existingUsers = JSON.parse(localStorage.getItem('artchain_users') || '[]') as User[];
    const foundUser = existingUsers.find(u => u.email === email && u.password === password);

    if (!foundUser) {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password' });
      throw new Error('Invalid email or password');
    }

    setUser(foundUser);
    localStorage.setItem('artchain_user', JSON.stringify(foundUser));
    toast({ title: 'Welcome back!', description: `Logged in as ${foundUser.username}` });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('artchain_user');
    toast({ title: 'Logged out', description: 'You have been logged out.' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
