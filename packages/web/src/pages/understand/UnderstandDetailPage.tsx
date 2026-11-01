import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import understandData from '../../data/understand-dyslexia.json';

const UnderstandDetailPage: React.FC = () => {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [section, setSection] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>('content');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const found = (understandData.sections as any[]).find((s) => s.id === sectionId);
    setSection(found);
  }, [sectionId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const printPage = () => {
    window.print();
  };

  if (!section) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Section not found</p>
          <Link
            to="/understand"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Understand Dyslexia
          </Link>
        </div>
      </div>
    );
  }

  const sectionIcon = section.icon || '📚';
  const sectionColor = section.color || 'blue';

  const colorClasses: Record<string, { bg: string; border: string; text: string; accent: string }> = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-900 dark:text-blue-100', accent: 'bg-blue-500' },
    green: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', text: 'text-green-900 dark:text-green-100', accent: 'bg-green-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', text: 'text-purple-900 dark:text-purple-100', accent: 'bg-purple-500' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-700', text: 'text-orange-900 dark:text-orange-100', accent: 'bg-orange-500' },
    red: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-700', text: 'text-red-900 dark:text-red-100', accent: 'bg-red-500' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-700', text: 'text-indigo-900 dark:text-indigo-100', accent: 'bg-indigo-500' },
    teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-700', text: 'text-teal-900 dark:text-teal-100', accent: 'bg-teal-500' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-700', text: 'text-amber-900 dark:text-amber-100', accent: 'bg-amber-500' },
    slate: { bg: 'bg-slate-50 dark:bg-slate-900/20', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-900 dark:text-slate-100', accent: 'bg-slate-500' },
  };

  const colors = colorClasses[sectionColor] || colorClasses.blue;

  // Generate table of contents from content structure
  const generateTableOfContents = () => {
    const toc: { id: string; label: string; level: number }[] = [];
    const content = section.content;

    if (content.overview) {
      toc.push({ id: 'overview', label: 'Overview', level: 1 });
    }

    Object.keys(content).forEach(key => {
      if (key !== 'overview' && typeof content[key] === 'object') {
        const subContent = content[key];
        if (subContent.title) {
          toc.push({ id: key, label: subContent.title, level: 1 });
        } else {
          toc.push({ id: key, label: key.replace(/([A-Z])/g, ' $1').trim(), level: 1 });
        }

        // Add nested items
        if (Array.isArray(subContent)) {
          subContent.forEach((item: any, idx: number) => {
            if (item.name) {
              toc.push({ id: `${key}-${idx}`, label: item.name, level: 2 });
            }
          });
        } else if (typeof subContent === 'object' && subContent !== null) {
          Object.keys(subContent).forEach(subKey => {
            if (subKey !== 'title' && subKey !== 'overview' && typeof subContent[subKey] === 'object') {
              if (subContent[subKey].title) {
                toc.push({ id: `${key}-${subKey}`, label: subContent[subKey].title, level: 2 });
              }
            }
          });
        }
      }
    });

    return toc;
  };

  const tableOfContents = generateTableOfContents();

  const renderContent = (content: any, parentKey: string = '') => {
    if (typeof content === 'string') {
      return <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>;
    }

    if (Array.isArray(content)) {
      return (
        <ul className="space-y-3">
          {content.map((item: any, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <span className={`flex-shrink-0 w-3 h-3 mt-2 ${colors.accent} rounded-full transform hover:scale-125 transition-transform`} />
              <span className="text-lg text-gray-700 dark:text-gray-300">
                {typeof item === 'string' ? item : renderContent(item, `${parentKey}-${index}`)}
              </span>
            </li>
          ))}
        </ul>
      );
    }

    if (typeof content === 'object' && content !== null) {
      return (
        <div className="space-y-4">
          {Object.entries(content).map(([key, value]) => {
            const sectionKey = parentKey ? `${parentKey}-${key}` : key;
            const isExpanded = expandedSections.has(sectionKey);

            if (key === 'title') {
              return (
                <h4 key={key} className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value as string}
                </h4>
              );
            }

            if (key === 'overview' || key === 'description') {
              return (
                <p key={key} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {value as string}
                </p>
              );
            }

            // Render nested objects as expandable sections
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              return (
                <div key={key} className={`p-4 ${colors.bg} rounded-xl border-2 ${colors.border}`}>
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h5>
                    <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      {renderContent(value, sectionKey)}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div key={key} className="mb-3">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </p>
                {renderContent(value, sectionKey)}
              </div>
            );
          })}
        </div>
      );
    }

    return <span>{String(content)}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Back Button */}
        <Link
          to="/understand"
          className="mb-8 inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
        >
          <span className="mr-2">←</span>
          <span>Back to Research Ecosystem</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">📑</span>
                Contents
              </h3>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block py-2 px-3 rounded-lg transition-colors ${
                      item.level === 1
                        ? 'font-semibold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'ml-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-start mb-6">
                <div className="text-6xl mr-6 transform hover:scale-110 transition-transform">
                  {sectionIcon}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    {section.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {section.description}
                  </p>
                  {section.researchStats && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      <div className={`px-4 py-2 ${colors.bg} rounded-lg border ${colors.border}`}>
                        <span className={`text-sm font-semibold ${colors.text}`}>
                          📄 {section.researchStats.papers} papers
                        </span>
                      </div>
                      <div className={`px-4 py-2 ${colors.bg} rounded-lg border ${colors.border}`}>
                        <span className={`text-sm font-semibold ${colors.text}`}>
                          ✓ {section.researchStats.claims} claims
                        </span>
                      </div>
                      <div className={`px-4 py-2 ${colors.bg} rounded-lg border ${colors.border}`}>
                        <span className={`text-sm font-semibold ${colors.text}`}>
                          {section.researchStats.phase}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={printPage}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={() => setActiveTab(activeTab === 'content' ? 'summary' : 'content')}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    activeTab === 'content'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  📄 {activeTab === 'content' ? 'Content View' : 'Summary View'}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200 dark:border-gray-700">
              {activeTab === 'content' ? (
                <div className="space-y-8">
                  {/* Overview */}
                  {section.content.overview && (
                    <div id="overview" className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">📋</span>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h3>
                      </div>
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        {section.content.overview}
                      </p>
                    </div>
                  )}

                  {/* Dynamic Content Rendering */}
                  {Object.entries(section.content)
                    .filter(([key]) => key !== 'overview')
                    .map(([key, value]) => (
                      <div key={key} id={key} className={`p-6 ${colors.bg} rounded-xl border-2 ${colors.border}`}>
                        {typeof value === 'object' && value !== null && 'title' in value ? (
                          <div className="flex items-center mb-4">
                            <span className="text-3xl mr-3">📌</span>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{(value as any).title}</h3>
                          </div>
                        ) : (
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                        )}
                        {renderContent(value, key)}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Summary</h3>
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-700">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {section.content.overview}
                    </p>
                  </div>
                  {section.researchStats && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
                        <div className="text-3xl font-bold text-green-900 dark:text-green-100">{section.researchStats.papers}</div>
                        <div className="text-sm text-green-700 dark:text-green-300">Research Papers</div>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                        <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{section.researchStats.claims}</div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">Verified Claims</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Source citation */}
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/30 dark:to-blue-900/20 rounded-xl border-2 border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">📚</span>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Source</h3>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-gray-900 dark:text-white">{section.source.authors}</strong> ({section.source.year}). {section.source.title}. <em className="text-gray-600 dark:text-gray-400">{section.source.journal}</em>.
                </p>
                {section.source.doi && section.source.doi !== 'Multiple DOIs available in research database' && (
                  <p className="text-base text-gray-600 dark:text-gray-400 mt-3">
                    DOI: <a href={`https://doi.org/${section.source.doi}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                      {section.source.doi}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Related Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="mr-2">🔗</span>
                Related Topics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {understandData.sections
                  .filter((s: any) => s.id !== section.id)
                  .slice(0, 4)
                  .map((relatedSection: any) => (
                    <Link
                      key={relatedSection.id}
                      to={`/understand/${relatedSection.id}`}
                      className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{relatedSection.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{relatedSection.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{relatedSection.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
            aria-label="Back to top"
          >
            ↑
          </button>
        )}
      </div>
    </div>
  );
};

export default UnderstandDetailPage;
