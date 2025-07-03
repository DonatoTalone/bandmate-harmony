
import React, { useState } from 'react';
import { Camera, Edit, MapPin, Phone, Mail, Users, Settings, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { uploadFile, createBucketIfNotExists } from '@/integrations/supabase/storage';
import ProfileSettings from '@/components/ProfileSettings';
import { Strumento } from '@/types';

const ProfileScreen: React.FC = () => {
  const { logout } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: '',
    cognome: '',
    nome_arte: '',
    bio: '',
    citta: '',
    raggio_attivita: 25
  });

  const [isEditingStrumenti, setIsEditingStrumenti] = useState(false);
  const [nuovoStrumento, setNuovoStrumento] = useState<{ strumento: Strumento; livello: string; anni_esperienza: number }>({
    strumento: 'Pianoforte',
    livello: 'Principiante',
    anni_esperienza: 0
  });

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await createBucketIfNotExists('profile-images');
      const imageUrl = await uploadFile('profile-images', file, 'avatars');
      await updateProfile({ foto_profile: imageUrl });
      
      toast({
        title: "Foto aggiornata",
        description: "La tua foto profilo è stata caricata con successo",
      });
    } catch (error) {
      console.error('Errore nel caricamento dell\'immagine:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare l'immagine",
        variant: "destructive"
      });
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      nome: profile.nome || '',
      cognome: profile.cognome || '',
      nome_arte: profile.nome_arte || '',
      bio: profile.bio || '',
      citta: profile.citta || '',
      raggio_attivita: profile.raggio_attivita || 25
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    await updateProfile(editForm);
    setIsEditingProfile(false);
  };

  const handleAddStrumento = async () => {
    const strumentiAggiornati = [...(profile.strumenti || []), nuovoStrumento];
    await updateProfile({ strumenti: strumentiAggiornati });
    setNuovoStrumento({ strumento: 'Pianoforte', livello: 'Principiante', anni_esperienza: 0 });
    setIsEditingStrumenti(false);
  };

  const handleRemoveStrumento = async (index: number) => {
    const strumentiAggiornati = profile.strumenti?.filter((_, i) => i !== index) || [];
    await updateProfile({ strumenti: strumentiAggiornati });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header con foto profilo */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
          <CardContent className="relative pt-0 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={profile.foto_profile || undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {profile.nome?.charAt(0) || 'U'}{profile.cognome?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="profile-image-upload" className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.nome} {profile.cognome}
                </h1>
                {profile.nome_arte && (
                  <p className="text-xl text-indigo-600 font-medium mb-2">"{profile.nome_arte}"</p>
                )}
                {profile.citta && (
                  <div className="flex items-center justify-center md:justify-start text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{profile.citta}</span>
                  </div>
                )}
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Button onClick={handleEditProfile} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifica Profilo
                  </Button>
                  <ProfileSettings />
                  <Button onClick={logout} variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        {profile.bio && (
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Strumenti */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              I Miei Strumenti
            </CardTitle>
            <Dialog open={isEditingStrumenti} onOpenChange={setIsEditingStrumenti}>
              <DialogTrigger asChild>
                <Button size="sm">Aggiungi Strumento</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Aggiungi Nuovo Strumento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Strumento</label>
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Livello</label>
                    <Select 
                      value={nuovoStrumento.livello} 
                      onValueChange={(value) => setNuovoStrumento(prev => ({ ...prev, livello: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Principiante">Principiante</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzato">Avanzato</SelectItem>
                        <SelectItem value="Professionale">Professionale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Anni di esperienza</label>
                    <Input 
                      type="number" 
                      min="0"
                      value={nuovoStrumento.anni_esperienza}
                      onChange={(e) => setNuovoStrumento(prev => ({ ...prev, anni_esperienza: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <Button onClick={handleAddStrumento} className="w-full">
                    Aggiungi Strumento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {profile.strumenti && profile.strumenti.length > 0 ? (
              <div className="space-y-3">
                {profile.strumenti.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.strumento}</h3>
                      <p className="text-sm text-gray-600">{item.livello} • {item.anni_esperienza} anni di esperienza</p>
                    </div>
                    <Button 
                      onClick={() => handleRemoveStrumento(index)}
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Rimuovi
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nessuno strumento aggiunto</p>
            )}
          </CardContent>
        </Card>

        {/* Dialog per modifica profilo */}
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifica Profilo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <Input 
                    value={editForm.nome}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cognome</label>
                  <Input 
                    value={editForm.cognome}
                    onChange={(e) => setEditForm(prev => ({ ...prev, cognome: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nome d'arte</label>
                <Input 
                  value={editForm.nome_arte}
                  onChange={(e) => setEditForm(prev => ({ ...prev, nome_arte: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Città</label>
                <Input 
                  value={editForm.citta}
                  onChange={(e) => setEditForm(prev => ({ ...prev, citta: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Raggio di attività (km)</label>
                <Input 
                  type="number"
                  value={editForm.raggio_attivita}
                  onChange={(e) => setEditForm(prev => ({ ...prev, raggio_attivita: parseInt(e.target.value) || 25 }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <Textarea 
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                  Annulla
                </Button>
                <Button onClick={handleSaveProfile}>
                  Salva Modifiche
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfileScreen;
