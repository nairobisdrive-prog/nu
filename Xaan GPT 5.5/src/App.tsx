import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  Bath,
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  KeyRound,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react'
import './App.css'

type Listing = {
  id: number
  title: string
  address: string
  price: string
  status: string
  beds: number
  baths: number
  size: string
  tag: string
  images: string[]
  lat: string
  top: string
  left: string
}

const images = ['/images/home-1.jpg', '/images/home-2.jpg', '/images/home-3.jpg', '/images/home-4.jpg', '/images/home-5.jpg']

const listings: Listing[] = [
  {
    id: 1,
    title: 'Casa Nube, Polanco',
    address: 'Emilio Castelar 218, Polanco, CDMX',
    price: '$18,900,000 MXN',
    status: 'Listed 2h ago',
    beds: 3,
    baths: 3,
    size: '318 m²',
    tag: 'Condo',
    images: [images[1], images[3], images[4], images[0]],
    lat: '19.4326',
    top: '30%',
    left: '54%',
  },
  {
    id: 2,
    title: 'Villa Mar, Tulum Beach',
    address: 'Aldea Zama, Tulum, Quintana Roo',
    price: '$1,240,000 USD',
    status: 'New today',
    beds: 4,
    baths: 5,
    size: '512 m²',
    tag: 'Villa',
    images: [images[2], images[0], images[3], images[1]],
    lat: '20.2114',
    top: '64%',
    left: '70%',
  },
  {
    id: 3,
    title: 'Casa Patio, Mérida Centro',
    address: 'Calle 60, Centro, Mérida, Yucatán',
    price: '$8,650,000 MXN',
    status: 'Updated 5h ago',
    beds: 5,
    baths: 4,
    size: '430 m²',
    tag: 'Historic',
    images: [images[4], images[2], images[0], images[3]],
    lat: '20.9674',
    top: '52%',
    left: '38%',
  },
  {
    id: 4,
    title: 'Vista Andes, San Pedro',
    address: 'Valle Oriente, Monterrey, Nuevo León',
    price: '$14,200,000 MXN',
    status: 'Verified active',
    beds: 3,
    baths: 4,
    size: '286 m²',
    tag: 'Penthouse',
    images: [images[0], images[1], images[2], images[3]],
    lat: '25.6500',
    top: '24%',
    left: '24%',
  },
  {
    id: 5,
    title: 'Loft Roma Norte',
    address: 'Orizaba 171, Roma Norte, CDMX',
    price: '$7,980,000 MXN',
    status: 'Listed yesterday',
    beds: 2,
    baths: 2,
    size: '142 m²',
    tag: 'Loft',
    images: [images[3], images[1], images[4], images[0]],
    lat: '19.4192',
    top: '39%',
    left: '47%',
  },
]

const infoCards = [
  {
    icon: Search,
    title: 'Buy without the hunt',
    copy: 'See homes, condos, villas, presales, and off-market-ready listings from local brokerages in one reliably refreshed search.',
    cta: 'Explore listings',
  },
  {
    icon: KeyRound,
    title: 'Rent with real availability',
    copy: 'Xa’an filters stale posts and duplicate rentals so your shortlist is filled with units you can actually tour.',
    cta: 'Find rentals',
  },
  {
    icon: Building2,
    title: 'Sell into the active market',
    copy: 'Reach buyers already comparing Mexico’s updated inventory, not scattered ads across broker sites and social feeds.',
    cta: 'List with Xa’an',
  },
]

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-3" aria-label="Xa’an home">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#141821] text-[#f2e7f6] shadow-xl shadow-[#523575]/20">
        <Home size={21} strokeWidth={2.4} />
      </span>
      <span className="text-2xl font-semibold tracking-[-0.06em] text-[#141821]">Xa’an</span>
    </a>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  const left = ['Buy', 'Sell', 'Rent', 'Find an Agent']
  const right = ['Advertise', 'FAQ', 'Sign In']
  const linkClass = 'text-[15px] font-medium text-[#4b3965] transition hover:text-[#141821]'
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-2xl">
      <nav className="mx-auto hidden max-w-[1500px] items-center justify-between px-[min(10vw,150px)] py-5 lg:flex">
        <div className="flex min-w-[390px] items-center gap-10">
          {left.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} className={linkClass}>
              {item}
            </a>
          ))}
        </div>
        <Logo />
        <div className="flex min-w-[390px] items-center justify-end gap-10">
          {right.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} className={linkClass}>
              {item}
            </a>
          ))}
        </div>
      </nav>
      <nav className="flex items-center justify-between px-5 py-4 lg:hidden">
        <Logo />
        <button onClick={() => setOpen(true)} className="rounded-full border border-[#ccc2ed] bg-white p-3 text-[#141821]">
          <Menu size={20} />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#141821]/30 backdrop-blur-sm lg:hidden">
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26 }} className="ml-auto h-full w-[82%] bg-white p-6 shadow-2xl">
              <div className="mb-10 flex items-center justify-between">
                <Logo />
                <button onClick={() => setOpen(false)} className="rounded-full bg-[#f2e7f6] p-3"><X size={20} /></button>
              </div>
              {[...left, ...right].map((item) => <a onClick={() => setOpen(false)} className="block border-b border-[#f2e7f6] py-5 text-xl font-semibold" href={`#${item.toLowerCase().replaceAll(' ', '-')}`} key={item}>{item}</a>)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Hero() {
  const { scrollYProgress } = useScroll()
  const rotateX = useTransform(scrollYProgress, [0, 0.22], [18, 0])
  const y = useTransform(scrollYProgress, [0, 0.22], [0, 120])
  const scale = useTransform(scrollYProgress, [0, 0.22], [0.92, 1.05])
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.12])
  return (
    <section id="home" className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#f2e7f6_0%,#fff_38%,#fff_100%)] pt-32 lg:pt-40">
      <div className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-[#ccc2ed]/60 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-12 h-96 w-96 rounded-full bg-[#f2e7f6] blur-3xl" />
      <div className="mx-auto max-w-[1400px] px-5 text-center lg:px-10">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-[#ccc2ed] bg-white/70 px-4 py-2 text-sm font-semibold text-[#523575] shadow-sm backdrop-blur-xl">
          <Sparkles size={16} /> 90%+ of active local listings, updated in one place
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.8 }} className="mx-auto max-w-6xl text-5xl font-semibold leading-[0.98] tracking-[-0.075em] text-[#141821] sm:text-7xl lg:text-[112px]">
          Mexico real estate, finally in sync.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.75 }} className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-[#756791] sm:text-xl">
          Xa’an replaces the broker-site maze, Facebook Marketplace scrolling, and street-sign guessing with one reliably refreshed database for homes and condos for sale across Mexico.
        </motion.p>
        <motion.div style={{ rotateX, y, scale, opacity, transformPerspective: 1100 }} className="relative mx-auto mt-14 max-w-6xl rounded-[44px] border border-white/80 bg-white/55 p-3 shadow-2xl shadow-[#523575]/18 backdrop-blur-2xl">
          <div className="absolute inset-x-12 -top-5 h-10 rounded-full bg-[#ccc2ed]/60 blur-2xl" />
          <div className="grid overflow-hidden rounded-[34px] bg-[#141821] p-3 text-left md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[430px] overflow-hidden rounded-[26px] bg-[#f2e7f6]">
              {listings.slice(0, 4).map((listing, index) => (
                <motion.div key={listing.id} initial={{ opacity: 0, y: 80, rotate: index % 2 ? -4 : 4 }} animate={{ opacity: 1, y: index * 42, rotate: index % 2 ? -3 : 3 }} transition={{ delay: 0.2 + index * 0.12, duration: 0.7 }} className="absolute left-[8%] top-[7%] w-[78%] overflow-hidden rounded-[28px] border border-white/50 bg-white shadow-2xl">
                  <img src={listing.images[0]} className="h-48 w-full object-cover" />
                  <div className="p-5">
                    <div className="text-2xl font-semibold tracking-[-0.04em] text-[#141821]">{listing.price}</div>
                    <p className="mt-1 text-sm text-[#756791]">{listing.address}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col justify-between p-7 text-white">
              <div>
                <div className="rounded-full bg-white/10 px-4 py-2 text-sm text-[#ccc2ed] w-fit">Live inventory engine</div>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-0.055em]">From scattered signs to searchable certainty.</h2>
              </div>
              <div className="rounded-[28px] bg-white p-3 shadow-2xl">
                <SearchBar compact />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SearchBar({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('Polanco, CDMX')
  return (
    <form onSubmit={(e) => e.preventDefault()} className={`flex flex-col gap-3 rounded-[26px] border border-[#ccc2ed]/70 bg-white p-2 shadow-xl shadow-[#523575]/8 ${compact ? '' : 'mx-auto max-w-5xl md:flex-row'}`}>
      <div className="flex flex-1 items-center gap-3 px-4 py-3">
        <Search className="text-[#523575]" size={23} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full bg-transparent text-lg font-medium text-[#141821] outline-none placeholder:text-[#a297b9]" placeholder="Search by city, neighborhood, address" />
      </div>
      <div className="flex gap-2">
        <button type="button" className="rounded-2xl border border-[#f2e7f6] px-4 py-3 text-sm font-semibold text-[#4b3965]"><SlidersHorizontal className="inline" size={16} /> Filters</button>
        <a href="#listings" className="rounded-2xl bg-[#141821] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#50267a]">Search homes</a>
      </div>
    </form>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  const [hovered, setHovered] = useState(false)
  const [saved, setSaved] = useState(false)
  const activeImages = useMemo(() => listing.images, [listing.images])
  return (
    <motion.article onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} whileHover={{ y: -8 }} className="group overflow-hidden rounded-[30px] border border-[#f2e7f6] bg-white shadow-sm transition hover:shadow-2xl hover:shadow-[#523575]/12">
      <div className="relative h-64 overflow-hidden bg-[#f2e7f6]">
        <motion.div animate={hovered ? { x: `-${(activeImages.length - 1) * 100}%` } : { x: '0%' }} transition={hovered ? { duration: activeImages.length * 1.05, ease: 'linear', repeat: Infinity, repeatType: 'reverse' } : { duration: 0.45, ease: 'easeOut' }} className="flex h-full w-full">
          {activeImages.map((src) => <img key={src} src={src} alt={listing.title} className="h-full min-w-full object-cover" />)}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141821]/45 via-transparent to-transparent opacity-70" />
        <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1.5 text-sm font-bold text-[#523575] backdrop-blur-xl">{listing.status}</div>
        <button onClick={() => setSaved(!saved)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-[#141821] backdrop-blur-xl transition hover:scale-105">
          <Heart size={19} fill={saved ? '#50267a' : 'transparent'} color={saved ? '#50267a' : '#141821'} />
        </button>
        <div className="absolute bottom-4 left-4 rounded-full bg-[#141821]/75 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-xl">{listing.tag}</div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.045em] text-[#141821]">{listing.price}</h3>
            <p className="mt-2 font-semibold text-[#4b3965]">{listing.title}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-[#756791]"><MapPin size={14} /> {listing.address}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#141821]">
          <span className="rounded-full bg-[#f2e7f6] px-3 py-2"><BedDouble size={16} className="mr-1 inline" />{listing.beds} beds</span>
          <span className="rounded-full bg-[#f2e7f6] px-3 py-2"><Bath size={16} className="mr-1 inline" />{listing.baths} baths</span>
          <span className="rounded-full bg-[#f2e7f6] px-3 py-2">{listing.size}</span>
        </div>
      </div>
    </motion.article>
  )
}

function InfoCard({ card, index }: { card: (typeof infoCards)[number]; index: number }) {
  const Icon = card.icon
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="group relative overflow-hidden rounded-[34px] border border-white/70 bg-white/70 p-7 shadow-xl shadow-[#523575]/8 backdrop-blur-2xl">
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#ccc2ed]/50 blur-2xl transition group-hover:scale-150" />
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-[#141821] text-white shadow-lg shadow-[#523575]/20"><Icon size={24} /></div>
      <h3 className="relative mt-7 text-3xl font-semibold tracking-[-0.05em] text-[#141821]">{card.title}</h3>
      <p className="relative mt-4 min-h-24 text-[16px] leading-7 text-[#756791]">{card.copy}</p>
      <a href="#listings" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-[#f2e7f6] px-5 py-3 font-semibold text-[#50267a] transition group-hover:bg-[#141821] group-hover:text-white">{card.cta}<ChevronRight size={17} /></a>
    </motion.div>
  )
}

function SearchSection() {
  return (
    <section id="buy" className="relative z-10 -mt-6 px-5 pb-24 pt-20 lg:px-10">
      <div className="mx-auto max-w-[1320px]">
        <SearchBar />
        <div className="mt-20 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#756791]">Recently listed near you</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-0.06em] text-[#141821] sm:text-6xl">Stop checking five places. Xa’an keeps the market together.</h2>
          </div>
          <p className="max-w-md text-lg leading-8 text-[#756791]">Fresh brokerage feeds, local verification signals, and duplicate suppression mean you can compare the active market with confidence.</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {infoCards.map((card, index) => <InfoCard key={card.title} card={card} index={index} />)}
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {listings.slice(0, 3).map((listing) => <ListingCard listing={listing} key={listing.id} />)}
        </div>
      </div>
    </section>
  )
}

function ListingsFinder() {
  return (
    <section id="listings" className="bg-[#f8f5fb] px-5 py-24 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#756791]">Listings finder</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#141821] sm:text-6xl">Grid + map, built for Mexico.</h2>
          </div>
          <div className="rounded-full border border-[#ccc2ed] bg-white px-5 py-3 text-sm font-semibold text-[#4b3965]">5,842 active properties refreshed today</div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-5 md:grid-cols-2">
            {listings.map((listing) => <ListingCard listing={listing} key={listing.id} />)}
          </div>
          <div className="sticky top-28 h-[760px] overflow-hidden rounded-[36px] border border-white bg-[#141821] p-4 shadow-2xl shadow-[#523575]/15">
            <div className="relative h-full overflow-hidden rounded-[26px] bg-[#f2e7f6]">
              <img src="/images/city.jpg" className="h-full w-full object-cover opacity-70 mix-blend-multiply" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,24,33,.88),rgba(80,38,122,.35))]" />
              <div className="absolute left-6 top-6 rounded-3xl bg-white/88 p-5 backdrop-blur-xl">
                <div className="text-2xl font-semibold tracking-[-0.04em] text-[#141821]">Live Mexico map</div>
                <p className="mt-1 text-sm text-[#756791]">Tap a pin to preview verified active homes.</p>
              </div>
              {listings.map((listing) => (
                <button key={listing.id} style={{ top: listing.top, left: listing.left }} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#50267a] shadow-xl transition hover:scale-110">
                  {listing.price.includes('USD') ? '$1.2M' : listing.price.split(',')[0].replace('$', '$')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ImageAccordion() {
  const [active, setActive] = useState(0)
  return (
    <div className="flex h-[560px] gap-3 overflow-hidden rounded-[38px] bg-[#141821] p-3">
      {images.map((src, index) => (
        <motion.button key={src} onMouseEnter={() => setActive(index)} onClick={() => setActive(index)} animate={{ flex: active === index ? 5 : 1 }} transition={{ type: 'spring', stiffness: 110, damping: 22 }} className="relative min-w-0 overflow-hidden rounded-[28px] text-left">
          <img src={src} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141821]/70 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <div className="text-sm font-semibold">0{index + 1}</div>
            {active === index && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-2xl font-semibold tracking-[-0.04em]">{['Facade', 'Living', 'Pool', 'Suite', 'Terrace'][index]}</motion.div>}
          </div>
        </motion.button>
      ))}
    </div>
  )
}

function PropertyDetails() {
  const detail = listings[0]
  return (
    <section id="rent" className="px-5 py-24 lg:px-10">
      <div className="mx-auto max-w-[1480px]">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#756791]">Property details page</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-[#141821] sm:text-6xl">A beautiful decision room.</h2>
          </div>
          <div className="flex gap-3">
            <button className="rounded-full border border-[#ccc2ed] bg-white px-5 py-3 font-semibold text-[#141821]"><Share2 size={17} className="mr-2 inline" />Share</button>
            <button className="rounded-full bg-[#141821] px-5 py-3 font-semibold text-white"><Heart size={17} className="mr-2 inline" />Save</button>
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[7fr_3fr]">
          <ImageAccordion />
          <div className="grid gap-5">
            {[images[1], images[2], images[3], '/images/detail-kitchen.jpg'].map((src, index) => (
              <div key={src} className="relative overflow-hidden rounded-[28px]">
                <img src={src} className="h-full min-h-[130px] w-full object-cover" />
                {index === 3 && <button className="absolute inset-0 m-auto h-fit w-fit rounded-full bg-white/90 px-5 py-3 font-bold text-[#141821] backdrop-blur-xl">See all 38 photos</button>}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(280px,1fr)]">
          <main>
            <div className="rounded-[36px] border border-[#f2e7f6] bg-white p-8 shadow-sm">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                <div>
                  <h3 className="text-5xl font-semibold tracking-[-0.06em] text-[#141821]">{detail.price}</h3>
                  <p className="mt-3 flex items-center gap-2 text-lg text-[#756791]"><MapPin size={18} />{detail.address}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-[#f2e7f6] p-4 font-bold text-[#141821]"><BedDouble className="mx-auto mb-1" />{detail.beds}<span className="block text-xs text-[#756791]">beds</span></div>
                  <div className="rounded-2xl bg-[#f2e7f6] p-4 font-bold text-[#141821]"><Bath className="mx-auto mb-1" />{detail.baths}<span className="block text-xs text-[#756791]">baths</span></div>
                  <div className="rounded-2xl bg-[#f2e7f6] p-4 font-bold text-[#141821]"><Building2 className="mx-auto mb-1" />{detail.size}<span className="block text-xs text-[#756791]">home</span></div>
                </div>
              </div>
              <p className="mt-8 text-lg leading-8 text-[#4b3965]">A refined Polanco residence with floor-to-ceiling windows, private elevator access, warm stone finishes, and immediate proximity to parks, restaurants, embassies, and Mexico City’s most dependable luxury services.</p>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                ['Interior', 'Oak floors, marble kitchen, automated shades, acoustic glazing'],
                ['Building', '24/7 security, 3 parking spots, private storage, wellness lounge'],
                ['Financial', 'Verified title packet, HOA $18,400 MXN/mo, property tax current'],
                ['Neighborhood', 'Walk to Lincoln Park, Masaryk, elite schools, cafés, galleries'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[30px] border border-[#f2e7f6] bg-white p-6">
                  <h4 className="text-2xl font-semibold tracking-[-0.04em] text-[#141821]">{title}</h4>
                  <p className="mt-3 leading-7 text-[#756791]">{copy}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <h3 className="text-4xl font-semibold tracking-[-0.055em] text-[#141821]">Nearby similar properties</h3>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {listings.slice(1).concat(listings.slice(0, 1)).map((listing) => <ListingCard key={`similar-${listing.id}`} listing={listing} />)}
              </div>
            </div>
          </main>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[34px] border border-[#ccc2ed] bg-white/82 p-6 shadow-2xl shadow-[#523575]/12 backdrop-blur-2xl">
              <div className="flex items-center gap-4">
                <img src="/images/agent-1.jpg" className="h-16 w-16 rounded-2xl object-cover" />
                <div><div className="font-bold text-[#141821]">Mariana Ortega</div><div className="text-sm text-[#756791]">Xa’an Premier Agent</div></div>
              </div>
              <button className="mt-6 w-full rounded-2xl bg-[#50267a] px-5 py-4 font-bold text-white shadow-lg shadow-[#50267a]/20"><MessageCircle className="mr-2 inline" />Contact Agent</button>
              <button className="mt-3 w-full rounded-2xl border border-[#ccc2ed] bg-[#f2e7f6] px-5 py-4 font-bold text-[#141821]"><CalendarDays className="mr-2 inline" />Request a Tour</button>
              <div className="mt-6 rounded-2xl bg-[#141821] p-5 text-white">
                <ShieldCheck className="mb-3 text-[#ccc2ed]" />
                <p className="font-semibold">Active-listing confidence</p>
                <p className="mt-2 text-sm leading-6 text-[#ccc2ed]">This property was refreshed today from a verified local brokerage feed.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function AgentAndDashboard() {
  return (
    <section id="find-an-agent" className="bg-[#141821] px-5 py-24 text-white lg:px-10">
      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#ccc2ed]">Find an agent</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">Local experts, verified by activity.</h2>
          <p className="mt-6 text-lg leading-8 text-[#ccc2ed]">Compare agents by neighborhoods served, active listings, response time, languages, and recent closings—then message without leaving your search.</p>
          <div className="mt-9 rounded-[34px] bg-white p-5 text-[#141821]">
            <div className="flex items-center gap-5">
              <img src="/images/agent-2.jpg" className="h-24 w-24 rounded-[26px] object-cover" />
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em]">Sofía Navarro</h3>
                <p className="text-[#756791]">Luxury buyer advisor · CDMX + Riviera Maya</p>
                <div className="mt-2 flex gap-1 text-[#50267a]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-[#f2e7f6] p-4"><b>42</b><span className="block text-xs text-[#756791]">active listings</span></div>
              <div className="rounded-2xl bg-[#f2e7f6] p-4"><b>8m</b><span className="block text-xs text-[#756791]">avg reply</span></div>
              <div className="rounded-2xl bg-[#f2e7f6] p-4"><b>98%</b><span className="block text-xs text-[#756791]">verified</span></div>
            </div>
          </div>
        </div>
        <div id="sign-in" className="rounded-[42px] border border-white/10 bg-white/8 p-4 backdrop-blur-2xl">
          <div className="rounded-[32px] bg-[#f8f5fb] p-6 text-[#141821]">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-[#756791]">User dashboard</p><h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">Your market command center</h3></div>
              <UserRound className="text-[#50267a]" />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <DashboardTile icon={Heart} title="Saved properties" value="12" copy="Tour-ready homes in Polanco, Roma Norte, Tulum" />
              <DashboardTile icon={Search} title="Saved searches" value="4" copy="Budget, neighborhood, amenity filters synced" />
              <DashboardTile icon={Mail} title="Email alerts" value="Daily" copy="Daily, weekly, or monthly updates on new matches" />
              <DashboardTile icon={Bell} title="Price changes" value="7" copy="Instant notices when tracked homes move" />
            </div>
            <div className="mt-5 rounded-[26px] bg-white p-5">
              <div className="mb-4 flex items-center gap-2 font-bold"><UsersRound size={18} /> Shared shortlist</div>
              {listings.slice(0, 3).map((listing) => <div key={`dash-${listing.id}`} className="flex items-center justify-between border-t border-[#f2e7f6] py-3"><span className="font-semibold">{listing.title}</span><span className="text-sm text-[#756791]">{listing.status}</span></div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardTile({ icon: Icon, title, value, copy }: { icon: typeof Heart; title: string; value: string; copy: string }) {
  return (
    <div className="rounded-[26px] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between"><Icon className="text-[#50267a]" /><span className="text-2xl font-semibold tracking-[-0.04em]">{value}</span></div>
      <h4 className="mt-4 font-bold">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-[#756791]">{copy}</p>
    </div>
  )
}

function Footer() {
  return (
    <footer id="faq" className="px-5 py-16 lg:px-10">
      <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 rounded-[36px] bg-[#f2e7f6] p-8 md:flex-row md:items-center">
        <div><Logo /><p className="mt-4 max-w-2xl text-[#756791]">Xa’an is the modern home search for Mexico: fewer dead ends, more active listings, smarter tours, and one calm place to make your move.</p></div>
        <a id="advertise" href="mailto:partners@xaan.mx" className="rounded-full bg-[#141821] px-6 py-4 font-bold text-white">Advertise active listings</a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#141821] selection:bg-[#ccc2ed] selection:text-[#141821]">
      <Nav />
      <Hero />
      <SearchSection />
      <ListingsFinder />
      <PropertyDetails />
      <AgentAndDashboard />
      <Footer />
    </div>
  )
}
