import React from 'react';
import { ModuleProgress } from '@dyslexia-hub/core';

interface TrainingProgressCardProps {
  moduleProgress: ModuleProgress;
  moduleName: string;
  moduleIcon: string;
  onStart?: () => void;
}

const TrainingProgressCard: React.FC<TrainingProgressCardProps> = ({
  moduleProgress,
  moduleName,
  moduleIcon,
  onStart
}) => {
  const { currentLevel, highestLevel, sessionsCompleted, bestScore, totalTimeSpent, completionPercentage, isComplete } = moduleProgress;

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{moduleIcon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{moduleName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Level {currentLevel} of 3
            </p>
          </div>
        </div>
        {isComplete && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
            Complete
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Sessions</p>
          <p className="font-semibold text-gray-900 dark:text-white">{sessionsCompleted}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Best Score</p>
          <p className="font-semibold text-gray-900 dark:text-white">{Math.round(bestScore)}%</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Time Spent</p>
          <p className="font-semibold text-gray-900 dark:text-white">{formatTime(totalTimeSpent)}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Highest Level</p>
          <p className="font-semibold text-gray-900 dark:text-white">{highestLevel}</p>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onStart}
        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Start ${moduleName}`}
      >
        {isComplete ? 'Review' : 'Continue'}
      </button>
    </div>
  );
};

export default TrainingProgressCard;
