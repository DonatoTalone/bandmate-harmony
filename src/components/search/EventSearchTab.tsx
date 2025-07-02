
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import SearchFilters from '@/components/search/SearchFilters';
import LocationSelector from '@/components/LocationSelector';
import { useEvents } from '@/contexts/EventsContext';
import { Strumento } from '@/types';

const EventSearchTab: React.FC = () => {
  const { searchEventi } = useEvents();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilters, setActiveFilters] = useState<{
    strumento?: Strumento;
    tipoEvento?: string;
    regione?: string;
    provincia?: string;
    citta?: string;
  }>({});
  
  const [locationSettings, setLocationSettings] = useState({ city: '', radius: 50 });
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [eventiTrovati, setEventiTrovati] = useState<any[]>([]);

  const handleFilterChange = (filterType: string, value: string | undefined) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchTriggered(false);
    setEventiTrovati([]);
  };

  const handleSearch = () => {
    setSearchTriggered(true);
    const filtri = {
      ...activeFilters,
      citta: locationSettings.city,
      data: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
    };
    
    const risultati = searchEventi(filtri);
    setEventiTrovati(risultati);
    
    console.log('Ricerca avviata con filtri:', filtri);
    console.log('Eventi trovati:', risultati);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const DateCell: React.FC<{ date: Date }> = ({ date }) => {
    const isSelected = selectedDate && isSameDay(date, selectedDate);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isCurrentDay = isToday(date);

    return (
      <div 
        className={`aspect-square p-1 border border-gray-100 cursor-pointer transition-all hover:bg-blue-50 ${
          isSelected ? 'bg-blue-100 border-blue-300' : 
          isCurrentDay ? 'bg-orange-50 border-orange-200' :  
          !isCurrentMonth ? 'text-gray-300' : ''
        }`}
        onClick={() => setSelectedDate(date)}
      >
        <div className={`text-sm font-medium mb-1 ${
          isCurrentDay ? 'text-orange-600' : 
          !isCurrentMonth ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {format(date, 'd')}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <LocationSelector
        defaultCity={locationSettings.city}
        defaultRadius={locationSettings.radius}
        onLocationChange={(city, radius) => {
          setLocationSettings({ city, radius });
          console.log('Località aggiornata:', city, radius);
        }}
      />

      <SearchFilters
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onSearch={handleSearch}
      />

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">
              {format(currentMonth, 'MMMM yyyy', { locale: it })}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={goToPreviousMonth} className="text-white hover:bg-white/20">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={goToNextMonth} className="text-white hover:bg-white/20">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 bg-gray-50">
            {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 p-3 border-b">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {monthDays.map(date => (
              <DateCell key={date.toISOString()} date={date} />
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-lg font-bold">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: it })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {eventiTrovati.length > 0 ? (
              <div className="space-y-4">
                {eventiTrovati.map(evento => (
                  <Card key={evento.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800">{evento.titolo}</h3>
                        <Badge className="bg-blue-500">{evento.tipoEvento}</Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{evento.descrizione}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{evento.oraInizio} - {evento.oraFine}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{evento.luogo}</span>
                      </div>
                      {evento.strumentiRichiesti.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Strumenti richiesti:</p>
                          <div className="flex flex-wrap gap-1">
                            {evento.strumentiRichiesti.map((sr, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {sr.strumento} ({sr.numero})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-gray-50">
                <div className="text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTriggered ? 'Nessun evento trovato' : 'Avvia una ricerca'}
                  </h3>
                  <p className="text-sm">
                    {searchTriggered 
                      ? 'Prova a modificare i filtri di ricerca per questo giorno.'
                      : 'Imposta i filtri e clicca su "Avvia Ricerca" per trovare eventi.'
                    }
                  </p>
                </div>
              </Card>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventSearchTab;
