import React from 'react';

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

interface BrainRegionCardProps {
  region: BrainRegion;
  onClick: () => void;
}

/**
 * Card component displaying brain region information
 * Shows region name, description, and key findings
 */
export const BrainRegionCard: React.FC<BrainRegionCardProps> = ({ region, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 bg-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-shadow border-2 border-transparent hover:border-blue-300"
      aria-label={`View details for ${region.name}`}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900">
          {region.name}
        </h3>

        <p className="text-base text-gray-700 leading-relaxed">
          {region.description}
        </p>

        <div className="mt-2">
          <p className="text-sm font-medium text-gray-600 mb-1">
            Key Findings:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            {region.findings.slice(0, 2).map((finding, index) => (
              <li key={index}>{finding}</li>
            ))}
            {region.findings.length > 2 && (
              <li className="text-blue-600">+{region.findings.length - 2} more</li>
            )}
          </ul>
        </div>
      </div>
    </button>
  );
};
