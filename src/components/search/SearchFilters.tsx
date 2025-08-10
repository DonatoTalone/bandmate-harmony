
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X, Search } from 'lucide-react';
import { Strumento } from '@/types';
import { STRUMENTI } from '@/constants/strumenti';

interface SearchFiltersProps {
  activeFilters: {
    strumento?: Strumento;
    tipoEvento?: string;
    regione?: string;
    provincia?: string;
    citta?: string;
  };
  onFilterChange: (filterType: string, value: string | undefined) => void;
  onClearFilters: () => void;
  onSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilters,
  onFilterChange,
  onClearFilters,
  onSearch
}) => {
  // Lista completa degli strumenti dalla definizione dei tipi
  const strumenti: Strumento[] = STRUMENTI;

  const tipiEvento = [
    'Sfilata', 'Concerto', 'Evento Civile', 'Celebrazione Religiosa', 'Evento Benefico', 'Prova', 'Altro'
  ];

  const regioni = [
    'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia',
    'Lazio', 'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna',
    'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
  ];

  const hasActiveFilters = Object.values(activeFilters).some(filter => filter);

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-lg font-bold flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filtri di Ricerca
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Strumento</label>
            <Select value={activeFilters.strumento || ''} onValueChange={(value) => onFilterChange('strumento', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="Tutti gli strumenti" />
              </SelectTrigger>
              <SelectContent>
                {strumenti.map(strumento => (
                  <SelectItem key={strumento} value={strumento}>
                    {strumento}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo Evento</label>
            <Select value={activeFilters.tipoEvento || ''} onValueChange={(value) => onFilterChange('tipoEvento', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="Tutti i tipi" />
              </SelectTrigger>
              <SelectContent>
                {tipiEvento.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Regione</label>
            <Select value={activeFilters.regione || ''} onValueChange={(value) => onFilterChange('regione', value || undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="Tutte le regioni" />
              </SelectTrigger>
              <SelectContent>
                {regioni.map(regione => (
                  <SelectItem key={regione} value={regione}>
                    {regione}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="text-gray-600 border-gray-300"
          >
            <X className="w-3 h-3 mr-2" />
            Cancella Filtri
          </Button>
          
          <Button 
            onClick={onSearch}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8"
          >
            <Search className="w-3 h-3 mr-2" />
            Cerca
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;
