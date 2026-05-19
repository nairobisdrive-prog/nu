import { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageAccordionProps {
  images: string[];
  labels?: string[];
  onImageClick?: (index: number) => void;
}

const defaultLabels = ['Facade', 'Living', 'Pool', 'Suite', 'Terrace', 'Kitchen', 'Garden', 'View'];

export default function ImageAccordion({ images, labels, onImageClick }: ImageAccordionProps) {
  const [active, setActive] = useState(0);
  const displayImages = images.slice(0, 5);
  const displayLabels = labels || defaultLabels;

  return (
    <div className="flex h-[560px] gap-3 overflow-hidden rounded-[38px] bg-[#141821] p-3">
      {displayImages.map((src, index) => (
        <motion.button
          key={src}
          onMouseEnter={() => setActive(index)}
          onClick={() => {
            setActive(index);
            onImageClick?.(index);
          }}
          animate={{ flex: active === index ? 5 : 1 }}
          transition={{ type: 'spring', stiffness: 110, damping: 22 }}
          className="relative min-w-0 overflow-hidden rounded-[28px] text-left"
        >
          <img src={src} alt={`Property view ${index + 1}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141821]/70 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <div className="text-sm font-semibold">0{index + 1}</div>
            {active === index && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-2xl font-semibold tracking-[-0.04em]"
              >
                {displayLabels[index] || 'View'}
              </motion.div>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
