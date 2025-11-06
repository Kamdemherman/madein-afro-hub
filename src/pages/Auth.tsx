import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('signin-email') as string;
    const password = formData.get('signin-password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: error.message,
      });
    } else {
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue sur Made in Africa Shops',
      });
      navigate('/');
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('signup-email') as string;
    const password = formData.get('signup-password') as string;
    const confirmPassword = formData.get('signup-confirm-password') as string;
    const fullName = formData.get('signup-name') as string;
    const memberType = formData.get('member-type') as 'grossiste' | 'detaillant';

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères',
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName, memberType);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur d\'inscription',
        description: error.message,
      });
    } else {
      toast({
        title: 'Inscription réussie',
        description: 'Votre compte a été créé avec succès',
      });
      navigate('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Made in Africa Shops
          </CardTitle>
          <CardDescription>Connectez-vous ou créez votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email" 
                    name="signin-email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <Input 
                    id="signin-password" 
                    name="signin-password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Se connecter
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <Input 
                    id="signup-name" 
                    name="signup-name" 
                    type="text" 
                    placeholder="Votre nom" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    name="signup-email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input 
                    id="signup-password" 
                    name="signup-password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmer le mot de passe</Label>
                  <Input 
                    id="signup-confirm-password" 
                    name="signup-confirm-password" 
                    type="password" 
                    placeholder="••••••••" 
                    required 
                    minLength={6}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Type de membre</Label>
                  <RadioGroup name="member-type" defaultValue="detaillant" className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="detaillant" id="detaillant" />
                      <Label htmlFor="detaillant" className="font-normal cursor-pointer">
                        Détaillant - Acheter des produits
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="grossiste" id="grossiste" />
                      <Label htmlFor="grossiste" className="font-normal cursor-pointer">
                        Grossiste - Vendre en gros
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Créer mon compte
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
