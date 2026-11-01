# @dyslexia-hub/components

Base component library for the Dyslexia Grand Hub platform.

## Features

- **Base UI Components**: Button, Input, Card, Modal, Typography
- **Theme System**: Default, dyslexia-friendly, and high-contrast themes
- **Accessibility**: WCAG 2.1 AA compliant components
- **Dyslexia-Friendly Design**: Large click targets, clear fonts, high contrast

## Installation

This package is a workspace dependency. It will be installed automatically with the monorepo.

```bash
npm install
```

## Usage

### Components

```tsx
import { Button, Input, Card, Modal, Typography } from '@dyslexia-hub/components';

function App() {
  return (
    <div>
      <Typography variant="h1">Welcome</Typography>
      <Button variant="primary" size="large">
        Get Started
      </Button>
      <Input
        type="text"
        label="Name"
        value={name}
        onChange={setName}
      />
    </div>
  );
}
```

### Themes

```tsx
import { defaultTheme, dyslexiaTheme, highContrastTheme } from '@dyslexia-hub/components';

// Apply theme to your application
const theme = dyslexiaTheme;
```

## Component Documentation

### Button

```tsx
<Button
  variant="primary"
  size="large"
  onClick={handleClick}
  loading={isLoading}
>
  Get Started
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'tertiary' | 'danger'
- `size`: 'small' | 'medium' | 'large'
- `disabled`: boolean
- `loading`: boolean
- `icon`: ReactNode
- `children`: ReactNode
- `onClick`: () => void

**Accessibility:**
- Keyboard navigation (Enter, Space)
- Focus indicators
- ARIA labels for icon-only buttons
- Loading state announcement

**Dyslexia-Friendly:**
- Large click targets (44px minimum height)
- Clear visual feedback
- High contrast colors

### Input

```tsx
<Input
  type="text"
  label="Name"
  value={name}
  onChange={setName}
  error={error}
  helperText="Enter your full name"
/>
```

**Props:**
- `type`: 'text' | 'number' | 'email' | 'password'
- `label`: string
- `value`: string
- `onChange`: (value: string) => void
- `error`: string
- `helperText`: string
- `disabled`: boolean

**Accessibility:**
- Label association (for/id)
- Error announcement
- Helper text for context
- Keyboard navigation

**Dyslexia-Friendly:**
- Large input height (48px)
- Clear labels above inputs
- Error messages in red with icons
- High contrast borders

### Card

```tsx
<Card
  title="RAN-IT"
  hoverable
  onClick={handleCardClick}
>
  <CardContent />
</Card>
```

**Props:**
- `title`: string
- `children`: ReactNode
- `onClick`: () => void
- `hoverable`: boolean

**Accessibility:**
- Keyboard navigation when clickable
- Focus indicators
- ARIA role="button" when clickable

**Dyslexia-Friendly:**
- Generous padding (24px)
- Clear visual hierarchy
- High contrast borders
- Minimal clutter

### Modal

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirmation"
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `children`: ReactNode

**Accessibility:**
- Focus trap
- Escape key to close
- ARIA dialog role
- Screen reader announcement

**Dyslexia-Friendly:**
- Clear close button
- Minimal modal content
- High contrast overlay
- Large touch targets

### Typography

```tsx
<Typography variant="h1">Heading</Typography>
<Typography variant="body">Body text</Typography>
<Typography variant="caption" color="secondary">Caption</Typography>
```

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'body' | 'caption'
- `children`: ReactNode
- `color`: 'primary' | 'secondary' | 'error' | 'text'
- `as`: keyof JSX.IntrinsicElements (override HTML tag)

**Accessibility:**
- Semantic HTML (h1-h6, p, span)
- Screen reader hierarchy
- Sufficient color contrast

**Dyslexia-Friendly:**
- Font size hierarchy (h1: 32px, h2: 24px, body: 16px)
- Line height 1.5-2.0
- Letter spacing 0.5-1px
- OpenDyslexic font option

## Theme System

### Default Theme

Standard color palette for general use.

```typescript
{
  colors: {
    primary: '#3B82F6',      // Blue
    secondary: '#10B981',    // Green
    background: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
  }
}
```

### Dyslexia Theme

Optimized for users with dyslexia:
- Warm cream background reduces glare
- Darker colors for better contrast
- High contrast borders
- Optimized for OpenDyslexic font

```typescript
{
  colors: {
    primary: '#1E40AF',      // Darker blue
    secondary: '#059669',    // Darker green
    background: '#FEF3C7',    // Warm cream
    text: '#1C1917',          // Dark brown
    border: '#D97706',
    error: '#DC2626',
    warning: '#D97706',
    success: '#059669',
  }
}
```

### High Contrast Theme

Maximum contrast for users with visual impairments:
- Pure black and white
- No gray colors
- Clear boundaries
- Maximum readability

```typescript
{
  colors: {
    primary: '#000000',
    secondary: '#000000',
    background: '#FFFFFF',
    text: '#000000',
    border: '#000000',
    error: '#000000',
    warning: '#000000',
    success: '#000000',
  }
}
```

## Development

```bash
# Build
npm run build

# Test
npm run test

# Watch mode
npm run test:watch
```

## Accessibility Compliance

All components are designed to meet WCAG 2.1 AA standards:
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators
- ARIA attributes

## Dyslexia-Friendly Design Principles

- **Large Click Targets**: Minimum 44px height for interactive elements
- **Clear Visual Feedback**: Hover, active, and focus states
- **High Contrast**: Minimum 4.5:1 contrast ratio
- **Readable Typography**: Optimized font sizes, line heights, and letter spacing
- **Minimal Clutter**: Clean layouts with generous spacing
- **Clear Labels**: Descriptive text for all interactive elements
