
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  id: string;
  nome: string;
  cognome: string;
  nome_arte?: string;
  email: string;
  telefono?: string;
  citta?: string;
  raggio_attivita: number;
  bio?: string;
  foto_profile?: string;
  strumenti: Array<{ strumento: string; livello: string; anni_esperienza: number }>;
  social_media: Record<string, string>;
  impostazioni_privacy: Record<string, any>;
}

interface ProfileContextType {
  profile: ProfileData | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<ProfileData>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadProfile = async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Errore nel caricamento del profilo:', error);
        return;
      }

      const profileData: ProfileData = {
        id: data.id,
        nome: data.nome,
        cognome: data.cognome,
        nome_arte: data.nome_arte,
        email: data.email,
        telefono: data.telefono,
        citta: data.citta,
        raggio_attivita: data.raggio_attivita || 25,
        bio: data.bio,
        foto_profile: data.foto_profile,
        strumenti: Array.isArray(data.strumenti) 
          ? (data.strumenti as any[]).map(s => ({
              strumento: s.strumento || '',
              livello: s.livello || 'Principiante',
              anni_esperienza: s.anni_esperienza || 0
            }))
          : [],
        social_media: typeof data.social_media === 'object' ? data.social_media as Record<string, string> : {},
        impostazioni_privacy: typeof data.impostazioni_privacy === 'object' ? data.impostazioni_privacy as Record<string, any> : {}
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Errore nel caricamento del profilo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profilo aggiornato",
        description: "Le modifiche sono state salvate con successo",
      });
    } catch (error) {
      console.error('Errore nell\'aggiornamento del profilo:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il profilo",
        variant: "destructive"
      });
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, updateProfile, refreshProfile }}>
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
