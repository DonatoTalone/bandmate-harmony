
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Music, Users, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/contexts/EventsContext';
import { Strumento } from '@/types';

const CreateScreen: React.FC = () => {
  const { toast } = useToast();
  const { addEvento } = useEvents();

  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    data: '',
    oraInizio: '',
    oraFine: '',
    luogo: '',
    tipoEvento: '',
    tipoOrganico: ''
  });

  const [strumentiRichiesti, setStrumentiRichiesti] = useState<{ strumento: Strumento; numero: number; descrizione: string }[]>([]);
  const [nuovoStrumento, setNuovoStrumento] = useState<{ strumento: Strumento; numero: number; descrizione: string }>({
    strumento: 'Pianoforte',
    numero: 1,
    descrizione: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddStrumento = () => {
    if (nuovoStrumento.numero > 0) {
      setStrumentiRichiesti(prev => [...prev, nuovoStrumento]);
      setNuovoStrumento({ strumento: 'Pianoforte', numero: 1, descrizione: '' });
    }
  };

  const handleRemoveStrumento = (index: number) => {
    setStrumentiRichiesti(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titolo || !formData.data || !formData.oraInizio || !formData.oraFine || !formData.luogo || !formData.tipoEvento) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive"
      });
      return;
    }

    try {
      await addEvento({
        titolo: formData.titolo,
        descrizione: formData.descrizione,
        data: formData.data,
        oraInizio: formData.oraInizio,
        oraFine: formData.oraFine,
        luogo: formData.luogo,
        tipoEvento: formData.tipoEvento,
        tipoOrganico: formData.tipoOrganico,
        strumentiRichiesti
      });

      // Reset form
      setFormData({
        titolo: '',
        descrizione: '',
        data: '',
        oraInizio: '',
        oraFine: '',
        luogo: '',
        tipoEvento: '',
        tipoOrganico: ''
      });
      setStrumentiRichiesti([]);
    } catch (error) {
      console.error('Errore nella creazione dell\'evento:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Plus className="w-6 h-6 mr-2" />
              Crea Nuovo Evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informazioni base */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titolo">Titolo dell'evento *</Label>
                  <Input
                    id="titolo"
                    value={formData.titolo}
                    onChange={(e) => handleInputChange('titolo', e.target.value)}
                    placeholder="Es. Jam Session Jazz"
                  />
                </div>

                <div>
                  <Label htmlFor="descrizione">Descrizione</Label>
                  <Textarea
                    id="descrizione"
                    value={formData.descrizione}
                    onChange={(e) => handleInputChange('descrizione', e.target.value)}
                    placeholder="Descrivi il tuo evento..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Data e ora */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="oraInizio">Ora inizio *</Label>
                  <Input
                    id="oraInizio"
                    type="time"
                    value={formData.oraInizio}
                    onChange={(e) => handleInputChange('oraInizio', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="oraFine">Ora fine *</Label>
                  <Input
                    id="oraFine"
                    type="time"
                    value={formData.oraFine}
                    onChange={(e) => handleInputChange('oraFine', e.target.value)}
                  />
                </div>
              </div>

              {/* Luogo */}
              <div>
                <Label htmlFor="luogo">Luogo *</Label>
                <Input
                  id="luogo"
                  value={formData.luogo}
                  onChange={(e) => handleInputChange('luogo', e.target.value)}
                  placeholder="Es. Studio musicale, Via Roma 123, Milano"
                />
              </div>

              {/* Tipo evento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoEvento">Tipo di evento *</Label>
                  <Select value={formData.tipoEvento} onValueChange={(value) => handleInputChange('tipoEvento', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona il tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jam Session">Jam Session</SelectItem>
                      <SelectItem value="Concerto">Concerto</SelectItem>
                      <SelectItem value="Prova">Prova</SelectItem>
                      <SelectItem value="Registrazione">Registrazione</SelectItem>
                      <SelectItem value="Lezione">Lezione</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tipoOrganico">Tipo di organico</Label>
                  <Select value={formData.tipoOrganico} onValueChange={(value) => handleInputChange('tipoOrganico', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona l'organico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Band">Band</SelectItem>
                      <SelectItem value="Duo">Duo</SelectItem>
                      <SelectItem value="Trio">Trio</SelectItem>
                      <SelectItem value="Quartetto">Quartetto</SelectItem>
                      <SelectItem value="Orchestra">Orchestra</SelectItem>
                      <SelectItem value="Coro">Coro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Strumenti richiesti */}
              <div>
                <Label className="text-base font-semibold">Strumenti richiesti</Label>
                <div className="mt-2 space-y-3">
                  {strumentiRichiesti.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item.strumento}</span> 
                        <span className="text-gray-600"> x{item.numero}</span>
                        {item.descrizione && <div className="text-sm text-gray-500">{item.descrizione}</div>}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveStrumento(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {/* Form per aggiungere strumento */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                    <div>
                      <Label htmlFor="strumento">Strumento</Label>
                      <Select 
                        value={nuovoStrumento.strumento} 
                        onValueChange={(value) => setNuovoStrumento(prev => ({ ...prev, strumento: value as Strumento }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pianoforte">Pianoforte</SelectItem>
                          <SelectItem value="Chitarra">Chitarra</SelectItem>
                          <SelectItem value="Violino">Violino</SelectItem>
                          <SelectItem value="Batteria">Batteria</SelectItem>
                          <SelectItem value="Basso">Basso</SelectItem>
                          <SelectItem value="Voce">Voce</SelectItem>
                          <SelectItem value="Sassofono">Sassofono</SelectItem>
                          <SelectItem value="Tromba">Tromba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="numero">Numero</Label>
                      <Input
                        id="numero"
                        type="number"
                        min="1"
                        value={nuovoStrumento.numero}
                        onChange={(e) => setNuovoStrumento(prev => ({ ...prev, numero: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="descrizioneStrumento">Note</Label>
                      <Input
                        id="descrizioneStrumento"
                        value={nuovoStrumento.descrizione}
                        onChange={(e) => setNuovoStrumento(prev => ({ ...prev, descrizione: e.target.value }))}
                        placeholder="Es. livello avanzato"
                      />
                    </div>
                    <Button type="button" onClick={handleAddStrumento} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Crea Evento
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateScreen;
