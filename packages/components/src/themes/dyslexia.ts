/**
 * Dyslexia-Friendly Theme
 * Optimized for users with dyslexia:
 * - Warm cream background reduces glare
 * - Darker colors for better contrast
 * - High contrast borders
 * - Optimized for OpenDyslexic font
 */

import { Theme } from './default';

export const dyslexiaTheme: Theme = {
  colors: {
    primary: '#1E40AF',      // Darker blue for better contrast
    secondary: '#059669',    // Darker green for better contrast
    background: '#FEF3C7',    // Warm cream to reduce glare
    text: '#1C1917',          // Dark brown for reduced eye strain
    border: '#D97706',        // High contrast border
    error: '#DC2626',
    warning: '#D97706',
    success: '#059669',
  },
  typography: {
    fontFamily: {
      default: 'OpenDyslexic, Inter, system-ui, sans-serif',
      dyslexia: 'OpenDyslexic, sans-serif',
    },
    fontSize: {
      h1: '36px',            // Slightly larger for readability
      h2: '28px',
      h3: '22px',
      body: '18px',
      caption: '16px',
    },
    lineHeight: {
      tight: 1.6,
      normal: 1.8,
      relaxed: 2.2,
    },
    letterSpacing: {
      normal: '0.5px',       // Slightly increased letter spacing
      wide: '1.5px',
      wider: '2.5px',
    },
  },
  spacing: {
    xs: '12px',              // Increased spacing for reduced clutter
    sm: '16px',
    md: '20px',
    lg: '32px',
    xl: '40px',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
  },
};
