-- Table principale pour les leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    domaine VARCHAR(50) NOT NULL, -- AJOUTÉ
    createdAt TIMESTAMP NOT NULL,
    source VARCHAR(50) NOT NULL
);

-- Table pour les utilisateurs/admins (si tu veux gérer des comptes admin côté base)
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Table pour les logs d’actions (optionnel, utile pour audit)
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES admins(id)
);

-- Table pour les contacts (si tu veux stocker les messages du formulaire de contact)
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Table pour les sources de leads (optionnel, si tu veux catégoriser)
CREATE TABLE IF NOT EXISTS lead_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Index pour accélérer les recherches sur leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_createdAt ON leads(createdAt);

-- Index pour accélérer les recherches sur contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_createdAt ON contacts(createdAt);
ALTER TABLE leads ADD COLUMN domaine VARCHAR(50) NOT NULL DEFAULT '';