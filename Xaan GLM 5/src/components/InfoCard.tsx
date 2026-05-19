import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  index?: number;
}

export default function InfoCard({ icon: Icon, title, description, gradient, index = 0 }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl shadow-charcoal/5 hover:shadow-2xl hover:shadow-plum-900/10 transition-all duration-500 border border-plum-300/30">
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${gradient}`}
        />

        {/* Icon */}
        <div className="relative mb-6">
          <div
            className={`w-16 h-16 rounded-2xl ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <h3 className="font-heading font-bold text-xl text-charcoal mb-3 group-hover:text-plum-700 transition-colors">
            {title}
          </h3>
          <p className="text-plum-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative Corner */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-plum-300/20 to-transparent group-hover:scale-150 transition-transform duration-700" />
      </div>
    </motion.div>
  );
}
