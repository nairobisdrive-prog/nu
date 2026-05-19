import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { blogsApi } from '../lib/api';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        const data = await blogsApi.get(slug);
        setPost(data.post);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-3xl mx-auto px-4 animate-pulse">
          <div className="aspect-[16/9] bg-gray-200 rounded-2xl" />
          <div className="mt-8 h-8 bg-gray-200 rounded w-3/4" />
          <div className="mt-4 h-4 bg-gray-200 rounded w-1/2" />
          <div className="mt-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white pt-24">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <p className="text-gray-500 text-lg">Blog post not found.</p>
          <Link to="/blog" className="mt-4 inline-block text-[#5b25c1] font-medium hover:underline">
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100"
        >
          <img
            src={post.featured_image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=675&fit=crop'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            {post.tags && (
              <div className="flex gap-2">
                {(typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags).map((tag: string) => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#5b25c1]/10 text-[#5b25c1] text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{post.excerpt}</p>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#5b25c1] prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Share this article:</span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#1DA1F2] hover:text-white flex items-center justify-center transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#4267B2] hover:text-white flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#0077b5] hover:text-white flex items-center justify-center transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
