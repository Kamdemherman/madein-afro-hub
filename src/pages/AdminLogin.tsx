import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast({
          variant: 'destructive',
          title: 'Erreur de connexion',
          description: authError.message,
        });
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de récupérer les informations utilisateur',
        });
        setIsLoading(false);
        return;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .single();

      if (roleError || !roleData) {
        // Sign out the user if they're not an admin
        await supabase.auth.signOut();
        toast({
          variant: 'destructive',
          title: 'Accès refusé',
          description: 'Vous n\'avez pas les permissions administrateur',
        });
        setIsLoading(false);
        return;
      }

      // User is admin, redirect to dashboard
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue dans l\'espace administrateur',
      });
      navigate('/dashboard/admin');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Espace Administrateur
          </CardTitle>
          <CardDescription>
            Connectez-vous avec vos identifiants administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email administrateur</Label>
              <Input 
                id="admin-email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="border-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Mot de passe</Label>
              <div className="relative">
                <Input 
                  id="admin-password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="border-primary/20 focus:border-primary"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Accéder au tableau de bord
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Cet espace est réservé aux administrateurs.
              <br />
              <a href="/auth" className="text-primary hover:underline">
                Retour à la connexion standard
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
