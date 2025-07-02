
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Camera, FolderOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PermissionStatus {
  location: 'granted' | 'denied' | 'prompt' | 'unknown';
  camera: 'granted' | 'denied' | 'prompt' | 'unknown';
  storage: 'granted' | 'denied' | 'prompt' | 'unknown';
}

const DevicePermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    location: 'unknown',
    camera: 'unknown',
    storage: 'unknown'
  });
  const { toast } = useToast();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      // Controlla autorizzazione per la posizione
      if ('permissions' in navigator) {
        const locationResult = await navigator.permissions.query({ name: 'geolocation' });
        setPermissions(prev => ({ ...prev, location: locationResult.state as any }));
      }

      // Controlla autorizzazione per la camera (approssimativa)
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissions(prev => ({ ...prev, camera: 'granted' }));
        } catch (error) {
          setPermissions(prev => ({ ...prev, camera: 'denied' }));
        }
      }
    } catch (error) {
      console.error('Errore nel controllo delle autorizzazioni:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      setPermissions(prev => ({ ...prev, location: 'granted' }));
      toast({
        title: "Posizione abilitata",
        description: `Coordinate: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
      });
    } catch (error) {
      setPermissions(prev => ({ ...prev, location: 'denied' }));
      toast({
        title: "Accesso alla posizione negato",
        description: "Non è possibile accedere alla tua posizione",
        variant: "destructive"
      });
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      });
      
      // Ferma subito lo stream dopo aver ottenuto il permesso
      stream.getTracks().forEach(track => track.stop());
      
      setPermissions(prev => ({ ...prev, camera: 'granted' }));
      toast({
        title: "Camera abilitata",
        description: "Ora puoi scattare foto e accedere alla galleria",
      });
    } catch (error) {
      setPermissions(prev => ({ ...prev, camera: 'denied' }));
      toast({
        title: "Accesso alla camera negato",
        description: "Non è possibile accedere alla camera",
        variant: "destructive"
      });
    }
  };

  const requestStorageAccess = () => {
    // Per l'accesso ai file, usiamo un input file nascosto
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*,audio/*';
    input.multiple = true;
    
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setPermissions(prev => ({ ...prev, storage: 'granted' }));
        toast({
          title: "Accesso ai file abilitato",
          description: `Selezionati ${files.length} file`,
        });
      }
    };
    
    input.click();
  };

  const getPermissionIcon = (status: string) => {
    switch (status) {
      case 'granted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'denied':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getPermissionText = (status: string) => {
    switch (status) {
      case 'granted':
        return 'Concesso';
      case 'denied':
        return 'Negato';
      case 'prompt':
        return 'Da richiedere';
      default:
        return 'Sconosciuto';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-center">
          Autorizzazioni Dispositivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Per un'esperienza completa, l'app necessita di alcune autorizzazioni del dispositivo.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {/* Posizione */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Posizione</p>
                <p className="text-sm text-gray-600">Per trovare eventi vicini</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getPermissionIcon(permissions.location)}
              <span className="text-sm">{getPermissionText(permissions.location)}</span>
            </div>
          </div>
          {permissions.location !== 'granted' && (
            <Button 
              onClick={requestLocationPermission}
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Abilita Posizione
            </Button>
          )}

          {/* Camera e Galleria */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Camera e Galleria</p>
                <p className="text-sm text-gray-600">Per foto profilo e media</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getPermissionIcon(permissions.camera)}
              <span className="text-sm">{getPermissionText(permissions.camera)}</span>
            </div>
          </div>
          {permissions.camera !== 'granted' && (
            <Button 
              onClick={requestCameraPermission}
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Abilita Camera
            </Button>
          )}

          {/* Archivio File */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <FolderOpen className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Archivio File</p>
                <p className="text-sm text-gray-600">Per caricare documenti</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getPermissionIcon(permissions.storage)}
              <span className="text-sm">{getPermissionText(permissions.storage)}</span>
            </div>
          </div>
          {permissions.storage !== 'granted' && (
            <Button 
              onClick={requestStorageAccess}
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Abilita Accesso File
            </Button>
          )}
        </div>

        <Button 
          onClick={checkPermissions}
          variant="ghost" 
          size="sm" 
          className="w-full text-gray-600"
        >
          Ricontrolla Autorizzazioni
        </Button>
      </CardContent>
    </Card>
  );
};

export default DevicePermissions;
