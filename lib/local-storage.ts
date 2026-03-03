import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONTACT_FILE = path.join(DATA_DIR, 'contact.json');

// Ensure data directory exists
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

export function readLocalContact(): Record<string, string> {
    ensureDataDir();
    try {
        if (fs.existsSync(CONTACT_FILE)) {
            const raw = fs.readFileSync(CONTACT_FILE, 'utf-8');
            return JSON.parse(raw);
        }
    } catch {
        // File doesn't exist or is invalid
    }
    return {};
}

export function writeLocalContact(data: Record<string, string>) {
    ensureDataDir();
    fs.writeFileSync(CONTACT_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
