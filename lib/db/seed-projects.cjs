process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const envPath = path.join(__dirname, "..", "..", ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([A-Z_]+)=(.*)/);
  if (match) process.env[match[1]] = match[2].trim();
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const createTable = `
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  units TEXT NOT NULL DEFAULT '',
  highlights TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  brochure_url TEXT NOT NULL DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  gallery TEXT[] NOT NULL DEFAULT '{}',
  rera TEXT NOT NULL DEFAULT '',
  possession TEXT NOT NULL DEFAULT '',
  price_range TEXT NOT NULL DEFAULT '',
  developer TEXT NOT NULL DEFAULT 'Cosmos Real Estate',
  featured BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

const seedData = `
INSERT INTO projects (name, description, location, type, status, units, highlights, image, featured, active) VALUES
('Cosmos Grandeur', 'Ultra-luxury residences with private pools and smart home automation in the heart of Koregaon Park.', 'Koregaon Park, Pune', 'Residential', 'Completed', '42 Exclusive Units', 'Private Pools, Home Automation', '/images/proj-1.png', true, true),
('Cosmos Business Hub', 'LEED-certified premium office spaces with smart parking and modern amenities in Baner.', 'Baner, Pune', 'Commercial', 'Ongoing', '120 Office Spaces', 'LEED Certified, Smart Parking', '/images/com-2.png', true, true),
('Cosmos Logistics Park', 'Grade-A warehousing and logistics infrastructure at Chakan industrial corridor.', 'Chakan, Pune', 'Industrial', 'Upcoming', '5 Million SqFt', 'Grade-A Warehousing', '/images/ind-2.png', false, true),
('Cosmos Heights', 'Premium flats with clubhouse and infinity pool in the upscale Kalyani Nagar neighborhood.', 'Kalyani Nagar, Pune', 'Residential', 'Completed', '80 Premium Flats', 'Clubhouse, Infinity Pool', '/images/res-1.png', false, true),
('Cosmos Retail Square', 'High footfall retail destination with anchor stores in Viman Nagar.', 'Viman Nagar, Pune', 'Commercial', 'Completed', '45 Retail Shops', 'High Footfall, Anchor Stores', '/images/com-3.png', false, true),
('Cosmos Villas', 'Luxury gated bungalow community with private gardens in Aundh.', 'Aundh, Pune', 'Residential', 'Ongoing', '15 Luxury Bungalows', 'Gated Community, Private Gardens', '/images/res-2.png', false, true),
('Cosmos IT Park', 'Twin IT towers with food court and co-working zones in Kharadi IT corridor.', 'Kharadi, Pune', 'Commercial', 'Upcoming', '2 IT Towers', 'Food Court, Co-working Zones', '/images/proj-2.png', false, true),
('Cosmos Riverfront', 'Waterfront apartments with river views and jogging tracks at Mundhwa.', 'Mundhwa, Pune', 'Residential', 'Upcoming', '200 Waterfront Apts', 'River Views, Jogging Track', '/images/proj-3.png', false, true)
ON CONFLICT DO NOTHING;
`;

async function main() {
  try {
    await pool.query(createTable);
    console.log("Table created!");
    await pool.query(seedData);
    console.log("Seed data inserted!");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

main();
