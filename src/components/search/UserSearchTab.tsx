
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, MapPin, Music, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  nome: string;
  cognome: string;
  nome_arte?: string;
  citta?: string;
  foto_profile?: string;
  strumenti: Array<{ strumento: string; livello: string; anni_esperienza: number }>;
  bio?: string;
}

const UserSearchTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Inserisci un termine di ricerca",
        description: "Scrivi nome, cognome o nome d'arte per cercare musicisti",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Ricerca migliorata che supporta nome e cognome insieme
      const searchTerms = searchQuery.trim().split(' ');
      let query = supabase.from('profiles').select('*');
      
      if (searchTerms.length === 1) {
        // Ricerca singola parola in tutti i campi
        query = query.or(`nome.ilike.%${searchTerms[0]}%,cognome.ilike.%${searchTerms[0]}%,nome_arte.ilike.%${searchTerms[0]}%`);
      } else if (searchTerms.length === 2) {
        // Ricerca con due parole: nome e cognome o viceversa
        const [first, second] = searchTerms;
        query = query.or(
          `and(nome.ilike.%${first}%,cognome.ilike.%${second}%),and(nome.ilike.%${second}%,cognome.ilike.%${first}%),nome_arte.ilike.%${searchQuery}%`
        );
      } else {
        // Ricerca con più parole: cerca la stringa completa nel nome_arte o nei singoli campi
        query = query.or(`nome_arte.ilike.%${searchQuery}%,nome.ilike.%${searchQuery}%,cognome.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const userProfiles: UserProfile[] = (data || []).map(profile => ({
        id: profile.id,
        nome: profile.nome,
        cognome: profile.cognome,
        nome_arte: profile.nome_arte,
        citta: profile.citta,
        foto_profile: profile.foto_profile,
        bio: profile.bio,
        strumenti: Array.isArray(profile.strumenti) 
          ? (profile.strumenti as any[]).map(s => ({
              strumento: s.strumento || '',
              livello: s.livello || 'Principiante',
              anni_esperienza: s.anni_esperienza || 0
            }))
          : []
      }));

      setUsers(userProfiles);
      
      if (userProfiles.length === 0) {
        toast({
          title: "Nessun risultato",
          description: "Non sono stati trovati musicisti con questo nome",
        });
      }
    } catch (error) {
      console.error('Errore nella ricerca utenti:', error);
      toast({
        title: "Errore",
        description: "Impossibile cercare gli utenti",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Cerca Musicisti
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Nome, cognome o nome d'arte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={searchUsers} 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? 'Ricerca...' : 'Cerca'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.foto_profile || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {user.nome?.charAt(0) || 'U'}{user.cognome?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {user.nome} {user.cognome}
                        </h3>
                        {user.nome_arte && (
                          <p className="text-indigo-600 font-medium">"{user.nome_arte}"</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Contatta
                      </Button>
                    </div>
                    
                    {user.citta && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{user.citta}</span>
                      </div>
                    )}
                    
                    {user.bio && (
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{user.bio}</p>
                    )}
                    
                    {user.strumenti.length > 0 && (
                      <div>
                        <div className="flex items-center mb-2">
                          <Music className="w-4 h-4 mr-1 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Strumenti:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {user.strumenti.slice(0, 3).map((strumento, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {strumento.strumento} ({strumento.livello})
                            </Badge>
                          ))}
                          {user.strumenti.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.strumenti.length - 3} altri
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchTab;
