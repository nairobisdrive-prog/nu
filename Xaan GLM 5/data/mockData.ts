export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  priceType: 'sale' | 'rent';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  propertyType: 'house' | 'condo' | 'apartment' | 'land';
  images: string[];
  description: string;
  features: string[];
  yearBuilt: number;
  parking: number;
  agent: Agent;
  coordinates: { lat: number; lng: number };
  listedDate: string;
  status: 'active' | 'pending' | 'sold';
}

export interface Agent {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  agency: string;
  rating: number;
  reviewCount: number;
  listings: number;
  bio: string;
  specialties: string[];
}

export const agents: Agent[] = [
  {
    id: '1',
    name: 'María González',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    phone: '+52 55 1234 5678',
    email: 'maria@xaan.mx',
    agency: 'Xaán Premier Realty',
    rating: 4.9,
    reviewCount: 127,
    listings: 45,
    bio: 'With over 15 years of experience in Mexican real estate, María specializes in luxury properties in Mexico City and surrounding areas.',
    specialties: ['Luxury Homes', 'Mexico City', 'Investment Properties']
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    phone: '+52 55 9876 5432',
    email: 'carlos@xaan.mx',
    agency: 'Xaán Coastal Properties',
    rating: 4.8,
    reviewCount: 89,
    listings: 32,
    bio: 'Carlos is your expert for beachfront properties in Cancún, Playa del Carmen, and Tulum.',
    specialties: ['Beachfront', 'Cancún', 'Vacation Homes']
  },
  {
    id: '3',
    name: 'Ana Sofía Reyes',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    phone: '+52 33 4567 8901',
    email: 'ana@xaan.mx',
    agency: 'Xaán Guadalajara',
    rating: 4.9,
    reviewCount: 156,
    listings: 58,
    bio: 'Ana Sofía knows every corner of Guadalajara and helps families find their perfect home.',
    specialties: ['Family Homes', 'Guadalajara', 'First-time Buyers']
  }
];

const propertyImages = {
  luxury: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
  ],
  modern: [
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop'
  ],
  beachfront: [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600573472592-401b3c7f3c56?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'
  ],
  colonial: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop'
  ],
  condo: [
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600573472592-401b3c7f3c56?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
  ]
};

export const properties: Property[] = [
  {
    id: '1',
    title: 'Luxurious Polanco Estate',
    address: 'Av. Presidente Masaryk 456',
    city: 'Mexico City',
    state: 'CDMX',
    price: 28500000,
    priceType: 'sale',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6500,
    propertyType: 'house',
    images: propertyImages.luxury,
    description: 'An exceptional estate in the heart of Polanco, featuring stunning contemporary architecture, a private garden, and breathtaking city views. This masterpiece offers the ultimate in luxury living with smart home technology throughout.',
    features: ['Smart Home', 'Private Garden', 'Wine Cellar', 'Home Theater', 'Rooftop Terrace', '3-Car Garage'],
    yearBuilt: 2022,
    parking: 3,
    agent: agents[0],
    coordinates: { lat: 19.4326, lng: -99.1917 },
    listedDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    title: 'Modern Condo in Santa Fe',
    address: 'Centro Santa Fe, Torre A, Piso 28',
    city: 'Mexico City',
    state: 'CDMX',
    price: 8500000,
    priceType: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2200,
    propertyType: 'condo',
    images: propertyImages.modern,
    description: 'Sleek modern condo with floor-to-ceiling windows offering panoramic views of the city. Premium finishes throughout, including Italian marble floors and German kitchen appliances.',
    features: ['Panoramic Views', 'Gym', 'Pool', '24/7 Security', 'Concierge', 'Pet Friendly'],
    yearBuilt: 2021,
    parking: 2,
    agent: agents[0],
    coordinates: { lat: 19.3591, lng: -99.2606 },
    listedDate: '2024-01-20',
    status: 'active'
  },
  {
    id: '3',
    title: 'Beachfront Paradise in Cancún',
    address: 'Zona Hotelera, Km 12.5',
    city: 'Cancún',
    state: 'Quintana Roo',
    price: 45000,
    priceType: 'rent',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3800,
    propertyType: 'house',
    images: propertyImages.beachfront,
    description: 'Wake up to the Caribbean Sea in this stunning beachfront villa. Private beach access, infinity pool, and outdoor entertaining areas make this the perfect vacation retreat.',
    features: ['Beachfront', 'Infinity Pool', 'Private Beach Access', 'Outdoor Kitchen', 'Staff Quarters', 'Boat Dock'],
    yearBuilt: 2020,
    parking: 4,
    agent: agents[1],
    coordinates: { lat: 21.1213, lng: -86.7698 },
    listedDate: '2024-02-01',
    status: 'active'
  },
  {
    id: '4',
    title: 'Colonial Gem in San Miguel de Allende',
    address: 'Calle Aldama 23',
    city: 'San Miguel de Allende',
    state: 'Guanajuato',
    price: 12800000,
    priceType: 'sale',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 4200,
    propertyType: 'house',
    images: propertyImages.colonial,
    description: 'A beautifully restored colonial home in the heart of San Miguel. Original architectural details blend seamlessly with modern amenities. Central courtyard with fountain.',
    features: ['Colonial Architecture', 'Central Courtyard', 'Rooftop Terrace', 'Original Details', 'Guest House', 'Garden'],
    yearBuilt: 1850,
    parking: 2,
    agent: agents[2],
    coordinates: { lat: 20.9144, lng: -100.7436 },
    listedDate: '2024-01-25',
    status: 'active'
  },
  {
    id: '5',
    title: 'Luxury Penthouse in Puebla',
    address: 'Av. Juárez 789, Piso 15',
    city: 'Puebla',
    state: 'Puebla',
    price: 6200000,
    priceType: 'sale',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1800,
    propertyType: 'condo',
    images: propertyImages.condo,
    description: 'Stunning penthouse with wraparound terrace offering views of the Popocatépetl volcano. Modern design with premium finishes throughout.',
    features: ['Terrace', 'Volcano Views', 'Modern Design', 'Rooftop Access', 'Parking', 'Storage'],
    yearBuilt: 2023,
    parking: 1,
    agent: agents[2],
    coordinates: { lat: 19.0414, lng: -98.2063 },
    listedDate: '2024-02-05',
    status: 'active'
  },
  {
    id: '6',
    title: 'Family Home in Monterrey',
    address: 'Av. Gómez Morín 234',
    city: 'Monterrey',
    state: 'Nuevo León',
    price: 7500000,
    priceType: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3500,
    propertyType: 'house',
    images: propertyImages.modern,
    description: 'Spacious family home in prestigious San Pedro Garza García. Open floor plan, gourmet kitchen, and beautiful garden with pool.',
    features: ['Pool', 'Garden', 'Gourmet Kitchen', 'Home Office', 'Security System', 'Covered Parking'],
    yearBuilt: 2019,
    parking: 3,
    agent: agents[0],
    coordinates: { lat: 25.6526, lng: -100.3668 },
    listedDate: '2024-02-10',
    status: 'active'
  },
  {
    id: '7',
    title: 'Tulum Eco-Luxury Villa',
    address: 'La Veleta, Calle 7 Sur',
    city: 'Tulum',
    state: 'Quintana Roo',
    price: 18500000,
    priceType: 'sale',
    bedrooms: 5,
    bathrooms: 5,
    sqft: 5000,
    propertyType: 'house',
    images: propertyImages.beachfront,
    description: 'Sustainable luxury in the jungle. This eco-friendly villa features natural materials, private cenote access, and modern amenities while respecting the environment.',
    features: ['Eco-Friendly', 'Private Cenote', 'Jungle Setting', 'Natural Materials', 'Pool', 'Solar Power'],
    yearBuilt: 2022,
    parking: 2,
    agent: agents[1],
    coordinates: { lat: 20.2114, lng: -87.4653 },
    listedDate: '2024-02-08',
    status: 'active'
  },
  {
    id: '8',
    title: 'Guadalajara Downtown Loft',
    address: 'Av. Chapultepec 567',
    city: 'Guadalajara',
    state: 'Jalisco',
    price: 28000,
    priceType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    propertyType: 'apartment',
    images: propertyImages.condo,
    description: 'Industrial-chic loft in the heart of Guadalajara\'s trendiest neighborhood. Exposed brick, high ceilings, and walking distance to restaurants and galleries.',
    features: ['Industrial Design', 'High Ceilings', 'Walk Score 95', 'Pet Friendly', 'Rooftop Access', 'Bike Storage'],
    yearBuilt: 2018,
    parking: 1,
    agent: agents[2],
    coordinates: { lat: 20.6720, lng: -103.3470 },
    listedDate: '2024-02-12',
    status: 'active'
  }
];

export const formatPrice = (price: number, type: 'sale' | 'rent'): string => {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  if (type === 'rent') {
    return `${formatter.format(price)}/mes`;
  }
  return formatter.format(price);
};
