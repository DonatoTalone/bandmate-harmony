
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '../shared/GlassCard';

interface LocationPickerProps {
  onSelectLocation: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  defaultAddress?: string;
  className?: string;
}

export function LocationPicker({
  onSelectLocation,
  defaultAddress = '',
  className,
}: LocationPickerProps) {
  const [address, setAddress] = useState(defaultAddress);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Mock location suggestions for demo purposes
  const mockSuggestions = [
    { address: "Central Park, New York, NY", latitude: 40.7812, longitude: -73.9665 },
    { address: "Times Square, New York, NY", latitude: 40.7580, longitude: -73.9855 },
    { address: "Golden Gate Park, San Francisco, CA", latitude: 37.7694, longitude: -122.4862 },
    { address: "Grant Park, Chicago, IL", latitude: 41.8796, longitude: -87.6237 },
  ];
  
  const handleSelectSuggestion = (suggestion: typeof mockSuggestions[0]) => {
    setAddress(suggestion.address);
    onSelectLocation(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <MapPin size={18} />
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setShowSuggestions(e.target.value.length > 2);
          }}
          onFocus={() => address.length > 2 && setShowSuggestions(true)}
          placeholder="Enter location"
          className="glass-input pl-10 w-full"
        />
      </div>
      
      {showSuggestions && (
        <GlassCard className="absolute z-10 mt-1 w-full max-h-60 overflow-auto py-1 animate-scale-in">
          {mockSuggestions
            .filter(s => s.address.toLowerCase().includes(address.toLowerCase()))
            .map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-start gap-2"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <MapPin size={16} className="mt-0.5 text-primary shrink-0" />
                <span>{suggestion.address}</span>
              </button>
            ))}
          {mockSuggestions.filter(s => s.address.toLowerCase().includes(address.toLowerCase())).length === 0 && (
            <div className="px-4 py-3 text-muted-foreground">
              No locations found. Try a different search.
            </div>
          )}
        </GlassCard>
      )}
      
      <p className="text-sm text-muted-foreground mt-2">
        Select your location to find nearby events
      </p>
    </div>
  );
}
