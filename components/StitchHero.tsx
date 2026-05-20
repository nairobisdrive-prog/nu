'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function StitchHero() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let offset = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gridSize = 40;
      offset = (offset + 0.3) % gridSize;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = offset; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = offset; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <>
      {/* Left Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 border-r border-gray-300 flex flex-col items-center py-6 z-50 bg-[#F1EFE9]">
        <div className="mb-12">
          <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <rect height="16" stroke="black" strokeWidth="2" width="16" x="4" y="4"></rect>
            <rect fill="black" height="6" width="6" x="9" y="9"></rect>
          </svg>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-12">
          <span className="vertical-text text-[10px] tracking-widest font-bold text-gray-400">2024 UI/UX</span>
          <span className="vertical-text text-xs tracking-[0.3em] font-bold text-[#5B25C1] uppercase">Mexico Real Estate</span>
        </div>
        <div className="mt-auto space-y-6">
          <button className="hover:opacity-60 transition-opacity">
            <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
          </button>
          <button className="hover:opacity-60 transition-opacity">
            <svg fill="currentColor" height="20" viewBox="0 0 256 256" width="20"><path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48ZM104,136H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path></svg>
          </button>
        </div>
      </aside>

      {/* Hero Wrapper */}
      <main className="ml-16 min-h-screen relative flex flex-col bg-white">
        {/* Header Nav */}
        <header className="relative flex items-center h-20 border-b border-gray-200">
          <div className="flex items-center pl-12 z-10">
            <img src="/xaan-logo.png" alt="XA'AN" className="h-10 w-auto object-contain" />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 w-[580px]">
            <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm h-11 overflow-hidden">
              <div className="flex items-center gap-0.5 pl-3 pr-3 border-r border-gray-200 flex-shrink-0">
                <Link href="/rentals/short-term" className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-[#221854] text-white">Short Term</Link>
                <Link href="/rentals/long-term" className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">Long Term</Link>
              </div>
              <div className="flex items-center gap-2 px-4 flex-1 min-w-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5B25C1" strokeWidth="2" className="flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input type="text" placeholder="Where to?" className="bg-transparent text-sm text-[#141821] placeholder-gray-400 outline-none border-0 ring-0 focus:ring-0 focus:outline-none w-full font-medium min-w-0"/>
              </div>
              <div className="flex items-center gap-2 px-3 flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#756791" strokeWidth="2" className="flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="text-sm text-gray-400 whitespace-nowrap">Any week</span>
              </div>
              <div className="flex items-center gap-2 px-3 flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#756791" strokeWidth="2" className="flex-shrink-0"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-sm text-gray-400">Guests</span>
              </div>
              <button className="h-11 w-11 flex-shrink-0 bg-[#5B25C1] flex items-center justify-center hover:bg-[#221854] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            </div>
          </div>

          <nav className="flex-1 flex items-center justify-end">
            <ul className="flex gap-10 text-xs font-bold tracking-widest uppercase mr-8">
              <li><a className="hover:text-[#5B25C1] transition-colors" href="#">Become a host</a></li>
              <li><a className="hover:text-[#5B25C1] transition-colors" href="#">FAQ</a></li>
            </ul>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="bg-[#5B25C1] text-white px-8 h-20 flex items-center gap-3 cta-polygon hover:pr-12 transition-all duration-300"
              >
                <span className="text-xs font-bold tracking-widest uppercase">Login</span>
                <svg fill="none" height="14" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="14"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div className={`${dropdownOpen ? '' : 'hidden'} absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50`}>
                <Link href="/login" className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#221854" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <p className="text-xs font-bold tracking-widest uppercase text-[#141821]">Agent / Host</p>
                </Link>
                <Link href="/login" className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#221854" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <p className="text-xs font-bold tracking-widest uppercase text-[#141821]">Guest</p>
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="flex-1 relative flex">
          <section className="w-1/2 pt-10 pl-12 flex flex-col z-10">
            <h1 className="text-[14rem] font-black leading-[0.8] tracking-tighter text-[#141821] mb-12">
              XA&apos;AN<br/>ONE
            </h1>
            <div className="max-w-md">
              <h2 className="text-[#5B25C1] text-4xl font-extrabold leading-tight mb-6">
                Real estate,<br/>redefined.
              </h2>
              <p className="text-sm leading-relaxed text-gray-700 font-medium">
                The only aggregate real estate platform in Mexico. We simplify the search by unifying individual broker sites and marketplaces into one technical interface.
              </p>
            </div>
            <div className="mt-auto dual-button">
              <button className="btn-main group">
                <span className="text-xs font-bold tracking-widest uppercase mr-4">Discover Xa&apos;an</span>
                <svg className="group-hover:translate-x-1 transition-transform" fill="none" height="18" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="18"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </button>
              <button className="btn-secondary group">
                <span className="text-xs font-bold tracking-widest uppercase mr-4">Watch film</span>
                <svg className="group-hover:scale-110 transition-transform" fill="none" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="20"><circle cx="12" cy="12" r="10"></circle><polygon fill="currentColor" points="10 8 16 12 10 16 10 8"></polygon></svg>
              </button>
            </div>
          </section>

          <section className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none">
            <div className="floating-circle absolute -right-20 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#5B25C1] rounded-full z-0"></div>
            <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>
            <div className="z-20 mr-24 space-y-16 text-white">
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center">
                  <svg fill="white" height="16" viewBox="0 0 256 256" width="16"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
                </div>
                <div className="border-b border-white/20 pb-4 w-64">
                  <span className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-80 block mb-1">Feature 01</span>
                  <h4 className="text-xs font-bold tracking-widest uppercase">Aggregate Search</h4>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center">
                  <svg fill="white" height="16" viewBox="0 0 256 256" width="16"><path d="M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Zm0,160H48V56H208V200ZM176,88a12,12,0,1,1-12-12A12,12,0,0,1,176,88Z"></path></svg>
                </div>
                <div className="border-b border-white/20 pb-4 w-64">
                  <span className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-80 block mb-1">Feature 02</span>
                  <h4 className="text-xs font-bold tracking-widest uppercase">Market Intelligence</h4>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center">
                  <svg fill="white" height="16" viewBox="0 0 256 256" width="16"><path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88a8,8,0,0,1-8,8H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24A8,8,0,0,1,168,128Z"></path></svg>
                </div>
                <div className="border-b border-white/20 pb-4 w-64">
                  <span className="text-[10px] tracking-[0.2em] font-bold uppercase opacity-80 block mb-1">Feature 03</span>
                  <h4 className="text-xs font-bold tracking-widest uppercase">Curated Portfolio</h4>
                </div>
              </div>
            </div>
            <div className="absolute left-1/2 bottom-20 w-[312px] pointer-events-auto -translate-x-[40%]">
              <div className="relative bg-black rounded-[36px] p-3 shadow-2xl border border-white/10 overflow-hidden group">
                <div className="flex justify-center mb-2">
                  <div className="w-16 h-1 bg-white/20 rounded-full"></div>
                </div>
                <img
                  alt="Architecture Wireframe"
                  className="w-full h-auto rounded-[24px] grayscale contrast-125 transition-all duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=800&fit=crop"
                />
                <div className="mt-2 text-center text-[8px] text-white/30 font-bold tracking-widest uppercase">VILLA — WIREFRAME 01</div>
              </div>
            </div>

            <div className="absolute bottom-12 right-6 w-[320px] bg-white/92 backdrop-blur-xl rounded-2xl border border-gray-200 z-30 pointer-events-auto overflow-hidden flex h-[130px]">
              <div className="flex-1 px-5 py-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black tracking-tighter uppercase mb-0.5">XA&apos;AN</h3>
                  <p className="text-[8px] tracking-[0.18em] font-bold text-gray-400 uppercase">Download the app</p>
                </div>
                <div className="flex items-end gap-3">
                  <div className="w-14 h-14 bg-[#141821] rounded flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                      <rect x="4" y="4" width="6" height="6" />
                      <rect x="14" y="4" width="6" height="6" />
                      <rect x="4" y="14" width="6" height="6" />
                      <rect x="14" y="14" width="6" height="6" />
                    </svg>
                  </div>
                  <p className="text-[9px] text-gray-400 leading-tight mb-0.5">Scan to search<br/>Mexico&apos;s full market</p>
                </div>
              </div>
              <div className="w-[88px] flex-shrink-0 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200&h=400&fit=crop"
                  alt="Xa'an App"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </section>
        </div>

        <footer className="h-8 border-t border-gray-200 flex justify-end items-center px-4 bg-gray-100/50">
          <div className="bg-[#141821] text-white text-[9px] px-3 py-1 rounded font-bold tracking-widest uppercase">54 FPS</div>
        </footer>
      </main>
    </>
  );
}
