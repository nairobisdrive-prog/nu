import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Share2, MapPin, Bed, Bath, Square, Calendar,
  Car, Home, Building, ChevronLeft, ChevronRight, X,
  Phone, Mail, Camera, Check, Star, Clock, Eye
} from 'lucide-react';
import { properties, formatPrice, agents } from '../data/mockData';
import ListingCard from '../components/ListingCard';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const property = properties.find(p => p.id === id) || properties[0];
  const [saved, setSaved] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [hoveredAccordion, setHoveredAccordion] = useState<number | null>(null);

  const similarProperties = properties.filter(p => p.id !== property.id).slice(0, 5);
  const agent = property.agent;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Bar */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-xl border-b border-plum-300/30">
        <div className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/listings"
                className="flex items-center gap-2 text-plum-600 hover:text-plum-700 font-medium"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Listings
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSaved(!saved)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  saved
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'border-plum-300/50 text-charcoal hover:border-plum-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${saved ? 'fill-red-500' : ''}`} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-plum-300/50 text-charcoal hover:border-plum-700 transition-all">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Gallery - 70/30 Layout */}
      <section className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-8">
        <div className="grid grid-cols-12 gap-4 h-[500px] max-lg:h-auto">
          {/* Left 70% - Image Accordion */}
          <div className="col-span-8 max-lg:col-span-12 max-lg:h-[400px] flex gap-2">
            {property.images.slice(0, 5).map((img, index) => (
              <motion.div
                key={index}
                className="relative rounded-xl overflow-hidden cursor-pointer flex-1 transition-all duration-500"
                style={{ flex: hoveredAccordion === index ? 2.5 : hoveredAccordion !== null ? 0.8 : 1 }}
                onMouseEnter={() => setHoveredAccordion(index)}
                onMouseLeave={() => setHoveredAccordion(null)}
                onClick={() => {
                  setActiveImageIndex(index);
                  setShowGallery(true);
                }}
              >
                <img
                  src={img}
                  alt={`${property.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                {hoveredAccordion === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-4 left-4 right-4"
                  >
                    <div className="flex items-center gap-2 text-white">
                      <Camera className="w-4 h-4" />
                      <span className="text-sm font-medium">{index + 1} / {property.images.length}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right 30% - Gallery Grid */}
          <div className="col-span-4 max-lg:col-span-12 max-lg:h-[200px] flex flex-col gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              {property.images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setActiveImageIndex(index);
                    setShowGallery(true);
                  }}
                >
                  <img
                    src={img}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGallery(true)}
              className="w-full py-3 rounded-xl bg-plum-300/50 hover:bg-plum-300 text-plum-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              See All {property.images.length} Photos
            </button>
          </div>
        </div>
      </section>

      {/* Main Content - 80/20 Layout */}
      <section className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-8">
        <div className="grid grid-cols-12 gap-12">
          {/* Left 80% */}
          <div className="col-span-8 max-lg:col-span-12 space-y-12">
            {/* Price & Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-heading font-bold text-3xl text-charcoal mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-plum-600">
                    <MapPin className="w-5 h-5" />
                    <span>{property.address}, {property.city}, {property.state}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-heading font-bold text-charcoal">
                    {formatPrice(property.price, property.priceType)}
                  </span>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.priceType === 'sale'
                        ? 'bg-plum-700 text-white'
                        : 'bg-plum-300 text-plum-900'
                    }`}>
                      {property.priceType === 'sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-6 py-6 border-y border-plum-300/50">
                <div className="text-center">
                  <Bed className="w-6 h-6 text-plum-600 mx-auto mb-2" />
                  <span className="block text-2xl font-heading font-bold text-charcoal">{property.bedrooms}</span>
                  <span className="text-sm text-plum-600">Bedrooms</span>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 text-plum-600 mx-auto mb-2" />
                  <span className="block text-2xl font-heading font-bold text-charcoal">{property.bathrooms}</span>
                  <span className="text-sm text-plum-600">Bathrooms</span>
                </div>
                <div className="text-center">
                  <Square className="w-6 h-6 text-plum-600 mx-auto mb-2" />
                  <span className="block text-2xl font-heading font-bold text-charcoal">{property.sqft.toLocaleString()}</span>
                  <span className="text-sm text-plum-600">Square Meters</span>
                </div>
                <div className="text-center">
                  <Car className="w-6 h-6 text-plum-600 mx-auto mb-2" />
                  <span className="block text-2xl font-heading font-bold text-charcoal">{property.parking}</span>
                  <span className="text-sm text-plum-600">Parking</span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-heading font-bold text-xl text-charcoal mb-4">About This Property</h2>
              <p className="text-plum-600 leading-relaxed">{property.description}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-heading font-bold text-xl text-charcoal mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-plum-300/20"
                  >
                    <Check className="w-5 h-5 text-plum-700" />
                    <span className="text-charcoal">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Details by Type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-heading font-bold text-xl text-charcoal mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl bg-plum-300/20">
                  <Home className="w-5 h-5 text-plum-600 mb-2" />
                  <span className="block text-sm text-plum-600">Property Type</span>
                  <span className="font-semibold text-charcoal capitalize">{property.propertyType}</span>
                </div>
                <div className="p-4 rounded-xl bg-plum-300/20">
                  <Calendar className="w-5 h-5 text-plum-600 mb-2" />
                  <span className="block text-sm text-plum-600">Year Built</span>
                  <span className="font-semibold text-charcoal">{property.yearBuilt}</span>
                </div>
                <div className="p-4 rounded-xl bg-plum-300/20">
                  <Clock className="w-5 h-5 text-plum-600 mb-2" />
                  <span className="block text-sm text-plum-600">Listed</span>
                  <span className="font-semibold text-charcoal">{new Date(property.listedDate).toLocaleDateString('es-MX')}</span>
                </div>
                <div className="p-4 rounded-xl bg-plum-300/20">
                  <Building className="w-5 h-5 text-plum-600 mb-2" />
                  <span className="block text-sm text-plum-600">Status</span>
                  <span className="font-semibold text-charcoal capitalize">{property.status}</span>
                </div>
                <div className="p-4 rounded-xl bg-plum-300/20">
                  <Eye className="w-5 h-5 text-plum-600 mb-2" />
                  <span className="block text-sm text-plum-600">Views</span>
                  <span className="font-semibold text-charcoal">{Math.floor(Math.random() * 500 + 100)}</span>
                </div>
                <div className="p-4 rounded-xl bg-plum-300/20">
                  <Calendar className="w-5 h-5 text-plum-600 mb-2" />
                  <span className="block text-sm text-plum-600">Last Updated</span>
                  <span className="font-semibold text-charcoal">{new Date().toLocaleDateString('es-MX')}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right 20% - Sidebar */}
          <div className="col-span-4 max-lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-40 space-y-6"
            >
              {/* Agent Card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-charcoal/5 border border-plum-300/30">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-heading font-semibold text-charcoal">{agent.name}</h3>
                    <p className="text-sm text-plum-600">{agent.agency}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-charcoal">{agent.rating}</span>
                      <span className="text-sm text-plum-500">({agent.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <button className="w-full py-4 rounded-xl bg-gradient-to-r from-plum-700 to-plum-900 text-white font-semibold hover:shadow-lg hover:shadow-plum-700/30 transition-all flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Agent
                  </button>
                  <button className="w-full py-4 rounded-xl border-2 border-plum-700 text-plum-700 font-semibold hover:bg-plum-700 hover:text-white transition-all flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Request a Tour
                  </button>
                </div>

                <div className="space-y-3">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-3 text-plum-600 hover:text-plum-700 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{agent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-3 text-plum-600 hover:text-plum-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{agent.email}</span>
                  </a>
                </div>
              </div>

              {/* Schedule Tour */}
              <div className="bg-plum-300/20 rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-charcoal mb-4">Schedule a Tour</h3>
                <div className="space-y-3">
                  <button className="w-full py-3 rounded-xl bg-white border border-plum-300/50 text-charcoal font-medium hover:border-plum-700 transition-colors">
                    Today at 2:00 PM
                  </button>
                  <button className="w-full py-3 rounded-xl bg-white border border-plum-300/50 text-charcoal font-medium hover:border-plum-700 transition-colors">
                    Tomorrow at 10:00 AM
                  </button>
                  <button className="w-full py-3 rounded-xl bg-white border border-plum-300/50 text-charcoal font-medium hover:border-plum-700 transition-colors">
                    Tomorrow at 3:00 PM
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="py-16 bg-gradient-to-b from-plum-300/20 to-white">
        <div className="mx-[150px] max-xl:mx-8 max-lg:mx-6">
          <h2 className="font-heading font-bold text-2xl text-charcoal mb-8">Similar Properties Nearby</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {similarProperties.map((p, index) => (
              <ListingCard key={p.id} property={p} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Full Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center"
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={property.images[activeImageIndex]}
              alt={`${property.title} - Image ${activeImageIndex + 1}`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeImageIndex
                      ? 'w-8 bg-white'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
