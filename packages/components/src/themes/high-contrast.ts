/**
 * High Contrast Theme
 * Maximum contrast for users with visual impairments:
 * - Pure black and white
 * - No gray colors
 * - Clear boundaries
 * - Maximum readability
 */

import { Theme } from './default';

export const highContrastTheme: Theme = {
  colors: {
    primary: '#000000',
    secondary: '#000000',
    background: '#FFFFFF',
    text: '#000000',
    border: '#000000',
    error: '#000000',
    warning: '#000000',
    success: '#000000',
  },
  typography: {
    fontFamily: {
      default: 'Inter, system-ui, sans-serif',
      dyslexia: 'OpenDyslexic, sans-serif',
    },
    fontSize: {
      h1: '36px',            // Larger for visibility
      h2: '28px',
      h3: '22px',
      body: '18px',
      caption: '16px',
    },
    lineHeight: {
      tight: 1.6,
      normal: 1.8,
      relaxed: 2.0,
    },
    letterSpacing: {
      normal: '0.5px',
      wide: '1.5px',
      wider: '2.5px',
    },
  },
  spacing: {
    xs: '12px',
    sm: '16px',
    md: '20px',
    lg: '32px',
    xl: '40px',
  },
  borderRadius: {
    sm: '2px',              // Smaller radius for clearer boundaries
    md: '4px',
    lg: '6px',
  },
};
