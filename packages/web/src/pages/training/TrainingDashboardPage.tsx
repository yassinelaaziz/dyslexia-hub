import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserTrainingProgress,
  TrainingStatistics,
  Achievement
} from '@dyslexia-hub/core';
import { getTrainingStorage } from '../../storage/trainingStorage';
import TrainingProgressCard from '../../components/training/TrainingProgressCard';
import InterventionDetailModal from '../../components/training/InterventionDetailModal';
import interventionsData from '../../data/interventions.json';
import trainingExercisesData from '../../data/training-exercises.json';
import { EfficacyRating } from '../../components/interventions/EfficacyRating';

const TrainingDashboardPage: React.FC = () => {
  const [userId] = useState('user-1'); // In a real app, this would come from auth
  const [progress, setProgress] = useState<UserTrainingProgress | null>(null);
  const [statistics, setStatistics] = useState<TrainingStatistics | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [interventions, setInterventions] = useState<any[]>([]);
  const [selectedIntervention, setSelectedIntervention] = useState<any>(null);

  const moduleNames: Record<string, { name: string; icon: string }> = {
    'phonological-training': { name: 'Phonological Awareness', icon: '🔤' },
    'ran-training': { name: 'Rapid Naming', icon: '⚡' },
    'working-memory': { name: 'Working Memory', icon: '🧠' },
    'fluency-training': { name: 'Reading Fluency', icon: '📖' },
    'orton-gillingham': { name: 'Orton-Gillingham', icon: '✨' },
    'multisensory-structured': { name: 'MSLE', icon: '🎨' },
    'comprehension-strategies': { name: 'Comprehension', icon: '📚' },
    'assistive-technology': { name: 'Assistive Tech', icon: '💻' },
    'accommodations': { name: 'Accommodations', icon: '🏫' },
    'bci-phonological': { name: 'BCI Training', icon: '🧬' },
    'early-intervention': { name: 'Early Intervention', icon: '👶' },
    'morphological-awareness': { name: 'Morphology', icon: '🔡' },
    'vocabulary-instruction': { name: 'Vocabulary', icon: '📝' },
    'spelling-instruction': { name: 'Spelling', icon: '✏️' },
    'self-regulation': { name: 'Self-Regulation', icon: '🎯' },
    'parent-involvement': { name: 'Parent Support', icon: '👨‍👩‍👧' },
    'peer-tutoring': { name: 'Peer Tutoring', icon: '🤝' },
    'sight-word': { name: 'Sight Words', icon: '👀' },
    'auditory-processing': { name: 'Auditory Processing', icon: '👂' },
    'reading-motivation': { name: 'Reading Motivation', icon: '❤️' },
    'visual-processing': { name: 'Visual Processing', icon: '👁️' },
    'multisensory-math': { name: 'Multisensory Math', icon: '🔢' },
    'executive-function': { name: 'Executive Function', icon: '📋' },
    'speech-therapy': { name: 'Speech Therapy', icon: '🗣️' },
    'mindfulness': { name: 'Mindfulness', icon: '🧘' }
  };

  useEffect(() => {
    loadTrainingData();
    setInterventions(interventionsData.interventions);
  }, [userId]);

  const loadTrainingData = async () => {
    try {
      const storage = getTrainingStorage();

      // Load progress
      const userProgress = await storage.getUserProgress(userId);
      if (userProgress) {
        setProgress(userProgress);
      } else {
        // Initialize default progress
        const defaultProgress: UserTrainingProgress = {
          userId,
          overallProgress: 0,
          streak: 0,
          lastTrainingDate: null,
          totalSessions: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          achievements: [],
          recommendedModules: ['phonological-training', 'ran-training'],
          moduleProgress: []
        };
        await storage.saveUserProgress(defaultProgress);
        setProgress(defaultProgress);
      }

      // Load achievements
      const userAchievements = await storage.getAchievements(userId);
      setAchievements(userAchievements);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load training data:', error);
      setLoading(false);
    }
  };

  // Filter interventions based on selected filters and search query
  const filteredInterventions = interventions.filter((intervention) => {
    const matchesCategory = !selectedCategory || intervention.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      intervention.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intervention.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const calculateStatistics = (): TrainingStatistics => {
    if (!progress) {
      return {
        userId,
        totalSessions: 0,
        sessionsLast7Days: 0,
        sessionsLast30Days: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalHours: 0,
        averageScore: 0,
        bestScore: 0,
        mostTrainedModule: '',
        improvementTrend: 0
      };
    }

    return {
      userId,
      totalSessions: progress.totalSessions,
      sessionsLast7Days: 0, // Would need full history to calculate
      sessionsLast30Days: 0,
      currentStreak: progress.streak,
      longestStreak: progress.streak, // Simplified
      totalHours: progress.totalTimeSpent / 3600,
      averageScore: progress.averageScore,
      bestScore: progress.moduleProgress.length > 0
        ? Math.max(...progress.moduleProgress.map(m => m.bestScore))
        : 0,
      mostTrainedModule: progress.moduleProgress.length > 0
        ? progress.moduleProgress.sort((a, b) => b.sessionsCompleted - a.sessionsCompleted)[0]?.moduleId || ''
        : '',
      improvementTrend: 0 // Would need historical data
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading training data...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStatistics();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Training Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your progress and continue your training journey
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Important:</strong> This training is not a clinical intervention. It provides
                evidence-based exercises based on screening results. For formal diagnosis or treatment,
                please consult with qualified healthcare or educational professionals.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {progress ? Math.round(progress.overallProgress) : 0}%
                </p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.currentStreak} days
                </p>
              </div>
              <span className="text-3xl">🔥</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSessions}
                </p>
              </div>
              <span className="text-3xl">🎯</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time Trained</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalHours.toFixed(1)}h
                </p>
              </div>
              <span className="text-3xl">⏱️</span>
            </div>
          </div>
        </div>

        {/* Training Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Training Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {progress && progress.moduleProgress.length > 0 ? (
              progress.moduleProgress.map((moduleProgress) => {
                const moduleInfo = moduleNames[moduleProgress.moduleId];
                if (!moduleInfo) return null;

                return (
                  <TrainingProgressCard
                    key={moduleProgress.moduleId}
                    moduleProgress={moduleProgress}
                    moduleName={moduleInfo.name}
                    moduleIcon={moduleInfo.icon}
                    onStart={() => {
                      // Navigate to training session
                      window.location.href = `/training/session/${moduleProgress.moduleId}`;
                    }}
                  />
                );
              })
            ) : (
              // Show all modules as not started
              Object.entries(moduleNames).map(([moduleId, info]) => (
                <TrainingProgressCard
                  key={moduleId}
                  moduleProgress={{
                    moduleId,
                    currentLevel: 1,
                    highestLevel: 0,
                    sessionsCompleted: 0,
                    bestScore: 0,
                    totalTimeSpent: 0,
                    completionPercentage: 0,
                    isComplete: false
                  }}
                  moduleName={info.name}
                  moduleIcon={info.icon}
                  onStart={() => {
                    window.location.href = `/training/session/${moduleId}`;
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Intervention Explorer */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Intervention Explorer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Explore evidence-based interventions and start training exercises
          </p>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="phonological">Phonological</option>
              <option value="multisensory">Multisensory</option>
              <option value="general">General</option>
              <option value="technology">Technology</option>
            </select>

            <input
              type="text"
              placeholder="Search interventions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Intervention Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterventions.map((intervention) => {
              const hasTraining = intervention.id in trainingExercisesData.exercises;
              const moduleProgress = progress?.moduleProgress.find(m => m.moduleId === intervention.id);

              return (
                <div
                  key={intervention.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {intervention.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {intervention.description}
                    </p>
                    <EfficacyRating
                      rating={intervention.efficacyRating}
                      evidenceTier={intervention.evidenceTier}
                      size="small"
                    />
                  </div>

                  <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Duration:</strong> {intervention.duration}</p>
                    <p><strong>Frequency:</strong> {intervention.frequency}</p>
                    <p><strong>Age Groups:</strong> {intervention.ageGroups.join(', ')}</p>
                  </div>

                  {hasTraining && (
                    <div className="mb-4">
                      {moduleProgress ? (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Training Progress: {moduleProgress.completionPercentage}%
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Sessions: {moduleProgress.sessionsCompleted}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Not started
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {hasTraining && (
                      <button
                        onClick={() => {
                          window.location.href = `/training/session/${intervention.id}`;
                        }}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                      >
                        Start Training
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedIntervention(intervention)}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredInterventions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No interventions match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Achievements
          </h2>
          {achievements.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center"
                  title={achievement.description}
                >
                  <span className="text-4xl mb-2 block">{achievement.icon}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {achievement.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {achievement.points} pts
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <span className="text-4xl mb-4 block">🏆</span>
              <p className="text-gray-600 dark:text-gray-400">
                Start training to unlock achievements!
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/training/history"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">📜</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Training History
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View your past training sessions
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/screening"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-center space-x-4">
              <span className="text-3xl">📋</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Retake Screening
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your assessment for new recommendations
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Intervention Detail Modal */}
      <InterventionDetailModal
        intervention={selectedIntervention}
        onClose={() => setSelectedIntervention(null)}
      />
    </div>
  );
};

export default TrainingDashboardPage;
