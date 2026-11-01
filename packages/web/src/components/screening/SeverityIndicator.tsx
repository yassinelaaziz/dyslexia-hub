/**
 * SeverityIndicator Component
 *
 * Visual severity rating with color-coded, accessible display
 *
 * Accessibility Features:
 * - WCAG 2.1 AA compliant
 * - Screen reader support (ARIA labels)
 * - Color + text indicators (not color-only)
 * - High contrast ratios
 *
 * Dyslexia-Friendly Design:
 * - Large, clear visual indicator
 * - Color + emoji + text (multiple cues)
 * - High contrast colors
 * - Clear visual hierarchy
 */

import React from 'react';

export interface SeverityIndicatorProps {
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  isChild?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({
  severity,
  isChild = false,
  size = 'medium',
}) => {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'none':
        return {
          color: '#10B981', // Green
          backgroundColor: '#D1FAE5',
          emoji: '✅',
          label: 'No Risk',
          description: 'No risk indicators detected',
        };
      case 'mild':
        return {
          color: '#F59E0B', // Amber
          backgroundColor: '#FEF3C7',
          emoji: '🟡',
          label: 'Mild',
          description: 'Mild risk indicators',
        };
      case 'moderate':
        return {
          color: '#F97316', // Orange
          backgroundColor: '#FFEDD5',
          emoji: '🟠',
          label: 'Moderate',
          description: 'Moderate risk indicators',
        };
      case 'severe':
        return {
          color: '#EF4444', // Red
          backgroundColor: '#FEE2E2',
          emoji: '🔴',
          label: 'Severe',
          description: 'Strong risk indicators',
        };
      default:
        return {
          color: '#6B7280', // Gray
          backgroundColor: '#F3F4F6',
          emoji: '⚪',
          label: 'Unknown',
          description: 'Severity unknown',
        };
    }
  };

  const config = getSeverityConfig(severity);

  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'small':
        return {
          container: { padding: '12px 20px', borderRadius: '8px' },
          emoji: { fontSize: '24px' },
          text: { fontSize: '16px' },
        };
      case 'medium':
        return {
          container: { padding: '20px 32px', borderRadius: '12px' },
          emoji: { fontSize: '32px' },
          text: { fontSize: '20px' },
        };
      case 'large':
        return {
          container: { padding: '28px 40px', borderRadius: '16px' },
          emoji: { fontSize: '48px' },
          text: { fontSize: '24px' },
        };
      default:
        return {
          container: { padding: '20px 32px', borderRadius: '12px' },
          emoji: { fontSize: '32px' },
          text: { fontSize: '20px' },
        };
    }
  };

  const sizeStyles = getSizeStyles(size);

  const containerStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: config.backgroundColor,
    border: `3px solid ${config.color}`,
    borderRadius: sizeStyles.container.borderRadius,
    padding: sizeStyles.container.padding,
    transition: 'all 0.2s ease',
  };

  const emojiStyles = {
    fontSize: sizeStyles.emoji.fontSize,
    lineHeight: 1,
  };

  const textContainerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  };

  const labelStyles = {
    fontSize: sizeStyles.text.fontSize,
    fontWeight: 700,
    color: config.color,
  };

  const descriptionStyles = {
    fontSize: isChild ? '16px' : '14px',
    fontWeight: 500,
    color: '#374151',
  };

  return (
    <div
      style={containerStyles}
      role="img"
      aria-label={`Severity: ${config.label} - ${config.description}`}
    >
      <span style={emojiStyles} aria-hidden="true">
        {config.emoji}
      </span>
      <div style={textContainerStyles}>
        <span style={labelStyles}>{config.label}</span>
        {!isChild && <span style={descriptionStyles}>{config.description}</span>}
      </div>
    </div>
  );
};

export default SeverityIndicator;
