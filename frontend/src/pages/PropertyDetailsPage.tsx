import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { propertiesApi, agentsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import ShortTermCard from '../components/ShortTermCard';
import LongTermCard from '../components/LongTermCard';

/* ─── Masonry grid placements (16 cols × 14 rows) ─── */
const masonryPlacements = [
  { col: '1 / 6', row: '1 / 6' },
  { col: '6 / 9', row: '1 / 11' },
  { col: '9 / 12', row: '1 / 4' },
  { col: '12 / -1', row: '1 / 4' },
  { col: '1 / 4', row: '6 / 11' },
  { col: '4 / 6', row: '6 / 7' },
  { col: '4 / 6', row: '7 / 11' },
  { col: '1 / 6', row: '11 / -1' },
  { col: '6 / 12', row: '11 / -1' },
  { col: '9 / 12', row: '4 / 11' },
  { col: '12 / 13', row: '4 / 6' },
  { col: '13 / -1', row: '4 / 6' },
  { col: '12 / -1', row: '6 / 13' },
  { col: '12 / -1', row: '13 / -1' },
];

/* ─── Static accordion images ─── */
const accImages = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=900&h=700&fit=crop',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&h=700&fit=crop',
];

/* ─── Icons for stats ─── */
const BedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B25C1" strokeWidth="1.5">
    <rect x="2" y="8" width="20" height="12" rx="2" />
    <path d="M2 14h20M10 8V6a2 2 0 0 1 4 0v2" />
  </svg>
);
const BathIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B25C1" strokeWidth="1.5">
    <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
    <path d="M6 12V7a2 2 0 0 1 4 0" />
  </svg>
);
const SqftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B25C1" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="1" />
  </svg>
);
const ParkingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B25C1" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

/* ─── Types ─── */
interface PropertyData {
  id: number;
  title: string;
  address?: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  price_type: string;
  property_type?: string;
  images: string | string[];
  features?: string | string[];
  sqft?: number;
  parking?: number;
  year_built?: string;
  listed_date?: string;
  status?: string;
  views?: number;
  last_updated?: string;
  agent_id?: number;
  description?: string;
}

interface AgentData {
  id: number;
  name: string;
  photo_url?: string;
  specialty?: string;
}

interface SimilarProperty {
  id: number;
  title: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  price_type: string;
  property_type: string;
  images: string[];
}

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { firebaseUser } = useAuth();

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [similar, setSimilar] = useState<SimilarProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  /* Accordion */
  const [accActive, setAccActive] = useState(0);

  /* Right slider */
  const [sliderPos, setSliderPos] = useState(0);

  /* Load more photos */
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await propertiesApi.get(id);
        setProperty(data.property || data);
        try {
          const simData = await propertiesApi.similar(id, '4');
          setSimilar(simData.properties || []);
        } catch {
          setSimilar([]);
        }
      } catch (err) {
        console.error('Failed to fetch property:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  useEffect(() => {
    async function fetchAgent() {
      if (!property?.agent_id) return;
      try {
        const data = await agentsApi.get(String(property.agent_id));
        setAgent(data.agent);
      } catch (err) {
        console.error('Failed to fetch agent:', err);
      }
    }
    fetchAgent();
  }, [property?.agent_id]);

  const images: string[] = useMemo(() => {
    if (!property?.images) return [];
    return typeof property.images === 'string' ? JSON.parse(property.images) : (property.images as string[]);
  }, [property]);

  const features: string[] = useMemo(() => {
    if (!property?.features) return [];
    return typeof property.features === 'string' ? JSON.parse(property.features) : (property.features as string[]);
  }, [property]);

  const city = property?.city || 'Mazatlan';
  const accordionItems = useMemo(
    () => [
      `${city}\nRestaurants`,
      `Things to Do\nin ${city}`,
      `${city}\nWeather`,
      `Cost of Living\nin ${city}`,
    ],
    [city]
  );

  const visibleSliderImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=350&fit=crop',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500&h=350&fit=crop',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&h=350&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&h=350&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=350&fit=crop',
  ];

  const totalSlider = visibleSliderImages.length;
  const maxSliderPos = Math.max(0, totalSlider - 2);

  const handleSlideUp = () => setSliderPos((p) => Math.max(0, p - 1));
  const handleSlideDown = () => setSliderPos((p) => Math.min(maxSliderPos, p + 1));

  const handleSave = async () => {
    if (!firebaseUser) {
      navigate('/login');
      return;
    }
    setSaved(!saved);
  };

  const formatPrice = (price: number, priceType: string) => {
    const fmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
    return priceType === 'short_term' ? `${fmt} / night` : `${fmt} / month`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-xl bg-[#f2e7f6] mx-auto mb-4" />
          <div className="h-4 bg-[#f2e7f6] rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#756791] text-lg">Property not found.</p>
          <Link
            to="/rentals/short-term"
            className="mt-4 inline-block text-[#523575] font-medium hover:underline"
          >
            Browse rentals
          </Link>
        </div>
      </div>
    );
  }

  const isShortTerm = property.price_type === 'short_term';
  const displayedImages = showAllPhotos ? images : images.slice(0, 14);
  const photoCountText = showAllPhotos
    ? `Showing ${images.length} of ${images.length}`
    : `Showing ${Math.min(14, images.length)} of ${images.length}`;

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════════════════════════════════════════════
          HERO — 100vh (no header — app uses global Header)
          ═══════════════════════════════════════════════ */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: '80px' }}>
        {/* ── Title row ── */}
        <div
          className="px-8 lg:px-14 flex items-start justify-between flex-shrink-0"
          style={{ paddingTop: 5, paddingBottom: 12 }}
        >
          <div>
            <p className="text-lg font-normal uppercase tracking-[0.22em] text-[#221854] leading-8">
              Property Details Page
            </p>
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.06em] text-[#141821] leading-tight">
              A beautiful decision room.
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-sm font-semibold text-[#141821] hover:border-[#5B25C1] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141821] text-white text-sm font-semibold hover:bg-[#221854] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Save
            </button>
          </div>
        </div>

        {/* ── Gallery row ── */}
        <div
          className="flex-1 px-8 lg:px-14 flex gap-4 min-h-0"
          style={{ paddingBottom: 10 }}
        >
          {/* LEFT: Accordion */}
          <div
            className="flex-1 min-w-0 rounded-[38px] overflow-hidden relative"
            style={{ minHeight: 0, background: '#141821', padding: 12 }}
          >
            <div className="w-full h-full rounded-[28px] overflow-hidden relative">
              {/* Crossfade background images */}
              {accImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    opacity: i === accActive ? 1 : 0,
                    transition: 'opacity 0.9s ease',
                    zIndex: 1,
                  }}
                />
              ))}

              {/* Dark overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.48)',
                  zIndex: 2,
                }}
              />

              {/* 4 accordion columns */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                {accordionItems.map((title, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setAccActive(i)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'default',
                      borderRight:
                        i < accordionItems.length - 1
                          ? '1px solid rgba(255,255,255,0.08)'
                          : undefined,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        width: 1,
                        transition: 'background 0.4s ease',
                        background:
                          i === accActive
                            ? 'rgba(255,255,255,0.55)'
                            : 'transparent',
                      }}
                    />
                    <div
                      style={{
                        padding: '10px 16px',
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontSize: 28,
                        lineHeight: 1.1,
                        fontWeight: i === accActive ? 500 : 300,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        textAlign: 'center',
                        color:
                          i === accActive
                            ? '#ffffff'
                            : 'rgba(255,255,255,0.35)',
                        transition: 'color 0.35s, font-weight 0.35s',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {title}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        width: 1,
                        transition: 'background 0.4s ease',
                        background:
                          i === accActive
                            ? 'rgba(255,255,255,0.55)'
                            : 'transparent',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Image slider */}
          <div
            className="flex flex-col gap-0 relative"
            style={{ width: 300, flexShrink: 0 }}
          >
            <div
              className="flex-1 overflow-hidden rounded-[20px] relative"
              style={{ minHeight: 0 }}
            >
              <div
                className="h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.5s ease',
                  transform: `translateY(-${(sliderPos / totalSlider) * 100}%)`,
                }}
              >
                {visibleSliderImages.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      height: '50%',
                      paddingTop: i === 0 ? 0 : 4,
                      paddingBottom: i === 0 ? 4 : 0,
                    }}
                  >
                    <img
                      src={src}
                      alt={`Slide ${i + 1}`}
                      className="w-full h-full object-cover"
                      style={{ borderRadius: 16 }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Slider controls */}
            <div className="flex flex-col gap-2 absolute right-3 top-1/2 -translate-y-1/2 z-10">
              <button
                onClick={handleSlideUp}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors border border-gray-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#141821" strokeWidth="2.5">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
              <button
                onClick={handleSlideDown}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors border border-gray-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#141821" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* END HERO */}

      {/* ═══════════════════════════════════════════════
          MASONRY GALLERY
          ═══════════════════════════════════════════════ */}
      <section className="bg-white pt-24 pb-16">
        {/* Header */}
        <div className="px-8 lg:px-14 mb-6 flex items-end justify-between">
          <div>
            <p className="text-lg font-normal uppercase tracking-[0.22em] text-[#221854] leading-8">Gallery</p>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] text-[#141821]">All photos</h2>
          </div>
          <span className="text-sm text-gray-400 font-medium">{photoCountText}</span>
        </div>

        {/* 16-col × 14-row fixed grid */}
        <div
          style={{
            width: '100%',
            height: '67vh',
            padding: '0 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(16, 1fr)',
            gridTemplateRows: 'repeat(14, 1fr)',
            gap: 8,
          }}
        >
          {displayedImages.map((src, i) => {
            const placement = masonryPlacements[i % masonryPlacements.length];
            return (
              <div
                key={i}
                style={{
                  gridColumn: placement.col,
                  gridRow: placement.row,
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={src}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Load More */}
        {!showAllPhotos && images.length > 14 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setShowAllPhotos(true)}
              className="px-10 py-3.5 rounded-full border-2 border-[#221854] text-[#221854] text-xs font-bold tracking-widest uppercase hover:bg-[#221854] hover:text-white transition-all duration-300"
            >
              Load More Photos
            </button>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════
          BODY — Property Info + Agent Sidebar
          ═══════════════════════════════════════════════ */}
      <div className="bg-white px-8 lg:px-14 py-12">
        <div className="max-w-7xl mx-auto flex gap-12">
          {/* LEFT: Main content */}
          <div className="flex-1 min-w-0">
            {/* Title + Price + Badge */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-[#141821] mb-1">
                  {property.title}
                </h2>
                <p className="flex items-center gap-1.5 text-sm text-[#756791]">
                  <MapPin size={13} strokeWidth={2} />
                  {property.address}, {property.city}, {property.state}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black tracking-tight text-[#141821]">
                  {formatPrice(property.price, property.price_type)}
                </p>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#f0ebff] text-[#5B25C1]">
                  {isShortTerm ? 'For Rent' : 'For Rent'}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4 py-8 border-t border-b border-gray-100 my-6">
              <div className="text-center">
                <div className="mx-auto mb-2 flex justify-center">
                  <BedIcon />
                </div>
                <p className="text-2xl font-bold text-[#141821]">{property.bedrooms}</p>
                <p className="text-sm text-[#756791]">Bedrooms</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex justify-center">
                  <BathIcon />
                </div>
                <p className="text-2xl font-bold text-[#141821]">{property.bathrooms}</p>
                <p className="text-sm text-[#756791]">Bathrooms</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex justify-center">
                  <SqftIcon />
                </div>
                <p className="text-2xl font-bold text-[#141821]">
                  {property.sqft?.toLocaleString?.() || property.sqft}
                </p>
                <p className="text-sm text-[#756791]">Square Meters</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex justify-center">
                  <ParkingIcon />
                </div>
                <p className="text-2xl font-bold text-[#141821]">{property.parking || 1}</p>
                <p className="text-sm text-[#756791]">Parking</p>
              </div>
            </div>

            {/* About */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#141821] mb-3">About this property</h3>
              <p className="text-base text-[#242424] leading-7">{property.description}</p>
            </div>

            {/* Amenities */}
            {features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#141821] mb-4">Features &amp; amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-[#242424]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B25C1" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property details grid */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#141821] mb-4">Property details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-[#756791] mb-1">Type</p>
                  <p className="text-sm font-semibold text-[#141821]">{property.property_type || 'Villa'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-[#756791] mb-1">Year Built</p>
                  <p className="text-sm font-semibold text-[#141821]">{property.year_built || '2019'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-[#756791] mb-1">Listed</p>
                  <p className="text-sm font-semibold text-[#141821]">{property.listed_date || 'May 2025'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-[#756791] mb-1">Status</p>
                  <p className="text-sm font-semibold text-[#141821]">{property.status || 'Available'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-[#756791] mb-1">Views</p>
                  <p className="text-sm font-semibold text-[#141821]">{property.views?.toLocaleString?.() || '1,240'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-bold tracking-widest uppercase text-[#756791] mb-1">Last Updated</p>
                  <p className="text-sm font-semibold text-[#141821]">{property.last_updated || '2 days ago'}</p>
                </div>
              </div>
            </div>

            {/* Agent card */}
            {agent && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-[#141821] mb-4">Hosted by</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={agent.photo_url || '/images/agent-placeholder.jpg'}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#141821]">{agent.name}</p>
                    <p className="text-sm text-[#756791]">{agent.specialty || 'Real Estate Agent'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Booking widget (sticky) */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                {/* Price */}
                <div className="mb-5">
                  <span className="text-2xl font-bold text-[#141821] underline">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'MXN',
                      maximumFractionDigits: 0,
                    }).format(property.price)}{' '}
                    MXN
                  </span>
                  <span className="text-base text-[#242424] font-normal"> por 2 noches</span>
                </div>

                {/* Date inputs */}
                <div className="border border-gray-300 rounded-xl overflow-hidden mb-3">
                  <div className="grid grid-cols-2 divide-x divide-gray-300">
                    <div className="p-3">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-[#141821] mb-0.5">Llegada</p>
                      <input
                        type="date"
                        defaultValue="2026-05-22"
                        className="text-sm text-[#141821] w-full border-0 ring-0 focus:ring-0 focus:outline-none p-0 bg-transparent"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-[#141821] mb-0.5">Salida</p>
                      <input
                        type="date"
                        defaultValue="2026-05-24"
                        className="text-sm text-[#141821] w-full border-0 ring-0 focus:ring-0 focus:outline-none p-0 bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="border-t border-gray-300 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-[#141821] mb-0.5">Huéspedes</p>
                      <span className="text-sm text-[#141821]">1 huésped</span>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#141821" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Cancellation notice */}
                <p className="text-sm text-center text-[#242424] mb-3">
                  Cancelación gratuita antes del <strong>21 de mayo</strong>
                </p>

                {/* Reserve button */}
                <button className="w-full py-4 rounded-full bg-gradient-to-r from-[#5B25C1] to-[#221854] text-white font-bold text-base tracking-wide hover:opacity-90 transition-opacity mb-3">
                  Reservar
                </button>

                <p className="text-sm text-center text-[#756791]">Aún no se te cobrará nada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SIMILAR PROPERTIES
          ═══════════════════════════════════════════════ */}
      {similar.length > 0 && (
        <section className="bg-white px-8 lg:px-14 py-12">
          <div className="max-w-7xl mx-auto">
            <p className="text-lg font-normal uppercase tracking-[0.22em] text-[#221854] leading-8 mb-2">
              You may also like
            </p>
            <h2 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] text-[#141821] mb-8">
              Similar properties
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar.map((p) =>
                p.price_type === 'short_term' ? (
                  <ShortTermCard key={p.id} property={p} />
                ) : (
                  <LongTermCard key={p.id} property={p} />
                )
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
