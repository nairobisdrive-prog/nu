import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Heart, Search } from 'lucide-react';

interface HeaderProps {
  scrolled: boolean;
}

export default function Header({ scrolled }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const leftNav = [
    { name: 'Buy', href: '/listings?type=sale' },
    { name: 'Rent', href: '/listings?type=rent' },
    { name: 'Sell', href: '/#sell' },
    { name: 'Find an Agent', href: '/find-agent' },
  ];

  const rightNav = [
    { name: 'Advertise', href: '/#advertise' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Sign In', href: '/dashboard' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-plum-900/5'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-[150px] max-xl:mx-8 max-lg:mx-6">
        <div className="flex items-center justify-between h-20">
          {/* Left Navigation */}
          <nav className="flex items-center gap-8 max-lg:hidden">
            {leftNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  scrolled
                    ? 'text-charcoal hover:text-plum-700'
                    : 'text-charcoal/80 hover:text-plum-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Center Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-plum-700 to-plum-900 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">X</span>
              </div>
              <span className={`font-heading font-bold text-2xl ${
                scrolled ? 'text-plum-700' : 'text-plum-700'
              }`}>
                Xa'an
              </span>
            </motion.div>
          </Link>

          {/* Right Navigation */}
          <nav className="flex items-center gap-6 max-lg:hidden">
            {rightNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  item.name === 'Sign In'
                    ? 'px-5 py-2 rounded-full bg-gradient-to-r from-plum-700 to-plum-900 text-white hover:shadow-lg hover:shadow-plum-700/30 transition-all duration-300'
                    : scrolled
                    ? 'text-charcoal hover:text-plum-700'
                    : 'text-charcoal/80 hover:text-plum-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-plum-300/50 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-charcoal" />
            ) : (
              <Menu className="w-6 h-6 text-charcoal" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-plum-300/50"
          >
            <div className="px-6 py-4 space-y-2">
              {[...leftNav, ...rightNav].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg text-charcoal hover:bg-plum-300/50 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
