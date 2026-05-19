import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, MapPin, Monitor } from 'lucide-react';
import StitchHero from '../components/StitchHero';
import ShortTermCard from '../components/ShortTermCard';
import LongTermCard from '../components/LongTermCard';
import { propertiesApi } from '../lib/api';

const infoCards = [
  {
    icon: Search,
    title: 'Find your stay without the hunt',
    description: 'Browse villas, condos, casitas, and beachfront rentals from local brokerages in one reliably refreshed search.',
    cta: 'Explore rentals',
    ctaHref: '/rentals/short-term',
    gradient: 'linear-gradient(135deg, #EA580C, #C2410C)',
  },
  {
    icon: MapPin,
    title: 'Rent with real availability',
    description: "Xa'an filters stale posts and duplicate listings so your shortlist is filled with units you can actually book tonight.",
    cta: 'Find rentals',
    ctaHref: '/rentals/long-term',
    gradient: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
  },
  {
    icon: Monitor,
    title: 'List into the active market',
    description: "Reach renters already comparing Mexico's updated inventory — not scattered across broker sites and Facebook groups.",
    cta: "List with Xa'an",
    ctaHref: '/dashboard',
    gradient: 'linear-gradient(135deg, #7629a5, #5b25c1)',
  },
];

const recentSearches = [
  { location: 'Punta de Mita', type: 'Hospedajes', details: '3 noches • vie., 22 may. – lun., 25 may.', guests: '2 pasajeros' },
  { location: 'Tulum', type: 'Renta larga', details: 'Desde jun. 2025 • 6 meses mín.', guests: '1 persona' },
  { location: 'Polanco', type: 'Departamentos', details: 'Renta mensual • hasta $35,000 MXN', guests: '2 recámaras' },
  { location: 'Mazatlán', type: 'Villas', details: '7 noches • jul., 4 – jul., 11', guests: '4 pasajeros' },
  { location: 'Mérida Centro', type: 'Casas', details: 'Renta anual • 3+ recámaras', guests: 'Familia, 4 personas' },
];

export default function HomePage() {
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [longTermProperties, setLongTermProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const [shortData, longData] = await Promise.all([
          propertiesApi.list({ price_type: 'short_term', limit: '8' }),
          propertiesApi.list({ price_type: 'long_term', limit: '4' }),
        ]);
        setRecentProperties(shortData.properties || []);
        setRecommended((shortData.properties || []).slice(0, 10));
        setLongTermProperties(longData.properties || []);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  return (
    <div>
      <StitchHero />

      {/* Section 1: Recently Viewed Properties */}
      <div className="ml-16 pt-20 pb-14 px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="lg:w-3/5">
              <p className="text-base font-normal uppercase tracking-[0.22em] leading-8 text-[#221854] mb-2">Recently Viewed</p>
              <h2 className="text-4xl sm:text-6xl font-semibold tracking-[-0.06em] text-[#141821] leading-tight">
                Pick up where<br />you left off.
              </h2>
            </div>
            <div className="lg:w-2/5 lg:pb-2">
              <p className="text-lg font-normal leading-8 text-[#5B25C1]">
                The last 8 properties you explored — ready to revisit whenever you are.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="ml-16 py-12 px-8 lg:px-16" style={{ background: '#F5F3EF' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-56 rounded-2xl bg-gray-200" />
                  <div className="mt-3 h-4 rounded bg-gray-200 w-3/4" />
                  <div className="mt-2 h-3 rounded bg-gray-200 w-1/2" />
                </div>
              ))
            ) : (
              recentProperties.slice(0, 8).map((property) => (
                <ShortTermCard key={property.id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Recent Searches */}
      <section className="ml-16 pb-20 px-8 lg:px-16" style={{ background: '#F5F3EF' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-10">
            <div className="lg:w-3/5">
              <p className="text-base font-normal uppercase tracking-[0.22em] leading-8 text-[#221854] mb-2">Your History</p>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] text-[#141821] leading-tight">
                Recent searches.
              </h2>
            </div>
            <div className="lg:w-2/5 lg:pb-1">
              <p className="text-lg font-normal leading-8 text-[#5B25C1]">
                Jump back into a search right where you left it.
              </p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recentSearches.map((search, i) => (
              <div
                key={i}
                className="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-[#ede9f6] px-6 py-5 min-w-[240px] cursor-pointer hover:shadow-md transition-shadow duration-200"
              >
                <p className="text-sm font-semibold text-[#141821] mb-1">
                  {search.type} en <span className="text-[#5B25C1]">{search.location}</span>
                </p>
                <p className="text-sm text-[#756791]">{search.details}</p>
                <p className="text-sm text-[#756791]">{search.guests}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Stop Checking 5 Places */}
      <section className="ml-16 py-20 px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-14">
            <div className="lg:w-3/5">
              <p className="text-base font-normal uppercase tracking-[0.22em] leading-8 text-[#221854] mb-2">Recently Listed Near You</p>
              <h2 className="text-4xl sm:text-6xl font-semibold tracking-[-0.06em] text-[#141821] leading-tight">
                Stop checking five places.<br />Xa'an keeps<br />the market together.
              </h2>
            </div>
            <div className="lg:w-2/5 lg:pb-2">
              <p className="text-lg font-normal leading-8 text-[#5B25C1]">
                Fresh rental feeds, local verification signals, and duplicate suppression mean you can compare every available short-term stay with confidence.
              </p>
            </div>
          </div>

          <div
            className="relative rounded-3xl overflow-hidden p-8 lg:p-10"
            style={{ background: 'linear-gradient(135deg, #EA580C 0%, #1D4ED8 52%, #7629a5 100%)' }}
          >
            {/* Grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">
              {infoCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-7 flex flex-col items-center gap-6 hover:bg-white/35 transition-colors duration-300"
                  >
                    <div
                      className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center"
                      style={{ background: card.gradient }}
                    >
                      <Icon size={32} strokeWidth={2} className="text-white" />
                    </div>
                    <div className="flex-1 text-center">
                      <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                      <p className="text-sm leading-relaxed text-white/80">{card.description}</p>
                    </div>
                    <Link
                      to={card.ctaHref}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white transition-colors"
                    >
                      {card.cta}
                      <ArrowRight size={16} strokeWidth={2} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Recommended For You */}
      <div className="ml-16 pt-20 pb-14 px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="lg:w-3/5">
              <p className="text-base font-normal uppercase tracking-[0.22em] leading-8 text-[#221854] mb-2">Suggested For You</p>
              <h2 className="text-4xl sm:text-6xl font-semibold tracking-[-0.06em] text-[#141821] leading-tight">
                Recommended<br />for you.
              </h2>
            </div>
            <div className="lg:w-2/5 lg:pb-2">
              <p className="text-lg font-normal leading-8 text-[#5B25C1]">
                10 nearby properties matched to your budget, preferred dates, and number of guests.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="ml-16 py-12 px-8 lg:px-16" style={{ background: '#F5F3EF' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 rounded-2xl bg-gray-200" />
                  <div className="mt-3 h-4 rounded bg-gray-200 w-3/4" />
                  <div className="mt-2 h-3 rounded bg-gray-200 w-1/2" />
                </div>
              ))
            ) : (
              recommended.slice(0, 10).map((property) => (
                <ShortTermCard key={property.id} property={property} />
              ))
            )}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/rentals/short-term"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#5b25c1] text-[#5b25c1] font-semibold hover:bg-[#5b25c1] hover:text-white transition-all duration-300"
            >
              View all properties
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 5: Long Term Card Reference */}
      <div className="ml-16 pt-20 pb-14 px-8 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-[0.22em] uppercase text-[#221854] mb-3">Long Term Rentals</p>
          <h2 className="text-4xl sm:text-6xl font-semibold tracking-[-0.06em] text-[#141821] mb-4">Card style reference</h2>
          <p className="text-lg font-normal leading-8 text-[#5B25C1]">
            Long-term rental card — portrait layout with overlay. Used on the Long Term Rental listing page.
          </p>
        </div>
      </div>

      <section className="ml-16 py-12 px-8 lg:px-16" style={{ background: '#F5F3EF' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-5">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-80 rounded-2xl bg-gray-200" />
              </div>
            ))
          ) : (
            longTermProperties.slice(0, 4).map((property) => (
              <LongTermCard key={property.id} property={property} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
