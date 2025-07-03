
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/contexts/ProfileContext';
import DevicePermissions from '@/components/DevicePermissions';

const ProfileSettings: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  
  const [settings, setSettings] = useState({
    telefono: profile?.telefono || '',
    citta: profile?.citta || '',
    impostazioni_privacy: profile?.impostazioni_privacy || {
      telefono: 'privato' as const,
      email: 'privato' as const,
      disponibilita: 'pubblico' as const,
      accetta_recensioni: true
    }
  });

  const handleSave = async () => {
    await updateProfile(settings);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Impostazioni
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Impostazioni Profilo</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profilo</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="permissions">Autorizzazioni</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div>
              <Label htmlFor="telefono">Telefono</Label>
              <Input
                id="telefono"
                value={settings.telefono}
                onChange={(e) => setSettings(prev => ({ ...prev, telefono: e.target.value }))}
                placeholder="Es. +39 123 456 7890"
              />
            </div>

            <div>
              <Label htmlFor="citta">Città</Label>
              <Input
                id="citta"
                value={settings.citta}
                onChange={(e) => setSettings(prev => ({ ...prev, citta: e.target.value }))}
                placeholder="Es. Milano"
              />
              <p className="text-xs text-gray-500 mt-1">
                Inserisci il nome della tua città per essere trovato da altri musicisti
              </p>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Impostazioni Privacy</h3>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="privacy-telefono">Telefono visibile</Label>
                  <p className="text-xs text-gray-500">Chi può vedere il tuo numero</p>
                </div>
                <Select
                  value={settings.impostazioni_privacy.telefono}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    impostazioni_privacy: { 
                      ...prev.impostazioni_privacy, 
                      telefono: value as 'pubblico' | 'privato' | 'soloPartecipanti'
                    }
                  }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pubblico">Pubblico</SelectItem>
                    <SelectItem value="privato">Privato</SelectItem>
                    <SelectItem value="soloPartecipanti">Solo partecipanti</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="privacy-email">Email visibile</Label>
                  <p className="text-xs text-gray-500">Chi può vedere la tua email</p>
                </div>
                <Select
                  value={settings.impostazioni_privacy.email}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    impostazioni_privacy: { 
                      ...prev.impostazioni_privacy, 
                      email: value as 'pubblico' | 'privato' | 'soloPartecipanti'
                    }
                  }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pubblico">Pubblico</SelectItem>
                    <SelectItem value="privato">Privato</SelectItem>
                    <SelectItem value="soloPartecipanti">Solo partecipanti</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="privacy-disponibilita">Disponibilità visibile</Label>
                  <p className="text-xs text-gray-500">Chi può vedere quando sei disponibile</p>
                </div>
                <Select
                  value={settings.impostazioni_privacy.disponibilita}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    impostazioni_privacy: { 
                      ...prev.impostazioni_privacy, 
                      disponibilita: value as 'pubblico' | 'privato'
                    }
                  }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pubblico">Pubblico</SelectItem>
                    <SelectItem value="privato">Privato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label htmlFor="accetta-recensioni">Accetta recensioni</Label>
                  <p className="text-xs text-gray-500">Permetti ad altri di recensirti</p>
                </div>
                <Switch
                  id="accetta-recensioni"
                  checked={settings.impostazioni_privacy.accetta_recensioni}
                  onCheckedChange={(checked) => setSettings(prev => ({
                    ...prev,
                    impostazioni_privacy: { ...prev.impostazioni_privacy, accetta_recensioni: checked }
                  }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <DevicePermissions />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annulla
          </Button>
          <Button onClick={handleSave}>
            Salva Modifiche
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;
