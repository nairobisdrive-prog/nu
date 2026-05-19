import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Phone, Mail, MapPin, Home, Calendar,
  ChevronLeft, MessageCircle, Award, TrendingUp
} from 'lucide-react';
import { agents, properties } from '../data/mockData';
import ListingCard from '../components/ListingCard';

export default function AgentProfilePage() {
  const { id } = useParams();
  const agent = agents.find(a => a.id === id) || agents[0];
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings');

  const agentListings = properties.filter(p => p.agent.id === agent.id);

  const stats = [
    { label: 'Active Listings', value: agent.listings, icon: Home },
    { label: 'Properties Sold', value: Math.floor(agent.listings * 3.5), icon: Award },
    { label: 'Years Experience', value: 12, icon: Calendar },
    { label: 'Avg. Days on Market', value: 18, icon: TrendingUp }
  ];

  const reviews = [
    {
      id: 1,
      author: 'Juan Pérez',
      rating: 5,
      date: '2024-01-15',
      text: 'María was exceptional throughout our home buying journey. Her knowledge of the market and dedication to finding us the perfect home was outstanding.'
    },
    {
      id: 2,
      author: 'Ana García',
      rating: 5,
      date: '2024-01-10',
      text: 'Professional, responsive, and truly cares about her clients. Highly recommend!'
    },
    {
      id: 3,
      author: 'Roberto López',
      rating: 4,
      date: '2024-01-05',
      text: 'Great experience working with María. She helped us sell our property quickly and at a great price.'
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-xl border-b border-plum-300/30">
        <div className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-4">
          <Link
            to="/find-agent"
            className="flex items-center gap-2 text-plum-600 hover:text-plum-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Agents
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-12">
        <div className="bg-gradient-to-r from-plum-700 to-plum-900 rounded-3xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <img
              src={agent.photo}
              alt={agent.name}
              className="w-40 h-40 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="font-heading font-bold text-3xl text-white mb-2">{agent.name}</h1>
              <p className="text-plum-300 mb-4">{agent.agency}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{agent.rating}</span>
                <span className="text-plum-300">({agent.reviewCount} reviews)</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {agent.specialties.map((specialty, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button className="px-6 py-3 rounded-xl bg-white text-plum-700 font-semibold hover:shadow-xl transition-all flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call Agent
              </button>
              <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-charcoal/5 border border-plum-300/30 text-center"
            >
              <stat.icon className="w-8 h-8 text-plum-600 mx-auto mb-3" />
              <span className="block text-3xl font-heading font-bold text-charcoal">{stat.value}</span>
              <span className="text-sm text-plum-600">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-8">
        <div className="flex items-center gap-4 border-b border-plum-300/50 mb-8">
          {[
            { id: 'listings', label: 'Listings' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'about', label: 'About' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-4 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-plum-700'
                  : 'text-plum-600 hover:text-plum-700'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-plum-700"
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentListings.map((property, index) => (
              <ListingCard key={property.id} property={property} index={index} />
            ))}
            {agentListings.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-plum-600">No active listings at the moment.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-charcoal/5 border border-plum-300/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-charcoal">{review.author}</h4>
                    <span className="text-sm text-plum-500">{new Date(review.date).toLocaleDateString('es-MX')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-plum-600">{review.text}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg shadow-charcoal/5 border border-plum-300/30"
            >
              <h3 className="font-heading font-semibold text-xl text-charcoal mb-4">About {agent.name}</h3>
              <p className="text-plum-600 leading-relaxed mb-6">{agent.bio}</p>

              <h4 className="font-heading font-semibold text-lg text-charcoal mb-3">Specialties</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {agent.specialties.map((specialty, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-plum-300/50 text-plum-700 font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <h4 className="font-heading font-semibold text-lg text-charcoal mb-3">Contact Information</h4>
              <div className="space-y-3">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-3 text-plum-600 hover:text-plum-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {agent.phone}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-3 text-plum-600 hover:text-plum-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {agent.email}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
}
