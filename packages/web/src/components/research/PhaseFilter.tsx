import React from 'react';

interface Phase {
  id: string;
  name: string;
  title: string;
  claims: number;
  description: string;
}

interface PhaseFilterProps {
  phases: Phase[];
  selectedPhase: string | null;
  onPhaseChange: (phase: string | null) => void;
}

/**
 * Filter component for research phases
 * Allows filtering by research phase
 */
export const PhaseFilter: React.FC<PhaseFilterProps> = ({
  phases,
  selectedPhase,
  onPhaseChange
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Filter By Phase</h3>

      <div className="space-y-2">
        <button
          onClick={() => onPhaseChange(null)}
          className={`w-full text-left p-3 rounded-md border transition-colors ${
            selectedPhase === null
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          aria-label="Show all phases"
        >
          All Phases ({phases.reduce((sum, p) => sum + p.claims, 0)} claims)
        </button>

        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => onPhaseChange(phase.id)}
            className={`w-full text-left p-3 rounded-md border transition-colors ${
              selectedPhase === phase.id
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
            aria-label={`Filter by ${phase.name} phase`}
          >
            <div className="font-medium">{phase.name}</div>
            <div className="text-sm opacity-90">{phase.claims} claims</div>
          </button>
        ))}
      </div>
    </div>
  );
};
