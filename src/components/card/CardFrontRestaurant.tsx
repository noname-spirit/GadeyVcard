'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download, Phone, Globe, MapPin, Clock, Utensils } from 'lucide-react';
import type { CardTheme, CardLanguage } from '@/types/card';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;  // false = épuisé (Supabase Realtime le met à jour)
  emoji?: string;
}

export interface RestaurantCardData {
  id: string;
  slug: string;
  name: string;           // Nom du restaurant
  tagline: string;        // Ex : "Cuisine thaï authentique · Bangkok"
  photo: string;
  contact: {
    phone?: string;
    website?: string;
    address?: string;
    hours?: string;       // Ex : "11h–22h · 7j/7"
  };
  menu: MenuItem[];
  accentColor?: string;
  updatedAt?: string;
}

const labels = {
  fr: { save: 'Enregistrer Contact', reserve: 'Réserver', menu: 'Notre menu', sold_out: 'Épuisé' },
  en: { save: 'Save Contact', reserve: 'Reserve', menu: 'Our menu', sold_out: 'Sold out' },
  th: { save: 'บันทึกข้อมูล', reserve: 'จอง', menu: 'เมนู', sold_out: 'หมดแล้ว' },
};

const CATEGORY_ORDER = ['Entrées', 'Plats', 'Desserts', 'Boissons'];

interface CardFrontRestaurantProps {
  card: RestaurantCardData;
  theme: CardTheme;
  language: CardLanguage;
  isSaving?: boolean;
  onSaveContact: () => void;
}

export function CardFrontRestaurant({ card, theme, language, isSaving, onSaveContact }: CardFrontRestaurantProps) {
  const dark = theme === 'dark';
  const l = labels[language];

  const cardBg = dark
    ? 'from-zinc-900 via-zinc-900/95 to-black border-zinc-800/60'
    : 'from-white via-zinc-50 to-zinc-100 border-zinc-200/80';
  const cardShadow = dark ? 'shadow-2xl shadow-orange-500/5' : 'shadow-xl shadow-zinc-300/40';
  const nameColor = dark ? 'text-white' : 'text-zinc-900';
  const metaColor = dark ? 'text-zinc-400' : 'text-zinc-500';
  const actionBtn = dark
    ? 'bg-zinc-800/50 hover:bg-emerald-500/15 border-zinc-700/30 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400'
    : 'bg-zinc-100 hover:bg-emerald-500/10 border-zinc-200 hover:border-emerald-500/40 text-zinc-600 hover:text-emerald-500';
  const sectionTitle = dark ? 'text-zinc-400' : 'text-zinc-500';
  const itemBg = dark ? 'bg-zinc-800/40 border-zinc-700/40' : 'bg-zinc-100 border-zinc-200';
  const itemText = dark ? 'text-zinc-200' : 'text-zinc-800';
  const itemPrice = dark ? 'text-orange-400' : 'text-orange-500';

  // Grouper les plats par catégorie dans l'ordre défini
  const grouped = CATEGORY_ORDER.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    const items = card.menu.filter((m) => m.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className={`w-full bg-linear-to-br ${cardBg} rounded-3xl border backdrop-blur-2xl ${cardShadow} flex flex-col transition-colors duration-300 relative overflow-hidden`}>

      {/* Decorative top line */}
      <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />

      {/* Hero photo */}
      <div className="relative w-full h-36 overflow-hidden">
        <Image
          src={card.photo}
          alt={card.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/70" />
        <div className="absolute bottom-3 left-4 right-4">
          <h2 className="text-xl font-bold text-white">{card.name}</h2>
          <p className="text-zinc-300 text-xs mt-0.5">{card.tagline}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">

        {/* Meta info */}
        <div className={`flex flex-wrap gap-3 ${metaColor} text-xs`}>
          {card.contact.address && (
            <span className="flex items-center gap-1"><MapPin size={12} />{card.contact.address}</span>
          )}
          {card.contact.hours && (
            <span className="flex items-center gap-1"><Clock size={12} />{card.contact.hours}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {card.contact.phone && (
            <a href={`tel:${card.contact.phone}`} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${actionBtn} border transition-all duration-300 text-xs font-medium`}>
              <Phone size={13} />
              {l.reserve}
            </a>
          )}
          {card.contact.website && (
            <a href={card.contact.website} target="_blank" rel="noopener noreferrer" className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl ${actionBtn} border transition-all duration-300 text-xs font-medium`}>
              <Globe size={13} />
              Site
            </a>
          )}
        </div>

        {/* Menu */}
        {card.menu.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className={`flex items-center gap-2 ${sectionTitle} text-xs uppercase tracking-widest font-semibold`}>
              <Utensils size={12} />
              {l.menu}
            </div>

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="flex flex-col gap-2">
                <p className={`text-xs font-semibold ${sectionTitle} tracking-wide`}>{category}</p>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border ${itemBg} transition-all`}
                  >
                    <div className="flex items-center gap-2">
                      {item.emoji && <span className="text-base">{item.emoji}</span>}
                      <span className={`text-sm font-medium ${item.available ? itemText : 'text-zinc-600 line-through'}`}>
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {!item.available ? (
                        <span className="text-xs font-semibold text-zinc-500 bg-zinc-800/60 border border-zinc-700/40 px-2 py-0.5 rounded-full">
                          {l.sold_out}
                        </span>
                      ) : (
                        <span className={`text-sm font-semibold ${itemPrice}`}>{item.price}€</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Save contact */}
        <motion.button
          onClick={onSaveContact}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-500/25 disabled:opacity-50"
        >
          <Download size={15} className={isSaving ? 'animate-spin' : ''} />
          {l.save}
        </motion.button>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent" />
    </div>
  );
}
