/**
 * ScreeningPage Component
 *
 * Main screening page with child and adult screening flows
 *
 * Accessibility Features:
 * - WCAG 2.1 AA compliant
 * - Screen reader support (ARIA labels, live regions)
 * - Keyboard navigation (tab order, focus management)
 *
 * Dyslexia-Friendly Design:
 * - Child-friendly screening flow (simplified language, engaging UI)
 * - Adult screening flow (standard language, professional UI)
 * - Age detection or manual selection
 * - Multi-step form with progress tracking
 * - Results page with severity and recommendations
 * - Clear disclaimer about screening vs diagnosis
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScreeningStore } from '../../stores/screeningStore';
import { ScreeningQuestion, ScreeningProgress, ScreeningResult } from '../../components/screening';
import { ScreeningServiceImpl, ScreeningAnswers, SCREENING_DISCLAIMER } from '@dyslexia-hub/core';

type ScreeningStep = 'welcome' | 'age-selection' | 'screening' | 'results';

export const ScreeningPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentScreening,
    history,
    startScreening,
    setAnswer,
    nextQuestion,
    previousQuestion,
    completeScreening,
    cancelScreening,
    loadHistory,
  } = useScreeningStore();

  const [currentStep, setCurrentStep] = useState<ScreeningStep>('welcome');
  const [age, setAge] = useState<number | null>(null);
  const [isChild, setIsChild] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  const [calculatedScores, setCalculatedScores] = useState<any>(null);
  const [calculatedSeverity, setCalculatedSeverity] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const screeningService = new ScreeningServiceImpl(
    // @ts-ignore - Repository implementations would be injected
    {} as any,
    {} as any
  );

  // Load user history on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId') || 'guest';
    loadHistory(userId);
  }, [loadHistory]);

  const handleStartScreening = (childMode: boolean) => {
    setIsChild(childMode);
    setCurrentStep('age-selection');
  };

  const handleAgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (age && age >= 5 && age <= 100) {
      const childMode = age < 13;
      setIsChild(childMode);
      const userId = localStorage.getItem('userId') || 'guest';
      startScreening(userId, age, language, childMode);
      setCurrentStep('screening');
    }
  };

  const handleAnswerSelect = (questionId: string, value: number) => {
    setAnswer(questionId, value);
  };

  const handleNext = () => {
    const { currentScreening } = useScreeningStore.getState();
    if (!currentScreening) return;

    const { currentQuestionIndex, isChild } = currentScreening;
    const questions = screeningService.getQuestions(currentScreening.age, currentScreening.language);

    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
    } else {
      // Calculate results
      handleCalculateResults();
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const handleCalculateResults = () => {
    const { currentScreening } = useScreeningStore.getState();
    if (!currentScreening) return;

    const answers: ScreeningAnswers = {
      userId: currentScreening.userId,
      age: currentScreening.age,
      language: currentScreening.language,
      answers: currentScreening.answers,
    };

    const scores = screeningService.calculateScores(answers);
    const severity = screeningService.calculateSeverity(scores);

    // Mock recommendations (would come from intervention service)
    const mockRecommendations: string[] = [];
    if (severity !== 'none') {
      mockRecommendations.push('RAN-IT (Rapid Naming Training)');
      if (severity === 'moderate' || severity === 'severe') {
        mockRecommendations.push('Phonological Training Program');
      }
      if (severity === 'severe') {
        mockRecommendations.push('Working Memory Exercises');
      }
    }

    setCalculatedScores(scores);
    setCalculatedSeverity(severity);
    setRecommendations(mockRecommendations);

    // Complete screening in store
    completeScreening(scores, severity, mockRecommendations);

    setCurrentStep('results');
  };

  const handleViewInterventions = () => {
    navigate('/interventions');
  };

  const handleStartTraining = () => {
    navigate('/training');
  };

  const handleRetakeScreening = () => {
    setCurrentStep('welcome');
    setAge(null);
    setCalculatedScores(null);
    setCalculatedSeverity(null);
    setRecommendations([]);
  };

  const handleCancel = () => {
    cancelScreening();
    setCurrentStep('welcome');
  };

  // Render welcome screen
  if (currentStep === 'welcome') {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
          Dyslexia Screening
        </h1>
        <p style={{ fontSize: '20px', lineHeight: 1.6, marginBottom: '32px', textAlign: 'center', color: '#374151' }}>
          This screening helps identify potential risk indicators for dyslexia. It is NOT a diagnosis.
        </p>

        <div style={{ backgroundColor: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <strong style={{ display: 'block', marginBottom: '8px', color: '#92400E' }}>IMPORTANT DISCLAIMER:</strong>
          <p style={{ margin: 0, color: '#92400E', lineHeight: 1.5 }}>{SCREENING_DISCLAIMER}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => handleStartScreening(true)}
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              border: '2px solid #3B82F6',
              borderRadius: '12px',
              cursor: 'pointer',
              minHeight: '64px',
              width: '100%',
              maxWidth: '400px',
            }}
            aria-label="Start child-friendly screening"
          >
            🎮 Start Screening (Child-Friendly)
          </button>
          <button
            onClick={() => handleStartScreening(false)}
            style={{
              padding: '20px 40px',
              fontSize: '20px',
              fontWeight: 600,
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: '2px solid #10B981',
              borderRadius: '12px',
              cursor: 'pointer',
              minHeight: '64px',
              width: '100%',
              maxWidth: '400px',
            }}
            aria-label="Start adult screening"
          >
            📋 Start Screening (Adult)
          </button>
        </div>

        {history.length > 0 && (
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '16px' }}>
              You have {history.length} previous screening result{history.length > 1 ? 's' : ''}
            </p>
            <button
              onClick={() => setCurrentStep('results')}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 600,
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              View Previous Results
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render age selection screen
  if (currentStep === 'age-selection') {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
          What is your age?
        </h1>
        <p style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '32px', textAlign: 'center', color: '#374151' }}>
          This helps us provide age-appropriate questions.
        </p>

        <form onSubmit={handleAgeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <label htmlFor="age-input" style={{ display: 'block', fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#374151' }}>
              Age
            </label>
            <input
              id="age-input"
              type="number"
              min="5"
              max="100"
              value={age || ''}
              onChange={(e) => setAge(parseInt(e.target.value) || null)}
              required
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '20px',
                border: '2px solid #E5E7EB',
                borderRadius: '10px',
                outline: 'none',
              }}
              aria-label="Enter your age"
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep('welcome')}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 600,
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: '2px solid #E5E7EB',
                borderRadius: '10px',
                cursor: 'pointer',
                minHeight: '56px',
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!age || age < 5 || age > 100}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 600,
                backgroundColor: age && age >= 5 && age <= 100 ? '#3B82F6' : '#9CA3AF',
                color: '#FFFFFF',
                border: '2px solid transparent',
                borderRadius: '10px',
                cursor: age && age >= 5 && age <= 100 ? 'pointer' : 'not-allowed',
                minHeight: '56px',
              }}
              aria-disabled={!age || age < 5 || age > 100}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Render screening questions
  if (currentStep === 'screening' && currentScreening) {
    const questions = screeningService.getQuestions(currentScreening.age, currentScreening.language);
    const currentQuestion = questions[currentScreening.currentQuestionIndex];
    const selectedValue = currentScreening.answers[currentQuestion.id];

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <ScreeningProgress
          currentStep={currentScreening.currentQuestionIndex + 1}
          totalSteps={questions.length}
          currentDomain={currentQuestion.domain}
          isChild={isChild}
        />

        <ScreeningQuestion
          id={currentQuestion.id}
          domain={currentQuestion.domain}
          text={currentQuestion.text}
          options={currentQuestion.options}
          questionNumber={currentScreening.currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedValue={selectedValue}
          onSelect={(value) => handleAnswerSelect(currentQuestion.id, value)}
          onNext={handleNext}
          onPrevious={currentScreening.currentQuestionIndex > 0 ? handlePrevious : undefined}
          isChild={isChild}
        />

        <button
          onClick={handleCancel}
          style={{
            marginTop: '24px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            backgroundColor: 'transparent',
            color: '#6B7280',
            border: '2px solid #E5E7EB',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Cancel Screening
        </button>
      </div>
    );
  }

  // Render results
  if (currentStep === 'results' && calculatedScores && calculatedSeverity) {
    const mostRecentResult = history.length > 0 ? history[0] : null;

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <ScreeningResult
          scores={calculatedScores}
          severity={calculatedSeverity}
          recommendations={recommendations}
          isChild={isChild}
          onViewInterventions={handleViewInterventions}
          onStartTraining={handleStartTraining}
          onRetakeScreening={handleRetakeScreening}
        />
      </div>
    );
  }

  return null;
};

export default ScreeningPage;
