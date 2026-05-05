'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Phone, Globe, MapPin, Clock, Utensils, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { CardTheme, CardLanguage } from '@/types/card';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  emoji?: string;
}

export interface RestaurantCardData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  photo: string;
  contact: {
    phone?: string;
    website?: string;
    address?: string;
    hours?: string;
  };
  menu: MenuItem[];
  accentColor?: string;
  updatedAt?: string;
}

const labels = {
  fr: { save: 'Enregistrer Contact', reserve: 'Réserver', menu: 'Notre menu', sold_out: 'Épuisé', close: 'Fermer' },
  en: { save: 'Save Contact', reserve: 'Reserve', menu: 'Our menu', sold_out: 'Sold out', close: 'Close' },
  th: { save: 'บันทึกข้อมูล', reserve: 'จอง', menu: 'เมนู', sold_out: 'หมดแล้ว', close: 'ปิด' },
};

const CATEGORY_ORDER = ['Entrées', 'Plats', 'Desserts', 'Boissons'];

interface CardFrontRestaurantProps {
  card: RestaurantCardData;
  theme: CardTheme;
  language: CardLanguage;
  isSaving?: boolean;
  onSaveContact: () => void;
  onMenuOpen?: () => void; // si fourni → panel externe, pas d'overlay interne
}

export interface RestaurantMenuPanelProps {
  card: RestaurantCardData;
  theme: CardTheme;
  language: CardLanguage;
}

export function RestaurantMenuPanel({ card, theme, language }: RestaurantMenuPanelProps) {
  const dark = theme === 'dark';
  const l = labels[language];
  const overlayBg = dark ? 'bg-zinc-900' : 'bg-zinc-50';
  const overlayHeader = dark ? 'border-zinc-800/60' : 'border-zinc-200/60';
  const sectionTitle = dark ? 'text-zinc-400' : 'text-zinc-500';
  const itemBg = dark ? 'bg-zinc-800/40 border-zinc-700/40' : 'bg-white border-zinc-200';
  const itemText = dark ? 'text-zinc-200' : 'text-zinc-800';
  const itemPrice = dark ? 'text-orange-400' : 'text-orange-500';

  const grouped = CATEGORY_ORDER.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    const items = card.menu.filter((m) => m.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`w-full rounded-3xl border overflow-hidden ${overlayBg} ${dark ? 'border-zinc-800/60' : 'border-zinc-200/60'}`}
    >
      <div className={`flex items-center gap-2 px-4 py-3.5 border-b ${overlayHeader}`}>
        <Utensils size={13} style={{ color: 'var(--accent)' }} />
        <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-zinc-900'}`}>{l.menu}</span>
        <span className={`text-xs ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>· {card.name}</span>
      </div>
      <div className="px-4 py-4 flex flex-col gap-5">
        {Object.entries(grouped).map(([category, items], i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            className="flex flex-col gap-2"
          >
            <p
              className={`text-[11px] font-semibold ${sectionTitle} tracking-widest uppercase pb-1 border-b`}
              style={{ borderColor: 'color-mix(in srgb, var(--accent) 20%, transparent)' }}
            >
              {category}
            </p>
            {items.map((item) => (
              <div key={item.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${itemBg}`}>
                <div className="flex items-center gap-2">
                  {item.emoji && <span className="text-base">{item.emoji}</span>}
                  <span className={`text-sm font-medium ${item.available ? itemText : 'text-zinc-600 line-through'}`}>
                    {item.name}
                  </span>
                </div>
                {item.available ? (
                  <span className={`text-sm font-bold ${itemPrice}`}>{item.price}€</span>
                ) : (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dark ? 'text-zinc-500 bg-zinc-800/60 border-zinc-700/40' : 'text-zinc-400 bg-zinc-100 border-zinc-200'}`}>
                    {l.sold_out}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function CardFrontRestaurant({ card, theme, language, isSaving, onSaveContact, onMenuOpen }: CardFrontRestaurantProps) {
  const dark = theme === 'dark';
  const l = labels[language];
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuClick = () => onMenuOpen ? onMenuOpen() : setMenuOpen(true);

  const cardBg = dark
    ? 'from-zinc-900 via-zinc-900/95 to-black border-zinc-800/60'
    : 'from-white via-zinc-50 to-zinc-100 border-zinc-200/80';
  const cardShadow = dark ? 'shadow-2xl' : 'shadow-xl shadow-zinc-300/40';
  const nameColor = dark ? 'text-white' : 'text-zinc-900';
  const metaColor = dark ? 'text-zinc-500' : 'text-zinc-400';
  const actionBtn = dark
    ? 'bg-zinc-800/50 hover:bg-emerald-500/15 border-zinc-700/30 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400'
    : 'bg-zinc-100 hover:bg-emerald-500/10 border-zinc-200 hover:border-emerald-500/40 text-zinc-600 hover:text-emerald-500';

  // Menu overlay styles
  const overlayBg = dark ? 'bg-zinc-950' : 'bg-zinc-50';
  const overlayHeader = dark ? 'border-zinc-800/60' : 'border-zinc-200/60';
  const sectionTitle = dark ? 'text-zinc-400' : 'text-zinc-500';
  const itemBg = dark ? 'bg-zinc-800/40 border-zinc-700/40' : 'bg-white border-zinc-200';
  const itemText = dark ? 'text-zinc-200' : 'text-zinc-800';
  const itemPrice = dark ? 'text-orange-400' : 'text-orange-500';

  const grouped = CATEGORY_ORDER.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    const items = card.menu.filter((m) => m.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div className="relative w-full">

      {/* ── Card principale ── */}
      <div className={`w-full bg-linear-to-br ${cardBg} rounded-3xl border backdrop-blur-2xl ${cardShadow} flex flex-col transition-colors duration-300 relative`}>

        {/* Decorative top line */}
        <div
          className="absolute top-0 left-12 right-12 h-px"
          style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--accent) 30%, transparent), transparent)' }}
        />

        <div className="px-4 pt-6 pb-6 flex flex-col items-center gap-4">

          {/* Photo ronde */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            <div
              className="w-24 h-24 rounded-full p-0.5 relative"
              style={{
                background: 'linear-gradient(to bottom right, color-mix(in srgb, var(--accent) 70%, white), var(--accent), color-mix(in srgb, var(--accent) 70%, black))',
                boxShadow: '0 10px 30px color-mix(in srgb, var(--accent) 30%, transparent)',
              }}
            >
              <div
                className="absolute inset-0 rounded-full blur-xl"
                style={{ background: 'color-mix(in srgb, var(--accent) 20%, transparent)' }}
              />
              <Image
                src={card.photo}
                alt={card.name}
                width={96}
                height={96}
                className="w-full h-full rounded-full object-cover relative z-10"
              />
            </div>
          </motion.div>

          {/* Nom + tagline */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center gap-1 text-center"
          >
            <h2 className={`text-xl font-bold ${nameColor} tracking-tight`}>{card.name}</h2>
            <p
              className="font-medium text-xs tracking-widest uppercase"
              style={{ color: 'color-mix(in srgb, var(--accent) 80%, transparent)' }}
            >
              {card.tagline}
            </p>
          </motion.div>

          {/* Meta */}
          {(card.contact.address || card.contact.hours) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className={`flex flex-wrap justify-center gap-3 ${metaColor} text-xs`}
            >
              {card.contact.address && (
                <span className="flex items-center gap-1"><MapPin size={11} />{card.contact.address}</span>
              )}
              {card.contact.hours && (
                <span className="flex items-center gap-1"><Clock size={11} />{card.contact.hours}</span>
              )}
            </motion.div>
          )}

          {/* Boutons action */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex gap-2 w-full"
          >
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
          </motion.div>

          {/* Bouton Notre menu */}
          {card.menu.length > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5 }}
              onClick={handleMenuClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border"
              style={{
                color: 'var(--accent)',
                borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
                background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              }}
            >
              <Utensils size={14} />
              {l.menu}
              <ChevronRight size={13} className="ml-auto opacity-50" />
            </motion.button>
          )}

          {/* Save contact */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            onClick={onSaveContact}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-2xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(to right, var(--accent), color-mix(in srgb, var(--accent) 80%, black))',
              boxShadow: '0 10px 30px color-mix(in srgb, var(--accent) 25%, transparent)',
            }}
          >
            <Download size={15} className={isSaving ? 'animate-spin' : ''} />
            {l.save}
          </motion.button>
        </div>

        {/* Decorative bottom line */}
        <div
          className="absolute bottom-0 left-12 right-12 h-px"
          style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--accent) 30%, transparent), transparent)' }}
        />
      </div>

      {/* ── Menu overlay pleine page ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={`absolute inset-0 rounded-3xl overflow-y-auto flex flex-col z-50 ${overlayBg}`}
            style={{ minHeight: '100%' }}
          >
            {/* Header overlay */}
            <div className={`flex items-center justify-between px-4 py-4 border-b ${overlayHeader} sticky top-0 ${overlayBg} z-10`}>
              <div className="flex items-center gap-2">
                <Utensils size={14} style={{ color: 'var(--accent)' }} />
                <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-zinc-900'}`}>{l.menu}</span>
                <span className={`text-xs ${dark ? 'text-zinc-500' : 'text-zinc-400'}`}>· {card.name}</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className={`p-1.5 rounded-xl transition-all ${dark ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900'}`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Contenu menu */}
            <div className="px-4 py-4 flex flex-col gap-5">
              {Object.entries(grouped).map(([category, items], i) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="flex flex-col gap-2"
                >
                  <p
                    className={`text-[11px] font-semibold ${sectionTitle} tracking-widest uppercase pb-1 border-b`}
                    style={{ borderColor: 'color-mix(in srgb, var(--accent) 20%, transparent)' }}
                  >
                    {category}
                  </p>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${itemBg}`}
                    >
                      <div className="flex items-center gap-2">
                        {item.emoji && <span className="text-base">{item.emoji}</span>}
                        <span className={`text-sm font-medium ${item.available ? itemText : 'text-zinc-600 line-through'}`}>
                          {item.name}
                        </span>
                      </div>
                      {item.available ? (
                        <span className={`text-sm font-bold ${itemPrice}`}>{item.price}€</span>
                      ) : (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${dark ? 'text-zinc-500 bg-zinc-800/60 border-zinc-700/40' : 'text-zinc-400 bg-zinc-100 border-zinc-200'}`}>
                          {l.sold_out}
                        </span>
                      )}
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
