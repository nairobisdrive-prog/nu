import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const cards = [
    {
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
      z: 100,
      rotateY: -15,
      rotateX: 10,
      x: -250,
      y: 50
    },
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
      z: 50,
      rotateY: 20,
      rotateX: -5,
      x: 300,
      y: -30
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
      z: 0,
      rotateY: -10,
      rotateX: 15,
      x: -150,
      y: -80
    },
    {
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop',
      z: -50,
      rotateY: 25,
      rotateX: -10,
      x: 200,
      y: 100
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
      z: -100,
      rotateY: -20,
      rotateX: 5,
      x: 0,
      y: 150
    }
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-plum-300/30 via-white to-white"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-plum-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-plum-400/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-plum-400/30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0.3, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-plum-300/50 shadow-lg shadow-plum-900/5 mb-8"
        >
          <Sparkles className="w-4 h-4 text-plum-700" />
          <span className="text-sm font-medium text-plum-700">Mexico's #1 Real Estate Platform</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-charcoal leading-tight mb-6"
        >
          Find Your Dream Home
          <br />
          <span className="gradient-text">In Mexico</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-plum-600 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          The only platform with 90%+ of active listings in one place.
          No more searching broker sites, Facebook Marketplace, or street signs.
        </motion.p>
      </motion.div>

      {/* 3D Cards */}
      <div className="absolute inset-0 perspective-1000 pointer-events-none">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            style={{
              y: index === 0 ? y1 : index === 1 ? y2 : y3
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            className="absolute left-1/2 top-1/2 transform-style-3d"
          >
            <div
              className="relative w-[280px] h-[180px] rounded-2xl overflow-hidden shadow-2xl shadow-charcoal/20 border-2 border-white/50"
              style={{
                transform: `
                  translateX(${card.x + mousePosition.x * 30}px)
                  translateY(${card.y + mousePosition.y * 30}px)
                  translateZ(${card.z}px)
                  rotateY(${card.rotateY + mousePosition.x * 10}deg)
                  rotateX(${card.rotateX - mousePosition.y * 10}deg)
                `,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <img
                src={card.image}
                alt="Property"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-plum-600"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <ArrowDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
