import { motion } from 'framer-motion';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  copy: string;
  cta: string;
  ctaHref?: string;
  index?: number;
}

export default function InfoCard({ icon: Icon, title, copy, cta, ctaHref = '#listings', index = 0 }: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-[34px] border border-white/70 bg-white/70 p-7 shadow-xl shadow-[#523575]/8 backdrop-blur-2xl"
    >
      {/* Decorative corner blur orb */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#ccc2ed]/50 blur-2xl transition group-hover:scale-150" />

      {/* Icon square */}
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-[#141821] text-white shadow-lg shadow-[#523575]/20">
        <Icon size={24} />
      </div>

      {/* Title */}
      <h3 className="relative mt-7 text-3xl font-semibold tracking-[-0.05em] text-[#141821]">
        {title}
      </h3>

      {/* Body */}
      <p className="relative mt-4 min-h-24 text-[16px] leading-7 text-[#756791]">
        {copy}
      </p>

      {/* CTA pill */}
      <a
        href={ctaHref}
        className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-[#f2e7f6] px-5 py-3 font-semibold text-[#50267a] transition group-hover:bg-[#141821] group-hover:text-white"
      >
        {cta}
        <ChevronRight size={17} />
      </a>
    </motion.div>
  );
}
