import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Strumento } from '@/types';
import { query } from '@/lib/database';
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
      const data = await query('SELECT * FROM eventi ORDER BY created_at DESC');

      if (data) {
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
        console.log('Events loaded:', eventiFormattati);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "Could not load events",
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
        title: "Error",
        description: "You must be authenticated to create an event",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newEvents = await query(
        `INSERT INTO eventi (organizzatore_id, titolo, descrizione, data, ora_inizio, ora_fine, luogo, tipo_evento, tipo_organico, strumenti_richiesti) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          user.id,
          eventData.titolo,
          eventData.descrizione,
          eventData.data,
          eventData.oraInizio,
          eventData.oraFine,
          eventData.luogo,
          eventData.tipoEvento,
          eventData.tipoOrganico,
          JSON.stringify(eventData.strumentiRichiesti)
        ]
      );

      const data = newEvents[0];
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
        title: "Event created",
        description: "Your event has been added successfully",
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Could not create event",
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
    console.log('Filters:', filters);
    console.log('Events available:', eventi);
    
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
