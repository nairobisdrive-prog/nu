import pool from '../config/database.js';

const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  role ENUM('user', 'agent', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  agency VARCHAR(255),
  license_number VARCHAR(100),
  rating DECIMAL(2,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  bio TEXT,
  specialties JSON,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  price DECIMAL(12,2) NOT NULL,
  price_type ENUM('short_term', 'long_term') NOT NULL,
  bedrooms INT DEFAULT 0,
  bathrooms DECIMAL(3,1) DEFAULT 0,
  sqft INT DEFAULT 0,
  property_type ENUM('house', 'condo', 'apartment', 'loft', 'villa', 'studio') NOT NULL,
  images JSON,
  description TEXT,
  features JSON,
  year_built INT,
  parking INT DEFAULT 0,
  agent_id INT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  listed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'pending', 'sold', 'inactive') DEFAULT 'active',
  available_from DATE,
  available_to DATE,
  min_stay_nights INT,
  max_stay_nights INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL
);

-- Saved properties
CREATE TABLE IF NOT EXISTS saved_properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_save (user_id, property_id)
);

-- Saved searches
CREATE TABLE IF NOT EXISTS saved_searches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  query_json JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  featured_image TEXT,
  author_id INT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  tags JSON,
  meta_title VARCHAR(500),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Property views tracking
CREATE TABLE IF NOT EXISTS property_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  user_id INT,
  session_id VARCHAR(255),
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Searches tracking
CREATE TABLE IF NOT EXISTS searches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  query_params JSON,
  results_count INT,
  searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_price_type ON properties(price_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_users_firebase ON users(firebase_uid);
`;

async function initDatabase() {
  console.log('🏗️ Initializing database schema...');

  try {
    const statements = schema.split(';').filter(s => s.trim().length > 0);

    for (const statement of statements) {
      await pool.execute(statement);
    }

    console.log('✅ Database schema initialized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Schema initialization failed:', err);
    process.exit(1);
  }
}

initDatabase();
