'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ShortTermCard from '@/components/ShortTermCard';
import { propertiesApi } from '@/lib/api';

interface Property {
  id: number; title: string; city: string; state: string;
  bedrooms: number; bathrooms: number; price: number;
  price_type: string; images: string[];
}

function ChevronDownIcon() {
  return <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#756791" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>;
}

const SIMULATED_PINS = [
  { top: '22%', left: '30%', num: 1 }, { top: '38%', left: '55%', num: 2 },
  { top: '60%', left: '20%', num: 3 }, { top: '50%', left: '72%', num: 4 },
  { top: '28%', left: '65%', num: 5, color: '#40208e' },
];

function ShortTermRentalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    propertyType: '', minPrice: '', maxPrice: '',
    bedrooms: '', bathrooms: '', checkIn: '', checkOut: '', sort: 'newest',
  });

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const params: Record<string, string> = { price_type: 'short_term', limit: '60', sort: filters.sort };
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
      } finally { setLoading(false); }
    }
    fetchProperties();
  }, [filters]);

  const updateFilter = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => {
    setFilters({ location: '', propertyType: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', checkIn: '', checkOut: '', sort: 'newest' });
    router.push('/rentals/short-term');
  };
  const hasActiveFilters = filters.location || filters.propertyType || filters.minPrice || filters.maxPrice || filters.bedrooms || filters.bathrooms;

  return (
    <div className="min-h-screen">
      <div className="bg-white px-6 lg:px-16 pt-20 pb-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg font-normal uppercase tracking-[0.22em] text-[#221854] leading-8 mb-2">Short Term Rentals</p>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.06em] text-[#141821]">Find your next stay</h1>
        </div>
      </div>

      <div className="bg-white px-6 lg:px-16 py-4 border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#756791] font-medium">{loading ? 'Loading...' : `${total} properties found`}</p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#141821] font-medium cursor-pointer focus:outline-none focus:border-[#5B25C1]">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDownIcon />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#141821] hover:border-[#5B25C1] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></svg>
              Filters
            </button>
            <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 gap-1">
              {(['grid', 'map'] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`p-2 rounded-lg transition-all ${view === v ? 'bg-[#221854] text-white' : 'text-[#756791] hover:bg-gray-100'}`}>
                  {v === 'grid'
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                  }
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}
            className="bg-white border-b border-gray-100 px-6 lg:px-16 py-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-[#141821]">Filters</h3>
                  {hasActiveFilters && <button onClick={clearFilters} className="text-sm font-medium text-[#5B25C1] hover:text-[#221854]">Clear all</button>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    { label: 'Property Type', key: 'propertyType', type: 'select', options: ['', 'Villa', 'Condo', 'Apartment', 'Casita'] },
                    { label: 'Min Price /n', key: 'minPrice', type: 'number', placeholder: '$0' },
                    { label: 'Max Price /n', key: 'maxPrice', type: 'number', placeholder: '$10,000' },
                    { label: 'Beds', key: 'bedrooms', type: 'select', options: ['', '1+', '2+', '3+', '4+'] },
                    { label: 'Baths', key: 'bathrooms', type: 'select', options: ['', '1+', '2+', '3+'] },
                    { label: 'Check-in', key: 'checkIn', type: 'date' },
                    { label: 'Check-out', key: 'checkOut', type: 'date' },
                  ].map(({ label, key, type, options, placeholder }: any) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-[#756791] uppercase tracking-wider mb-2">{label}</label>
                      {type === 'select'
                        ? <select value={(filters as any)[key]} onChange={e => updateFilter(key, e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]">{options.map((o: string) => <option key={o} value={o}>{o || 'All'}</option>)}</select>
                        : <input type={type} placeholder={placeholder} value={(filters as any)[key]} onChange={e => updateFilter(key, e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-[#141821] focus:outline-none focus:border-[#5B25C1]" />
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {view === 'grid' && (
        <div className="px-6 lg:px-16 py-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse"><div className="h-52 bg-gray-200 rounded-t-2xl" /><div className="p-4 bg-white rounded-b-2xl"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div></div>)}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
                <button onClick={clearFilters} className="mt-4 px-6 py-2.5 rounded-full bg-[#5b25c1] text-white font-medium hover:bg-[#40208e] transition-colors">Clear filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {properties.map(p => <ShortTermCard key={p.id} property={p} />)}
                </div>
                <div className="mt-10 flex justify-center">
                  <button className="px-8 py-3 rounded-full border-2 border-[#221854] text-[#221854] text-sm font-bold tracking-widest uppercase hover:bg-[#221854] hover:text-white transition-colors">Load more properties</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {view === 'map' && (
        <div className="px-6 lg:px-16 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[640px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[640px] pr-2">
              {loading ? [...Array(4)].map((_, i) => <div key={i} className="animate-pulse"><div className="h-40 bg-gray-200 rounded-t-2xl" /><div className="p-3 bg-white rounded-b-2xl"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /></div></div>) :
                properties.slice(0, 12).map((p, i) => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
                    <div className="relative overflow-hidden h-40">
                      {p.images[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                      <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[#5B25C1] border-2 border-white flex items-center justify-center"><span className="text-white text-[9px] font-black">{i + 1}</span></div>
                    </div>
                    <div className="p-3"><h3 className="text-sm font-semibold text-[#141821] mb-0.5">{p.title}</h3><p className="text-xs text-[#756791]">{p.city}, {p.state}</p></div>
                  </div>
                ))
              }
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-[#e8e4f0] min-h-[640px] flex items-center justify-center border border-[#ccc2ed]">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=640&fit=crop" alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-30" />
              <div className="relative z-10 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-[#5B25C1] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                </div>
                <p className="font-semibold text-[#221854]">Interactive Map View</p>
                <p className="text-sm text-[#756791] mt-1">Showing {total} properties across Mexico</p>
              </div>
              {SIMULATED_PINS.map(pin => (
                <div key={pin.num} className="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform z-20"
                  style={{ top: pin.top, left: pin.left, backgroundColor: (pin as any).color || '#5B25C1' }}>
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

export default function ShortTermRentalsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 rounded-full border-4 border-[#5B25C1] border-t-transparent" /></div>}>
      <ShortTermRentalsContent />
    </Suspense>
  );
}
