
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Music, Users, Search, PlusCircle, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { useEvents } from '@/contexts/EventsContext';
import { query } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

interface HomeScreenProps {
  onTabChange: (tab: 'search' | 'create') => void;
}

interface UserStats {
  eventiPartecipati: number;
  connessioni: number;
  competenzeConfermate: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTabChange }) => {
  const { profile } = useProfile();
  const { eventi } = useEvents();
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    eventiPartecipati: 0,
    connessioni: 0,
    competenzeConfermate: 0
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      // TODO: Implementare query per eventi partecipati, connessioni e competenze confermate
      // Per ora usiamo valori placeholder
      setUserStats({
        eventiPartecipati: 0,
        connessioni: 0,
        competenzeConfermate: 0
      });
    } catch (error) {
      console.error('Errore nel caricamento delle statistiche:', error);
    }
  };

  const eventiRecenti = eventi.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header compatto */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold">
            Ciao, {profile?.nome_arte || profile?.nome || 'Musicista'}! 👋
          </h1>
          <p className="text-blue-100 text-sm">
            Trova musicisti e crea eventi
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Quick Actions - più compatte */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" 
            onClick={() => onTabChange('search')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-blue-600 p-2 rounded-full w-fit mx-auto mb-2">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900 text-sm">Cerca</h3>
              <p className="text-blue-700 text-xs">Musicisti ed eventi</p>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200" 
            onClick={() => onTabChange('create')}
          >
            <CardContent className="p-4 text-center">
              <div className="bg-green-600 p-2 rounded-full w-fit mx-auto mb-2">
                <PlusCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-green-900 text-sm">Crea</h3>
              <p className="text-green-700 text-xs">Nuovo evento</p>
            </CardContent>
          </Card>
        </div>

        {/* Statistiche compatte */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{userStats.eventiPartecipati}</div>
              <div className="text-xs text-gray-600">Eventi Partecipati</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-green-600">{userStats.connessioni}</div>
              <div className="text-xs text-gray-600">Connessioni</div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-purple-600">{userStats.competenzeConfermate}</div>
              <div className="text-xs text-gray-600">Competenze Confermate</div>
            </CardContent>
          </Card>
        </div>

        {/* I tuoi strumenti - sezione compatta */}
        {profile?.strumenti && profile.strumenti.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Music className="w-4 h-4 mr-2" />
                I Tuoi Strumenti
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {profile.strumenti.slice(0, 4).map((strumento, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {strumento.strumento}
                  </Badge>
                ))}
                {profile.strumenti.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.strumenti.length - 4}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Eventi Recenti - più compatti */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Eventi Recenti
              </div>
              <Badge variant="outline" className="text-xs">{eventi.length} totali</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {eventiRecenti.length > 0 ? (
              <div className="space-y-2">
                {eventiRecenti.map((evento) => (
                  <div key={evento.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{evento.titolo}</h4>
                      <Badge variant="outline" className="text-xs">{evento.tipoEvento}</Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {evento.data}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{evento.luogo}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Nessun evento disponibile</p>
                <Button onClick={() => onTabChange('create')} size="sm" className="mt-2">
                  Crea il tuo primo evento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeScreen;
