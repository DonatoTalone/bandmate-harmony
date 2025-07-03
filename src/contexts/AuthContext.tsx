
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  nome: string;
  cognome: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signup: (email: string, password: string, nome: string, cognome: string) => Promise<{ error?: { message: string } }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simple mock authentication
      if (email && password) {
        const mockUser = {
          id: '1',
          email: email,
          nome: 'Mario',
          cognome: 'Rossi'
        };
        setUser(mockUser);
        localStorage.setItem('current_user', JSON.stringify(mockUser));
        return {};
      } else {
        return { error: { message: 'Email e password sono richiesti' } };
      }
    } catch (error) {
      return { error: { message: 'Errore durante il login' } };
    }
  };

  const signup = async (email: string, password: string, nome: string, cognome: string) => {
    try {
      if (email && password && nome && cognome) {
        const newUser = {
          id: Date.now().toString(),
          email,
          nome,
          cognome
        };
        
        // Create corresponding profile
        const newProfile = {
          id: newUser.id,
          user_id: newUser.id,
          nome,
          cognome,
          strumenti: []
        };
        
        localStorage.setItem('mock_profile', JSON.stringify(newProfile));
        return {};
      } else {
        return { error: { message: 'Tutti i campi sono richiesti' } };
      }
    } catch (error) {
      return { error: { message: 'Errore durante la registrazione' } };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
