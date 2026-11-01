/**
 * Input Component
 *
 * Accessibility Features:
 * - Label association (for/id)
 * - Error announcement
 * - Helper text for context
 * - Keyboard navigation
 *
 * Dyslexia-Friendly Design:
 * - Large input height (48px)
 * - Clear labels above inputs
 * - Error messages in red with icons
 * - High contrast borders
 */

import React, { InputHTMLAttributes, useState } from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  type?: 'text' | 'number' | 'email' | 'password';
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  id,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `error-${inputId}`;
  const helperId = `helper-${inputId}`;

  const baseStyles = {
    width: '100%',
    minHeight: '48px',
    padding: '12px 16px',
    fontSize: '16px',
    fontFamily: 'inherit',
    borderRadius: '8px',
    border: '2px solid',
    backgroundColor: disabled ? '#F3F4F6' : '#FFFFFF',
    color: disabled ? '#9CA3AF' : '#1F2937',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const borderStyles = error
    ? {
        borderColor: '#EF4444',
        boxShadow: focused ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : 'none',
      }
    : focused
    ? {
        borderColor: '#3B82F6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
      }
    : {
        borderColor: '#E5E7EB',
        boxShadow: 'none',
      };

  const labelStyles = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '16px',
    fontWeight: 600,
    color: error ? '#EF4444' : '#1F2937',
    fontFamily: 'inherit',
  };

  const errorStyles = {
    marginTop: '8px',
    fontSize: '14px',
    color: '#EF4444',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'inherit',
  };

  const helperStyles = {
    marginTop: '8px',
    fontSize: '14px',
    color: '#6B7280',
    fontFamily: 'inherit',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div style={{ width: '100%' }}>
      <label
        htmlFor={inputId}
        style={labelStyles}
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        style={{
          ...baseStyles,
          ...borderStyles,
        }}
        {...props}
      />
      {error && (
        <div
          id={errorId}
          role="alert"
          style={errorStyles}
        >
          <span aria-hidden="true">⚠</span>
          <span>{error}</span>
        </div>
      )}
      {helperText && !error && (
        <div
          id={helperId}
          style={helperStyles}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Input;
