import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, ShoppingBag, FileText } from 'lucide-react';

interface Profile {
  full_name: string;
  member_type: 'grossiste' | 'detaillant';
  company_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country: string;
}

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: formData.get('full_name') as string,
        company_name: formData.get('company_name') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        country: formData.get('country') as string,
      })
      .eq('id', user.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil',
      });
    } else {
      toast({
        title: 'Succès',
        description: 'Profil mis à jour avec succès',
      });
      fetchProfile();
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations et vos activités</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informations du compte</CardTitle>
                  <Badge variant={profile.member_type === 'grossiste' ? 'default' : 'secondary'}>
                    {profile.member_type === 'grossiste' ? 'Grossiste' : 'Détaillant'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nom complet *</Label>
                      <Input 
                        id="full_name" 
                        name="full_name" 
                        defaultValue={profile.full_name}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_name">Nom de l'entreprise</Label>
                      <Input 
                        id="company_name" 
                        name="company_name" 
                        defaultValue={profile.company_name || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel"
                        defaultValue={profile.phone || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        defaultValue={profile.city || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        defaultValue={profile.address || ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays</Label>
                      <Input 
                        id="country" 
                        name="country" 
                        defaultValue={profile.country}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sauvegarder les modifications
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Commandes
                </TabsTrigger>
                <TabsTrigger value="products">
                  <Package className="w-4 h-4 mr-2" />
                  {profile.member_type === 'grossiste' ? 'Mes Produits' : 'Favoris'}
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <FileText className="w-4 h-4 mr-2" />
                  Activité
                </TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Aucune commande pour le moment</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {profile.member_type === 'grossiste' ? 'Mes produits' : 'Produits favoris'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {profile.member_type === 'grossiste' 
                        ? 'Vous n\'avez pas encore ajouté de produits'
                        : 'Aucun produit favori'}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Aucune activité récente</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
