import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Search,
  Mail,
  Bell,
  User,
  Users,
} from 'lucide-react';
import { agentsApi } from '../lib/api';

/* ─── Dark Header Icons ─── */
function IconMapPin({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ccc2ed" strokeWidth="2" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ccc2ed" strokeWidth="2" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ccc2ed" strokeWidth="2" className={className}>
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

interface Agent {
  id: string | number;
  name: string;
  role?: string;
  specialties?: string[];
  photo?: string;
  active_listings?: number;
  response_time?: string;
  verified_rate?: string;
}

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#50267a" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const UserIcon24 = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#50267a" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const UsersIcon18 = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#141821" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const shortlistItems = [
  { name: 'Casa Guadalajara Centro', status: 'Under review' },
  { name: 'Villa Residencial Cancún', status: 'Tour scheduled' },
  { name: 'Penthouse Monterrey Sky', status: 'Offer pending' },
];

export default function DashboardPage() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentsApi
      .list()
      .then((data: Agent[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAgent(data[0]);
        }
      })
      .catch(() => {
        // fallback to static mock agent if API fails
      })
      .finally(() => setLoading(false));
  }, []);

  const featuredAgent: Agent = agent || {
    id: 1,
    name: 'Sofía Navarro',
    role: 'Luxury buyer advisor · CDMX + Riviera Maya',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    active_listings: 42,
    response_time: '8m',
    verified_rate: '98%',
  };

  return (
    <div className="min-h-screen bg-[#141821]">
      {/* Dark Header Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 border-b border-white/10 bg-[#141821]">
        {/* Left: Logo */}
        <div className="flex items-center pl-8 lg:pl-32 z-10">
          <Link to="/">
            <img src="/xaan-logo.png" alt="XA'AN" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[580px]">
          <div className="flex items-center bg-white/10 border border-white/20 rounded-full shadow-sm h-11 overflow-hidden">
            <div className="flex items-center gap-0.5 pl-3 pr-3 border-r border-white/20 flex-shrink-0">
              <button className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#5B25C1] text-white">Short Term</button>
              <button className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-white/60 hover:bg-white/10 transition-colors">Long Term</button>
            </div>
            <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
              <IconMapPin className="flex-shrink-0" />
              <input type="text" placeholder="Where to?" className="bg-transparent text-sm text-white placeholder-white/40 outline-none border-0 ring-0 focus:ring-0 focus:outline-none w-full font-medium min-w-0" />
            </div>
            <div className="flex items-center gap-2 px-3 flex-shrink-0">
              <IconCalendar className="flex-shrink-0" />
              <span className="text-sm text-white/40 whitespace-nowrap">Any week</span>
            </div>
            <div className="flex items-center gap-2 px-3 flex-shrink-0">
              <IconUsers className="flex-shrink-0" />
              <span className="text-sm text-white/40">Guests</span>
            </div>
            <button className="h-11 w-11 flex-shrink-0 bg-[#5B25C1] flex items-center justify-center hover:bg-[#221854] transition-colors">
              <IconSearch />
            </button>
          </div>
        </div>

        {/* Right: Nav */}
        <nav className="flex-1 flex items-center justify-end">
          <ul className="hidden md:flex gap-10 text-xs font-bold tracking-widest uppercase mr-8 text-white/70">
            <li><a className="hover:text-white transition-colors" href="#">Become a host</a></li>
            <li><a className="hover:text-white transition-colors" href="#">FAQ</a></li>
          </ul>
          <button className="bg-[#5B25C1] text-white px-8 h-20 flex items-center gap-3 hover:bg-[#221854] transition-all duration-300 cta-polygon">
            <span className="text-xs font-bold tracking-widest uppercase">Login</span>
            <IconChevronDown />
          </button>
        </nav>
      </header>

    <section
      className="px-5 py-24 text-white lg:px-10"
      style={{ paddingTop: 128 }}
    >
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT COLUMN: Find an Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ccc2ed]">
            Find an agent
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">
            Local experts,
            <br />
            verified by activity.
          </h2>
          <p className="mt-6 text-lg leading-8 text-[#ccc2ed]">
            Compare agents by neighborhoods served, active listings, response time,
            languages, and recent closings—then message without leaving your search.
          </p>

          {/* Featured Agent Card */}
          <div
            className="mt-9 bg-white p-5 text-[#141821]"
            style={{ borderRadius: 34 }}
          >
            <div className="flex items-center gap-5">
              <img
                src={featuredAgent.photo}
                alt={featuredAgent.name}
                className="h-24 w-24 object-cover"
                style={{ borderRadius: 26 }}
              />
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                  {featuredAgent.name}
                </h3>
                <p className="text-[#756791]">
                  {featuredAgent.role || 'Real estate advisor'}
                </p>
                <div className="mt-2 flex gap-1">
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                  <StarIcon />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-[#f2e7f6] p-4">
                <b className="text-lg text-[#141821]">
                  {featuredAgent.active_listings ?? 42}
                </b>
                <span className="mt-0.5 block text-xs text-[#756791]">
                  active listings
                </span>
              </div>
              <div className="rounded-2xl bg-[#f2e7f6] p-4">
                <b className="text-lg text-[#141821]">
                  {featuredAgent.response_time ?? '8m'}
                </b>
                <span className="mt-0.5 block text-xs text-[#756791]">
                  avg reply
                </span>
              </div>
              <div className="rounded-2xl bg-[#f2e7f6] p-4">
                <b className="text-lg text-[#141821]">
                  {featuredAgent.verified_rate ?? '98%'}
                </b>
                <span className="mt-0.5 block text-xs text-[#756791]">
                  verified
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: User Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="p-4"
          style={{
            borderRadius: 42,
            border: '1px solid rgba(255,255,255,0.10)',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div
            className="p-6 text-[#141821]"
            style={{ borderRadius: 32, background: '#f8f5fb' }}
          >
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#756791]">
                  User dashboard
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  Your market command center
                </h3>
              </div>
              <UserIcon24 />
            </div>

            {/* 2×2 Tiles */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {/* Saved properties */}
              <div
                className="bg-white p-5 shadow-sm"
                style={{ borderRadius: 26 }}
              >
                <div className="flex items-center justify-between">
                  <Heart className="h-5 w-5" stroke="#50267a" strokeWidth={2} />
                  <span className="text-2xl font-semibold tracking-[-0.04em]">
                    12
                  </span>
                </div>
                <h4 className="mt-4 font-bold">Saved properties</h4>
                <p className="mt-2 text-sm leading-6 text-[#756791]">
                  Tour-ready homes in Polanco, Roma Norte, Tulum
                </p>
              </div>

              {/* Saved searches */}
              <div
                className="bg-white p-5 shadow-sm"
                style={{ borderRadius: 26 }}
              >
                <div className="flex items-center justify-between">
                  <Search className="h-5 w-5" stroke="#50267a" strokeWidth={2} />
                  <span className="text-2xl font-semibold tracking-[-0.04em]">
                    4
                  </span>
                </div>
                <h4 className="mt-4 font-bold">Saved searches</h4>
                <p className="mt-2 text-sm leading-6 text-[#756791]">
                  Budget, neighborhood, amenity filters synced
                </p>
              </div>

              {/* Email alerts */}
              <div
                className="bg-white p-5 shadow-sm"
                style={{ borderRadius: 26 }}
              >
                <div className="flex items-center justify-between">
                  <Mail className="h-5 w-5" stroke="#50267a" strokeWidth={2} />
                  <span className="text-2xl font-semibold tracking-[-0.04em]">
                    Daily
                  </span>
                </div>
                <h4 className="mt-4 font-bold">Email alerts</h4>
                <p className="mt-2 text-sm leading-6 text-[#756791]">
                  Daily, weekly, or monthly updates on new matches
                </p>
              </div>

              {/* Price changes */}
              <div
                className="bg-white p-5 shadow-sm"
                style={{ borderRadius: 26 }}
              >
                <div className="flex items-center justify-between">
                  <Bell className="h-5 w-5" stroke="#50267a" strokeWidth={2} />
                  <span className="text-2xl font-semibold tracking-[-0.04em]">
                    7
                  </span>
                </div>
                <h4 className="mt-4 font-bold">Price changes</h4>
                <p className="mt-2 text-sm leading-6 text-[#756791]">
                  Instant notices when tracked homes move
                </p>
              </div>
            </div>

            {/* Shared shortlist */}
            <div
              className="mt-5 bg-white p-5"
              style={{ borderRadius: 26 }}
            >
              <div className="mb-4 flex items-center gap-2 font-bold text-[#141821]">
                <UsersIcon18 />
                Shared shortlist
              </div>
              {shortlistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-t border-[#f2e7f6] py-3"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-sm text-[#756791]">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </div>
  );
}
