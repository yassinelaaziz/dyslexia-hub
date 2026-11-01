/**
 * Card Component
 *
 * Accessibility Features:
 * - Keyboard navigation when clickable
 * - Focus indicators
 * - ARIA role="button" when clickable
 *
 * Dyslexia-Friendly Design:
 * - Generous padding (24px)
 * - Clear visual hierarchy
 * - High contrast borders
 * - Minimal clutter
 */

import React, { HTMLAttributes, ReactNode, useState } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  onClick,
  hoverable = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const baseStyles = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    padding: '24px',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const interactiveStyles = onClick
    ? {
        cursor: 'pointer',
        ...(hoverable
          ? {
              boxShadow: focused
                ? '0 0 0 3px rgba(59, 130, 246, 0.5), 0 4px 12px rgba(0, 0, 0, 0.15)'
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
              transform: focused ? 'translateY(-2px)' : 'translateY(0)',
            }
          : {
              boxShadow: focused
                ? '0 0 0 3px rgba(59, 130, 246, 0.5)'
                : 'none',
            }),
      }
    : {
        cursor: 'default',
        boxShadow: 'none',
      };

  const titleStyles = {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1F2937',
    marginBottom: '16px',
    fontFamily: 'inherit',
    lineHeight: 1.5,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const cardProps = onClick
    ? {
        role: 'button' as const,
        tabIndex: 0 as const,
        onClick,
        onKeyDown: handleKeyDown,
        onFocus: () => setFocused(true),
        onBlur: () => setFocused(false),
      }
    : {};

  return (
    <div
      style={{
        ...baseStyles,
        ...interactiveStyles,
      }}
      {...cardProps}
      {...props}
    >
      {title && <h3 style={titleStyles}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
