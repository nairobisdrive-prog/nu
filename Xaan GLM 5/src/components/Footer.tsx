import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-16">
        <div className="grid grid-cols-4 gap-12 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {/* Brand Column */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-plum-400 to-plum-500 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">X</span>
              </div>
              <span className="font-heading font-bold text-2xl text-white">
                Xa'an
              </span>
            </Link>
            <p className="text-plum-500 text-sm leading-relaxed mb-6">
              Mexico's premier real estate platform. Find your perfect home with the most comprehensive database of listings nationwide.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-plum-700 flex items-center justify-center transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Buy a Home', 'Rent a Home', 'Sell Your Property', 'Find an Agent', 'Mortgage Calculator'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-plum-500 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Buying Guide', 'Selling Guide', 'Market Insights', 'Neighborhoods', 'Blog'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-plum-500 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-plum-500 text-sm">
                <Mail className="w-4 h-4 text-plum-400" />
                hola@xaan.mx
              </li>
              <li className="flex items-center gap-3 text-plum-500 text-sm">
                <Phone className="w-4 h-4 text-plum-400" />
                +52 55 1234 5678
              </li>
              <li className="flex items-start gap-3 text-plum-500 text-sm">
                <MapPin className="w-4 h-4 text-plum-400 mt-0.5" />
                <span>Av. Paseo de la Reforma 250,<br />Col. Juárez, CDMX 06600</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex items-center justify-between max-sm:flex-col max-sm:gap-4">
          <p className="text-plum-500 text-sm">
            © {currentYear} Xa'an. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} to="/" className="text-plum-500 hover:text-white transition-colors text-sm">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
