'use client';

import Link from 'next/link';

interface Property {
  id: number; title: string; city: string; state: string;
  bedrooms: number; bathrooms: number; price: number;
  price_type: string; images: string[];
}

export default function ShortTermCard({ property, onSave }: { property: Property; onSave?: (id: number) => void }) {
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); e.stopPropagation();
    onSave?.(property.id);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  const firstTwoImages = property.images.slice(0, 2);

  return (
    <Link href={`/property/${property.id}`} className="block">
      <article className="card-root bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300">
        <div className="card-img-wrap">
          <div className="card-img-track">
            {firstTwoImages.length > 0 ? firstTwoImages.map((src, i) => (
              <img key={i} src={src} alt={property.title} />
            )) : (
              <div className="w-full h-[208px] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">No image</div>
            )}
          </div>
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#221854] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">Short Stay</div>
          <button type="button" onClick={handleSaveClick} className="absolute top-3 right-3 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#141821" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-base font-semibold tracking-[-0.03em] text-[#141821]">{property.title}</h3>
            <span className="text-sm font-semibold text-[#5B25C1]">View</span>
          </div>
          <p className="text-sm text-[#756791] mb-2">{property.city}, {property.state}</p>
          <div className="flex items-center gap-2 text-sm text-[#756791]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="8" width="20" height="12" rx="2" /><path d="M2 14h20M10 8V6a2 2 0 0 1 4 0v2" /></svg>
            <span>{property.bedrooms}</span>
            <span className="text-[#ccc2ed]">·</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" /><path d="M6 12V7a2 2 0 0 1 4 0" /></svg>
            <span>{property.bathrooms}</span>
            <span className="text-[#ccc2ed]">·</span>
            <span className="font-semibold text-[#141821]">{formatPrice(property.price)}</span>
            <span className="text-xs">/n</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
