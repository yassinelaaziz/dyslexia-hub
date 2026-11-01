import React from 'react';

interface Milestone {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  action: string;
}

interface MilestoneCardProps {
  milestone: Milestone;
  onClick: () => void;
}

/**
 * Card component displaying developmental milestone
 * Shows milestone name, description, and key indicators
 */
export const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 bg-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 transition-shadow border-2 border-transparent hover:border-blue-300"
      aria-label={`View details for ${milestone.name}`}
    >
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-gray-900">
          {milestone.name}
        </h3>

        <p className="text-base text-gray-700 leading-relaxed">
          {milestone.description}
        </p>

        <div className="mt-2">
          <p className="text-sm font-medium text-gray-600 mb-1">
            Key Indicators:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            {milestone.indicators.slice(0, 2).map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
            {milestone.indicators.length > 2 && (
              <li className="text-blue-600">+{milestone.indicators.length - 2} more</li>
            )}
          </ul>
        </div>
      </div>
    </button>
  );
};
