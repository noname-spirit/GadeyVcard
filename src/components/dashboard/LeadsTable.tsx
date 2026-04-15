'use client';

import { useState } from 'react';
import { Download, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface LeadRow {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  domaine: string;
  source: string;
  createdAt: string;
}

interface LeadsTableProps {
  leads: LeadRow[];
  onDelete?: (id: string) => void;
  onExport?: () => void;
}

export function LeadsTable({ leads, onDelete, onExport }: LeadsTableProps) {
  const [search, setSearch] = useState('');

  const filtered = leads.filter((l) =>
    [l.nom, l.email, l.domaine].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un lead..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/50"
          />
        </div>
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport} className="flex items-center gap-1.5">
            <Download size={14} />
            CSV
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-800/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800/60 bg-zinc-900/60">
              {['Nom', 'Email', 'Domaine', 'Source', 'Date', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-zinc-500 text-sm">
                  Aucun lead pour l'instant.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-zinc-200">{lead.nom}</td>
                  <td className="px-4 py-3 text-zinc-400">{lead.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-800 border border-zinc-700/40 text-zinc-400">
                      {lead.domaine}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      lead.source === 'qd code'
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700/40'
                    }`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    {onDelete && (
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-600 text-right">{filtered.length} lead{filtered.length > 1 ? 's' : ''}</p>
    </div>
  );
}
