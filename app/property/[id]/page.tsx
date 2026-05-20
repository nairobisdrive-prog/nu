'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { propertiesApi } from '@/lib/api';
import ShortTermCard from '@/components/ShortTermCard';
import LongTermCard from '@/components/LongTermCard';

const masonryPlacements = [
  { col: '1 / 6', row: '1 / 6' }, { col: '6 / 9', row: '1 / 11' },
  { col: '9 / 12', row: '1 / 4' }, { col: '12 / -1', row: '1 / 4' },
  { col: '1 / 4', row: '6 / 11' }, { col: '4 / 6', row: '6 / 7' },
  { col: '4 / 6', row: '7 / 11' }, { col: '1 / 6', row: '11 / -1' },
  { col: '6 / 12', row: '11 / -1' }, { col: '9 / 12', row: '4 / 11' },
  { col: '12 / 13', row: '4 / 6' }, { col: '13 / -1', row: '4 / 6' },
  { col: '12 / -1', row: '6 / 13' }, { col: '12 / -1', row: '13 / -1' },
];

const galleryImages = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1527030280862-64139fba04ca?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=640&fit=crop',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&h=640&fit=crop',
];

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [property, setProperty] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      try {
        const [propData, simData] = await Promise.all([
          propertiesApi.get(id),
          propertiesApi.similar(id, '4'),
        ]);
        setProperty(propData.property);
        setSimilar(simData.properties || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#5B25C1] border-t-transparent" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-[#141821]">Property not found</p>
        <Link href="/rentals/short-term" className="px-6 py-3 rounded-full bg-[#5B25C1] text-white font-medium">Browse properties</Link>
      </div>
    );
  }

  const images = Array.isArray(property.images)
    ? (typeof property.images[0] === 'string' ? property.images : property.images)
    : (typeof property.images === 'string' ? JSON.parse(property.images) : []);

  const displayImages = images.length >= 14 ? images : [...images, ...galleryImages].slice(0, 14);
  const isShortTerm = property.price_type === 'short_term';

  return (
    <div className="min-h-screen bg-[#F1EFE9]">

      {/* Hero */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '80px' }}>
        <div style={{ paddingTop: '5px', paddingBottom: '12px' }} className="px-8 lg:px-16 max-w-7xl mx-auto w-full">
          <p className="text-sm font-normal uppercase tracking-[0.22em] text-[#221854]">
            {isShortTerm ? 'Short Term Rental' : 'Long Term Rental'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] text-[#141821]">{property.title}</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-[#5B25C1]" />
            <span className="text-sm text-[#756791]">{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>
        <div className="flex-1 px-8 lg:px-16" />
      </div>

      {/* Gallery */}
      <div className="pt-16 pb-8">
        <div style={{
          width: '100%', height: '67vh', padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(16, 1fr)',
          gridTemplateRows: 'repeat(14, 1fr)',
          gap: '8px',
        }}>
          {displayImages.map((img: string, i: number) => (
            <div key={i} style={{
              gridColumn: masonryPlacements[i]?.col,
              gridRow: masonryPlacements[i]?.row,
              borderRadius: '10px', overflow: 'hidden',
            }}>
              <img src={img} alt={`${property.title} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 lg:px-16 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left: property info */}
          <div className="flex-1 min-w-0">
            {/* Stats */}
            <div className="flex items-center gap-8 pb-8 border-b border-gray-200 mb-8">
              {[
                { label: 'Bedrooms', value: property.bedrooms },
                { label: 'Bathrooms', value: property.bathrooms },
                { label: 'Sq Ft', value: property.sqft ? property.sqft.toLocaleString() : '—' },
                { label: 'Parking', value: property.parking || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-semibold text-[#141821]">{value}</p>
                  <p className="text-sm text-[#756791]">{label}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#141821] mb-4">About this property</h2>
              <p className="text-[#242424] leading-7">{property.description || 'No description available.'}</p>
            </div>

            {/* Features */}
            {property.features && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-[#141821] mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(typeof property.features === 'string' ? JSON.parse(property.features) : property.features).map((f: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#242424]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5B25C1]" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: booking widget */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="mb-5">
                  <span className="text-2xl font-bold text-[#141821]">
                    ${property.price?.toLocaleString('en-US')} MXN
                  </span>
                  <span className="text-base text-[#242424] font-normal">
                    {isShortTerm ? ' por noche' : ' por mes'}
                  </span>
                </div>

                <div className="border border-gray-300 rounded-xl overflow-hidden mb-3">
                  <div className="grid grid-cols-2 divide-x divide-gray-300">
                    <div className="p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#141821] mb-1">Llegada</p>
                      <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full text-sm text-[#141821] outline-none border-0 focus:ring-0 bg-transparent" />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#141821] mb-1">Salida</p>
                      <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full text-sm text-[#141821] outline-none border-0 focus:ring-0 bg-transparent" />
                    </div>
                  </div>
                  <div className="border-t border-gray-300 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#141821]">Huéspedes</p>
                      <p className="text-sm text-[#141821]">{guests} huésped{guests > 1 ? 'es' : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-[#141821] hover:border-[#5B25C1] transition-colors">-</button>
                      <button onClick={() => setGuests(guests + 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-[#141821] hover:border-[#5B25C1] transition-colors">+</button>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#756791] mb-4">
                  Cancelación gratuita antes del <strong className="text-[#141821]">21 de mayo</strong>
                </p>

                <button className="w-full py-4 rounded-full bg-gradient-to-r from-[#5B25C1] to-[#221854] text-white font-bold text-sm tracking-widest uppercase hover:shadow-lg transition-all">
                  Reservar
                </button>

                <p className="text-sm text-center text-[#756791] mt-3">Aún no se te cobrará nada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <div className="px-6 lg:px-16 py-12 max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#141821] mb-8">Similar properties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similar.map(p =>
              p.price_type === 'short_term'
                ? <ShortTermCard key={p.id} property={p} />
                : <LongTermCard key={p.id} property={p} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
