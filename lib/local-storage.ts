import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

// --- Contact ---



// --- Leads ---

export interface Lead {
    id: string;
    name: string;
    contact: string;
    language: string;
    timestamp: string;
}

export function readLocalLeads(): Lead[] {
    ensureDataDir();
    try {
        if (fs.existsSync(LEADS_FILE)) {
            const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
            return JSON.parse(raw);
        }
    } catch {
        // File doesn't exist or is invalid
    }
    return [];
}

export function writeLocalLeads(leads: Lead[]) {
    ensureDataDir();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}
