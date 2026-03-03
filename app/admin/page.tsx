'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Save, LogOut, Check, AlertCircle, Eye, EyeOff, Loader2, Contact, ChevronDown, ChevronUp } from 'lucide-react';

const VCARD_FIELDS = [
    { key: 'fn', label: 'Nom complet', type: 'text', required: true, group: 'Identité' },
    { key: 'title', label: 'Titre / Poste', type: 'text', required: false, group: 'Identité' },
    { key: 'org', label: 'Entreprise', type: 'text', required: false, group: 'Identité' },
    { key: 'bday', label: 'Date de naissance', type: 'date', required: false, group: 'Identité' },
    { key: 'tel_mobile', label: 'Téléphone mobile', type: 'tel', required: false, group: 'Téléphone' },
    { key: 'tel_work', label: 'Téléphone bureau', type: 'tel', required: false, group: 'Téléphone' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'tel', required: false, group: 'Téléphone' },
    { key: 'email_personal', label: 'Email personnel', type: 'email', required: false, group: 'Email' },
    { key: 'email_work', label: 'Email professionnel', type: 'email', required: false, group: 'Email' },
    { key: 'url', label: 'Site web', type: 'url', required: false, group: 'Web & Réseaux' },
    { key: 'instagram', label: 'Instagram URL', type: 'url', required: false, group: 'Web & Réseaux' },
    { key: 'youtube', label: 'YouTube URL', type: 'url', required: false, group: 'Web & Réseaux' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'url', required: false, group: 'Web & Réseaux' },
    { key: 'tiktok', label: 'TikTok URL', type: 'url', required: false, group: 'Web & Réseaux' },
    { key: 'facebook', label: 'Facebook URL', type: 'url', required: false, group: 'Web & Réseaux' },
    { key: 'line_id', label: 'Line ID', type: 'text', required: false, group: 'Web & Réseaux' },
    { key: 'adr_street', label: 'Rue', type: 'text', required: false, group: 'Adresse' },
    { key: 'adr_city', label: 'Ville', type: 'text', required: false, group: 'Adresse' },
    { key: 'adr_region', label: 'Région / Province', type: 'text', required: false, group: 'Adresse' },
    { key: 'adr_postal', label: 'Code postal', type: 'text', required: false, group: 'Adresse' },
    { key: 'adr_country', label: 'Pays', type: 'text', required: false, group: 'Adresse' },
    { key: 'note', label: 'Note / Bio', type: 'textarea', required: false, group: 'Autre' },
    { key: 'photo_url', label: 'Photo URL', type: 'url', required: false, group: 'Autre' },
];

const GROUPS = ['Identité', 'Téléphone', 'Email', 'Web & Réseaux', 'Adresse', 'Autre'];

type Feedback = { type: 'success' | 'error'; message: string } | null;

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authFeedback, setAuthFeedback] = useState<Feedback>(null);

    const [contactData, setContactData] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState<Feedback>(null);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Identité']));

    // Check auth status on mount via httpOnly cookie
    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (res.ok) {
                    setAuthenticated(true);
                }
            })
            .catch(() => { })
            .finally(() => setCheckingAuth(false));
    }, []);

    // Load contact data when authenticated
    useEffect(() => {
        if (authenticated) {
            loadContactData();
        }
    }, [authenticated]);

    const loadContactData = async () => {
        try {
            const res = await fetch('/api/contact');
            const json = await res.json();
            if (json.data) {
                setContactData(json.data);
            }
        } catch (error) {
            console.error('Failed to load contact data:', error);
        }
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setAuthFeedback(null);

        const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const json = await res.json();

            if (!res.ok) {
                setAuthFeedback({ type: 'error', message: json.error });
                return;
            }

            setAuthenticated(true);
            setUsername('');
            setPassword('');
        } catch {
            setAuthFeedback({ type: 'error', message: 'Erreur de connexion' });
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setAuthenticated(false);
        setContactData({});
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveFeedback(null);

        try {
            const res = await fetch('/api/contact', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fields: contactData }),
            });

            const json = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    handleLogout();
                    return;
                }
                setSaveFeedback({ type: 'error', message: json.error });
                return;
            }

            setSaveFeedback({ type: 'success', message: 'Contact sauvegardé avec succès !' });
            setTimeout(() => setSaveFeedback(null), 3000);
        } catch {
            setSaveFeedback({ type: 'error', message: 'Erreur de sauvegarde' });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (key: string, value: string) => {
        setContactData(prev => ({ ...prev, [key]: value }));
    };

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(group)) {
                next.delete(group);
            } else {
                next.add(group);
            }
            return next;
        });
    };

    // AUTH SCREEN
    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-400" size={32} />
            </div>
        );
    }

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <Contact size={28} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
                        <p className="text-zinc-500 text-sm mt-1">Smart vCard</p>
                    </div>

                    <div className="bg-zinc-900/60 rounded-2xl border border-zinc-800/40 p-6 backdrop-blur-xl">
                        <div className="flex mb-6 bg-zinc-800/40 rounded-xl p-1">
                            <button
                                onClick={() => { setIsRegister(false); setAuthFeedback(null); }}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${!isRegister ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-500'}`}
                            >
                                <LogIn size={14} className="inline mr-1.5" />
                                Connexion
                            </button>
                            <button
                                onClick={() => { setIsRegister(true); setAuthFeedback(null); }}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${isRegister ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-500'}`}
                            >
                                <UserPlus size={14} className="inline mr-1.5" />
                                Inscription
                            </button>
                        </div>

                        <form onSubmit={handleAuth} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Nom d&apos;utilisateur</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-900/60 text-white text-sm rounded-xl border border-zinc-800/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all"
                                    placeholder="admin"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 pr-11 bg-zinc-900/60 text-white text-sm rounded-xl border border-zinc-800/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
                            >
                                {authLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : isRegister ? (
                                    <UserPlus size={16} />
                                ) : (
                                    <LogIn size={16} />
                                )}
                                {authLoading ? 'Chargement...' : isRegister ? 'Créer le compte' : 'Se connecter'}
                            </button>
                        </form>

                        <AnimatePresence>
                            {authFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs border ${authFeedback.type === 'error'
                                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                        : 'bg-green-500/10 border-green-500/30 text-green-400'
                                        }`}
                                >
                                    {authFeedback.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                                    {authFeedback.message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isRegister && (
                            <p className="text-zinc-600 text-xs mt-4 text-center">
                                Maximum 2 comptes autorisés
                            </p>
                        )}
                    </div>

                    <a
                        href="/"
                        className="block mt-6 text-center text-zinc-600 hover:text-zinc-400 text-xs transition-colors duration-200"
                    >
                        ← Retour à la Smart vCard
                    </a>
                </motion.div>
            </div>
        );
    }

    // ADMIN DASHBOARD
    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white">
            {/* Top Bar */}
            <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/40">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                            <Contact size={16} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight">Admin Panel</h1>
                            <p className="text-zinc-500 text-xs">Gestion du contact</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white border border-zinc-800/40 hover:border-zinc-700/60 transition-all"
                    >
                        <LogOut size={14} />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-6 py-8">
                {/* Field Groups */}
                <div className="flex flex-col gap-4">
                    {GROUPS.map(group => {
                        const fields = VCARD_FIELDS.filter(f => f.group === group);
                        const isExpanded = expandedGroups.has(group);
                        const filledCount = fields.filter(f => contactData[f.key]?.trim()).length;

                        return (
                            <motion.div
                                key={group}
                                layout
                                className="bg-zinc-900/40 rounded-2xl border border-zinc-800/30 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleGroup(group)}
                                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-zinc-800/20 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold text-white">{group}</span>
                                        {filledCount > 0 && (
                                            <span className="px-2 py-0.5 bg-orange-500/15 text-orange-400 rounded-full text-xs font-medium">
                                                {filledCount}/{fields.length}
                                            </span>
                                        )}
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp size={16} className="text-zinc-500" />
                                    ) : (
                                        <ChevronDown size={16} className="text-zinc-500" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 flex flex-col gap-4">
                                                {fields.map(field => (
                                                    <div key={field.key}>
                                                        <label className="text-xs text-zinc-400 mb-1.5 block font-medium">
                                                            {field.label}
                                                            {field.required && <span className="text-orange-400 ml-1">*</span>}
                                                        </label>
                                                        {field.type === 'textarea' ? (
                                                            <textarea
                                                                value={contactData[field.key] || ''}
                                                                onChange={e => updateField(field.key, e.target.value)}
                                                                rows={3}
                                                                className="w-full px-4 py-3 bg-zinc-900/60 text-white text-sm rounded-xl border border-zinc-800/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all resize-none"
                                                                placeholder={field.label}
                                                            />
                                                        ) : (
                                                            <input
                                                                type={field.type}
                                                                value={contactData[field.key] || ''}
                                                                onChange={e => updateField(field.key, e.target.value)}
                                                                className="w-full px-4 py-3 bg-zinc-900/60 text-white text-sm rounded-xl border border-zinc-800/40 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/30 transition-all"
                                                                placeholder={field.label}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Save Button */}
                <div className="sticky bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent pt-6 pb-8 mt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
                    >
                        {saving ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {saving ? 'Sauvegarde en cours...' : 'Sauvegarder le contact'}
                    </button>

                    <AnimatePresence>
                        {saveFeedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`mt-3 p-3 rounded-xl flex items-center justify-center gap-2 text-xs border ${saveFeedback.type === 'error'
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                                    }`}
                            >
                                {saveFeedback.type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
                                {saveFeedback.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
