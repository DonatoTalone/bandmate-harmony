
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const LoginScreen: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const { login, signup, user } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ nome: '', cognome: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('login');

  useEffect(() => {
    if (user) {
      onLoginSuccess?.();
    }
  }, [user, onLoginSuccess]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await login(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: "Errore di accesso",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Accesso effettuato",
          description: "Bentornato su Bandmate Harmony!",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un problema durante l'accesso",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { nome, cognome, email, password, confirmPassword } = registerForm;
    
    if (!nome || !cognome || !email || !password || !confirmPassword) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Errore",
        description: "Le password non corrispondono",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signup(email, password, nome, cognome);
      
      if (error) {
        toast({
          title: "Errore di registrazione",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Registrazione completata",
          description: "Benvenuto su Bandmate Harmony!",
        });
        setActiveTab('login');
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un problema durante la registrazione",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-center">Bandmate Harmony</CardTitle>
          <p className="text-center text-white/80 text-sm">Connetti musicisti, crea opportunità</p>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="login" className="rounded-none">Accedi</TabsTrigger>
            <TabsTrigger value="register" className="rounded-none">Registrati</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    name="email" 
                    type="email" 
                    placeholder="tu@esempio.it" 
                    value={loginForm.email}
                    onChange={handleLoginChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Button type="button" variant="link" className="p-0 h-auto text-xs">
                      Password dimenticata?
                    </Button>
                  </div>
                  <Input 
                    id="login-password" 
                    name="password" 
                    type="password" 
                    value={loginForm.password}
                    onChange={handleLoginChange}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={isLoading}>
                  {isLoading ? 'Accesso in corso...' : 'Accedi'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nome">Nome</Label>
                    <Input 
                      id="register-nome" 
                      name="nome" 
                      value={registerForm.nome}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-cognome">Cognome</Label>
                    <Input 
                      id="register-cognome" 
                      name="cognome" 
                      value={registerForm.cognome}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    name="email" 
                    type="email" 
                    placeholder="tu@esempio.it" 
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    name="password" 
                    type="password" 
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Conferma Password</Label>
                  <Input 
                    id="register-confirm-password" 
                    name="confirmPassword" 
                    type="password" 
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Registrandoti, accetti i nostri Termini di servizio e la Privacy policy.
                </p>
              </CardContent>
              
              <CardFooter>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" type="submit" disabled={isLoading}>
                  {isLoading ? 'Registrazione in corso...' : 'Registrati'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginScreen;
