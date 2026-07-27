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

const sql = `
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

pool.query(sql)
  .then(() => { console.log("projects table created successfully!"); pool.end(); })
  .catch((err) => { console.error("Error:", err.message); pool.end(); });
