import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LongTermCard from '../components/LongTermCard';
import { propertiesApi } from '../lib/api';

interface Property {
  id: number;
  title: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  price_type: string;
  images: string[];
}

/* ─── Inline Icons ─── */
function ChevronDownIcon() {
  return (
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#756791" strokeWidth="2">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function MapPlaceholderIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

/* ─── Map View Card ─── */
function MapCard({ property, index }: { property: Property; index: number }) {
  const image = property.images[0] || '';
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow duration-300">
      <div className="relative overflow-hidden h-40">
        {image ? (
          <img src={image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
        <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[#5B25C1] border-2 border-white flex items-center justify-center">
          <span className="text-white text-[9px] font-black">{index + 1}</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold tracking-tight text-[#141821] mb-0.5">{property.title}</h3>
        <p className="text-xs text-[#756791] mb-1">{property.city}, {property.state}</p>
        <p className="text-sm font-semibold text-[#5B25C1]">
          ${property.price.toLocaleString()}
          <span className="text-xs font-normal text-[#756791]">/mo</span>
        </p>
      </div>
    </div>
  );
}

/* ─── Simulated Map Pins ─── */
const SIMULATED_PINS = [
  { top: '22%', left: '30%', num: 1 },
  { top: '38%', left: '55%', num: 2 },
  { top: '60%', left: '20%', num: 3 },
  { top: '50%', left: '72%', num: 4 },
  { top: '28%', left: '65%', num: 5, color: '#40208e' },
];

export default function LongTermRentalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    checkIn: '',
    checkOut: '',
    sort: 'newest',
  });

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          price_type: 'long_term',
          limit: '60',
          sort: filters.sort,
        };
        if (filters.location) params.city = filters.location;
        if (filters.propertyType && filters.propertyType !== 'All') params.property_type = filters.propertyType.toLowerCase();
        if (filters.minPrice) params.min_price = filters.minPrice;
        if (filters.maxPrice) params.max_price = filters.maxPrice;
        if (filters.bedrooms && filters.bedrooms !== 'Any') params.bedrooms = filters.bedrooms.replace('+', '');
        if (filters.bathrooms && filters.bathrooms !== 'Any') params.bathrooms = filters.bathrooms.replace('+', '');

        const data = await propertiesApi.list(params);
        setProperties(data.properties || []);
        setTotal(data.pagination?.total || 0);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [filters]);

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      checkIn: '',
      checkOut: '',
      sort: 'newest',
    });
    setSearchParams({});
  };

  const hasActiveFilters =
    filters.location ||
    filters.propertyType ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.bedrooms ||
    filters.bathrooms ||
    filters.checkIn ||
    filters.checkOut;

  return (
    <div className="min-h-screen">
      {/* ── Page Heading ── */}
      <div className="bg-white px-6 lg:px-16 pt-12 pb-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg font-normal uppercase tracking-[0.22em] text-[#221854] leading-8 mb-2">Long Term Rentals</p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.06em] text-[#141821]">Find your next home</h1>
        </div>
      </div>

      {/* ── Controls Bar (sticky) ── */}
      <div className="bg-white px-6 lg:px-16 py-4 border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#756791] font-medium">
            {loading ? 'Loading properties...' : `${total} properties found`}
          </p>

          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#141821] font-medium cursor-pointer focus:outline-none focus:border-[#5B25C1]"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDownIcon />
            </div>

            {/* Filters button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#141821] hover:border-[#5B25C1] transition-colors"
            >
              <FilterIcon />
              Filters
            </button>

            {/* View toggle */}
            <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 gap-1">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all ${
                  view === 'grid'
                    ? 'bg-[#221854] text-white'
                    : 'text-[#756791] hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setView('map')}
                className={`p-2 rounded-lg transition-all ${
                  view === 'map'
                    ? 'bg-[#221854] text-white'
                    : 'text-[#756791] hover:bg-gray-100'
                }`}
                aria-label="Map view"
              >
                <MapIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Panel (collapsible) ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white border-b border-gray-100 px-6 lg:px-16 py-6 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-[#141821]">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium text-[#5B25C1] hover:text-[#221854] transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#756791] uppercase tracking-wider mb-2">Property Type</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => updateFilter('propertyType', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]"
                    >
                      <option value="">All</option>
                      <option value="Villa">Villa</option>
                      <option value="Condo">Condo</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Casita">Casita</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#756791] uppercase tracking-wider mb-2">Min Price /mo</label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter('minPrice', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#756791] uppercase tracking-wider mb-2">Max Price /mo</label>
                    <input
                      type="number"
                      placeholder="$10,000"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter('maxPrice', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#756791] uppercase tracking-wider mb-2">Beds</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => updateFilter('bedrooms', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]"
                    >
                      <option value="">Any</option>
                      <option value="1+">1+</option>
                      <option value="2+">2+</option>
                      <option value="3+">3+</option>
                      <option value="4+">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#756791] uppercase tracking-wider mb-2">Baths</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => updateFilter('bathrooms', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]"
                    >
                      <option value="">Any</option>
                      <option value="1+">1+</option>
                      <option value="2+">2+</option>
                      <option value="3+">3+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#756791] uppercase tracking-wider mb-2">Check-in</label>
                    <input
                      type="date"
                      value={filters.checkIn}
                      onChange={(e) => updateFilter('checkIn', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#756791] uppercase tracking-wider mb-2">Check-out</label>
                    <input
                      type="date"
                      value={filters.checkOut}
                      onChange={(e) => updateFilter('checkOut', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Grid View ── */}
      {view === 'grid' && (
        <div className="px-6 lg:px-16 py-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-52 bg-gray-200 rounded-t-2xl" />
                    <div className="p-4 bg-white rounded-b-2xl">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#5b25c1] text-white font-medium hover:bg-[#40208e] transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {properties.map((property, index) => (
                    <LongTermCard key={property.id} property={property} index={index} />
                  ))}
                </div>
                <div className="mt-10 flex justify-center">
                  <button className="px-8 py-3 rounded-full border-2 border-[#221854] text-[#221854] text-sm font-bold tracking-widest uppercase hover:bg-[#221854] hover:text-white transition-colors">
                    Load more properties
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Map View ── */}
      {view === 'map' && (
        <div className="px-6 lg:px-16 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[640px]">
            {/* Left: card list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[640px] pr-2">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-t-2xl" />
                    <div className="p-3 bg-white rounded-b-2xl">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : properties.length === 0 ? (
                <div className="col-span-2 text-center py-10">
                  <p className="text-gray-500">No properties found.</p>
                </div>
              ) : (
                properties.slice(0, 12).map((property, index) => (
                  <MapCard key={property.id} property={property} index={index} />
                ))
              )}
            </div>

            {/* Right: map placeholder */}
            <div className="relative rounded-2xl overflow-hidden bg-[#e8e4f0] min-h-[640px] flex items-center justify-center border border-[#ccc2ed]">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=640&fit=crop"
                alt="Map"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-[#5B25C1] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPlaceholderIcon />
                </div>
                <p className="font-semibold text-[#221854]">Interactive Map View</p>
                <p className="text-sm text-[#756791] mt-1">
                  Showing {total} properties across Mexico
                </p>
              </div>
              {/* Simulated pins */}
              {SIMULATED_PINS.map((pin) => (
                <div
                  key={pin.num}
                  className="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform z-20"
                  style={{
                    top: pin.top,
                    left: pin.left,
                    backgroundColor: (pin as any).color || '#5B25C1',
                  }}
                >
                  <span className="text-white text-xs font-black">{pin.num}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
