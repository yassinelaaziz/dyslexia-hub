import React from 'react';

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
}

interface ClaimCardProps {
  claim: Claim;
  onClick: () => void;
}

/**
 * Card component displaying research claim
 * Shows claim text, confidence, and source citation
 */
export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 bg-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-shadow border-2 border-transparent hover:border-blue-300"
      aria-label={`View details for claim: ${claim.text.substring(0, 50)}...`}
    >
      <div className="flex flex-col gap-3">
        <p className="text-base text-gray-800 leading-relaxed line-clamp-3">
          {claim.text}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
            Confidence: {(claim.confidence * 100).toFixed(0)}%
          </span>
          <span className="text-sm text-gray-600">
            {claim.source.authors} ({claim.source.year})
          </span>
        </div>

        <p className="text-sm text-gray-500 italic">
          {claim.source.title}
        </p>
      </div>
    </button>
  );
};
