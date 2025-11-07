import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi du formulaire
    setTimeout(() => {
      toast({
        title: 'Message envoyé !',
        description: 'Nous vous répondrons dans les plus brefs délais.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contactez-nous
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Notre équipe est à votre écoute pour répondre à toutes vos questions
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Envoyez-nous un message</h2>
                  <Card className="bg-gradient-card shadow-card">
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nom complet</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Votre nom"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="votre@email.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Sujet</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="Objet de votre message"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Votre message..."
                            rows={6}
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-foreground">Informations de contact</h2>
                    <p className="text-muted-foreground mb-8">
                      N'hésitez pas à nous contacter par téléphone, email ou en visitant nos bureaux. 
                      Nous sommes disponibles du lundi au vendredi de 9h à 18h.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <Card className="bg-gradient-card shadow-card">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Mail className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1 text-foreground">Email</h3>
                            <p className="text-muted-foreground">contact@madeinafricashops.com</p>
                            <p className="text-muted-foreground">support@madeinafricashops.com</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-card shadow-card">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Phone className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1 text-foreground">Téléphone</h3>
                            <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                            <p className="text-muted-foreground">+225 01 02 03 04 05</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-card shadow-card">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1 text-foreground">Adresse</h3>
                            <p className="text-muted-foreground">
                              123 Avenue des Artisans<br />
                              Abidjan, Côte d'Ivoire
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-gradient-hero text-primary-foreground">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3">Horaires d'ouverture</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Lundi - Vendredi</span>
                          <span className="font-semibold">9h00 - 18h00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Samedi</span>
                          <span className="font-semibold">10h00 - 16h00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dimanche</span>
                          <span className="font-semibold">Fermé</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
