'use client';
import { useState } from 'react';

const ITEMS = [
  {
    title: 'Mazatlan\nRestaurants',
    image: '/reference_images/mazatlan restaurants.png',
  },
  {
    title: 'Things to Do\nin Mazatlan',
    image: '/reference_images/mazatlan-thngs to do.jpg',
  },
  {
    title: 'Mazatlan\nWeather',
    image: '/reference_images/mazatlan weather.jpg',
  },
  {
    title: 'Cost of Living\nin Mazatlan',
    image: '/reference_images/mazatlan cost of living.jpg',
  },
];

export const MazatlanGuideAccordion = () => {
  const [active, setActive] = useState(0);

  return (
    <div
      className="section"
      style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#0a0a0a' }}
    >
      {/* Background images — crossfade */}
      {ITEMS.map((item, idx) => (
        <img
          key={idx}
          src={item.image}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: active === idx ? 1 : 0,
            transition: 'opacity 0.9s ease',
            zIndex: 1,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.48)',
        zIndex: 2,
      }} />

      {/* 4 columns */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'row',
      }}>
        {ITEMS.map((item, idx) => {
          const isActive = active === idx;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRight: idx < ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              {/* Top line segment */}
              <div style={{
                flex: 1,
                width: 1,
                background: isActive ? 'rgba(255,255,255,0.55)' : 'transparent',
                transition: 'background 0.4s ease',
              }} />

              {/* Title — only this triggers the swap */}
              <div
                onMouseEnter={() => setActive(idx)}
                style={{ padding: '10px 24px', cursor: 'default' }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 38,
                  lineHeight: 1.1,
                  fontWeight: isActive ? 500 : 300,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  textAlign: 'center',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.35)',
                  transition: 'color 0.35s, font-weight 0.35s',
                  whiteSpace: 'pre-line',
                }}>
                  {item.title}
                </span>
              </div>

              {/* Bottom line segment */}
              <div style={{
                flex: 1,
                width: 1,
                background: isActive ? 'rgba(255,255,255,0.55)' : 'transparent',
                transition: 'background 0.4s ease',
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
