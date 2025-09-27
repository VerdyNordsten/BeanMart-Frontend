import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

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

export function ContactInfo() {
  return (
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
  );
}
