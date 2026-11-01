/**
 * Default Theme
 * Standard color palette for general use
 */

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
  typography: {
    fontFamily: {
      default: string;
      dyslexia: string;
    };
    fontSize: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      caption: string;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
    letterSpacing: {
      normal: string;
      wide: string;
      wider: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const defaultTheme: Theme = {
  colors: {
    primary: '#3B82F6',      // Blue
    secondary: '#10B981',    // Green
    background: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
  },
  typography: {
    fontFamily: {
      default: 'Inter, system-ui, sans-serif',
      dyslexia: 'OpenDyslexic, sans-serif',
    },
    fontSize: {
      h1: '32px',
      h2: '24px',
      h3: '20px',
      body: '16px',
      caption: '14px',
    },
    lineHeight: {
      tight: 1.5,
      normal: 1.75,
      relaxed: 2.0,
    },
    letterSpacing: {
      normal: '0px',
      wide: '1px',
      wider: '2px',
    },
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};
