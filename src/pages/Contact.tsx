import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Textarea } from '@/components/atoms/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Coffee } from 'lucide-react';

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'hello@beanmart.com',
      description: 'Send us an email and we\'ll respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Call us Monday through Friday, 9am to 5pm EST',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: '123 Coffee Street, Roast City, RC 12345',
      description: 'Visit our roastery and tasting room',
    },
    {
      icon: Clock,
      title: 'Hours',
      details: 'Mon-Fri: 9am-5pm EST',
      description: 'Weekend responses may be delayed',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-screen-2xl text-center">
          <Coffee className="h-16 w-16 text-coffee-medium mx-auto mb-6" />
          <h1 className="font-display text-5xl font-bold text-coffee-dark mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question about our coffee, need help with an order, or just want to chat about beans? 
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="container max-w-screen-2xl py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-coffee-dark">
                  Send Us a Message
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-coffee-dark mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-coffee-dark mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-coffee-dark mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-coffee-dark mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more..."
                      rows={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="coffee"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-coffee-dark mb-4">
                Let's Connect
              </h2>
              <p className="text-muted-foreground text-lg">
                We're here to help with any questions about our coffee, orders, or brewing tips. 
                Choose the best way to reach us.
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <Card key={index} className="card-shadow hover:warm-shadow smooth-transition">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-coffee-medium/10 rounded-lg">
                          <Icon className="h-6 w-6 text-coffee-medium" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-coffee-dark mb-1">
                            {info.title}
                          </h3>
                          <p className="font-medium text-coffee-medium mb-2">
                            {info.details}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* FAQ Section */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="font-display text-xl text-coffee-dark">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-coffee-dark mb-1">
                    How fresh is your coffee?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We roast to order and ship within 24 hours. Your coffee will arrive within 3-7 days of roasting.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-coffee-dark mb-1">
                    Do you offer bulk orders?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! Contact us for custom pricing on orders over 10 pounds.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-coffee-dark mb-1">
                    What's your return policy?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We offer a 30-day satisfaction guarantee. If you're not happy, we'll make it right.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}