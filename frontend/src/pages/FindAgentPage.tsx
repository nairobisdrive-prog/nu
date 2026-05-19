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
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.06em] text-[#141821] mb-4">
            Find Your Perfect Agent
          </h1>
          <p className="text-[#756791] text-lg max-w-2xl mx-auto">
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
          <div className="bg-white rounded-2xl shadow-md p-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#756791]" />
              <input
                type="text"
                placeholder="Search by name or agency"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F5F3EF] border border-[#CCC2ED]/50 focus:border-[#5B25C1] focus:outline-none text-[#141821]"
              />
            </div>
            <div className="relative min-w-[180px]">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#756791]" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-12 pr-8 py-3 rounded-xl bg-[#F5F3EF] border border-[#CCC2ED]/50 focus:border-[#5B25C1] focus:outline-none text-[#141821] appearance-none cursor-pointer"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#756791] pointer-events-none" />
            </div>
            <div className="relative min-w-[180px]">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#756791]" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full pl-12 pr-8 py-3 rounded-xl bg-[#F5F3EF] border border-[#CCC2ED]/50 focus:border-[#5B25C1] focus:outline-none text-[#141821] appearance-none cursor-pointer"
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#756791] pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Agents Grid */}
      <section className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#756791] text-lg">No agents found matching your criteria.</p>
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
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-500 group"
    >
      <Link to={`/agent/${agent.id}`}>
        <div className="relative h-48 bg-gradient-to-br from-[#221854] to-[#5B25C1]">
          <img
            src={agent.photo}
            alt={agent.name}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
          />
        </div>

        <div className="pt-16 pb-6 px-6 text-center">
          <h3 className="font-semibold text-lg text-[#141821] group-hover:text-[#5B25C1] transition-colors">
            {agent.name}
          </h3>
          <p className="text-sm text-[#756791] mb-3">{agent.agency}</p>

          <div className="flex items-center justify-center gap-1 mb-4">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-[#141821]">{agent.rating}</span>
            <span className="text-[#756791] text-sm">({agent.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-[#756791] mb-4">
            <span>{agent.listings} listings</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {agent.specialties.slice(0, 2).map((specialty, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-[#F2E7F6] text-[#523575] text-xs font-medium"
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
