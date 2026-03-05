// Ce script vérifie la connexion front/back, l'API leads et la base Neon/Postgres
// À lancer en local ou sur Vercel pour tester l'intégrité du site

import { sql } from '@vercel/postgres';

async function testDatabase() {
  try {
    const result = await sql`SELECT 1+1 AS test;`;
    if (result.rows[0].test === 2) {
      console.log('✅ Connexion à la base Neon/Postgres OK');
    } else {
      console.error('❌ Problème de connexion à la base');
    }
  } catch (err) {
    console.error('❌ Erreur base Neon/Postgres:', err);
  }
}

async function testApiLeads() {
  try {
    const res = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Test',
        email: 'test@email.com',
        telephone: '0600000000',
        source: 'script',
        createdAt: new Date().toISOString(),
      }),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      console.log('✅ API /api/leads fonctionne (lead enregistré)');
    } else {
      console.error('❌ API /api/leads erreur:', data);
    }
  } catch (err) {
    console.error('❌ Erreur API /api/leads:', err);
  }
}

async function runIntegrityCheck() {
  console.log('--- Vérification intégrité site ---');
  await testDatabase();
  await testApiLeads();
  console.log('--- Fin vérification ---');
}

runIntegrityCheck();
