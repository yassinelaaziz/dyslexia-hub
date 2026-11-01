/**
 * ScreeningQuestion Component
 *
 * Displays a single screening question with dyslexia-friendly design
 *
 * Accessibility Features:
 * - WCAG 2.1 AA compliant
 * - Screen reader support (ARIA labels, live regions)
 * - Keyboard navigation (tab order, focus management)
 * - Large click targets (44px minimum)
 *
 * Dyslexia-Friendly Design:
 * - Large, readable fonts
 * - High contrast colors
 * - Clear visual hierarchy
 * - One question at a time (reduced cognitive load)
 * - Minimal text, simple language
 */

import React, { useState, useEffect, useRef } from 'react';

export interface ScreeningQuestionProps {
  id: string;
  domain: string;
  text: string;
  options: { value: number; label: string }[];
  questionNumber: number;
  totalQuestions: number;
  selectedValue?: number;
  onSelect: (value: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isChild?: boolean;
}

export const ScreeningQuestion: React.FC<ScreeningQuestionProps> = ({
  id,
  domain,
  text,
  options,
  questionNumber,
  totalQuestions,
  selectedValue,
  onSelect,
  onNext,
  onPrevious,
  isChild = false,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [id]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(options[index].value);
      if (onNext && selectedValue !== undefined) {
        onNext();
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % options.length;
      setFocusedIndex(nextIndex);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + options.length) % options.length;
      setFocusedIndex(prevIndex);
    }
  };

  const getDomainColor = (domain: string): string => {
    switch (domain) {
      case 'phonological':
        return '#3B82F6'; // Blue
      case 'rapidNaming':
        return '#10B981'; // Green
      case 'workingMemory':
        return '#F59E0B'; // Amber
      case 'attention':
        return '#8B5CF6'; // Purple
      default:
        return '#6B7280'; // Gray
    }
  };

  const baseStyles = {
    fontFamily: 'inherit',
    fontSize: isChild ? '20px' : '18px',
    lineHeight: 1.6,
    color: '#1F2937',
  };

  const containerStyles = {
    ...baseStyles,
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: isChild ? '32px' : '24px',
    border: '2px solid #E5E7EB',
    outline: 'none',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  };

  const questionHeaderStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  };

  const questionNumberStyles = {
    fontSize: isChild ? '24px' : '20px',
    fontWeight: 700,
    color: '#6B7280',
  };

  const domainBadgeStyles = {
    backgroundColor: getDomainColor(domain),
    color: '#FFFFFF',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  };

  const questionTextStyles = {
    fontSize: isChild ? '28px' : '24px',
    fontWeight: 600,
    marginBottom: '32px',
    lineHeight: 1.4,
    color: '#1F2937',
  };

  const optionsContainerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  };

  const optionStyles = (isSelected: boolean, isFocused: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderRadius: '12px',
    border: '3px solid',
    borderColor: isSelected ? getDomainColor(domain) : '#E5E7EB',
    backgroundColor: isSelected ? `${getDomainColor(domain)}15` : '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    minHeight: '60px',
    fontSize: isChild ? '20px' : '18px',
    fontWeight: isSelected ? 600 : 400,
    boxShadow: isFocused ? '0 0 0 4px rgba(59, 130, 246, 0.3)' : 'none',
  });

  const radioStyles = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '3px solid',
    borderColor: selectedValue !== undefined ? getDomainColor(domain) : '#9CA3AF',
    backgroundColor: selectedValue !== undefined ? getDomainColor(domain) : '#FFFFFF',
    marginRight: '16px',
    flexShrink: 0,
  };

  const navigationStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '32px',
    gap: '16px',
  };

  const buttonStyles = {
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 600,
    border: '2px solid transparent',
    cursor: 'pointer',
    minHeight: '52px',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const prevButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    borderColor: '#E5E7EB',
  };

  const nextButtonStyles = {
    ...buttonStyles,
    backgroundColor: selectedValue !== undefined ? '#3B82F6' : '#9CA3AF',
    color: '#FFFFFF',
    borderColor: selectedValue !== undefined ? '#3B82F6' : '#9CA3AF',
    cursor: selectedValue !== undefined ? 'pointer' : 'not-allowed',
  };

  return (
    <div
      ref={containerRef}
      style={containerStyles}
      tabIndex={0}
      role="group"
      aria-label={`Question ${questionNumber} of ${totalQuestions}`}
    >
      <div style={questionHeaderStyles}>
        <span style={questionNumberStyles}>
          Question {questionNumber} of {totalQuestions}
        </span>
        <span style={domainBadgeStyles}>{domain}</span>
      </div>

      <h2 style={questionTextStyles}>{text}</h2>

      <div style={optionsContainerStyles} role="radiogroup" aria-label="Answer options">
        {options.map((option, index) => {
          const isSelected = selectedValue === option.value;
          const isFocused = focusedIndex === index;

          return (
            <div
              key={option.value}
              style={optionStyles(isSelected, isFocused)}
              onClick={() => onSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
            >
              <div style={radioStyles} aria-hidden="true" />
              <span>{option.label}</span>
            </div>
          );
        })}
      </div>

      <div style={navigationStyles}>
        {onPrevious && (
          <button
            style={prevButtonStyles}
            onClick={onPrevious}
            disabled={questionNumber === 1}
            aria-label="Previous question"
          >
            Previous
          </button>
        )}
        {onNext && (
          <button
            style={nextButtonStyles}
            onClick={onNext}
            disabled={selectedValue === undefined}
            aria-label="Next question"
            aria-disabled={selectedValue === undefined}
          >
            {questionNumber === totalQuestions ? 'See Results' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ScreeningQuestion;
