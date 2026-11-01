import React from 'react';

interface GuideStep {
  title: string;
  description: string;
}

interface InterventionGuideProps {
  steps: GuideStep[];
}

/**
 * Display step-by-step intervention guide
 * Shows each step with clear numbering and description
 */
export const InterventionGuide: React.FC<InterventionGuideProps> = ({ steps }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Implementation Guide
      </h3>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full font-semibold text-lg">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-1">
                {step.title}
              </h4>
              <p className="text-base text-gray-700 leading-relaxed">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
