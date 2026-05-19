import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Search, Bell, Settings, User, Home,
  MapPin, Calendar, ChevronRight, Plus, Trash2, Edit
} from 'lucide-react';
import { properties, Property } from '../data/mockData';
import ListingCard from '../components/ListingCard';

type Tab = 'saved' | 'searches' | 'alerts' | 'settings';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('saved');
  const [savedProperties, setSavedProperties] = useState<Property[]>(properties.slice(0, 3));
  const [savedSearches, setSavedSearches] = useState([
    { id: 1, query: 'Polanco, Mexico City', type: 'sale', minPrice: 10000000, maxPrice: 20000000, bedrooms: 3 },
    { id: 2, query: 'Cancún Beachfront', type: 'rent', minPrice: 30000, maxPrice: 60000, bedrooms: 4 },
  ]);
  const [alerts, setAlerts] = useState([
    { id: 1, frequency: 'daily', active: true, searchId: 1 },
    { id: 2, frequency: 'weekly', active: true, searchId: 2 },
  ]);

  const tabs = [
    { id: 'saved', label: 'Saved Properties', icon: Heart, count: savedProperties.length },
    { id: 'searches', label: 'Saved Searches', icon: Search, count: savedSearches.length },
    { id: 'alerts', label: 'Email Alerts', icon: Bell, count: alerts.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-plum-300/20 to-white pt-24">
      <div className="mx-[150px] max-xl:mx-8 max-lg:mx-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-plum-700 to-plum-900 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-charcoal">Welcome back!</h1>
              <p className="text-plum-600">Manage your saved properties and alerts</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3 max-lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg shadow-charcoal/5 border border-plum-300/30 overflow-hidden"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center justify-between p-4 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-plum-700 text-white'
                      : 'text-charcoal hover:bg-plum-300/30'
                  }`}
                >
                  <div className="flex items-center gap-3">\n                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      activeTab === tab.id
                        ? 'bg-white/20'
                        : 'bg-plum-300/50'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="col-span-9 max-lg:col-span-12">
            {activeTab === 'saved' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="font-heading font-semibold text-xl text-charcoal mb-6">Saved Properties</h2>
                {savedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedProperties.map((property, index) => (
                      <div key={property.id} className="relative">
                        <ListingCard property={property} index={index} />
                        <button
                          onClick={() => setSavedProperties(savedProperties.filter(p => p.id !== property.id))}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-20"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg shadow-charcoal/5 border border-plum-300/30">
                    <Heart className="w-16 h-16 text-plum-400 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-charcoal mb-2">No saved properties yet</h3>
                    <p className="text-plum-600 mb-6">Start browsing and save your favorite properties</p>
                    <a
                      href="/listings"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-plum-700 text-white font-medium hover:bg-plum-800 transition-colors"
                    >
                      Browse Properties
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'searches' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading font-semibold text-xl text-charcoal">Saved Searches</h2>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-plum-700 text-white font-medium hover:bg-plum-800 transition-colors">
                    <Plus className="w-5 h-5" />
                    New Search
                  </button>
                </div>

                {savedSearches.length > 0 ? (
                  <div className="space-y-4">
                    {savedSearches.map((search, index) => (
                      <motion.div
                        key={search.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg shadow-charcoal/5 border border-plum-300/30 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-plum-300/50 flex items-center justify-center">
                            <Search className="w-6 h-6 text-plum-700" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-charcoal flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-plum-600" />
                              {search.query}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-plum-600">
                              <span className="capitalize">{search.type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                              <span>${(search.minPrice / 1000000).toFixed(0)}M - ${(search.maxPrice / 1000000).toFixed(0)}M MXN</span>
                              <span>{search.bedrooms}+ beds</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="w-10 h-10 rounded-full bg-plum-300/50 flex items-center justify-center text-plum-700 hover:bg-plum-300 transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setSavedSearches(savedSearches.filter(s => s.id !== search.id))}
                            className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-plum-700 text-white font-medium hover:bg-plum-800 transition-colors">
                            View Results
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg shadow-charcoal/5 border border-plum-300/30">
                    <Search className="w-16 h-16 text-plum-400 mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-charcoal mb-2">No saved searches yet</h3>
                    <p className="text-plum-600 mb-6">Save your search criteria to quickly find properties later</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'alerts' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="font-heading font-semibold text-xl text-charcoal mb-6">Email Alerts</h2>

                <div className="space-y-4">
                  {alerts.map((alert, index) => {
                    const search = savedSearches.find(s => s.id === alert.searchId);
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-lg shadow-charcoal/5 border border-plum-300/30 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            alert.active ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <Bell className={`w-6 h-6 ${alert.active ? 'text-green-600' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-charcoal">{search?.query || 'Unknown Search'}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-plum-600">
                              <Calendar className="w-4 h-4" />
                              <span className="capitalize">{alert.frequency} alerts</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                alert.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {alert.active ? 'Active' : 'Paused'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={alert.frequency}
                            onChange={(e) => setAlerts(alerts.map(a =>
                              a.id === alert.id ? { ...a, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' } : a
                            ))}
                            className="px-4 py-2 rounded-lg bg-plum-300/30 border border-plum-300/50 focus:outline-none text-charcoal"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                          <button
                            onClick={() => setAlerts(alerts.map(a =>
                              a.id === alert.id ? { ...a, active: !a.active } : a
                            ))}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              alert.active
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {alert.active ? 'Pause' : 'Resume'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="font-heading font-semibold text-xl text-charcoal mb-6">Account Settings</h2>

                <div className="bg-white rounded-2xl p-8 shadow-lg shadow-charcoal/5 border border-plum-300/30 space-y-8">
                  <div>
                    <h3 className="font-semibold text-charcoal mb-4">Profile Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-plum-600 mb-2">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-plum-600 mb-2">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-plum-600 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue="john.doe@example.com"
                          className="w-full px-4 py-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-plum-600 mb-2">Phone</label>
                        <input
                          type="tel"
                          defaultValue="+52 55 1234 5678"
                          className="w-full px-4 py-3 rounded-xl bg-plum-300/30 border border-plum-300/50 focus:border-plum-700 focus:outline-none text-charcoal"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-plum-300/50">
                    <h3 className="font-semibold text-charcoal mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Email notifications for new listings', checked: true },
                        { label: 'Price drop alerts', checked: true },
                        { label: 'Weekly market reports', checked: false },
                        { label: 'Promotional emails', checked: false },
                      ].map((pref, i) => (
                        <label key={i} className="flex items-center justify-between cursor-pointer">
                          <span className="text-charcoal">{pref.label}</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              defaultChecked={pref.checked}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-plum-300 rounded-full peer peer-checked:bg-plum-700 transition-colors" />
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-plum-300/50 flex justify-end gap-4">
                    <button className="px-6 py-3 rounded-xl border border-plum-300/50 text-charcoal font-medium hover:border-plum-700 transition-colors">
                      Cancel
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-plum-700 text-white font-medium hover:bg-plum-800 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
