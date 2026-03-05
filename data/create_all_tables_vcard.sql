-- Table principale pour les leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    domaine VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    source VARCHAR(50) NOT NULL
);

-- Table pour les utilisateurs/admins
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Table pour les logs d’actions
CREATE TABLE IF NOT EXISTS logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES admins(id)
);

-- Table pour les contacts (tous les champs du formulaire vCard)
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    fn VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    org VARCHAR(100),
    bday VARCHAR(20),
    tel_mobile VARCHAR(30),
    tel_work VARCHAR(30),
    whatsapp VARCHAR(30),
    email_personal VARCHAR(100),
    email_work VARCHAR(100),
    url VARCHAR(255),
    instagram VARCHAR(255),
    youtube VARCHAR(255),
    linkedin VARCHAR(255),
    tiktok VARCHAR(255),
    facebook VARCHAR(255),
    line_id VARCHAR(100),
    adr_street VARCHAR(100),
    adr_city VARCHAR(100),
    adr_region VARCHAR(100),
    adr_postal VARCHAR(20),
    adr_country VARCHAR(100),
    note TEXT,
    photo_url VARCHAR(255),
    createdAt TIMESTAMP DEFAULT NOW()
);

-- Table pour les sources de leads
CREATE TABLE IF NOT EXISTS lead_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Index pour accélérer les recherches sur leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_createdAt ON leads(createdAt);

-- Index pour accélérer les recherches sur contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email_personal ON contacts(email_personal);
CREATE INDEX IF NOT EXISTS idx_contacts_email_work ON contacts(email_work);
CREATE INDEX IF NOT EXISTS idx_contacts_createdAt ON contacts(createdAt);
