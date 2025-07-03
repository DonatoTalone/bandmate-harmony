
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiCall } from '@/lib/database';

interface User {
  id: string;
  email: string;
  nome: string;
  cognome: string;
  created_at: string;
  user_metadata?: any;
}

interface Session {
  access_token: string;
  user: User;
  expires_at: number;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, nome: string, cognome: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await apiCall('/auth/me');
          setUser(userData.user);
          setSession({
            access_token: token,
            user: userData.user,
            expires_at: Date.now() + 3600000 // 1 hour
          });
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.error) {
        return { error: response.error };
      }

      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user);
      setSession({
        access_token: response.access_token,
        user: response.user,
        expires_at: Date.now() + 3600000
      });

      return { error: null };
    } catch (error) {
      console.error("Errore durante il login:", error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, nome: string, cognome: string) => {
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, nome, cognome }),
      });

      if (response.error) {
        return { error: response.error };
      }

      return { error: null };
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setSession(null);
    }
  };

  const updateUser = async (userData: any) => {
    if (!user) return;
    
    try {
      const response = await apiCall('/profiles/update', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      
      setUser(prev => prev ? { ...prev, ...response.user } : null);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento del profilo:', error);
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
