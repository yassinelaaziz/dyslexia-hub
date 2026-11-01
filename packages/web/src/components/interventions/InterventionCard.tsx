import React from 'react';
import { Link } from 'react-router-dom';
import { EfficacyRating } from './EfficacyRating';

interface Intervention {
  id: string;
  name: string;
  category: string;
  description: string;
  evidenceTier: 'established' | 'emerging' | 'experimental';
  efficacyRating: number;
  ageGroups: string[];
  duration: string;
  frequency: string;
  difficultyLevel: string;
  costConsiderations: string;
  timeCommitmentDetails: string;
  ageSpecificRecommendations: string;
  successRates: string;
  contraindications: string;
  researchEvidenceSummary: string;
  source: {
    title: string;
    authors: string;
    year: number;
    journal: string;
    doi: string;
    confidence: number;
  };
}

interface InterventionCardProps {
  intervention: Intervention;
  onClick: () => void;
}

/**
 * Card component displaying intervention summary
 * Shows key information with dyslexia-friendly design
 */
export const InterventionCard: React.FC<InterventionCardProps> = ({
  intervention,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-shadow border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600"
      style={{ minHeight: '200px' }}
      aria-label={`View details for ${intervention.name}`}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {intervention.name}
        </h3>

        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          {intervention.description}
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <EfficacyRating
            rating={intervention.efficacyRating}
            evidenceTier={intervention.evidenceTier}
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            {intervention.category}
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded">
            {intervention.difficultyLevel}
          </span>
          <span>{intervention.duration}</span>
        </div>
      </div>
    </button>
  );
};
