import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import understandData from '../../data/understand-dyslexia.json';

interface Section {
  id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  visualMetaphor?: string;
  content: any;
  researchStats?: {
    papers: number | string;
    claims: number | string;
    phase: string;
  };
  source?: {
    title: string;
    authors: string;
    year: number | string;
    journal: string;
    doi: string;
  };
}

interface Vision {
  statement: string;
  description: string;
  audience: string;
  features: string[];
}

const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string; accent: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-900 dark:text-blue-100', hover: 'hover:border-blue-400 dark:hover:border-blue-500', accent: 'bg-blue-500' },
  green: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', text: 'text-green-900 dark:text-green-100', hover: 'hover:border-green-400 dark:hover:border-green-500', accent: 'bg-green-500' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', text: 'text-purple-900 dark:text-purple-100', hover: 'hover:border-purple-400 dark:hover:border-purple-500', accent: 'bg-purple-500' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', text: 'text-orange-900 dark:text-orange-100', hover: 'hover:border-orange-400 dark:hover:border-orange-500', accent: 'bg-orange-500' },
  red: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-700', text: 'text-red-900 dark:text-red-100', hover: 'hover:border-red-400 dark:hover:border-red-500', accent: 'bg-red-500' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-700', text: 'text-indigo-900 dark:text-indigo-100', hover: 'hover:border-indigo-400 dark:hover:border-indigo-500', accent: 'bg-indigo-500' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-700', text: 'text-teal-900 dark:text-teal-100', hover: 'hover:border-teal-400 dark:hover:border-teal-500', accent: 'bg-teal-500' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-700', text: 'text-amber-900 dark:text-amber-100', hover: 'hover:border-amber-400 dark:hover:border-amber-500', accent: 'bg-amber-500' },
  slate: { bg: 'bg-slate-50 dark:bg-slate-900/20', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-900 dark:text-slate-100', hover: 'hover:border-slate-400 dark:hover:border-slate-500', accent: 'bg-slate-500' },
};

const UnderstandDyslexiaPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [vision, setVision] = useState<Vision | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setSections(understandData.sections as Section[]);
    setVision(understandData.vision as Vision);
  }, []);

  const filteredSections = sections.filter(section => {
    const matchesSearch = searchQuery === '' ||
      section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || section.color === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedPath = ['what-is-dyslexia', 'causes', 'brain-neurology', 'manifestations', 'interventions'];

  const quickFacts = [
    { icon: '📊', label: '460 Papers', description: 'Peer-reviewed research papers' },
    { icon: '✓', label: '335 Claims', description: 'Verified research claims' },
    { icon: '🧬', label: '7 Phases', description: 'Research phases completed' },
    { icon: '🌍', label: '100%', description: 'Evidence-based content' },
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: '🌐' },
    { id: 'blue', name: 'Foundational', icon: '📖' },
    { id: 'green', name: 'Etiology', icon: '🧬' },
    { id: 'purple', name: 'Neurology', icon: '🧠' },
    { id: 'orange', name: 'Development', icon: '📈' },
    { id: 'red', name: 'Manifestations', icon: '🎭' },
    { id: 'indigo', name: 'Theory', icon: '🔬' },
    { id: 'teal', name: 'Interventions', icon: '💡' },
    { id: 'amber', name: 'Debates', icon: '⚖️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section with Vision */}
        <div className="text-center mb-12">
          <div className="mb-6 text-6xl animate-bounce">🧠</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Understand Dyslexia
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            A comprehensive research-backed guide to understanding dyslexia
          </p>

          {/* Vision Statement */}
          {vision && (
            <div className="max-w-4xl mx-auto mb-8 p-8 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-blue-300 dark:border-blue-600 shadow-xl">
              <div className="text-4xl mb-4">🌟</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-lg text-gray-800 dark:text-gray-200 italic mb-6 leading-relaxed">
                "{vision.statement}"
              </p>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
                {vision.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">👥 Audience</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{vision.audience}</p>
                </div>
                <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">✨ Key Features</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {vision.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Facts Banner */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Research at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickFacts.map((fact, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-2">{fact.icon}</div>
                <div className="text-3xl font-bold mb-1">{fact.label}</div>
                <div className="text-sm opacity-90">{fact.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🔍 Search Topics
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search for topics, concepts, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📂 Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recommended Learning Path */}
        <div className="mb-12 p-8 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl border-2 border-green-300 dark:border-green-600 shadow-xl">
          <div className="flex items-center mb-6">
            <span className="text-4xl mr-4">🎯</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommended Learning Path</h2>
              <p className="text-gray-600 dark:text-gray-300">Follow this sequence for a comprehensive understanding</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {recommendedPath.map((pathId, idx) => {
              const section = sections.find(s => s.id === pathId);
              if (!section) return null;
              const colors = colorClasses[section.color || 'blue'] || colorClasses.blue;
              return (
                <React.Fragment key={pathId}>
                  <Link
                    to={`/understand/${section.id}`}
                    className={`px-4 py-3 ${colors.bg} ${colors.border} border-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 ${colors.text}`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-semibold">{section.name}</span>
                  </Link>
                  {idx < recommendedPath.length - 1 && (
                    <span className="text-2xl text-gray-400 dark:text-gray-600">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Interactive Section Cards */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Explore Research Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSections.map((section) => {
              const colors = colorClasses[section.color || 'blue'] || colorClasses.blue;
              const isExpanded = expandedSection === section.id;
              const isRecommended = recommendedPath.includes(section.id);

              return (
                <div
                  key={section.id}
                  className={`${colors.bg} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${colors.border} ${colors.hover} transform hover:-translate-y-1`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl transform hover:scale-110 transition-transform">
                        {section.icon || '📚'}
                      </div>
                      {isRecommended && (
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {section.name}
                    </h3>
                    <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {section.description}
                    </p>

                    {/* Expandable Research Stats */}
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                      className="w-full mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          📊 Research Stats
                        </span>
                        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </div>
                    </button>

                    {isExpanded && section.researchStats && (
                      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Papers:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{section.researchStats.papers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Claims:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{section.researchStats.claims}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Phase:</span>
                          <span className="font-semibold text-gray-900 dark:text-white text-xs">{section.researchStats.phase}</span>
                        </div>
                      </div>
                    )}

                    <Link
                      to={`/understand/${section.id}`}
                      className={`block w-full text-center py-3 ${colors.accent} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                    >
                      Explore This Topic →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* No Results Message */}
        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No topics found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-2 border-amber-200 dark:border-amber-700">
          <div className="flex items-start">
            <div className="text-3xl mr-4">⚠️</div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Important Disclaimer
              </h3>
              <p className="text-base text-amber-800 dark:text-amber-200 leading-relaxed">
                {understandData.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderstandDyslexiaPage;
