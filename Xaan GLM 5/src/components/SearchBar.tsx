import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

export default function SearchBar() {
  const [searchType, setSearchType] = useState<'buy' | 'rent' | 'sell'>('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('type', searchType === 'buy' ? 'sale' : searchType);
    if (location) params.set('location', location);
    if (propertyType) params.set('propertyType', propertyType);
    if (priceRange) params.set('price', priceRange);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {/* Main Search Container */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-charcoal/10 p-3 max-w-5xl mx-auto">
        {/* Type Tabs */}
        <div className="flex items-center gap-2 mb-4 px-2">
          {[
            { id: 'buy', label: 'Buy' },
            { id: 'rent', label: 'Rent' },
            { id: 'sell', label: 'Sell' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSearchType(tab.id as 'buy' | 'rent' | 'sell')}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                searchType === tab.id
                  ? 'bg-gradient-to-r from-plum-700 to-plum-900 text-white shadow-lg shadow-plum-700/30'
                  : 'bg-plum-300/50 text-charcoal hover:bg-plum-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Fields */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Location */}
          <div className="flex-1 min-w-[200px] relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600" />
            <input
              type="text"
              placeholder="City, neighborhood, or address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:bg-white focus:outline-none transition-all text-charcoal placeholder:text-plum-500"
            />
          </div>

          {/* Property Type */}
          <div className="relative min-w-[180px]">
            <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full pl-12 pr-8 py-4 rounded-2xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:bg-white focus:outline-none transition-all text-charcoal appearance-none cursor-pointer"
            >
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
              <option value="apartment">Apartment</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="relative min-w-[180px]">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600" />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full pl-12 pr-8 py-4 rounded-2xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:bg-white focus:outline-none transition-all text-charcoal appearance-none cursor-pointer"
            >
              <option value="">Price Range</option>
              <option value="0-5000000">Under $5M MXN</option>
              <option value="5000000-10000000">$5M - $10M MXN</option>
              <option value="10000000-20000000">$10M - $20M MXN</option>
              <option value="20000000+">$20M+ MXN</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-plum-700 to-plum-900 text-white font-semibold flex items-center gap-2 hover:shadow-xl hover:shadow-plum-700/30 hover:scale-105 transition-all duration-300"
          >
            <Search className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>
    </motion.div>
  );
}
