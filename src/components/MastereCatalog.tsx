import React, { useState, useMemo } from 'react';
import { MastereProgram, MasterType, MasterDomain } from '../types/mastere';
import { MastereCard } from './MastereCard';
import { MastereDetailModal } from './MastereDetailModal';
import { Search, Filter, BookOpen, Layers } from 'lucide-react';

interface MastereCatalogProps {
  masteres: MastereProgram[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onApplyMastere: (mastere: MastereProgram) => void;
  lang: 'fr' | 'ar' | 'tn';
}

export const MastereCatalog: React.FC<MastereCatalogProps> = ({
  masteres,
  searchTerm,
  setSearchTerm,
  onApplyMastere,
  lang,
}) => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [modalMastere, setModalMastere] = useState<MastereProgram | null>(null);

  const domains = [
    { id: 'all', label: 'Tous les domaines' },
    { id: 'Informatique & IA', label: 'Informatique & IA' },
    { id: 'Gestion & Finance', label: 'Gestion & Finance' },
    { id: 'Ingénierie & Technologie', label: 'Ingénierie & Tech' },
    { id: 'Droit & Sciences Politiques', label: 'Droit & Politique' },
  ];

  const types = [
    { id: 'all', label: 'Tous les types' },
    { id: 'recherche', label: 'Mastère Recherche (M.R)' },
    { id: 'professionnel', label: 'Mastère Professionnel (M.P)' },
  ];

  const filteredMasteres = useMemo(() => {
    return masteres.filter(m => {
      const matchSearch = searchTerm === '' || 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.university.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDomain = selectedDomain === 'all' || m.domain === selectedDomain;
      const matchType = selectedType === 'all' || m.type === selectedType;

      return matchSearch && matchDomain && matchType;
    });
  }, [masteres, searchTerm, selectedDomain, selectedType]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
            Offre de Formation Universitaire 2026/2027
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            Catalogue National des Mastères
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Consultez les conditions d’accès, le barème de score spécifique et les quotas de chaque établissement universitaire tunisien.
          </p>
        </div>

        {/* Count indicator */}
        <div className="text-xs text-slate-500 font-medium">
          Affichage de <span className="font-bold text-slate-900 font-mono tabular-nums">{filteredMasteres.length}</span> formations sur <span className="font-bold text-slate-900 font-mono tabular-nums">{masteres.length}</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        {/* Search row */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par mot-clé, spécialité, faculté (FST, ISG, INSAT, ENIT, IHEC)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Segmented Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {domains.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedDomain === d.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedType === t.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Master Cards */}
      {filteredMasteres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMasteres.map((m) => (
            <MastereCard
              key={m.id}
              mastere={m}
              onSelect={(item) => setModalMastere(item)}
              onApply={(item) => onApplyMastere(item)}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 font-display">
            Aucun mastère ne correspond à vos filtres
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Essayez de modifier votre recherche ou de réinitialiser les filtres par domaine et par type.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedDomain('all');
              setSelectedType('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
          >
            Réinitialiser tous les filtres
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <MastereDetailModal
        mastere={modalMastere}
        onClose={() => setModalMastere(null)}
        onApply={(item) => onApplyMastere(item)}
        lang={lang}
      />
    </section>
  );
};
