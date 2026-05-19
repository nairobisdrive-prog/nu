import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/* ─── Inline SVG icons (match skeleton exactly) ─── */

function IconMapPin({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5B25C1" strokeWidth="2" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#756791" strokeWidth="2" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#756791" strokeWidth="2" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#221854" strokeWidth="2" className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

/* ─── Component ─── */

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState<'short' | 'long'>('short');
  const [query, setQuery] = useState('');
  const loginRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  /* Click-outside-to-close for dropdowns */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (loginRef.current && !loginRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      const path = searchType === 'short' ? '/rentals/short-term' : '/rentals/long-term';
      navigate(`${path}?location=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* ═══════ Variant A: Fixed header (all pages except home) ═══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center relative">
        {/* Left: Logo */}
        <div className="flex items-center pl-8 z-10">
          <Link to="/">
            <img src="/xaan-logo.png" alt="XA'AN" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[580px] hidden md:block">
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm h-11 overflow-hidden">
            {/* Toggle */}
            <div className="flex items-center gap-0.5 pl-3 pr-3 border-r border-gray-200 flex-shrink-0">
              <button
                onClick={() => setSearchType('short')}
                className={`text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full transition-colors ${
                  searchType === 'short'
                    ? 'bg-[#221854] text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Short Term
              </button>
              <button
                onClick={() => setSearchType('long')}
                className={`text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full transition-colors ${
                  searchType === 'long'
                    ? 'bg-[#221854] text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Long Term
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
              <IconMapPin className="flex-shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-transparent text-sm text-[#141821] placeholder-gray-400 outline-none border-0 ring-0 focus:ring-0 focus:outline-none w-full font-medium min-w-0"
              />
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2 px-3 flex-shrink-0 hidden lg:flex">
              <IconCalendar className="flex-shrink-0" />
              <span className="text-sm text-gray-400 whitespace-nowrap">Any week</span>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-2 px-3 flex-shrink-0 hidden lg:flex">
              <IconUsers className="flex-shrink-0" />
              <span className="text-sm text-gray-400">Guests</span>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="h-11 w-11 flex-shrink-0 bg-[#5B25C1] flex items-center justify-center hover:bg-[#221854] transition-colors"
            >
              <IconSearch />
            </button>
          </div>
        </div>

        {/* Right: Nav */}
        <nav className="flex-1 flex items-center justify-end">
          {/* Desktop links */}
          <ul className="hidden lg:flex gap-10 text-xs font-bold tracking-widest uppercase mr-8">
            <li>
              <Link to="/find-agent" className="hover:text-[#5B25C1] transition-colors">
                Become a host
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-[#5B25C1] transition-colors">
                FAQ
              </Link>
            </li>
          </ul>

          {/* Mobile search icon */}
          <button
            onClick={() => navigate('/rentals/short-term')}
            className="md:hidden mr-3 p-2 text-[#5B25C1]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden mr-4 p-2 text-[#141821]"
          >
            <Menu size={22} />
          </button>

          {/* Auth area */}
          {user ? (
            <div className="relative hidden lg:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 mr-8 rounded-full border border-[#ccc2ed] bg-white px-3 py-2 text-[#141821] hover:shadow-md transition-all"
              >
                <Menu size={18} />
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#141821]">
                  <span className="text-xs font-bold text-white">
                    {(user.display_name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-[#141821] truncate">
                        {user.display_name || 'User'}
                      </p>
                      <p className="text-xs text-[#756791] truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4b3965] hover:bg-gray-50 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Saved Properties
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4b3965] hover:bg-gray-50 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative hidden lg:block" ref={loginRef}>
              <button
                onClick={() => setLoginOpen(!loginOpen)}
                className="bg-[#221854] text-white px-8 h-16 flex items-center gap-3 hover:bg-[#5B25C1] transition-colors"
              >
                <span className="text-xs font-bold tracking-widest uppercase">Login</span>
                <IconChevronDown />
              </button>
              <AnimatePresence>
                {loginOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <Link
                      to="/login"
                      onClick={() => setLoginOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <IconHome />
                      <p className="text-xs font-bold tracking-widest uppercase text-[#141821]">
                        Agent / Host
                      </p>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setLoginOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#221854" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <p className="text-xs font-bold tracking-widest uppercase text-[#141821]">
                        Guest
                      </p>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>
      </header>

      {/* ═══════ Mobile menu ═══════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#141821]/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26 }}
              className="ml-auto h-full w-[82%] bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-10 flex items-center justify-between">
                <Link to="/" onClick={() => setMobileOpen(false)}>
                  <img src="/xaan-logo.png" alt="XA'AN" className="h-10 w-auto object-contain" />
                </Link>
                <button onClick={() => setMobileOpen(false)} className="rounded-full bg-[#f2e7f6] p-3">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-1">
                <Link to="/rentals/short-term" onClick={() => setMobileOpen(false)} className="block border-b border-[#f2e7f6] py-5 text-xl font-semibold text-[#141821]">
                  Short-term Rentals
                </Link>
                <Link to="/rentals/long-term" onClick={() => setMobileOpen(false)} className="block border-b border-[#f2e7f6] py-5 text-xl font-semibold text-[#141821]">
                  Long-term Rentals
                </Link>
                <Link to="/find-agent" onClick={() => setMobileOpen(false)} className="block border-b border-[#f2e7f6] py-5 text-xl font-semibold text-[#141821]">
                  Find Agent
                </Link>
                <Link to="/blog" onClick={() => setMobileOpen(false)} className="block border-b border-[#f2e7f6] py-5 text-xl font-semibold text-[#141821]">
                  FAQ
                </Link>
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block border-b border-[#f2e7f6] py-5 text-xl font-semibold text-[#141821]">
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left border-b border-[#f2e7f6] py-5 text-xl font-semibold text-red-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block border-b border-[#f2e7f6] py-5 text-xl font-semibold text-[#141821]">
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
