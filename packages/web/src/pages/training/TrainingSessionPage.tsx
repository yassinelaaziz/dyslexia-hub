import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrainingSessionResult } from '@dyslexia-hub/core';
import { getTrainingStorage } from '../../storage/trainingStorage';
import TrainingExercise from '../../components/interventions/TrainingExercise';
import trainingExercisesData from '../../data/training-exercises.json';

const TrainingSessionPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const [userId] = useState('user-1'); // In a real app, this would come from auth
  const [trainingData, setTrainingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (moduleId) {
      loadTrainingData(moduleId);
      setStartTime(Date.now());
    }
  }, [moduleId]);

  const loadTrainingData = (moduleId: string) => {
    const exercises = trainingExercisesData.exercises;
    const moduleData = exercises[moduleId as keyof typeof exercises];

    if (moduleData) {
      setTrainingData(moduleData);
    } else {
      console.error(`Training module ${moduleId} not found`);
    }
    setLoading(false);
  };

  const handleComplete = async (score: number) => {
    if (!moduleId) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const result: TrainingSessionResult = {
      id: sessionId,
      userId,
      trainingModule: moduleId,
      level: 1, // Default to level 1 for now
      score,
      timeSpent,
      date: new Date(),
      completed: true,
      achievementsUnlocked: [] // Would calculate achievements here
    };

    try {
      const storage = getTrainingStorage();
      await storage.saveTrainingRecord({
        id: result.id,
        userId: result.userId,
        trainingModule: result.trainingModule,
        level: result.level,
        score: result.score,
        completed: result.completed,
        timeSpent: result.timeSpent,
        date: result.date,
        metrics: result.metrics
      });

      // Update user progress
      const progress = await storage.getUserProgress(userId);
      if (progress) {
        progress.totalSessions++;
        progress.totalTimeSpent += timeSpent;
        progress.lastTrainingDate = new Date();
        progress.averageScore = (progress.averageScore * (progress.totalSessions - 1) + score) / progress.totalSessions;

        // Update module progress
        const moduleProgress = progress.moduleProgress.find(m => m.moduleId === moduleId);
        if (moduleProgress) {
          moduleProgress.sessionsCompleted++;
          moduleProgress.bestScore = Math.max(moduleProgress.bestScore, score);
          moduleProgress.totalTimeSpent += timeSpent;
        } else {
          progress.moduleProgress.push({
            moduleId,
            currentLevel: 1,
            highestLevel: 1,
            sessionsCompleted: 1,
            bestScore: score,
            totalTimeSpent: timeSpent,
            completionPercentage: 33,
            isComplete: false
          });
        }

        await storage.saveUserProgress(progress);
      }

      // Navigate back to dashboard
      navigate('/training');
    } catch (error) {
      console.error('Failed to save training result:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading training...</p>
        </div>
      </div>
    );
  }

  if (!trainingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Training module not found
          </p>
          <button
            onClick={() => navigate('/training')}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/training')}
            className="text-blue-500 hover:text-blue-600 mb-4 inline-block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {trainingData.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {trainingData.description}
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

        {/* Training Exercise */}
        <div className="flex justify-center">
          <TrainingExercise
            interventionId={moduleId || ''}
            trainingData={trainingData}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingSessionPage;
