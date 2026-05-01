'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, Trash2, Search, StickyNote, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { updateLead } from '@/lib/supabase/leads';

export interface LeadRow {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  message?: string;
  domaine: string;
  source: string;
  createdAt: string;
  status?: 'new' | 'contacted' | 'converted';
  notes?: string;
}

type UpdateFields = { statut?: string; notes?: string; source?: string };

interface LeadsTableProps {
  leads: LeadRow[];
  onDelete?: (id: string) => void;
  onExport?: () => void;
  onUpdate?: (id: string, fields: UpdateFields) => void;
}

type LeadStatus = 'new' | 'contacted' | 'converted';

const STATUS = {
  new: { label: 'Nouveau', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  contacted: { label: 'Contacté', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  converted: { label: 'Converti', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
};

const STATUS_CYCLE: (LeadStatus | undefined)[] = [undefined, 'new', 'contacted', 'converted'];
const SOURCE_OPTIONS = ['formulaire', 'qr code', 'téléphone', 'email', 'référence', 'autre'];

const SOURCE_OPTIONS = ['formulaire', 'qr code', 'téléphone', 'email', 'référence', 'autre'];

function initStatuses(rows: LeadRow[]): Record<string, LeadStatus | undefined> {
  const s: Record<string, LeadStatus | undefined> = {};
  rows.forEach((l) => { if (l.statut) s[l.id] = l.statut as LeadStatus; });
  return s;
}
function initNotes(rows: LeadRow[]): Record<string, string> {
  const n: Record<string, string> = {};
  rows.forEach((l) => { if (l.notes) n[l.id] = l.notes; });
  return n;
}
function initSources(rows: LeadRow[]): Record<string, string> {
  const src: Record<string, string> = {};
  rows.forEach((l) => { if (l.source) src[l.id] = l.source; });
  return src;
}

export function LeadsTable({ leads, onDelete, onExport, onUpdate }: LeadsTableProps) {
  const [search, setSearch] = useState('');
  
  const [statuses, setStatuses] = useState<Record<string, LeadStatus | undefined>>(() => {
    const s: Record<string, LeadStatus | undefined> = {};
    leads.forEach((l) => { if (l.status) s[l.id] = l.status; });
    return s;
  });
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const n: Record<string, string> = {};
    leads.forEach((l) => { if (l.notes) n[l.id] = l.notes; });
    return n;
  });
  const [sources, setSources] = useState<Record<string, string>>(() => {
    const src: Record<string, string> = {};
    leads.forEach((l) => { if (l.source) src[l.id] = l.source; });
    return src;
  });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  useEffect(() => {
    const s: Record<string, LeadStatus | undefined> = {};
    const n: Record<string, string> = {};
    const src: Record<string, string> = {};
    leads.forEach((l) => {
      if (l.status && STATUS_CYCLE.includes(l.status)) s[l.id] = l.status;
      if (l.notes) n[l.id] = l.notes;
      if (l.source) src[l.id] = l.source;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatuses(s);
    setNotes(n);
    setSources(src);
  }, [leads]);

  const saveStatus = useCallback((id: string, status: LeadStatus | undefined) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    updateLead(id, { status: status ?? '' });
  }, []);

  const cycleStatus = useCallback((id: string) => {
    const current = statuses[id];
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    saveStatus(id, next);
  }, [statuses, saveStatus]);

  const openNote = (id: string) => {
    setDraftNote(notes[id] ?? '');
    setEditingNote(id);
  };

  const saveNote = useCallback((id: string) => {
    setNotes((prev) => ({ ...prev, [id]: draftNote }));
    setEditingNote(null);
    updateLead(id, { notes: draftNote });
  }, [draftNote]);

  const changeSource = useCallback((id: string, value: string) => {
    setSources((prev) => ({ ...prev, [id]: value }));
    updateLead(id, { source: value });
  }, []);

  const filtered = leads.filter((l) =>
    [l.nom, l.email, l.telephone, l.message, l.domaine].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-4">
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

      {/* Mobile card view */}
      <div className="sm:hidden flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800/60 px-4 py-12 text-center text-zinc-500 text-sm">
            Aucun lead pour l&#39;instant.
          </div>
        ) : (
          filtered.map((lead) => {
            const status = statuses[lead.id];
            const note = notes[lead.id];
            return (
              <div key={lead.id} className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-zinc-200 text-sm truncate">{lead.nom}</span>
                    <span className="text-xs text-zinc-500 truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => cycleStatus(lead.id)}
                      className={[
                        'px-2.5 py-0.5 text-xs rounded-full font-medium border transition-all whitespace-nowrap',
                        status ? STATUS[status].color : 'bg-zinc-800 text-zinc-500 border-zinc-700/40',
                      ].join(' ')}
                    >
                      {status ? STATUS[status].label : '—'}
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-800 border border-zinc-700/40 text-zinc-400">{lead.domaine}</span>
                  <select
                    value={sources[lead.id] ?? lead.source}
                    onChange={(e) => changeSource(lead.id, e.target.value)}
                    className="px-2 py-0.5 text-xs rounded-full border bg-zinc-800 text-zinc-400 border-zinc-700/40 outline-none cursor-pointer"
                  >
                    {SOURCE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <span className="text-xs text-zinc-600 ml-auto">{new Date(lead.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                {lead.telephone && (
                  <span className="text-xs text-zinc-500">{lead.telephone}</span>
                )}
                {lead.message && (
                  <span className="text-xs text-zinc-500 line-clamp-2">{lead.message}</span>
                )}
                {editingNote === lead.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      type="text"
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveNote(lead.id);
                        if (e.key === 'Escape') setEditingNote(null);
                      }}
                      className="flex-1 px-2 py-1 text-xs bg-zinc-800 border border-zinc-700/40 rounded-lg text-zinc-100 outline-none focus:border-orange-500/50"
                    />
                    <button onClick={() => saveNote(lead.id)} className="p-1 text-emerald-400">&#x2713;</button>
                    <button onClick={() => setEditingNote(null)} className="p-1 text-zinc-500"><X size={11} /></button>
                  </div>
                ) : (
                  <button
                    onClick={() => openNote(lead.id)}
                    className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors text-left"
                  >
                    <StickyNote size={12} className={note ? 'text-amber-400' : ''} />
                    <span className="truncate">{note || 'Ajouter une note…'}</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block rounded-2xl border border-zinc-800/60 overflow-x-auto">
        <table className="w-full text-sm min-w-175">
          <thead>
            <tr className="border-b border-zinc-800/60 bg-zinc-900/60">
              {['Nom', 'Email', 'Tel', 'Message', 'Domaine', 'Source', 'Statut', 'Notes', 'Date', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-zinc-500 text-sm">
                  Aucun lead pour l&#39;instant.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => {
                const status = statuses[lead.id];
                const note = notes[lead.id];
                return (
                  <tr key={lead.id} className="border-b border-zinc-800/40 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-200">{lead.nom}</td>
                    <td className="px-4 py-3 text-zinc-400">{lead.email}</td>
                    <td className="px-4 py-3 text-zinc-400">{lead.telephone || <span className="text-zinc-700">—</span>}</td>
                    <td className="px-4 py-3 text-zinc-400 max-w-36">
                      {lead.message ? (
                        <span className="block truncate" title={lead.message}>{lead.message}</span>
                      ) : (
                        <span className="text-zinc-700">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-800 border border-zinc-700/40 text-zinc-400">
                        {lead.domaine}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={sources[lead.id] ?? lead.source}
                        onChange={(e) => changeSource(lead.id, e.target.value)}
                        className="px-2 py-0.5 text-xs rounded-full border bg-zinc-800 text-zinc-400 border-zinc-700/40 outline-none focus:border-orange-500/50 cursor-pointer"
                      >
                        {SOURCE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => cycleStatus(lead.id)}
                        title="Cliquer pour changer le statut"
                        className={[
                          'px-2.5 py-0.5 text-xs rounded-full font-medium border transition-all',
                          status ? STATUS[status].color : 'bg-zinc-800 text-zinc-500 border-zinc-700/40 hover:border-zinc-600',
                        ].join(' ')}
                      >
                        {status ? STATUS[status].label : '—'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {editingNote === lead.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            type="text"
                            value={draftNote}
                            onChange={(e) => setDraftNote(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveNote(lead.id);
                              if (e.key === 'Escape') setEditingNote(null);
                            }}
                            className="w-32 px-2 py-1 text-xs bg-zinc-800 border border-zinc-700/40 rounded-lg text-zinc-100 outline-none focus:border-orange-500/50"
                          />
                          <button onClick={() => saveNote(lead.id)} className="p-1 text-emerald-400 hover:text-emerald-300">&#x2713;</button>
                          <button onClick={() => setEditingNote(null)} className="p-1 text-zinc-500 hover:text-zinc-300"><X size={11} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openNote(lead.id)}
                          title={note || 'Ajouter une note'}
                          className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors max-w-36 truncate"
                        >
                          <StickyNote size={12} className={note ? 'text-amber-400' : ''} />
                          <span className="truncate">{note || 'Note...'}</span>
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-600 text-right">{filtered.length} lead{filtered.length > 1 ? 's' : ''}</p>
    </div>
  );
}
