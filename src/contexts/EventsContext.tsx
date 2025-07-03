
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Strumento } from '@/types';
import { apiCall } from '@/lib/database';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Evento {
  id: string;
  titolo: string;
  descrizione: string;
  data: string;
  oraInizio: string;
  oraFine: string;
  luogo: string;
  tipoEvento: string;
  tipoOrganico: string;
  strumentiRichiesti: { strumento: Strumento; numero: number; descrizione: string }[];
  createdBy: string;
  createdAt: string;
}

interface EventsContextType {
  eventi: Evento[];
  addEvento: (evento: Omit<Evento, 'id' | 'createdAt' | 'createdBy'>) => Promise<void>;
  searchEventi: (filters: {
    strumento?: Strumento;
    tipoEvento?: string;
    regione?: string;
    provincia?: string;
    citta?: string;
    data?: string;
  }) => Evento[];
  loadEventi: () => Promise<void>;
  isLoading: boolean;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadEventi = async () => {
    try {
      setIsLoading(true);
      const data = await apiCall('/events');

      if (data && Array.isArray(data)) {
        const eventiFormattati: Evento[] = data.map(e => ({
          id: e.id,
          titolo: e.titolo,
          descrizione: e.descrizione || '',
          data: e.data,
          oraInizio: e.ora_inizio,
          oraFine: e.ora_fine,
          luogo: e.luogo,
          tipoEvento: e.tipo_evento,
          tipoOrganico: e.tipo_organico || '',
          strumentiRichiesti: Array.isArray(e.strumenti_richiesti) 
            ? (e.strumenti_richiesti as any[]).map(sr => ({
                strumento: sr.strumento || 'Altro',
                numero: sr.numero || 1,
                descrizione: sr.descrizione || ''
              }))
            : [],
          createdBy: e.organizzatore_id,
          createdAt: e.created_at
        }));
        
        setEventi(eventiFormattati);
        console.log('Eventi caricati:', eventiFormattati);
      }
    } catch (error) {
      console.error('Errore nel caricare gli eventi:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare gli eventi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventi();
  }, []);

  const addEvento = async (eventData: Omit<Evento, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per creare un evento",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const eventoDB = {
        organizzatore_id: user.id,
        titolo: eventData.titolo,
        descrizione: eventData.descrizione,
        data: eventData.data,
        ora_inizio: eventData.oraInizio,
        ora_fine: eventData.oraFine,
        luogo: eventData.luogo,
        tipo_evento: eventData.tipoEvento,
        tipo_organico: eventData.tipoOrganico,
        strumenti_richiesti: eventData.strumentiRichiesti
      };
      
      const data = await apiCall('/events', {
        method: 'POST',
        body: JSON.stringify(eventoDB),
      });

      const nuovoEvento: Evento = {
        id: data.id,
        titolo: data.titolo,
        descrizione: data.descrizione || '',
        data: data.data,
        oraInizio: data.ora_inizio,
        oraFine: data.ora_fine,
        luogo: data.luogo,
        tipoEvento: data.tipo_evento,
        tipoOrganico: data.tipo_organico || '',
        strumentiRichiesti: Array.isArray(data.strumenti_richiesti) 
          ? (data.strumenti_richiesti as any[]).map(sr => ({
              strumento: sr.strumento || 'Altro',
              numero: sr.numero || 1,
              descrizione: sr.descrizione || ''
            }))
          : [],
        createdBy: data.organizzatore_id,
        createdAt: data.created_at
      };
      
      setEventi(prev => [nuovoEvento, ...prev]);
      
      toast({
        title: "Evento creato",
        description: "Il tuo evento è stato aggiunto con successo",
      });
    } catch (error) {
      console.error('Errore durante la creazione dell\'evento:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare l'evento",
        variant: "destructive"
      });
    }
  };

  const searchEventi = (filters: {
    strumento?: Strumento;
    tipoEvento?: string;
    regione?: string;
    provincia?: string;
    citta?: string;
    data?: string;
  }) => {
    console.log('Filtri ricerca:', filters);
    console.log('Eventi disponibili:', eventi);
    
    return eventi.filter(evento => {
      if (filters.strumento) {
        const hasStrumento = evento.strumentiRichiesti.some(sr => sr.strumento === filters.strumento);
        if (!hasStrumento) return false;
      }

      if (filters.tipoEvento && evento.tipoEvento !== filters.tipoEvento) {
        return false;
      }

      if (filters.data && evento.data !== filters.data) {
        return false;
      }

      if (filters.citta && !evento.luogo.toLowerCase().includes(filters.citta.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  return (
    <EventsContext.Provider value={{ eventi, addEvento, searchEventi, loadEventi, isLoading }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
