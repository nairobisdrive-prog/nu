import pool from '../config/database.js';

const cities = [
  { name: 'Mexico City', state: 'CDMX', lat: 19.4326, lng: -99.1332 },
  { name: 'Cancún', state: 'Quintana Roo', lat: 21.1619, lng: -86.8515 },
  { name: 'Tulum', state: 'Quintana Roo', lat: 20.2114, lng: -87.4654 },
  { name: 'Guadalajara', state: 'Jalisco', lat: 20.6597, lng: -103.3496 },
  { name: 'Monterrey', state: 'Nuevo León', lat: 25.6866, lng: -100.3161 },
  { name: 'Puerto Vallarta', state: 'Jalisco', lat: 20.6534, lng: -105.2253 },
  { name: 'Mazatlán', state: 'Sinaloa', lat: 23.2494, lng: -106.4111 },
  { name: 'San Miguel de Allende', state: 'Guanajuato', lat: 20.9140, lng: -100.7430 },
  { name: 'Playa del Carmen', state: 'Quintana Roo', lat: 20.6296, lng: -87.0739 },
  { name: 'Los Cabos', state: 'Baja California Sur', lat: 22.9188, lng: -109.6955 },
];

const propertyTypes = ['house', 'condo', 'apartment', 'loft', 'villa', 'studio'];

const shortTermImages = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
];

const longTermImages = [
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=600&fit=crop',
];

const features = [
  'Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Terrace',
  'Air Conditioning', 'Furnished', 'Pet Friendly', 'Ocean View',
  'Mountain View', 'City View', 'Balcony', 'Elevator', 'Concierge',
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomFeatures(count: number): string[] {
  const shuffled = [...features].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePropertyTitle(city: string, type: string, priceType: string): string {
  const adjectives = ['Modern', 'Luxury', 'Cozy', 'Spacious', 'Stylish', 'Elegant', 'Charming', 'Premium'];
  const types: Record<string, string> = {
    house: 'House', condo: 'Condo', apartment: 'Apartment',
    loft: 'Loft', villa: 'Villa', studio: 'Studio',
  };
  return `${randomItem(adjectives)} ${types[type]} in ${city}`;
}

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data (optional - comment out if you want to keep existing)
    await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
    await pool.execute('TRUNCATE TABLE saved_properties');
    await pool.execute('TRUNCATE TABLE saved_searches');
    await pool.execute('TRUNCATE TABLE property_views');
    await pool.execute('TRUNCATE TABLE searches');
    await pool.execute('TRUNCATE TABLE properties');
    await pool.execute('TRUNCATE TABLE agents');
    await pool.execute('TRUNCATE TABLE blogs');
    await pool.execute('TRUNCATE TABLE users');
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

    // Create users
    const users = [
      { firebase_uid: 'admin_001', email: 'admin@xaan.mx', display_name: 'Admin User', role: 'admin' },
      { firebase_uid: 'agent_001', email: 'maria@xaan.mx', display_name: 'María González', role: 'agent' },
      { firebase_uid: 'agent_002', email: 'carlos@xaan.mx', display_name: 'Carlos Mendoza', role: 'agent' },
      { firebase_uid: 'agent_003', email: 'ana@xaan.mx', display_name: 'Ana Sofía Reyes', role: 'agent' },
      { firebase_uid: 'agent_004', email: 'javier@xaan.mx', display_name: 'Javier Hernández', role: 'agent' },
      { firebase_uid: 'user_001', email: 'user@example.com', display_name: 'Test User', role: 'user' },
    ];

    const userIds: number[] = [];
    for (const user of users) {
      const [result]: any = await pool.execute(
        'INSERT INTO users (firebase_uid, email, display_name, role) VALUES (?, ?, ?, ?)',
        [user.firebase_uid, user.email, user.display_name, user.role]
      );
      userIds.push(result.insertId);
    }
    console.log(`✅ Created ${users.length} users`);

    // Create agents
    const agentData = [
      { user_id: userIds[1], agency: 'Xaán Premier Realty', license_number: 'LIC-001', rating: 4.9, review_count: 127, bio: 'Luxury property specialist with 15+ years experience in Mexico City.', specialties: ['Luxury Homes', 'Mexico City', 'Investment Properties'] },
      { user_id: userIds[2], agency: 'Xaán Coastal Properties', license_number: 'LIC-002', rating: 4.8, review_count: 89, bio: 'Beachfront property expert in Cancún and Riviera Maya.', specialties: ['Beachfront', 'Cancún', 'Vacation Homes'] },
      { user_id: userIds[3], agency: 'Xaán Guadalajara', license_number: 'LIC-003', rating: 4.9, review_count: 156, bio: 'Family home specialist in Guadalajara metropolitan area.', specialties: ['Family Homes', 'Guadalajara', 'First-time Buyers'] },
      { user_id: userIds[4], agency: 'Xaán Pacific', license_number: 'LIC-004', rating: 4.7, review_count: 64, bio: 'Puerto Vallarta and Mazatlán rental specialist.', specialties: ['Vacation Rentals', 'Puerto Vallarta', 'Mazatlán'] },
    ];

    const agentIds: number[] = [];
    for (const agent of agentData) {
      const [result]: any = await pool.execute(
        'INSERT INTO agents (user_id, agency, license_number, rating, review_count, bio, specialties, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [agent.user_id, agent.agency, agent.license_number, agent.rating, agent.review_count, agent.bio, JSON.stringify(agent.specialties), true]
      );
      agentIds.push(result.insertId);
    }
    console.log(`✅ Created ${agentData.length} agents`);

    // Create properties
    const propertyCount = 60;
    for (let i = 0; i < propertyCount; i++) {
      const city = randomItem(cities);
      const priceType = Math.random() > 0.5 ? 'short_term' : 'long_term';
      const type = randomItem(propertyTypes);
      const bedrooms = randomInt(1, 5);
      const bathrooms = randomInt(1, bedrooms + 1);
      const sqft = randomInt(50, 400);
      const price = priceType === 'short_term'
        ? randomInt(800, 8000) // nightly rate in MXN
        : randomInt(12000, 80000); // monthly rate in MXN

      const images = priceType === 'short_term' ? shortTermImages : longTermImages;
      const availableFrom = new Date();
      availableFrom.setDate(availableFrom.getDate() + randomInt(1, 30));
      const availableTo = new Date(availableFrom);
      availableTo.setMonth(availableTo.getMonth() + randomInt(1, 12));

      await pool.execute(
        `INSERT INTO properties 
         (title, address, city, state, price, price_type, bedrooms, bathrooms, sqft,
          property_type, images, description, features, year_built, parking, agent_id,
          lat, lng, status, available_from, available_to, min_stay_nights, max_stay_nights)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          generatePropertyTitle(city.name, type, priceType),
          `${randomInt(100, 9999)} ${randomItem(['Avenida', 'Calle', 'Boulevard'])} ${randomItem(['Reforma', 'Juárez', 'Insurgentes', 'Constitución', 'Independencia'])}`,
          city.name,
          city.state,
          price,
          priceType,
          bedrooms,
          bathrooms,
          sqft,
          type,
          JSON.stringify(images),
          `Beautiful ${type} in ${city.name}. Perfect for ${priceType === 'short_term' ? 'vacation stays' : 'long-term living'}. Features ${bedrooms} bedrooms and ${bathrooms} bathrooms.`,
          JSON.stringify(randomFeatures(randomInt(3, 8))),
          randomInt(1990, 2024),
          randomInt(0, 3),
          randomItem(agentIds),
          city.lat + (Math.random() - 0.5) * 0.1,
          city.lng + (Math.random() - 0.5) * 0.1,
          'active',
          availableFrom.toISOString().split('T')[0],
          availableTo.toISOString().split('T')[0],
          priceType === 'short_term' ? randomInt(1, 7) : null,
          priceType === 'short_term' ? randomInt(14, 90) : null,
        ]
      );
    }
    console.log(`✅ Created ${propertyCount} properties`);

    // Create blog posts
    const blogPosts = [
      {
        title: 'The Ultimate Guide to Renting in Mexico City',
        slug: 'guide-to-renting-mexico-city',
        excerpt: 'Everything you need to know about finding your perfect rental in CDMX, from neighborhoods to contracts.',
        content: '<p>Mexico City offers a diverse range of rental options...</p>',
        featured_image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=500&fit=crop',
        author_id: userIds[0],
        tags: ['Mexico City', 'Renting Guide', 'CDMX'],
        status: 'published',
      },
      {
        title: 'Short-Term vs Long-Term Rentals: What\'s Right for You?',
        slug: 'short-term-vs-long-term-rentals',
        excerpt: 'Compare the pros and cons of short-term and long-term rentals in Mexico.',
        content: '<p>Choosing between short-term and long-term rentals depends on your lifestyle...</p>',
        featured_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
        author_id: userIds[0],
        tags: ['Rental Tips', 'Mexico', 'Housing'],
        status: 'published',
      },
      {
        title: 'Top 10 Beachfront Rentals in Cancún',
        slug: 'top-beachfront-rentals-cancun',
        excerpt: 'Discover the most stunning beachfront properties available for rent in Cancún.',
        content: '<p>Cancún is known for its pristine beaches and turquoise waters...</p>',
        featured_image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&h=500&fit=crop',
        author_id: userIds[1],
        tags: ['Cancún', 'Beachfront', 'Vacation Rentals'],
        status: 'published',
      },
      {
        title: 'Understanding Rental Contracts in Mexico',
        slug: 'rental-contracts-mexico',
        excerpt: 'A comprehensive guide to Mexican rental agreements and your rights as a tenant.',
        content: '<p>Rental contracts in Mexico have specific requirements...</p>',
        featured_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop',
        author_id: userIds[0],
        tags: ['Legal', 'Contracts', 'Renting Guide'],
        status: 'published',
      },
      {
        title: 'Tulum: The Hottest Rental Market in Mexico',
        slug: 'tulum-rental-market',
        excerpt: 'Why Tulum has become the most sought-after destination for renters in Mexico.',
        content: '<p>Tulum has transformed from a sleepy beach town...</p>',
        featured_image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&h=500&fit=crop',
        author_id: userIds[2],
        tags: ['Tulum', 'Market Trends', 'Investment'],
        status: 'published',
      },
    ];

    for (const post of blogPosts) {
      await pool.execute(
        'INSERT INTO blogs (title, slug, excerpt, content, featured_image, author_id, tags, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [post.title, post.slug, post.excerpt, post.content, post.featured_image, post.author_id, JSON.stringify(post.tags), post.status, new Date().toISOString()]
      );
    }
    console.log(`✅ Created ${blogPosts.length} blog posts`);

    console.log('🎉 Database seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seedDatabase();
