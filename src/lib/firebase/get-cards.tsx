import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

export interface CardData {
  slug: string;
  uid: string;
  name: string;
  title: string;
  contact: {
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
    line: string | null;
  };
  socials: {
    instagram: string | null;
    youtube: string | null;
    linkedin: string | null;
    website: string | null;
  };
  photo: string | null;
  template: string;
  accentColor: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export async function getCardsByUid(uid: string): Promise<CardData[]> {
    console.log(uid, "uid");
  const q = query(collection(db, 'cards'), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as CardData);
}
