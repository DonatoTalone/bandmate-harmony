
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MapPin, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationSelectorProps {
  onLocationChange?: (city: string, radius: number) => void;
  defaultCity?: string;
  defaultRadius?: number;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationChange, 
  defaultCity = '', 
  defaultRadius = 50 
}) => {
  const [city, setCity] = useState(defaultCity);
  const [radius, setRadius] = useState([defaultRadius]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCity = e.target.value;
    setCity(newCity);
    onLocationChange?.(newCity, radius[0]);
  };

  const handleRadiusChange = (newRadius: number[]) => {
    setRadius(newRadius);
    onLocationChange?.(city, newRadius[0]);
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      // Simula la geocodifica inversa (in un'app reale useresti un servizio come Google Maps API)
      const { latitude, longitude } = position.coords;
      
      // Per ora usiamo coordinate approssimate per alcune città italiane
      let cityName = 'Posizione corrente';
      
      // Roma
      if (Math.abs(latitude - 41.9028) < 0.5 && Math.abs(longitude - 12.4964) < 0.5) {
        cityName = 'Roma';
      }
      // Milano
      else if (Math.abs(latitude - 45.4642) < 0.5 && Math.abs(longitude - 9.1900) < 0.5) {
        cityName = 'Milano';
      }
      // Napoli
      else if (Math.abs(latitude - 40.8518) < 0.5 && Math.abs(longitude - 14.2681) < 0.5) {
        cityName = 'Napoli';
      }
      // Torino
      else if (Math.abs(latitude - 45.0703) < 0.5 && Math.abs(longitude - 7.6869) < 0.5) {
        cityName = 'Torino';
      }

      setCity(cityName);
      onLocationChange?.(cityName, radius[0]);
      
      toast({
        title: "Posizione rilevata",
        description: `Trovato: ${cityName} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      });
    } catch (error) {
      toast({
        title: "Errore posizione",
        description: "Impossibile rilevare la posizione automaticamente",
        variant: "destructive"
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-600" />
          Località e Raggio di Azione
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Città o Paese
          </label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Es. Milano, Roma, Napoli..."
              value={city}
              onChange={handleCityChange}
              className="border-gray-300 focus:border-blue-500 flex-1"
            />
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              variant="outline"
              size="sm"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Inserisci il nome della tua città. Attualmente l'inserimento è libero.
          </p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Raggio di azione: {radius[0]} km
          </label>
          <Slider
            value={radius}
            onValueChange={handleRadiusChange}
            max={200}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>200 km</span>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            {city ? `Cercherai in ${city} e dintorni` : 'Inserisci una città'} 
            {city && ` entro ${radius[0]} km`}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            💡 La ricerca geografica è attualmente basata sui nomi delle città inseriti dagli utenti
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationSelector;
