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
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-[#CCC2ED]/30">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-4">
          <Link
            to="/find-agent"
            className="flex items-center gap-2 text-[#5B25C1] hover:text-[#221854] font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Agents
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <div className="bg-gradient-to-r from-[#221854] to-[#5B25C1] rounded-3xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <img
              src={agent.photo}
              alt={agent.name}
              className="w-40 h-40 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="font-bold text-3xl text-white mb-2">{agent.name}</h1>
              <p className="text-[#CCC2ED] mb-4">{agent.agency}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-semibold">{agent.rating}</span>
                <span className="text-[#CCC2ED]">({agent.reviewCount} reviews)</span>
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
              <button className="px-6 py-3 rounded-xl bg-white text-[#5B25C1] font-semibold hover:shadow-xl transition-all flex items-center gap-2">
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
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md text-center"
            >
              <stat.icon className="w-8 h-8 text-[#5B25C1] mx-auto mb-3" />
              <span className="block text-3xl font-bold text-[#141821]">{stat.value}</span>
              <span className="text-sm text-[#756791]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        <div className="flex items-center gap-4 border-b border-[#F2E7F6] mb-8">
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
                  ? 'text-[#5B25C1]'
                  : 'text-[#756791] hover:text-[#5B25C1]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B25C1]"
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
                <p className="text-[#756791]">No active listings at the moment.</p>
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
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-[#141821]">{review.author}</h4>
                    <span className="text-sm text-[#756791]">{new Date(review.date).toLocaleDateString('es-MX')}</span>
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
                <p className="text-[#756791]">{review.text}</p>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-md"
            >
              <h3 className="font-semibold text-xl text-[#141821] mb-4">About {agent.name}</h3>
              <p className="text-[#756791] leading-relaxed mb-6">{agent.bio}</p>

              <h4 className="font-semibold text-lg text-[#141821] mb-3">Specialties</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {agent.specialties.map((specialty, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-[#F2E7F6] text-[#5B25C1] font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <h4 className="font-semibold text-lg text-[#141821] mb-3">Contact Information</h4>
              <div className="space-y-3">
                <a
                  href={`tel:${agent.phone}`}
                  className="flex items-center gap-3 text-[#5B25C1] hover:text-[#221854] transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {agent.phone}
                </a>
                <a
                  href={`mailto:${agent.email}`}
                  className="flex items-center gap-3 text-[#5B25C1] hover:text-[#221854] transition-colors"
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
