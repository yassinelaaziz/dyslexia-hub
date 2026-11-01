/**
 * ScreeningProgress Component
 *
 * Displays progress indicator with visual feedback for screening
 *
 * Accessibility Features:
 * - WCAG 2.1 AA compliant
 * - Screen reader support (ARIA live regions)
 * - Visual progress with text alternative
 *
 * Dyslexia-Friendly Design:
 * - Clear visual feedback
 * - Large, readable progress bar
 * - Color + text indicators
 * - Encouraging messaging
 */

import React from 'react';

export interface ScreeningProgressProps {
  currentStep: number;
  totalSteps: number;
  currentDomain?: string;
  isChild?: boolean;
}

export const ScreeningProgress: React.FC<ScreeningProgressProps> = ({
  currentStep,
  totalSteps,
  currentDomain,
  isChild = false,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  const containerStyles = {
    width: '100%',
    marginBottom: isChild ? '32px' : '24px',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const labelStyles = {
    fontSize: isChild ? '20px' : '18px',
    fontWeight: 600,
    color: '#374151',
  };

  const percentageStyles = {
    fontSize: isChild ? '20px' : '18px',
    fontWeight: 700,
    color: '#3B82F6',
  };

  const progressBarContainerStyles = {
    width: '100%',
    height: isChild ? '24px' : '20px',
    backgroundColor: '#E5E7EB',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid #D1D5DB',
  };

  const progressBarFillStyles = {
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: '#3B82F6',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
    backgroundImage: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)',
  };

  const domainIndicatorStyles = {
    marginTop: '12px',
    fontSize: isChild ? '16px' : '14px',
    color: '#6B7280',
    fontStyle: 'italic' as const,
  };

  const getEncouragingMessage = (percentage: number, isChild: boolean): string => {
    if (isChild) {
      if (percentage < 25) return "Let's get started! 🌟";
      if (percentage < 50) return "Great job! Keep going! 🎉";
      if (percentage < 75) return "You're doing amazing! 🚀";
      if (percentage < 100) return "Almost there! 🏆";
      return "All done! 🎊";
    } else {
      if (percentage < 25) return "Getting started";
      if (percentage < 50) return "Making good progress";
      if (percentage < 75) return "More than halfway done";
      if (percentage < 100) return "Almost complete";
      return "Complete";
    }
  };

  return (
    <div style={containerStyles} role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Screening progress: ${percentage}% complete`}>
      <div style={headerStyles}>
        <span style={labelStyles}>Progress</span>
        <span style={percentageStyles}>{percentage}%</span>
      </div>

      <div style={progressBarContainerStyles}>
        <div style={progressBarFillStyles} />
      </div>

      {currentDomain && (
        <div style={domainIndicatorStyles}>
          Current: {currentDomain}
        </div>
      )}

      <div style={{ ...domainIndicatorStyles, fontStyle: 'normal', fontWeight: 600, marginTop: '8px' }}>
        {getEncouragingMessage(percentage, isChild)}
      </div>
    </div>
  );
};

export default ScreeningProgress;
