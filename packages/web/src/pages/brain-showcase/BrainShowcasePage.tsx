import React, { useState, useEffect } from 'react';
import { BrainRegionCard } from '../../components/brain';
import brainData from '../../data/brain-regions.json';

interface BrainRegion {
  id: string;
  name: string;
  description: string;
  findings: string[];
  source: {
    title: string;
    authors: string;
    year: number;
    journal: string;
    doi: string;
  };
}

const BrainShowcasePage: React.FC = () => {
  const [regions, setRegions] = useState<BrainRegion[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<BrainRegion | null>(null);

  useEffect(() => {
    setRegions(brainData.regions as BrainRegion[]);
  }, []);

  const handleBackToList = () => {
    setSelectedRegion(null);
  };

  // Detail view
  if (selectedRegion) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={handleBackToList}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Back to brain regions list"
        >
          ← Back to List
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedRegion.name}
          </h1>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {selectedRegion.description}
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Research Findings
            </h3>
            <ul className="space-y-3">
              {selectedRegion.findings.map((finding, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                  <p className="text-base text-gray-700">{finding}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Source
            </h3>
            <p className="text-base text-gray-700">
              <strong>{selectedRegion.source.authors}</strong> ({selectedRegion.source.year}). {selectedRegion.source.title}. <em>{selectedRegion.source.journal}</em>.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              DOI: <a href={`https://doi.org/${selectedRegion.source.doi}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {selectedRegion.source.doi}
              </a>
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">
              Important Note
            </h3>
            <p className="text-base text-amber-800">
              Brain findings in dyslexia show variability across individuals. These findings represent group-level patterns from research studies, not diagnostic markers for individuals. Neuroplasticity means the brain can change with intervention.
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
        Brain Showcase
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore brain regions and findings related to dyslexia
      </p>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Understanding Dyslexia and the Brain
        </h3>
        <p className="text-base text-blue-800">
          Research has identified patterns in brain structure and function associated with dyslexia. However, individual differences are significant, and the brain can change with intervention through neuroplasticity.
        </p>
      </div>

      <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">
          Disclaimer
        </h3>
        <p className="text-base text-amber-800">
          {brainData.disclaimer}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {regions.map((region) => (
          <BrainRegionCard
            key={region.id}
            region={region}
            onClick={() => setSelectedRegion(region)}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Visual Note
        </h3>
        <p className="text-base text-gray-700">
          A 3D brain visualization with interactive brain regions will be implemented in a future sprint. Currently, this page displays text-based information about brain regions associated with dyslexia.
        </p>
      </div>
    </div>
  );
};

export default BrainShowcasePage;
