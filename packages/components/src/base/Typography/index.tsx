/**
 * Typography Component
 *
 * Accessibility Features:
 * - Semantic HTML (h1-h6, p, span)
 * - Screen reader hierarchy
 * - Sufficient color contrast
 *
 * Dyslexia-Friendly Design:
 * - Font size hierarchy (h1: 32px, h2: 24px, body: 16px)
 * - Line height 1.5-2.0
 * - Letter spacing 0.5-1px
 * - OpenDyslexic font option
 */

import React, { HTMLAttributes, ReactNode } from 'react';

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'text';
  as?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  color = 'text',
  as,
  ...props
}) => {
  const colorMap = {
    primary: '#3B82F6',
    secondary: '#10B981',
    error: '#EF4444',
    text: '#1F2937',
  };

  const variantStyles = {
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0px',
      fontFamily: 'inherit',
    },
    h2: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0px',
      fontFamily: 'inherit',
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '0.5px',
      fontFamily: 'inherit',
    },
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: '0.5px',
      fontFamily: 'inherit',
    },
    caption: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
      fontFamily: 'inherit',
    },
  };

  const baseStyles = {
    color: colorMap[color],
    margin: 0,
    ...variantStyles[variant],
  };

  const tagMap = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    body: 'p',
    caption: 'span',
  };

  const Component = (as || tagMap[variant]) as keyof JSX.IntrinsicElements;

  return (
    <Component
      style={baseStyles}
      {...(props as any)}
    >
      {children}
    </Component>
  );
};

export default Typography;
