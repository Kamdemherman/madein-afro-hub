import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Users, Package, ShoppingCart, TrendingUp, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  member_type: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (error || !data) {
      toast({
        title: 'Accès refusé',
        description: 'Vous n\'avez pas les permissions nécessaires',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    setIsAdmin(true);
    loadDashboardData();
  };

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadProducts(),
      loadOrders(),
    ]);
    setLoading(false);
  };

  const loadStats = async () => {
    const [usersResult, productsResult, ordersResult] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount'),
    ]);

    const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    setStats({
      totalUsers: usersResult.count || 0,
      totalProducts: productsResult.count || 0,
      totalOrders: ordersResult.data?.length || 0,
      totalRevenue,
    });
  };

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, member_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading users:', error);
      return;
    }

    const usersWithEmails = await Promise.all(
      (data || []).map(async (profile) => {
        const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
        return {
          ...profile,
          email: authData?.user?.email || 'N/A',
        };
      })
    );

    setUsers(usersWithEmails);
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, is_active, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading products:', error);
      return;
    }

    setProducts(data || []);
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('id, order_number, total_amount, status, created_at, customer_id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading orders:', error);
      return;
    }

    const ordersWithEmails = await Promise.all(
      (data || []).map(async (order) => {
        const { data: authData } = await supabase.auth.admin.getUserById(order.customer_id);
        return {
          ...order,
          customer_email: authData?.user?.email || 'N/A',
        };
      })
    );

    setOrders(ordersWithEmails);
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', productId);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le produit',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Statut du produit mis à jour',
    });
    loadProducts();
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus as any })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la commande',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Succès',
      description: 'Statut de la commande mis à jour',
    });
    loadOrders();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending: { variant: 'secondary', icon: Clock },
      confirmed: { variant: 'default', icon: CheckCircle },
      processing: { variant: 'default', icon: Clock },
      shipped: { variant: 'default', icon: CheckCircle },
      delivered: { variant: 'default', icon: CheckCircle },
      cancelled: { variant: 'destructive', icon: XCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  if (isAdmin === null || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Total des membres</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Dans le catalogue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Total des commandes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} €</div>
              <p className="text-xs text-muted-foreground">Revenus totaux</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>Liste des derniers utilisateurs inscrits</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date d'inscription</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.member_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des produits</CardTitle>
                <CardDescription>Liste des produits du catalogue</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.price.toFixed(2)} €</TableCell>
                        <TableCell>{product.stock_quantity}</TableCell>
                        <TableCell>
                          {product.is_active ? (
                            <Badge variant="default">Actif</Badge>
                          ) : (
                            <Badge variant="secondary">Inactif</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleProductStatus(product.id, product.is_active)}
                          >
                            {product.is_active ? 'Désactiver' : 'Activer'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des commandes</CardTitle>
                <CardDescription>Liste des dernières commandes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Commande</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.order_number}</TableCell>
                        <TableCell>{order.customer_email}</TableCell>
                        <TableCell>{Number(order.total_amount).toFixed(2)} €</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">En attente</SelectItem>
                              <SelectItem value="confirmed">Confirmé</SelectItem>
                              <SelectItem value="processing">En traitement</SelectItem>
                              <SelectItem value="shipped">Expédié</SelectItem>
                              <SelectItem value="delivered">Livré</SelectItem>
                              <SelectItem value="cancelled">Annulé</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
