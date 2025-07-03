
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface ProfileData {
  id?: string;
  user_id?: string;
  nome?: string;
  cognome?: string;
  nome_arte?: string;
  bio?: string;
  citta?: string;
  raggio_attivita?: number;
  foto_profile?: string;
  strumenti?: Array<{
    strumento: string;
    livello: string;
    anni_esperienza: number;
  }>;
}

interface ProfileContextType {
  profile: ProfileData | null;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const savedProfile = localStorage.getItem('mock_profile');
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
          } else {
            // Create default profile
            const defaultProfile = {
              id: user.id,
              user_id: user.id,
              nome: user.nome,
              cognome: user.cognome,
              strumenti: []
            };
            setProfile(defaultProfile);
            localStorage.setItem('mock_profile', JSON.stringify(defaultProfile));
          }
        } catch (error) {
          console.error('Errore nel caricamento del profilo:', error);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    loadProfile();
  }, [user]);

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      if (profile) {
        const updatedProfile = { ...profile, ...data };
        setProfile(updatedProfile);
        localStorage.setItem('mock_profile', JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento del profilo:', error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
