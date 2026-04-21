'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { MenuItem } from '@/components/card/CardFrontRestaurant';

const CATEGORIES = ['Entrées', 'Plats', 'Desserts', 'Boissons'];

interface MenuManagerProps {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
}

function MenuItemRow({
  item,
  onToggle,
  onDelete,
}: {
  item: MenuItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200',
        item.available
          ? 'bg-zinc-800/40 border-zinc-700/40'
          : 'bg-zinc-900/40 border-zinc-800/40 opacity-60',
      ].join(' ')}
    >
      <GripVertical size={14} className="text-zinc-600 shrink-0 cursor-grab" />

      {item.emoji && <span className="text-base w-5 text-center shrink-0">{item.emoji}</span>}

      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium ${item.available ? 'text-zinc-200' : 'text-zinc-500 line-through'}`}>
          {item.name}
        </span>
      </div>

      <span className="text-sm font-semibold text-orange-400 shrink-0">{item.price}€</span>

      {/* Toggle épuisé */}
      <button
        onClick={onToggle}
        className={[
          'relative w-11 h-6 rounded-full border transition-all duration-300 shrink-0',
          item.available
            ? 'bg-emerald-500/20 border-emerald-500/40'
            : 'bg-zinc-800 border-zinc-700/40',
        ].join(' ')}
        title={item.available ? 'Marquer épuisé' : 'Remettre disponible'}
      >
        <motion.div
          animate={{ x: item.available ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={[
            'absolute top-0.5 w-5 h-5 rounded-full shadow-sm transition-colors duration-300',
            item.available ? 'bg-emerald-400' : 'bg-zinc-500',
          ].join(' ')}
        />
      </button>

      <span className={`text-xs font-medium w-14 text-right shrink-0 ${item.available ? 'text-emerald-400' : 'text-zinc-500'}`}>
        {item.available ? 'Dispo' : 'Épuisé'}
      </span>

      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
      >
        <Trash2 size={13} />
      </button>
    </motion.div>
  );
}

function AddItemForm({ category, onAdd }: { category: string; onAdd: (item: MenuItem) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [emoji, setEmoji] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !price) return;
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      price: parseFloat(price),
      category,
      available: true,
      emoji: emoji.trim() || undefined,
    });
    setName(''); setPrice(''); setEmoji(''); setOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-orange-400 transition-colors py-1"
      >
        <Plus size={12} />
        Ajouter un plat
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 mt-2">
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🍜"
                className="w-12 px-2 py-2 text-center text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 outline-none focus:border-orange-500/50"
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom du plat"
                className="flex-1 px-3 py-2 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50"
              />
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Prix"
                type="number"
                min="0"
                step="0.5"
                className="w-20 px-3 py-2 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50"
              />
              <Button size="sm" onClick={handleAdd}>OK</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MenuManager({ items, onChange }: MenuManagerProps) {
  const toggle = (id: string) => {
    onChange(items.map((i) => i.id === id ? { ...i, available: !i.available } : i));
  };

  const remove = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  const add = (item: MenuItem) => {
    onChange([...items, item]);
  };

  const grouped = CATEGORIES.reduce<Record<string, MenuItem[]>>((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat);
    return acc;
  }, {});

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Gestion du menu</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Les toggles se reflètent en temps réel sur votre carte
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Temps réel actif
        </div>
      </div>

      {CATEGORIES.map((cat) => {
        const catItems = grouped[cat];
        const isCollapsed = collapsed[cat];
        const soldOut = catItems.filter((i) => !i.available).length;

        return (
          <div key={cat} className="flex flex-col gap-2">
            <button
              onClick={() => setCollapsed((c) => ({ ...c, [cat]: !c[cat] }))}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-300">{cat}</span>
                <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700/40 px-2 py-0.5 rounded-full">
                  {catItems.length}
                </span>
                {soldOut > 0 && (
                  <span className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                    {soldOut} épuisé{soldOut > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <ChevronDown
                size={14}
                className={`text-zinc-600 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
              />
            </button>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-1.5 overflow-hidden"
                >
                  {catItems.map((item) => (
                    <MenuItemRow
                      key={item.id}
                      item={item}
                      onToggle={() => toggle(item.id)}
                      onDelete={() => remove(item.id)}
                    />
                  ))}
                  <AddItemForm category={cat} onAdd={add} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
