import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, Map, List, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { properties, Property } from '../data/mockData';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: ''
  });

  useEffect(() => {
    let result = [...properties];

    if (filters.type) {
      result = result.filter(p => p.priceType === filters.type);
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      result = result.filter(p =>
        p.city.toLowerCase().includes(loc) ||
        p.state.toLowerCase().includes(loc) ||
        p.address.toLowerCase().includes(loc)
      );
    }
    if (filters.propertyType) {
      result = result.filter(p => p.propertyType === filters.propertyType);
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseInt(filters.maxPrice));
    }
    if (filters.bedrooms) {
      result = result.filter(p => p.bedrooms >= parseInt(filters.bedrooms));
    }
    if (filters.bathrooms) {
      result = result.filter(p => p.bathrooms >= parseInt(filters.bathrooms));
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProperties(result);
  }, [filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: ''
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-plum-300/20 to-white pt-24">
      {/* Header */}
      <div className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="font-heading font-bold text-3xl text-charcoal mb-2">
              {filters.type === 'sale' ? 'Homes for Sale' : filters.type === 'rent' ? 'Homes for Rent' : 'All Properties'}
            </h1>
            <p className="text-plum-600">
              {filteredProperties.length} properties found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-white border border-plum-300/50 text-charcoal font-medium cursor-pointer focus:outline-none focus:border-plum-700"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                showFilters
                  ? 'bg-plum-700 text-white'
                  : 'bg-white border border-plum-300/50 text-charcoal hover:border-plum-700'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-xl border border-plum-300/50 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-plum-700 text-white'
                    : 'text-plum-600 hover:bg-plum-300/50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'map'
                    ? 'bg-plum-700 text-white'
                    : 'text-plum-600 hover:bg-plum-300/50'
                }`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-charcoal/5 border border-plum-300/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-lg text-charcoal">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-plum-600 hover:text-plum-700 font-medium text-sm flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-plum-600 mb-2">Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full p-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                    >
                      <option value="">All</option>
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-plum-600 mb-2">Property Type</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                      className="w-full p-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                    >
                      <option value="">All</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="apartment">Apartment</option>
                      <option value="land">Land</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-plum-600 mb-2">Min Price</label>
                    <input
                      type="number"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full p-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-plum-600 mb-2">Max Price</label>
                    <input
                      type="number"
                      placeholder="$50,000,000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full p-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-plum-600 mb-2">Beds</label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                      className="w-full p-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-plum-600 mb-2">Baths</label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                      className="w-full p-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-plum-600 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="City or state"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="w-full p-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <ListingCard key={property.id} property={property} index={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProperties.slice(0, 6).map((property, index) => (
                <ListingCard key={property.id} property={property} index={index} />
              ))}
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-plum-300/30 h-[600px] lg:h-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-plum-600 mx-auto mb-4" />
                  <p className="text-plum-600 font-medium">Interactive Map View</p>
                  <p className="text-plum-500 text-sm">Showing {filteredProperties.length} properties</p>
                </div>
              </div>
              {/* Simulated map pins */}
              {filteredProperties.slice(0, 8).map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute w-8 h-8 rounded-full bg-plum-700 border-2 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 transition-transform"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${15 + Math.random() * 70}%`
                  }}
                >
                  <span className="text-white text-xs font-bold">{i + 1}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-plum-600 text-lg">No properties found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 rounded-full bg-plum-700 text-white font-medium hover:bg-plum-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
