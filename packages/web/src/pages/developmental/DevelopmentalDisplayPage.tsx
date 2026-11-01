import React, { useState, useEffect } from 'react';
import { MilestoneCard } from '../../components/developmental';
import developmentalData from '../../data/developmental-milestones.json';

interface Milestone {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  action: string;
}

const DevelopmentalDisplayPage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    setMilestones(developmentalData.milestones as Milestone[]);
  }, []);

  const handleBackToList = () => {
    setSelectedMilestone(null);
  };

  // Detail view
  if (selectedMilestone) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={handleBackToList}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Back to milestones list"
        >
          ← Back to List
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedMilestone.name}
          </h1>

          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {selectedMilestone.description}
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Indicators
            </h3>
            <ul className="space-y-3">
              {selectedMilestone.indicators.map((indicator, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                  <p className="text-base text-gray-700">{indicator}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Recommended Action
            </h3>
            <p className="text-base text-green-800">
              {selectedMilestone.action}
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
        Developmental Display
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore developmental milestones for dyslexia across the lifespan
      </p>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Understanding Developmental Trajectories
        </h3>
        <p className="text-base text-blue-800">
          Dyslexia manifests differently across developmental stages. Early identification and intervention can significantly improve outcomes, but the brain remains plastic throughout life.
        </p>
      </div>

      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">
          Brain Plasticity
        </h3>
        <p className="text-base text-purple-800 mb-3">
          {developmentalData.neuroplasticity.description}
        </p>
        <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
          {developmentalData.neuroplasticity.keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-2">
          Disclaimer
        </h3>
        <p className="text-base text-amber-800">
          {developmentalData.disclaimer}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            onClick={() => setSelectedMilestone(milestone)}
          />
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Visual Note
        </h3>
        <p className="text-base text-gray-700">
          An interactive developmental timeline visualization will be implemented in a future sprint. Currently, this page displays text-based information about developmental milestones and indicators.
        </p>
      </div>
    </div>
  );
};

export default DevelopmentalDisplayPage;
