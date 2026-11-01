/**
 * @dyslexia-hub/components
 *
 * Base component library for the Dyslexia Grand Hub
 *
 * This library provides:
 * - Base UI components (Button, Input, Card, Modal, Typography)
 * - Theme system (default, dyslexia-friendly, high-contrast)
 * - Accessibility features (WCAG 2.1 AA compliant)
 * - Dyslexia-friendly design (large click targets, clear fonts, high contrast)
 */

// Base Components
export { Button } from './base/Button';
export type { ButtonProps } from './base/Button';
export { Input } from './base/Input';
export type { InputProps } from './base/Input';
export { Card } from './base/Card';
export type { CardProps } from './base/Card';
export { Modal } from './base/Modal';
export type { ModalProps } from './base/Modal';
export { Typography } from './base/Typography';
export type { TypographyProps } from './base/Typography';

// Themes
export { defaultTheme } from './themes/default';
export { dyslexiaTheme } from './themes/dyslexia';
export { highContrastTheme } from './themes/high-contrast';
export type { Theme } from './themes/default';
