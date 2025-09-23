import { Link } from 'react-router-dom';
import { Coffee, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { name: 'All Coffee', href: '/catalog' },
      { name: 'Single Origin', href: '/catalog?category=single-origin' },
      { name: 'Blends', href: '/catalog?category=blends' },
      { name: 'Decaf', href: '/catalog?category=decaf' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { name: 'Our Story', href: '/story' },
      { name: 'Brew Guides', href: '/brew-guides' },
      { name: 'Coffee Education', href: '/education' },
      { name: 'Roasting Process', href: '/roasting' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
    ],
  },
];

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Email', icon: Mail, href: 'mailto:hello@beanmart.com' },
];

export function Footer() {
  return (
    <footer className="bg-coffee-dark text-cream">
      <div className="container max-w-screen-2xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Coffee className="h-8 w-8 text-caramel" />
              <span className="font-display text-2xl font-bold">
                Beanmart
              </span>
            </Link>
            <p className="text-cream/80 mb-6 max-w-md">
              Sourcing the world's finest coffee beans directly from farmers, 
              roasted to perfection, and delivered fresh to your door.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-cream/60 hover:text-caramel smooth-transition"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-caramel mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-cream/80 hover:text-cream smooth-transition text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cream/60 text-sm">
            © 2024 Beanmart. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-cream/60 hover:text-cream text-sm smooth-transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-cream/60 hover:text-cream text-sm smooth-transition"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}