
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Evento {
  id: string;
  titolo: string;
  descrizione: string;
  data: string;
  ora: string;
  luogo: string;
  citta: string;
  tipoEvento: 'Concerto' | 'Jam Session' | 'Prova' | 'Workshop' | 'Altro';
  generesMusicali: string[];
  maxPartecipanti?: number;
  costoPartecipazione?: number;
  strumentiRichiesti: string[];
  livelloRichiesto: 'Principiante' | 'Intermedio' | 'Avanzato' | 'Professionale';
  createBy: string;
  partecipanti: string[];
}

interface EventsContextType {
  eventi: Evento[];
  addEvento: (evento: Omit<Evento, 'id' | 'createBy' | 'partecipanti'>) => Promise<void>;
  updateEvento: (id: string, evento: Partial<Evento>) => Promise<void>;
  deleteEvento: (id: string) => Promise<void>;
  joinEvento: (id: string) => Promise<void>;
  leaveEvento: (id: string) => Promise<void>;
  isLoading: boolean;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eventi, setEventi] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEventi = async () => {
      try {
        const savedEvents = localStorage.getItem('mock_events');
        if (savedEvents) {
          setEventi(JSON.parse(savedEvents));
        } else {
          // Create some mock events
          const mockEvents: Evento[] = [
            {
              id: '1',
              titolo: 'Jam Session Jazz',
              descrizione: 'Serata di improvvisazione jazz per musicisti di tutti i livelli',
              data: '2024-07-10',
              ora: '20:00',
              luogo: 'Blue Note Milano',
              citta: 'Milano',
              tipoEvento: 'Jam Session',
              generesMusicali: ['Jazz', 'Blues'],
              maxPartecipanti: 8,
              strumentiRichiesti: ['Pianoforte', 'Chitarra', 'Batteria', 'Basso'],
              livelloRichiesto: 'Intermedio',
              createBy: '1',
              partecipanti: []
            },
            {
              id: '2',
              titolo: 'Concerto Rock',
              descrizione: 'Serata rock con band locali',
              data: '2024-07-15',
              ora: '21:30',
              luogo: 'Rock Cafe',
              citta: 'Roma',
              tipoEvento: 'Concerto',
              generesMusicali: ['Rock', 'Alternative'],
              maxPartecipanti: 5,
              strumentiRichiesti: ['Chitarra', 'Basso', 'Batteria', 'Voce'],
              livelloRichiesto: 'Avanzato',
              createBy: '1',
              partecipanti: []
            }
          ];
          setEventi(mockEvents);
          localStorage.setItem('mock_events', JSON.stringify(mockEvents));
        }
      } catch (error) {
        console.error('Errore nel caricamento degli eventi:', error);
      }
      setIsLoading(false);
    };

    loadEventi();
  }, []);

  const addEvento = async (eventoData: Omit<Evento, 'id' | 'createBy' | 'partecipanti'>) => {
    try {
      const newEvento: Evento = {
        ...eventoData,
        id: Date.now().toString(),
        createBy: '1',
        partecipanti: []
      };
      
      const updatedEventi = [...eventi, newEvento];
      setEventi(updatedEventi);
      localStorage.setItem('mock_events', JSON.stringify(updatedEventi));
    } catch (error) {
      console.error('Errore nell\'aggiunta dell\'evento:', error);
    }
  };

  const updateEvento = async (id: string, eventoData: Partial<Evento>) => {
    try {
      const updatedEventi = eventi.map(evento => 
        evento.id === id ? { ...evento, ...eventoData } : evento
      );
      setEventi(updatedEventi);
      localStorage.setItem('mock_events', JSON.stringify(updatedEventi));
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'evento:', error);
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      const updatedEventi = eventi.filter(evento => evento.id !== id);
      setEventi(updatedEventi);
      localStorage.setItem('mock_events', JSON.stringify(updatedEventi));
    } catch (error) {
      console.error('Errore nell\'eliminazione dell\'evento:', error);
    }
  };

  const joinEvento = async (id: string) => {
    try {
      const updatedEventi = eventi.map(evento => 
        evento.id === id 
          ? { ...evento, partecipanti: [...evento.partecipanti, '1'] }
          : evento
      );
      setEventi(updatedEventi);
      localStorage.setItem('mock_events', JSON.stringify(updatedEventi));
    } catch (error) {
      console.error('Errore nella partecipazione all\'evento:', error);
    }
  };

  const leaveEvento = async (id: string) => {
    try {
      const updatedEventi = eventi.map(evento => 
        evento.id === id 
          ? { ...evento, partecipanti: evento.partecipanti.filter(p => p !== '1') }
          : evento
      );
      setEventi(updatedEventi);
      localStorage.setItem('mock_events', JSON.stringify(updatedEventi));
    } catch (error) {
      console.error('Errore nell\'uscita dall\'evento:', error);
    }
  };

  return (
    <EventsContext.Provider value={{
      eventi,
      addEvento,
      updateEvento,
      deleteEvento,
      joinEvento,
      leaveEvento,
      isLoading
    }}>
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
