import { Link } from 'react-router-dom';

interface Property {
  id: string | number;
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

interface LongTermCardProps {
  property: Property;
  onSave?: (property: Property) => void;
}

export default function LongTermCard({ property, onSave }: LongTermCardProps) {
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(property);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US');
  };

  return (
    <Link to={`/property/${property.id}`} className="lt-card rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-2xl transition-shadow duration-500 block">
      <div className="lt-img-wrap">
        <div className="lt-img-track">
          {property.images.slice(0, 2).map((img, i) => (
            <img key={i} src={img} alt={`${property.title} ${i + 1}`} />
          ))}
          {property.images.length === 1 && (
            <img src={property.images[0]} alt={property.title} />
          )}
        </div>
        <div className="lt-overlay" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-[#5B25C1] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
            Long Term
          </span>
          <span className="bg-[#221854] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
            {property.property_type}
          </span>
        </div>

        {/* Heart button */}
        <button
          onClick={handleSaveClick}
          className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-base font-semibold text-white tracking-[-0.03em] mb-0.5">
            {property.title}
          </h3>
          <p className="text-sm text-white/70 mb-3">
            {property.city}, {property.state}
          </p>
          <div className="flex items-center gap-2 text-sm text-white/80 mb-3">
            {/* Bed icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="8" width="20" height="12" rx="2" />
              <path d="M2 14h20" />
              <path d="M10 8V6a2 2 0 0 1 4 0v2" />
            </svg>
            {property.bedrooms}
            <span className="text-white/30">·</span>
            {/* Bath icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
              <path d="M6 12V7a2 2 0 0 1 4 0" />
            </svg>
            {property.bathrooms}
            <span className="text-white/30">·</span>
            <span className="font-semibold text-white">${formatPrice(property.price)}</span>
            <span className="text-xs text-white/70">/mo</span>
          </div>
          <button className="w-full py-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/35 text-white text-xs font-bold tracking-widest uppercase transition-colors border border-white/30">
            View this property
          </button>
        </div>
      </div>
    </Link>
  );
}
