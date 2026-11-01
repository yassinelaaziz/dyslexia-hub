import React, { useState, useEffect } from 'react';
import { ClaimCard, PhaseFilter } from '../../components/research';
import researchData from '../../data/research-claims.json';
import phaseSummary from '../../data/phase-summary.json';

interface SupportingPaper {
  title: string;
  authors: string;
  year: number;
  journal: string;
  doi: string | null;
  agreementLevel: 'strong' | 'moderate' | 'partial';
}

interface EvidenceStrength {
  level: 'high' | 'moderate' | 'low';
  sampleSize: string;
  replication: string;
  consensus: string;
}

interface Claim {
  id: string;
  text: string;
  phase: string;
  confidence: number;
  source: {
    title: string;
    authors: string;
    year: number;
    journal: string;
    doi: string;
  };
  // Enhanced fields (optional for backward compatibility)
  detailedDescription?: string;
  supportingPapers?: SupportingPaper[];
  contradictoryPapers?: SupportingPaper[];
  evidenceStrength?: EvidenceStrength;
  researchContext?: string;
  crossReferences?: string[];
  methodologyNotes?: string;
  applicability?: string;
}

interface Phase {
  id: string;
  name: string;
  title: string;
  claims: number;
  description: string;
}

interface EnhancedPhase extends Phase {
  papers: number;
  keyTopics: string[];
  keyFindings: string[];
  evidenceQuality: string;
  controversies?: string[];
}

const ResearchPage: React.FC = () => {
  const [phases, setPhases] = useState<EnhancedPhase[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showPhaseOverview, setShowPhaseOverview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const CLAIMS_PER_PAGE = 10;

  useEffect(() => {
    // Load research data from JSON and enhance with phase summary
    const basePhases = researchData.phases as Phase[];
    const enhancedPhases = basePhases.map(phase => {
      const summary = phaseSummary.phases.find(p => p.id === phase.id);
      return {
        ...phase,
        papers: summary?.papers || 0,
        keyTopics: summary?.keyTopics || [],
        keyFindings: summary?.keyFindings || [],
        evidenceQuality: summary?.evidenceQuality || 'Unknown',
        controversies: summary?.controversies
      };
    });
    setPhases(enhancedPhases);
    setClaims(researchData.sampleClaims as Claim[]);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPhase, searchQuery]);

  // Filter claims based on selected phase and search query
  const filteredClaims = claims.filter((claim) => {
    const matchesPhase = !selectedPhase || claim.phase === selectedPhase;
    const matchesSearch =
      !searchQuery ||
      claim.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.source.authors.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPhase && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredClaims.length / CLAIMS_PER_PAGE);
  const startIndex = (currentPage - 1) * CLAIMS_PER_PAGE;
  const endIndex = startIndex + CLAIMS_PER_PAGE;
  const visibleClaims = filteredClaims.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleBackToList = () => {
    setSelectedClaim(null);
  };

  // Detail view
  if (selectedClaim) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={handleBackToList}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Back to claims list"
        >
          ← Back to List
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Research Claim
          </h1>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-lg text-gray-800 leading-relaxed">
              {selectedClaim.text}
            </p>
            {selectedClaim.detailedDescription && (
              <p className="text-base text-gray-700 mt-3 leading-relaxed">
                {selectedClaim.detailedDescription}
              </p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confidence Rating
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{ width: `${selectedClaim.confidence * 100}%` }}
                  role="progressbar"
                  aria-valuenow={selectedClaim.confidence * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {(selectedClaim.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Source
            </h3>
            <p className="text-base text-gray-700">
              <strong>{selectedClaim.source.authors}</strong> ({selectedClaim.source.year}). {selectedClaim.source.title}. <em>{selectedClaim.source.journal}</em>.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              DOI: <a href={`https://doi.org/${selectedClaim.source.doi}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {selectedClaim.source.doi}
              </a>
            </p>
          </div>

          {selectedClaim.supportingPapers && selectedClaim.supportingPapers.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Supporting Papers ({selectedClaim.supportingPapers.length})
              </h3>
              <ul className="space-y-2">
                {selectedClaim.supportingPapers.map((paper, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <strong>{paper.authors}</strong> ({paper.year}). {paper.title}. <em>{paper.journal}</em>.
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                      {paper.agreementLevel} agreement
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedClaim.contradictoryPapers && selectedClaim.contradictoryPapers.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Contradictory Papers ({selectedClaim.contradictoryPapers.length})
              </h3>
              <ul className="space-y-2">
                {selectedClaim.contradictoryPapers.map((paper, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    <strong>{paper.authors}</strong> ({paper.year}). {paper.title}. <em>{paper.journal}</em>.
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedClaim.evidenceStrength && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Evidence Strength
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Level:</span> {selectedClaim.evidenceStrength.level}
                </div>
                <div>
                  <span className="font-medium">Sample Size:</span> {selectedClaim.evidenceStrength.sampleSize}
                </div>
                <div>
                  <span className="font-medium">Replication:</span> {selectedClaim.evidenceStrength.replication}
                </div>
                <div>
                  <span className="font-medium">Consensus:</span> {selectedClaim.evidenceStrength.consensus}
                </div>
              </div>
            </div>
          )}

          {selectedClaim.researchContext && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Research Context
              </h3>
              <p className="text-base text-gray-700">
                {selectedClaim.researchContext}
              </p>
            </div>
          )}

          {selectedClaim.methodologyNotes && (
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                Methodology Notes
              </h3>
              <p className="text-base text-gray-700">
                {selectedClaim.methodologyNotes}
              </p>
            </div>
          )}

          {selectedClaim.applicability && (
            <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-900 mb-2">
                Applicability
              </h3>
              <p className="text-base text-gray-700">
                {selectedClaim.applicability}
              </p>
            </div>
          )}

          {selectedClaim.crossReferences && selectedClaim.crossReferences.length > 0 && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Related Claims
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedClaim.crossReferences.map((ref, idx) => (
                  <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Important Note
            </h3>
            <p className="text-base text-amber-800">
              This claim is based on peer-reviewed research from the dyslexia research repository.
              Always consult the original source for complete context and methodology.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Research Repository
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore evidence-based research claims about dyslexia
      </p>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Repository Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
          <div>
            <span className="font-medium">Total Papers:</span> {phaseSummary.metadata.totalPapers}
          </div>
          <div>
            <span className="font-medium">Total Claims:</span> {phaseSummary.metadata.totalClaims}
          </div>
          <div>
            <span className="font-medium">Research Phases:</span> {phases.length}
          </div>
          <div>
            <span className="font-medium">Completion Date:</span> {phaseSummary.metadata.completionDate}
          </div>
        </div>
      </div>

      {/* Phase Overview Section */}
      <div className="mb-8">
        <button
          onClick={() => setShowPhaseOverview(!showPhaseOverview)}
          className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-expanded={showPhaseOverview}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              📊 Phase Overview ({phases.length} Phases)
            </h2>
            <span className="text-2xl">{showPhaseOverview ? '▼' : '▶'}</span>
          </div>
        </button>

        {showPhaseOverview && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedPhase(phase.id);
                  setShowPhaseOverview(false);
                }}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {phase.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {phase.title}
                </p>
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>📄 {phase.papers} papers</span>
                  <span>✓ {phase.claims} claims</span>
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400">
                  Evidence Quality: {phase.evidenceQuality}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-64 flex-shrink-0">
          <PhaseFilter
            phases={phases}
            selectedPhase={selectedPhase}
            onPhaseChange={setSelectedPhase}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Search bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search research claims"
            />
          </div>

          {/* Results count */}
          <p className="text-base text-gray-600 mb-4">
            Showing {filteredClaims.length} claim{filteredClaims.length !== 1 ? 's' : ''}
          </p>

          {/* Phase description with enhanced details */}
          {selectedPhase && (() => {
            const phase = phases.find((p) => p.id === selectedPhase);
            if (!phase) return null;
            return (
              <div 
                className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 transition-colors"
                onClick={() => setSelectedPhase(null)}
                title="Click to clear phase filter"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {phase.name}: {phase.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {phase.description}
                    </p>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600">
                      📄 {phase.papers} papers
                    </div>
                    <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-600">
                      ✓ {phase.claims} claims
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                    EVIDENCE QUALITY
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {phase.evidenceQuality}
                  </div>
                </div>

                {phase.keyTopics && phase.keyTopics.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1">
                      KEY TOPICS
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {phase.keyTopics.slice(0, 5).map((topic, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600"
                        >
                          {topic}
                        </span>
                      ))}
                      {phase.keyTopics.length > 5 && (
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-xs text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-600">
                          +{phase.keyTopics.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {phase.controversies && phase.controversies.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                      CONTROVERSIES
                    </div>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc list-inside">
                      {phase.controversies.slice(0, 2).map((controversy, idx) => (
                        <li key={idx}>{controversy}</li>
                      ))}
                      {phase.controversies.length > 2 && (
                        <li className="text-amber-600 dark:text-amber-400">
                          +{phase.controversies.length - 2} more controversies
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                  Click to clear this phase filter
                </div>
              </div>
            );
          })()}

          {/* Claim cards grid */}
          <div className="grid grid-cols-1 gap-4">
            {visibleClaims.map((claim, index) => (
              <div key={claim.id} data-claim-index={index}>
                <ClaimCard
                  claim={claim}
                  onClick={() => setSelectedClaim(claim)}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredClaims.length)} of {filteredClaims.length} claims
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
                  aria-label="Previous page"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages = [];
                    // Always show first page
                    pages.push(1);
                    
                    // Show ellipsis if gap after first page
                    if (currentPage > 3) {
                      pages.push('...');
                    }
                    
                    // Show pages around current page
                    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                      pages.push(i);
                    }
                    
                    // Show ellipsis if gap before last page
                    if (currentPage < totalPages - 2) {
                      pages.push('...');
                    }
                    
                    // Always show last page
                    if (totalPages > 1) {
                      pages.push(totalPages);
                    }
                    
                    return pages.map((page, idx) => {
                      if (page === '...') {
                        return <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page as number)}
                          className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                          }`}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}

          {filteredClaims.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No claims match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedPhase(null);
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              ✓ Research Content Integration
            </h3>
            <p className="text-base text-green-800 dark:text-green-200">
              This page displays research claims from the dyslexia research repository, synthesized from
              {phaseSummary.metadata.totalPapers} peer-reviewed papers across {phaseSummary.metadata.totalPhases} research phases.
              All claims are verified with source citations using the Strict-Source-Required methodology.
              Click on any claim to view detailed source information and DOI links.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResearchPage;
