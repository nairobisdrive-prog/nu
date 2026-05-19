import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Home, ChevronDown } from 'lucide-react';
import { agents, Agent } from '../data/mockData';

export default function FindAgentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const specialties = ['Luxury Homes', 'Beachfront', 'Family Homes', 'Investment Properties', 'Vacation Homes', 'First-time Buyers'];
  const cities = ['Mexico City', 'Cancún', 'Guadalajara', 'Monterrey', 'Tulum', 'San Miguel de Allende', 'Puebla'];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.agency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || agent.specialties.includes(selectedSpecialty);
    const matchesCity = !selectedCity || agent.specialties.some(s => s.includes(selectedCity));
    return matchesSearch && matchesSpecialty && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-plum-300/20 to-white pt-24">
      {/* Hero */}
      <section className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading font-bold text-4xl text-charcoal mb-4">
            Find Your Perfect Agent
          </h1>
          <p className="text-plum-600 text-lg max-w-2xl mx-auto">
            Connect with top-rated real estate professionals across Mexico
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl shadow-charcoal/5 p-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600" />
              <input
                type="text"
                placeholder="Search by name or agency"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
              />
            </div>
            <div className="relative min-w-[180px]">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-12 pr-8 py-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal appearance-none cursor-pointer"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600 pointer-events-none" />
            </div>
            <div className="relative min-w-[180px]">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-12 pr-8 py-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal appearance-none cursor-pointer"
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-plum-600 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Agents Grid */}
      <section className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-plum-600 text-lg">No agents found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-charcoal/5 hover:shadow-xl hover:shadow-plum-900/10 transition-all duration-500 group"
    >
      <Link to={`/agent/${agent.id}`}>
        <div className="relative h-48 bg-gradient-to-br from-plum-300 to-plum-400">
          <img
            src={agent.photo}
            alt={agent.name}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
          />
        </div>

        <div className="pt-16 pb-6 px-6 text-center">
          <h3 className="font-heading font-semibold text-lg text-charcoal group-hover:text-plum-700 transition-colors">
            {agent.name}
          </h3>
          <p className="text-sm text-plum-600 mb-3">{agent.agency}</p>

          <div className="flex items-center justify-center gap-1 mb-4">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-charcoal">{agent.rating}</span>
            <span className="text-plum-500 text-sm">({agent.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-plum-600 mb-4">
            <span>{agent.listings} listings</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {agent.specialties.slice(0, 2).map((specialty, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-plum-300/50 text-plum-700 text-xs font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
