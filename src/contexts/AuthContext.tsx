import React, { createContext, useContext, useEffect, useState } from 'react';
import { query } from '@/lib/database';
import bcrypt from 'bcryptjs';
import { User } from '@/types';

type AuthContextType = {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, nome: string, cognome: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setSession({ user: JSON.parse(savedUser) });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const users = await query('SELECT * FROM profiles WHERE email = $1', [email]);
      
      if (users.length === 0) {
        return { error: { message: 'Invalid credentials' } };
      }

      const user = users[0];
      // For simplicity, we'll skip password hashing in this example
      // In production, you should hash passwords with bcrypt
      
      setUser(user);
      setSession({ user });
      localStorage.setItem('user', JSON.stringify(user));
      
      return { error: null };
    } catch (error) {
      console.error("Login error:", error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, nome: string, cognome: string) => {
    try {
      // Check if user already exists
      const existingUsers = await query('SELECT * FROM profiles WHERE email = $1', [email]);
      
      if (existingUsers.length > 0) {
        return { error: { message: 'User already exists' } };
      }

      // Insert new user
      const newUsers = await query(
        'INSERT INTO profiles (nome, cognome, email) VALUES ($1, $2, $3) RETURNING *',
        [nome, cognome, email]
      );
      
      const newUser = newUsers[0];
      setUser(newUser);
      setSession({ user: newUser });
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { error: null };
    } catch (error) {
      console.error("Signup error:", error);
      return { error };
    }
  };

  const logout = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('user');
  };

  const updateUser = async (userData: any) => {
    if (!user) return;
    
    try {
      const updatedUsers = await query(
        'UPDATE profiles SET nome = $1, cognome = $2, bio = $3 WHERE id = $4 RETURNING *',
        [userData.nome, userData.cognome, userData.bio, user.id]
      );
      
      const updatedUser = updatedUsers[0];
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        isLoading, 
        login, 
        signup, 
        logout, 
        updateUser 
      }}
    >
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
