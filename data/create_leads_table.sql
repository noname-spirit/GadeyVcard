-- SQL pour créer la table leads
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    domaine VARCHAR(50) NOT NULL,
    note TEXT,
    createdAt TIMESTAMP NOT NULL,
    source VARCHAR(50) NOT NULL
);