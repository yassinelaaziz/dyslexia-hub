/**
 * ScreeningResult Component
 *
 * Displays screening results with severity and next steps
 *
 * Accessibility Features:
 * - WCAG 2.1 AA compliant
 * - Screen reader support (ARIA labels, live regions)
 * - Keyboard navigation
 *
 * Dyslexia-Friendly Design:
 * - Clear visual hierarchy
 * - Plain language explanations
 * - Hope-focused messaging
 * - Large, readable fonts
 * - High contrast colors
 */

import React from 'react';
import { SeverityIndicator } from './SeverityIndicator';

export interface ScreeningResultProps {
  scores: {
    phonological: number;
    rapidNaming: number;
    visual: number;
    workingMemory: number;
    overall: number;
  };
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  recommendations: string[];
  isChild?: boolean;
  onViewInterventions?: () => void;
  onStartTraining?: () => void;
  onRetakeScreening?: () => void;
}

export const ScreeningResult: React.FC<ScreeningResultProps> = ({
  scores,
  severity,
  recommendations,
  isChild = false,
  onViewInterventions,
  onStartTraining,
  onRetakeScreening,
}) => {
  const containerStyles = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: isChild ? '40px' : '32px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: '2px solid #E5E7EB',
  };

  const headerStyles = {
    fontSize: isChild ? '36px' : '28px',
    fontWeight: 700,
    marginBottom: '24px',
    color: '#1F2937',
    textAlign: 'center' as const,
  };

  const disclaimerStyles = {
    backgroundColor: '#FEF3C7',
    border: '2px solid #F59E0B',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '32px',
    fontSize: isChild ? '16px' : '14px',
    color: '#92400E',
    lineHeight: 1.5,
  };

  const severitySectionStyles = {
    textAlign: 'center' as const,
    marginBottom: '32px',
  };

  const severityLabelStyles = {
    fontSize: isChild ? '24px' : '20px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#374151',
  };

  const scoresSectionStyles = {
    marginBottom: '32px',
  };

  const sectionTitleStyles = {
    fontSize: isChild ? '24px' : '20px',
    fontWeight: 700,
    marginBottom: '20px',
    color: '#1F2937',
  };

  const scoreCardStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  };

  const scoreItemStyles = {
    backgroundColor: '#F9FAFB',
    border: '2px solid #E5E7EB',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center' as const,
  };

  const scoreLabelStyles = {
    fontSize: isChild ? '18px' : '16px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#374151',
  };

  const scoreValueStyles = {
    fontSize: isChild ? '32px' : '28px',
    fontWeight: 700,
    color: '#3B82F6',
  };

  const explanationStyles = {
    backgroundColor: '#EFF6FF',
    border: '2px solid #3B82F6',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    fontSize: isChild ? '18px' : '16px',
    lineHeight: 1.6,
    color: '#1E40AF',
  };

  const recommendationsSectionStyles = {
    marginBottom: '32px',
  };

  const recommendationListStyles = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const recommendationItemStyles = {
    backgroundColor: '#F0FDF4',
    border: '2px solid #10B981',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '12px',
    fontSize: isChild ? '18px' : '16px',
    color: '#065F46',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  };

  const buttonStyles = {
    padding: '16px 32px',
    borderRadius: '10px',
    fontSize: isChild ? '18px' : '16px',
    fontWeight: 600,
    border: '2px solid transparent',
    cursor: 'pointer',
    minHeight: '56px',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const primaryButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    borderColor: '#3B82F6',
  };

  const secondaryButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    borderColor: '#E5E7EB',
  };

  const getExplanation = (severity: string, isChild: boolean): string => {
    if (isChild) {
      switch (severity) {
        case 'none':
          return "Great news! Your screening shows no signs of reading difficulties. Your brain processes reading well. Keep reading and learning! 🧠✨";
        case 'mild':
          return "Your screening shows some small challenges with reading. This is okay! Your brain can learn new ways to read better. With practice, you can improve! 🌟";
        case 'moderate':
          return "Your screening shows some reading challenges. This doesn't mean you can't read well - it just means your brain learns differently. The good news: Your brain can change and improve! 🚀";
        case 'severe':
          return "Your screening shows reading challenges. This is important to know! Your brain works differently, and that's okay. There are tools and strategies that can help you read better. You're not alone! 💪";
        default:
          return "";
      }
    } else {
      switch (severity) {
        case 'none':
          return "Your screening results indicate no significant risk indicators for dyslexia. Your phonological processing and rapid naming skills appear to be within typical ranges. Continue regular reading practice.";
        case 'mild':
          return "Your screening results indicate mild risk indicators for dyslexia. This suggests some challenges with phonological processing or rapid naming. These challenges are common and can be addressed with targeted practice and strategies.";
        case 'moderate':
          return "Your screening results indicate moderate risk indicators for dyslexia. This suggests notable challenges with phonological processing and/or rapid naming. The brain is neuroplastic and can develop new neural pathways with appropriate interventions.";
        case 'severe':
          return "Your screening results indicate strong risk indicators for dyslexia. This suggests significant challenges with phonological processing and rapid naming. We strongly recommend consulting with a qualified professional for a comprehensive assessment. Evidence-based interventions can be highly effective.";
        default:
          return "";
      }
    }
  };

  const getSeverityLabel = (severity: string): string => {
    switch (severity) {
      case 'none':
        return 'No Risk Indicators';
      case 'mild':
        return 'Mild Risk Indicators';
      case 'moderate':
        return 'Moderate Risk Indicators';
      case 'severe':
        return 'Strong Risk Indicators';
      default:
        return 'Unknown';
    }
  };

  const renderStars = (score: number): string => {
    const normalizedScore = Math.round(score / 20); // Convert 0-100 to 0-5
    return '⭐'.repeat(normalizedScore) + '☆'.repeat(5 - normalizedScore);
  };

  return (
    <div style={containerStyles}>
      <h1 style={headerStyles}>Your Screening Results</h1>

      <div style={disclaimerStyles} role="alert">
        <strong>IMPORTANT:</strong> This screening is NOT a diagnosis. It is an initial risk assessment based on self-reported symptoms. A formal diagnosis of dyslexia requires comprehensive evaluation by qualified professionals (psychologists, educational specialists, or speech-language pathologists).
      </div>

      <div style={severitySectionStyles}>
        <h2 style={severityLabelStyles}>Overall Severity</h2>
        <SeverityIndicator severity={severity} isChild={isChild} />
        <p style={{ fontSize: isChild ? '20px' : '18px', fontWeight: 600, marginTop: '16px', color: '#374151' }}>
          {getSeverityLabel(severity)}
        </p>
      </div>

      <div style={scoresSectionStyles}>
        <h3 style={sectionTitleStyles}>Your Scores</h3>
        <div style={scoreCardStyles}>
          <div style={scoreItemStyles}>
            <div style={scoreLabelStyles}>Phonological</div>
            <div style={scoreValueStyles}>{Math.round(scores.phonological)}/100</div>
            <div style={{ fontSize: '24px' }}>{renderStars(scores.phonological)}</div>
          </div>
          <div style={scoreItemStyles}>
            <div style={scoreLabelStyles}>Rapid Naming</div>
            <div style={scoreValueStyles}>{Math.round(scores.rapidNaming)}/100</div>
            <div style={{ fontSize: '24px' }}>{renderStars(scores.rapidNaming)}</div>
          </div>
          <div style={scoreItemStyles}>
            <div style={scoreLabelStyles}>Working Memory</div>
            <div style={scoreValueStyles}>{Math.round(scores.workingMemory)}/100</div>
            <div style={{ fontSize: '24px' }}>{renderStars(scores.workingMemory)}</div>
          </div>
          <div style={scoreItemStyles}>
            <div style={scoreLabelStyles}>Overall</div>
            <div style={scoreValueStyles}>{Math.round(scores.overall)}/100</div>
            <div style={{ fontSize: '24px' }}>{renderStars(scores.overall)}</div>
          </div>
        </div>
      </div>

      <div style={explanationStyles} role="region" aria-label="Explanation of results">
        <strong>What This Means:</strong>
        <p style={{ marginTop: '12px', marginBottom: 0 }}>{getExplanation(severity, isChild)}</p>
      </div>

      {recommendations.length > 0 && (
        <div style={recommendationsSectionStyles}>
          <h3 style={sectionTitleStyles}>Recommended Interventions</h3>
          <ul style={recommendationListStyles}>
            {recommendations.map((rec, index) => (
              <li key={index} style={recommendationItemStyles}>
                <span style={{ fontSize: '24px' }}>✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={buttonContainerStyles}>
        {onStartTraining && severity !== 'none' && (
          <button
            style={primaryButtonStyles}
            onClick={onStartTraining}
            aria-label="Start personalized training"
          >
            🎯 Start Training
          </button>
        )}
        {onViewInterventions && (
          <button
            style={secondaryButtonStyles}
            onClick={onViewInterventions}
            aria-label="View recommended interventions"
          >
            View Interventions
          </button>
        )}
        {onRetakeScreening && (
          <button
            style={secondaryButtonStyles}
            onClick={onRetakeScreening}
            aria-label="Retake screening"
          >
            Retake Screening
          </button>
        )}
      </div>
    </div>
  );
};

export default ScreeningResult;
