import React from 'react';

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
  guide: {
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  notes: string;
}

interface InterventionDetailModalProps {
  intervention: Intervention | null;
  onClose: () => void;
}

const InterventionDetailModal: React.FC<InterventionDetailModalProps> = ({
  intervention,
  onClose
}) => {
  if (!intervention) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {intervention.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {intervention.category} • {intervention.evidenceTier}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {intervention.description}
            </p>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {intervention.duration}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Frequency</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {intervention.frequency}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {intervention.difficultyLevel}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Age Groups</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {intervention.ageGroups.join(', ')}
              </p>
            </div>
          </div>

          {/* Guide Steps */}
          {intervention.guide && intervention.guide.steps.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Implementation Guide
              </h3>
              <div className="space-y-3">
                {intervention.guide.steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Time Commitment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Time Commitment
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {intervention.timeCommitmentDetails}
            </p>
          </div>

          {/* Age-Specific Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Age-Specific Recommendations
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {intervention.ageSpecificRecommendations}
            </p>
          </div>

          {/* Success Rates */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Success Rates
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {intervention.successRates}
            </p>
          </div>

          {/* Cost Considerations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Cost Considerations
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {intervention.costConsiderations}
            </p>
          </div>

          {/* Contraindications */}
          {intervention.contraindications && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Contraindications
              </h3>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {intervention.contraindications}
                </p>
              </div>
            </div>
          )}

          {/* Research Evidence */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Research Evidence
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {intervention.researchEvidenceSummary}
            </p>
          </div>

          {/* Source */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Source
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                {intervention.source.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {intervention.source.authors} ({intervention.source.year})
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {intervention.source.journal}
              </p>
              {intervention.source.doi && (
                <a
                  href={`https://doi.org/${intervention.source.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  DOI: {intervention.source.doi}
                </a>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Confidence: {intervention.source.confidence}%
              </p>
            </div>
          </div>

          {/* Notes */}
          {intervention.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Additional Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {intervention.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterventionDetailModal;
