import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Key, TrendingUp, Shield, Zap, Database } from 'lucide-react';
import Hero3D from '../components/Hero3D';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import InfoCard from '../components/InfoCard';
import { properties } from '../data/mockData';

export default function HomePage() {
  const recentProperties = properties.slice(0, 4);

  return (
    <div>
      {/* 3D Hero Section */}
      <Hero3D />

      {/* Search Section */}
      <section className="relative -mt-20 z-20 px-6">
        <SearchBar />
      </section>

      {/* Recently Listed */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading font-bold text-4xl text-charcoal mb-4">
              Recently Listed Near You
            </h2>
            <p className="text-plum-600 text-lg max-w-2xl mx-auto">
              Discover the latest properties added to our comprehensive database
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProperties.map((property, index) => (
              <ListingCard key={property.id} property={property} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-plum-700 text-plum-700 font-semibold hover:bg-plum-700 hover:text-white transition-all duration-300"
            >
              View All Properties
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-plum-300/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading font-bold text-4xl text-charcoal mb-4">
              Everything You Need
            </h2>
            <p className="text-plum-600 text-lg max-w-2xl mx-auto">
              Whether you're buying, renting, or selling, we've got you covered
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard
              icon={Home}
              title="Buy a Home"
              description="Browse thousands of homes across Mexico. Our comprehensive database ensures you won't miss your perfect property."
              gradient="bg-gradient-to-br from-plum-700 to-plum-900"
              index={0}
            />
            <InfoCard
              icon={Key}
              title="Rent a Home"
              description="Find your ideal rental with verified listings and direct contact to landlords and property managers."
              gradient="bg-gradient-to-br from-plum-600 to-plum-800"
              index={1}
            />
            <InfoCard
              icon={TrendingUp}
              title="Sell Your Property"
              description="List your property and reach millions of potential buyers. Get the best price with our market insights."
              gradient="bg-gradient-to-br from-plum-500 to-plum-700"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading font-bold text-4xl text-charcoal mb-6">
                All Homes & Condos in One
                <span className="gradient-text"> Updated Database</span>
              </h2>
              <p className="text-plum-600 text-lg leading-relaxed mb-8">
                Stop wasting time searching through countless broker websites, Facebook Marketplace listings, 
                and driving around looking for "Se Vende" signs. Xa'an aggregates 90%+ of all active listings 
                across Mexico in real-time, so you never miss an opportunity.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Database, text: '90%+ of all active listings in Mexico' },
                  { icon: Zap, text: 'Real-time updates from all major sources' },
                  { icon: Shield, text: 'Verified listings with accurate information' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-plum-700 to-plum-900 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-charcoal font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-charcoal/20">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
                  alt="Beautiful Mexican home"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl font-heading font-bold text-charcoal">$12,500,000</span>
                      <span className="px-3 py-1 rounded-full bg-plum-700 text-white text-sm font-medium">For Sale</span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-charcoal mb-1">Modern Villa in Polanco</h3>
                    <p className="text-plum-600">Mexico City, CDMX</p>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4"
              >
                <div className="text-center">
                  <span className="text-3xl font-heading font-bold gradient-text">15K+</span>
                  <p className="text-sm text-plum-600">Active Listings</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-plum-700 via-plum-800 to-plum-900 p-12 md:p-16"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]" />
            </div>

            <div className="relative text-center">
              <h2 className="font-heading font-bold text-4xl text-white mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-plum-300 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of happy homeowners who found their perfect property through Xa'an
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/listings"
                  className="px-8 py-4 rounded-full bg-white text-plum-700 font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Browse Listings
                </Link>
                <Link
                  to="/find-agent"
                  className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Find an Agent
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
