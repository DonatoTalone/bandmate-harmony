
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Instrument = {
  id: string;
  name: string;
  category: "Woodwind" | "Brass" | "Percussion" | "Other";
  icon: string;
};

// Sample instrument data
const instruments: Instrument[] = [
  { id: "flute", name: "Flute", category: "Woodwind", icon: "🎵" },
  { id: "clarinet", name: "Clarinet", category: "Woodwind", icon: "🎵" },
  { id: "saxophone", name: "Saxophone", category: "Woodwind", icon: "🎷" },
  { id: "trumpet", name: "Trumpet", category: "Brass", icon: "🎺" },
  { id: "trombone", name: "Trombone", category: "Brass", icon: "🎵" },
  { id: "tuba", name: "Tuba", category: "Brass", icon: "🎵" },
  { id: "french-horn", name: "French Horn", category: "Brass", icon: "🎵" },
  { id: "snare-drum", name: "Snare Drum", category: "Percussion", icon: "🥁" },
  { id: "bass-drum", name: "Bass Drum", category: "Percussion", icon: "🥁" },
  { id: "cymbals", name: "Cymbals", category: "Percussion", icon: "🎵" },
  { id: "xylophone", name: "Xylophone", category: "Percussion", icon: "🎵" },
  { id: "baton", name: "Baton (Conductor)", category: "Other", icon: "🎵" },
];

interface InstrumentSelectorProps {
  selectedInstruments: string[];
  onChange: (instruments: string[]) => void;
  maxSelections?: number;
  className?: string;
}

export function InstrumentSelector({
  selectedInstruments,
  onChange,
  maxSelections = Infinity,
  className,
}: InstrumentSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = ["all", "Woodwind", "Brass", "Percussion", "Other"];

  const filteredInstruments = activeCategory === "all" 
    ? instruments 
    : instruments.filter(inst => inst.category === activeCategory);

  const handleInstrumentClick = (instrumentId: string) => {
    if (selectedInstruments.includes(instrumentId)) {
      onChange(selectedInstruments.filter(id => id !== instrumentId));
    } else if (selectedInstruments.length < maxSelections) {
      onChange([...selectedInstruments, instrumentId]);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              activeCategory === category
                ? "bg-primary text-white shadow-md"
                : "bg-muted text-foreground/70 hover:bg-muted/80"
            )}
          >
            {category === "all" ? "All Instruments" : category}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredInstruments.map(instrument => (
          <button
            key={instrument.id}
            onClick={() => handleInstrumentClick(instrument.id)}
            className={cn(
              "relative p-4 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center text-center gap-2",
              selectedInstruments.includes(instrument.id)
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background hover:border-primary/30 hover:bg-primary/5"
            )}
            disabled={!selectedInstruments.includes(instrument.id) && selectedInstruments.length >= maxSelections}
          >
            {selectedInstruments.includes(instrument.id) && (
              <div className="absolute top-2 right-2 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
            )}
            <span className="text-xl">{instrument.icon}</span>
            <span className="font-medium text-sm">{instrument.name}</span>
          </button>
        ))}
      </div>
      
      {maxSelections < Infinity && (
        <p className="text-muted-foreground text-sm mt-2">
          You can select up to {maxSelections} instrument{maxSelections !== 1 ? 's' : ''}.
          {selectedInstruments.length > 0 && ` (${selectedInstruments.length}/${maxSelections} selected)`}
        </p>
      )}
    </div>
  );
}
