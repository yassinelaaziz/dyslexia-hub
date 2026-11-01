import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrainingRecord } from '@dyslexia-hub/core';
import { getTrainingStorage } from '../../storage/trainingStorage';

const TrainingHistoryPage: React.FC = () => {
  const [userId] = useState('user-1'); // In a real app, this would come from auth
  const [history, setHistory] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const moduleNames: Record<string, { name: string; icon: string }> = {
    'phonological-training': { name: 'Phonological Awareness', icon: '🔤' },
    'ran-training': { name: 'Rapid Naming', icon: '⚡' },
    'working-memory': { name: 'Working Memory', icon: '🧠' },
    'fluency-training': { name: 'Reading Fluency', icon: '📖' }
  };

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    try {
      const storage = getTrainingStorage();
      const trainingHistory = await storage.getTrainingHistory(userId);
      setHistory(trainingHistory);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load training history:', error);
      setLoading(false);
    }
  };

  const filteredHistory = filter === 'all'
    ? history
    : history.filter(record => record.trainingModule === filter);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const exportHistory = () => {
    const csv = [
      ['Date', 'Module', 'Level', 'Score', 'Time Spent', 'Completed'].join(','),
      ...filteredHistory.map(record => [
        formatDate(record.date),
        moduleNames[record.trainingModule]?.name || record.trainingModule,
        record.level,
        record.score,
        formatTime(record.timeSpent),
        record.completed ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/training"
            className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Training History
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            View your past training sessions and track your progress over time
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by module:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Modules</option>
                {Object.entries(moduleNames).map(([id, info]) => (
                  <option key={id} value={id}>
                    {info.icon} {info.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={exportHistory}
              disabled={filteredHistory.length === 0}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* History Table */}
        {filteredHistory.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Time Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredHistory.map((record) => {
                    const moduleInfo = moduleNames[record.trainingModule];
                    return (
                      <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{moduleInfo?.icon || '📦'}</span>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {moduleInfo?.name || record.trainingModule}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {record.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            record.score >= 80
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : record.score >= 60
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                            {Math.round(record.score)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatTime(record.timeSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.completed ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium">
                              Incomplete
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No training history yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start your first training session to see your history here
            </p>
            <Link
              to="/training"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
            >
              Go to Training Dashboard
            </Link>
          </div>
        )}

        {/* Statistics Summary */}
        {history.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {history.length}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(history.reduce((sum, r) => sum + r.score, 0) / history.length)}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(history.reduce((sum, r) => sum + r.timeSpent, 0) / 60)}m
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round((history.filter(r => r.completed).length / history.length) * 100)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingHistoryPage;
