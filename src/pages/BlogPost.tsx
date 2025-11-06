import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[];
  published_at: string;
  profiles: {
    full_name: string;
  };
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    const { data: postData, error: postError } = await supabase
      .from('blog_posts')
      .select('*, profiles(full_name)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (postError) {
      console.error('Error fetching post:', postError);
      navigate('/blog');
      return;
    }

    setPost(postData);

    // Fetch related products
    const { data: associations } = await supabase
      .from('blog_product_associations')
      .select('product_id')
      .eq('blog_post_id', postData.id);

    if (associations && associations.length > 0) {
      const productIds = associations.map(a => a.product_id);
      const { data: products } = await supabase
        .from('products')
        .select('id, name, slug, price, images')
        .in('id', productIds)
        .eq('is_active', true);

      if (products) {
        setRelatedProducts(products);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {post.featured_image && (
            <div className="aspect-[21/9] rounded-lg overflow-hidden mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}
              <span className="text-muted-foreground">
                {new Date(post.published_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Par {post.profiles.full_name}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Produits associés</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                  <Link key={product.id} to={`/products/${product.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={product.images[0] || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <span className="text-xl font-bold text-primary">
                          {product.price.toFixed(2)} €
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
