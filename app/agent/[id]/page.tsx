'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Phone, Mail, ChevronLeft, MessageCircle, Award, TrendingUp, Home, Calendar } from 'lucide-react';
import { agentsApi } from '@/lib/api';

const reviews = [
  { id: 1, author: 'Juan Pérez', rating: 5, date: '2024-01-15', text: 'Exceptional throughout our home buying journey. Their knowledge of the market and dedication to finding us the perfect home was outstanding.' },
  { id: 2, author: 'Ana García', rating: 5, date: '2024-01-10', text: 'Professional, responsive, and truly cares about their clients. Highly recommend!' },
  { id: 3, author: 'Roberto López', rating: 4, date: '2024-01-05', text: 'Great experience. Helped us sell our property quickly and at a great price.' },
];

export default function AgentProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings');

  useEffect(() => {
    if (!id) return;
    agentsApi.get(id)
      .then((data: any) => setAgent(data.agent || data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-16 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#5B25C1] border-t-transparent" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] pt-16 flex flex-col items-center justify-center gap-4">
        <p className="text-[#756791] text-lg">Agent not found.</p>
        <Link href="/find-agent" className="text-[#5B25C1] font-medium hover:underline">Back to agents</Link>
      </div>
    );
  }

  const stats = [
    { label: 'Active Listings', value: agent.active_listings || agent.listings || 0, icon: Home },
    { label: 'Properties Sold', value: Math.floor((agent.active_listings || agent.listings || 10) * 3.5), icon: Award },
    { label: 'Years Experience', value: 12, icon: Calendar },
    { label: 'Avg. Days on Market', value: 18, icon: TrendingUp },
  ];

  const specialties = typeof agent.specialties === 'string'
    ? JSON.parse(agent.specialties)
    : (agent.specialties || []);

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-[#CCC2ED]/30">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-4">
          <Link href="/find-agent" className="flex items-center gap-2 text-[#5B25C1] hover:text-[#221854] font-medium w-fit">
            <ChevronLeft className="w-5 h-5" />Back to Agents
          </Link>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <div className="bg-gradient-to-r from-[#221854] to-[#5B25C1] rounded-3xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            {agent.photo && (
              <img src={agent.photo} alt={agent.name} className="w-40 h-40 rounded-2xl object-cover border-4 border-white/20 shadow-2xl" />
            )}
            <div className="text-center md:text-left flex-1">
              <h1 className="font-bold text-3xl text-white mb-2">{agent.name}</h1>
              {agent.agency && <p className="text-[#CCC2ED] mb-4">{agent.agency}</p>}
              {agent.rating && (
                <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">{agent.rating}</span>
                  {agent.review_count && <span className="text-[#CCC2ED]">({agent.review_count} reviews)</span>}
                </div>
              )}
              {specialties.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {specialties.map((s: string, i: number) => (
                    <span key={i} className="px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {agent.phone && (
                <a href={`tel:${agent.phone}`} className="px-6 py-3 rounded-xl bg-white text-[#5B25C1] font-semibold hover:shadow-xl transition-all flex items-center gap-2">
                  <Phone className="w-5 h-5" />Call Agent
                </a>
              )}
              {agent.email && (
                <a href={`mailto:${agent.email}`} className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />Send Message
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-md text-center">
              <stat.icon className="w-8 h-8 text-[#5B25C1] mx-auto mb-3" />
              <span className="block text-3xl font-bold text-[#141821]">{stat.value}</span>
              <span className="text-sm text-[#756791]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-8">
        <div className="flex items-center gap-4 border-b border-[#F2E7F6] mb-8">
          {[{ id: 'listings', label: 'Listings' }, { id: 'reviews', label: 'Reviews' }, { id: 'about', label: 'About' }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-medium transition-colors relative ${activeTab === tab.id ? 'text-[#5B25C1]' : 'text-[#756791] hover:text-[#5B25C1]'}`}>
              {tab.label}
              {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5B25C1]" />}
            </button>
          ))}
        </div>

        {activeTab === 'listings' && (
          <div className="text-center py-12">
            <p className="text-[#756791]">No active listings at the moment.</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-[#141821]">{review.author}</h4>
                    <span className="text-sm text-[#756791]">{new Date(review.date).toLocaleDateString('es-MX')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-md">
              <h3 className="font-semibold text-xl text-[#141821] mb-4">About {agent.name}</h3>
              {agent.bio && <p className="text-[#756791] leading-relaxed mb-6">{agent.bio}</p>}
              {specialties.length > 0 && (
                <>
                  <h4 className="font-semibold text-lg text-[#141821] mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {specialties.map((s: string, i: number) => (
                      <span key={i} className="px-4 py-2 rounded-full bg-[#F2E7F6] text-[#5B25C1] font-medium">{s}</span>
                    ))}
                  </div>
                </>
              )}
              <h4 className="font-semibold text-lg text-[#141821] mb-3">Contact Information</h4>
              <div className="space-y-3">
                {agent.phone && (
                  <a href={`tel:${agent.phone}`} className="flex items-center gap-3 text-[#5B25C1] hover:text-[#221854] transition-colors">
                    <Phone className="w-5 h-5" />{agent.phone}
                  </a>
                )}
                {agent.email && (
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-3 text-[#5B25C1] hover:text-[#221854] transition-colors">
                    <Mail className="w-5 h-5" />{agent.email}
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </div>
  );
}
