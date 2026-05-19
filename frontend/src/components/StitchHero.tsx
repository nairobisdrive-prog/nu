import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Search, SlidersHorizontal } from 'lucide-react';
import { propertiesApi } from '../lib/api';

interface HeroProperty {
  id: number;
  title: string;
  address: string;
  price: number;
  price_type: string;
  images: string[];
}

export default function StitchHero() {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 0.22], [18, 0]);
  const y = useTransform(scrollYProgress, [0, 0.22], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 0.22], [0.92, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.12]);

  const [query, setQuery] = useState('');
  const [featured, setFeatured] = useState<HeroProperty[]>([]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await propertiesApi.list({ limit: '4' });
        setFeatured(data.properties?.slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to fetch featured:', err);
      }
    }
    fetchFeatured();
  }, []);

  const formatPrice = (price: number, priceType: string) => {
    const fmt = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
    return priceType === 'short_term' ? `${fmt} / night` : `${fmt}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/rentals/short-term?location=${encodeURIComponent(query)}`;
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#f2e7f6_0%,#fff_38%,#fff_100%)] pt-32 lg:pt-40"
    >
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-[#ccc2ed]/60 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-12 h-96 w-96 rounded-full bg-[#f2e7f6] blur-3xl" />

      <div className="mx-auto max-w-[1400px] px-5 text-center lg:px-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-[#ccc2ed] bg-white/70 px-4 py-2 text-sm font-semibold text-[#523575] shadow-sm backdrop-blur-xl"
        >
          <Sparkles size={16} /> 90%+ of active local listings, updated in one place
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.8 }}
          className="mx-auto max-w-6xl text-5xl font-semibold leading-[0.98] tracking-[-0.075em] text-[#141821] sm:text-7xl lg:text-[112px]"
        >
          Mexico real estate, finally in sync.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.75 }}
          className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#756791] sm:text-xl"
        >
          Xa'an replaces the broker-site maze, Facebook Marketplace scrolling, and street-sign
          guessing with one reliably refreshed database for homes and condos for sale across Mexico.
        </motion.p>

        {/* 3D Card Stack Container */}
        <motion.div
          style={{ rotateX, y, scale, opacity, transformPerspective: 1100 }}
          className="relative mx-auto mt-14 max-w-6xl rounded-[44px] border border-white/80 bg-white/55 p-3 shadow-2xl shadow-[#523575]/18 backdrop-blur-2xl"
        >
          <div className="absolute inset-x-12 -top-5 h-10 rounded-full bg-[#ccc2ed]/60 blur-2xl" />
          <div className="grid overflow-hidden rounded-[34px] bg-[#141821] p-3 text-left md:grid-cols-[1.1fr_0.9fr]">
            {/* Left — Stacked property cards */}
            <div className="relative min-h-[430px] overflow-hidden rounded-[26px] bg-[#f2e7f6]">
              {featured.length > 0 ? (
                featured.map((property, index) => {
                  const images =
                    typeof property.images === 'string'
                      ? JSON.parse(property.images)
                      : property.images;
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 80, rotate: index % 2 ? -4 : 4 }}
                      animate={{
                        opacity: 1,
                        y: index * 42,
                        rotate: index % 2 ? -3 : 3,
                      }}
                      transition={{ delay: 0.2 + index * 0.12, duration: 0.7 }}
                      className="absolute left-[8%] top-[7%] w-[78%] overflow-hidden rounded-[28px] border border-white/50 bg-white shadow-2xl"
                    >
                      <img
                        src={images?.[0] || '/images/placeholder.jpg'}
                        alt={property.title}
                        className="h-48 w-full object-cover"
                      />
                      <div className="p-5">
                        <div className="text-2xl font-semibold tracking-[-0.04em] text-[#141821]">
                          {formatPrice(property.price, property.price_type)}
                        </div>
                        <p className="mt-1 text-sm text-[#756791]">
                          {property.address || property.title}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ccc2ed] border-t-[#523575]" />
                </div>
              )}
            </div>

            {/* Right — Search + copy */}
            <div className="flex flex-col justify-between p-7 text-white">
              <div>
                <div className="w-fit rounded-full bg-white/10 px-4 py-2 text-sm text-[#ccc2ed]">
                  Live inventory engine
                </div>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-0.055em]">
                  From scattered signs to searchable certainty.
                </h2>
              </div>
              <div className="rounded-[28px] bg-white p-3 shadow-2xl">
                <form
                  onSubmit={handleSearch}
                  className="flex flex-col gap-3 rounded-[26px] border border-[#ccc2ed]/70 bg-white p-2 shadow-xl shadow-[#523575]/8 md:flex-row"
                >
                  <div className="flex flex-1 items-center gap-3 px-4 py-3">
                    <Search className="text-[#523575]" size={23} />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-transparent text-lg font-medium text-[#141821] outline-none placeholder:text-[#a297b9]"
                      placeholder="Search by city, neighborhood, address"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to="/rentals/short-term"
                      className="rounded-2xl border border-[#f2e7f6] px-4 py-3 text-sm font-semibold text-[#4b3965] flex items-center gap-2"
                    >
                      <SlidersHorizontal size={16} /> Filters
                    </Link>
                    <button
                      type="submit"
                      className="rounded-2xl bg-[#141821] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#50267a]"
                    >
                      Search homes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
