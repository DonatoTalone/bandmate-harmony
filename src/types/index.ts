
export interface User {
  id: string;
  nome: string;
  cognome: string;
  nomeArte?: string;
  email: string;
  telefono?: string;
  citta: string;
  raggioAttivita: number; // in km
  coordinate?: {
    lat: number;
    lng: number;
  };
  bio?: string;
  fotoProfile?: string;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  strumenti: UserStrumento[];
  disponibilita: Disponibilita[];
  galleria: MediaItem[];
  recensioni: Recensione[];
  impostazioniPrivacy: PrivacySettings;
  dataRegistrazione: Date;
}

export interface UserStrumento {
  strumento: Strumento;
  livello: 'Principiante' | 'Intermedio' | 'Avanzato' | 'Professionista';
  anni_esperienza: number;
}

export interface Disponibilita {
  id: string;
  userId: string;
  data: Date;
  oraInizio: string;
  oraFine: string;
  descrizione?: string;
  attiva: boolean;
}

export interface Evento {
  id: string;
  organizzatoreId: string;
  organizzatore: User;
  titolo: string;
  descrizione: string;
  data: Date;
  oraInizio: string;
  oraFine: string;
  luogo: string;
  coordinate?: {
    lat: number;
    lng: number;
  };
  tipoEvento: 'Sfilata' | 'Concerto' | 'Evento Civile' | 'Celebrazione Religiosa' | 'Evento Benefico' | 'Prova' | 'Altro';
  strumentiRichiesti: StrumentoRichiesto[];
  candidature: Candidatura[];
  partecipanti: string[]; // user IDs
  dataCreazione: Date;
  stato: 'Aperto' | 'In Corso' | 'Completato' | 'Annullato';
}

export interface StrumentoRichiesto {
  strumento: Strumento;
  numeroRichiesto: number;
  descrizione?: string;
  assegnato?: string[]; // user IDs
}

export interface Candidatura {
  id: string;
  eventoId: string;
  candidatoId: string;
  candidato: User;
  strumento: Strumento;
  messaggio?: string;
  stato: 'Inviata' | 'Accettata' | 'Rifiutata';
  dataInvio: Date;
}

export interface Recensione {
  id: string;
  daParte: string; // user ID
  versoUtente: string; // user ID
  eventoId: string;
  tags: TagRecensione[];
  commento?: string;
  dataCreazione: Date;
  visibile: boolean;
}

export interface MediaItem {
  id: string;
  userId: string;
  tipo: 'foto' | 'video';
  url: string;
  didascalia?: string;
  eventoId?: string;
  nomeEvento?: string;
  dataCreazione: Date;
}

export interface PrivacySettings {
  telefono: 'pubblico' | 'privato' | 'soloPartecipanti';
  email: 'pubblico' | 'privato' | 'soloPartecipanti';
  disponibilita: 'pubblico' | 'privato';
  accettaRecensioni: boolean;
}

// Lista completa degli strumenti da banda
export type Strumento = 
  | 'Voce'
  | 'Flauto'
  | 'Ottavino'
  | 'Oboe'
  | 'Corno Inglese'
  | 'Fagotto'
  | 'Controfagotto'
  | 'Clarinetto Mib'
  | 'Clarinetto Sib'
  | 'Clarinetto Contralto'
  | 'Clarinetto Basso in Sib'
  | 'Clarinetto Contrabbasso'
  | 'Sassofono Soprano'
  | 'Sassofono Contralto'
  | 'Sassofono Tenore'
  | 'Sassofono Baritono'
  | 'Sassofono Basso'
  | 'Tromba'
  | 'Trombino'
  | 'Tromba bassa'
  | 'Cornetta'
  | 'Flicorno Soprano'
  | 'Flicorno contralto'
  | 'Flicorno tenore'
  | 'Flicorno baritono'
  | 'Corno'
  | 'Trombone Tenore'
  | 'Trombone Basso'
  | 'Basso Tuba'
  | 'Rullante'
  | 'Cassa'
  | 'Piatti'
  | 'Tastiere a percussione'
  | 'Batteria'
  | 'Percussioni varie'
  | 'Pianoforte'
  | 'Chitarra'
  | 'Basso elettrico'
  | 'Altro';

export type TagRecensione = 
  | 'Puntuale'
  | 'Professionale'
  | 'Ottima intesa'
  | 'Disponibile'
  | 'Creativo'
  | 'Affidabile'
  | 'Preparato'
  | 'Collaborativo'
  | 'Organizzato'
  | 'Comunicativo';

export interface CalendarDay {
  date: Date;
  eventi: Evento[];
  disponibilita: Disponibilita[];
}
