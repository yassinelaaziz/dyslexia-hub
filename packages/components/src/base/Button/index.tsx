/**
 * Button Component
 *
 * Accessibility Features:
 * - Keyboard navigation (Enter, Space)
 * - Focus indicators
 * - ARIA labels for icon-only buttons
 * - Loading state announcement
 *
 * Dyslexia-Friendly Design:
 * - Large click targets (44px minimum height)
 * - Clear visual feedback (hover, active, focus)
 * - High contrast colors
 * - Minimal text, clear action
 */

import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick,
  ...props
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    fontWeight: 600,
    borderRadius: '8px',
    border: '2px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const sizeStyles = {
    small: {
      minHeight: '36px',
      padding: '8px 16px',
      fontSize: '14px',
    },
    medium: {
      minHeight: '44px',
      padding: '12px 24px',
      fontSize: '16px',
    },
    large: {
      minHeight: '52px',
      padding: '16px 32px',
      fontSize: '18px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#9CA3AF' : '#3B82F6',
      color: '#FFFFFF',
      borderColor: disabled ? '#9CA3AF' : '#3B82F6',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
    },
    secondary: {
      backgroundColor: disabled ? '#F3F4F6' : '#10B981',
      color: '#FFFFFF',
      borderColor: disabled ? '#E5E7EB' : '#10B981',
      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
    },
    tertiary: {
      backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
      color: disabled ? '#9CA3AF' : '#1F2937',
      borderColor: disabled ? '#E5E7EB' : '#E5E7EB',
      boxShadow: 'none',
    },
    danger: {
      backgroundColor: disabled ? '#FCA5A5' : '#EF4444',
      color: '#FFFFFF',
      borderColor: disabled ? '#FCA5A5' : '#EF4444',
      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
    },
  };

  const focusStyles = {
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !loading && onClick) {
        onClick();
      }
    }
  };

  const isIconOnly = !children && icon;

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...(props.tabIndex === 0 ? focusStyles : {}),
      }}
      disabled={disabled || loading}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      aria-label={isIconOnly ? props['aria-label'] || 'Button' : undefined}
      {...props}
    >
      {loading && (
        <span
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderRadius: '50%',
            borderTopColor: 'transparent',
            animation: 'spin 0.6s linear infinite',
          }}
          aria-hidden="true"
        />
      )}
      {icon && <span aria-hidden="true">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};

export default Button;
