-- Table de stockage des leads pour Vercel Postgres
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telephone VARCHAR(30) NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  source VARCHAR(50) DEFAULT 'formulaire'
);
