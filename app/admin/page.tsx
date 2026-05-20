'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users, Home, FileText, Shield,
  Plus, Edit, Trash2, Eye, CheckCircle,
  LayoutDashboard, Building2, Newspaper, UserCog
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  totalUsers: number;
  totalAgents: number;
  totalProperties: number;
  activeProperties: number;
  totalBlogs: number;
  publishedBlogs: number;
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'blogs' | 'users'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setStats(data.stats))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        if (activeTab === 'properties') {
          const res = await fetch('/api/properties?limit=50');
          const data = await res.json();
          setProperties(data.properties || []);
        } else if (activeTab === 'blogs') {
          const res = await fetch('/api/blogs?limit=50');
          const data = await res.json();
          setBlogs(data.posts || []);
        } else if (activeTab === 'users') {
          const res = await fetch('/api/admin/users?limit=50');
          const data = await res.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeTab]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 rounded-full border-4 border-[#5B25C1] border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'bg-[#5B25C1]' },
    { label: 'Total Agents', value: stats?.totalAgents || 0, icon: Building2, color: 'bg-[#221854]' },
    { label: 'Properties', value: stats?.totalProperties || 0, icon: Home, color: 'bg-[#5B25C1]' },
    { label: 'Active Listings', value: stats?.activeProperties || 0, icon: CheckCircle, color: 'bg-[#221854]' },
    { label: 'Blog Posts', value: stats?.totalBlogs || 0, icon: Newspaper, color: 'bg-[#5B25C1]' },
    { label: 'Published', value: stats?.publishedBlogs || 0, icon: Eye, color: 'bg-[#221854]' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-16">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#141821]">Admin Dashboard</h1>
          <p className="text-[#756791] mt-1">Manage your rental platform</p>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'properties', label: 'Properties', icon: Home },
            { id: 'blogs', label: 'Blog Posts', icon: FileText },
            { id: 'users', label: 'Users', icon: UserCog },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#221854] text-white shadow-md' : 'bg-white text-[#756791] hover:bg-[#F5F3EF] border border-[#E8E5DF]'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E5DF]">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-[#141821]">{stat.value}</div>
                  <div className="text-sm text-[#756791]">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/rentals/short-term" className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E5DF] hover:shadow-md transition-shadow">
                <Home className="w-8 h-8 text-[#5B25C1] mb-4" />
                <h3 className="font-semibold text-[#141821]">Browse Properties</h3>
                <p className="text-sm text-[#756791] mt-1">View all rental listings</p>
              </Link>
              <Link href="/blog" className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E5DF] hover:shadow-md transition-shadow">
                <Newspaper className="w-8 h-8 text-[#5B25C1] mb-4" />
                <h3 className="font-semibold text-[#141821]">View Blog</h3>
                <p className="text-sm text-[#756791] mt-1">See published articles</p>
              </Link>
              <div className="bg-gradient-to-br from-[#221854] to-[#5B25C1] rounded-2xl p-6 text-white">
                <Shield className="w-8 h-8 mb-4" />
                <h3 className="font-semibold">Admin Access</h3>
                <p className="text-sm text-white/70 mt-1">Role: {user.role}</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'properties' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-[#E8E5DF] overflow-hidden">
            <div className="p-6 border-b border-[#E8E5DF] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#141821]">All Properties</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#221854] text-white text-sm font-medium hover:bg-[#5B25C1] transition-colors">
                <Plus className="w-4 h-4" />Add Property
              </button>
            </div>
            {loading ? (
              <div className="p-8 text-center text-[#756791]">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5F3EF]">
                    <tr>
                      {['Property', 'Type', 'Price', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#756791] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DF]">
                    {properties.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F5F3EF] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#E8E5DF] overflow-hidden">
                              {p.images && <img src={typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images[0]} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div>
                              <div className="font-medium text-[#141821] text-sm">{p.title}</div>
                              <div className="text-xs text-[#756791]">{p.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium bg-[#F5F3EF] ${p.price_type === 'short_term' ? 'text-[#5B25C1]' : 'text-[#221854]'}`}>
                            {p.price_type === 'short_term' ? 'Short-term' : 'Long-term'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#141821]">${Number(p.price).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-100 text-green-800' : p.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-[#F5F3EF] text-[#756791]'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/property/${p.id}`} className="p-1.5 rounded-lg hover:bg-[#F5F3EF] text-[#756791] hover:text-[#141821]"><Eye className="w-4 h-4" /></Link>
                            <button className="p-1.5 rounded-lg hover:bg-[#F5F3EF] text-[#756791] hover:text-[#5B25C1]"><Edit className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-[#756791] hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'blogs' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-[#E8E5DF] overflow-hidden">
            <div className="p-6 border-b border-[#E8E5DF] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#141821]">Blog Posts</h2>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#221854] text-white text-sm font-medium hover:bg-[#5B25C1] transition-colors">
                <Plus className="w-4 h-4" />Add Post
              </button>
            </div>
            {loading ? (
              <div className="p-8 text-center text-[#756791]">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5F3EF]">
                    <tr>
                      {['Post', 'Status', 'Date', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#756791] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DF]">
                    {blogs.map((post) => (
                      <tr key={post.id} className="hover:bg-[#F5F3EF] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#141821] text-sm">{post.title}</div>
                          <div className="text-xs text-[#756791]">/{post.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#756791]">
                          {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/blog/${post.slug}`} className="p-1.5 rounded-lg hover:bg-[#F5F3EF] text-[#756791] hover:text-[#141821]"><Eye className="w-4 h-4" /></Link>
                            <button className="p-1.5 rounded-lg hover:bg-[#F5F3EF] text-[#756791] hover:text-[#5B25C1]"><Edit className="w-4 h-4" /></button>
                            <button className="p-1.5 rounded-lg hover:bg-red-50 text-[#756791] hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-[#E8E5DF] overflow-hidden">
            <div className="p-6 border-b border-[#E8E5DF]">
              <h2 className="text-lg font-semibold text-[#141821]">All Users</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-[#756791]">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5F3EF]">
                    <tr>
                      {['User', 'Role', 'Joined', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#756791] uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E5DF]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#F5F3EF] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#221854] to-[#5B25C1] flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{(u.display_name || u.email || 'U').charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="font-medium text-[#141821] text-sm">{u.display_name || 'Unnamed'}</div>
                              <div className="text-xs text-[#756791]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-red-100 text-red-800' : u.role === 'agent' ? 'bg-[#F5F3EF] text-[#5B25C1]' : 'bg-[#F5F3EF] text-[#756791]'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#756791]">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button className="p-1.5 rounded-lg hover:bg-[#F5F3EF] text-[#756791] hover:text-[#5B25C1]"><Edit className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
