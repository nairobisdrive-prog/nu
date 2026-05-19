import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property, formatPrice } from '../data/mockData';

interface ListingCardProps {
  property: Property;
  index?: number;
}

export default function ListingCard({ property, index = 0 }: ListingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isHovered && property.images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, property.images.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg shadow-charcoal/5 hover:shadow-2xl hover:shadow-plum-900/10 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/property/${property.id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Images */}
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {property.images.map((img, i) => (
              <div
                key={i}
                className="min-w-full h-full bg-plum-300"
              >
                <img
                  src={img}
                  alt={`${property.title} - Image ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Navigation Arrows */}
          {isHovered && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5 text-charcoal" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5 text-charcoal" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {property.images.slice(0, 5).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentImageIndex
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved(!saved);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                saved ? 'fill-red-500 text-red-500' : 'text-charcoal'
              }`}
            />
          </button>

          {/* Status Badge */}
          {property.status !== 'active' && (
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-sm text-white text-xs font-medium z-10">
              {property.status === 'pending' ? 'Pending' : 'Sold'}
            </div>
          )}

          {/* Price Type Badge */}
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-plum-700/90 backdrop-blur-sm text-white text-xs font-medium z-10">
            {property.priceType === 'rent' ? 'For Rent' : 'For Sale'}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Price */}
          <div className="mb-2">
            <span className="text-2xl font-heading font-bold text-charcoal">
              {formatPrice(property.price, property.priceType)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-semibold text-lg text-charcoal mb-1 group-hover:text-plum-700 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-plum-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{property.city}, {property.state}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 pt-4 border-t border-plum-300/50">
            <div className="flex items-center gap-1.5 text-charcoal">
              <Bed className="w-4 h-4 text-plum-600" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 text-charcoal">
              <Bath className="w-4 h-4 text-plum-600" />
              <span className="text-sm font-medium">{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5 text-charcoal">
              <Square className="w-4 h-4 text-plum-600" />
              <span className="text-sm font-medium">{property.sqft.toLocaleString()} m²</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
