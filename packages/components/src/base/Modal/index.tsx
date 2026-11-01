/**
 * Modal Component
 *
 * Accessibility Features:
 * - Focus trap
 * - Escape key to close
 * - ARIA dialog role
 * - Screen reader announcement
 *
 * Dyslexia-Friendly Design:
 * - Clear close button
 * - Minimal modal content
 * - High contrast overlay
 * - Large touch targets
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const [previousActiveElement, setPreviousActiveElement] =
    useState<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      setPreviousActiveElement(document.activeElement as HTMLElement);
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore focus to previous element
      previousActiveElement?.focus();
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, previousActiveElement]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '16px',
  };

  const modalStyles = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    padding: '32px',
    position: 'relative' as const,
    outline: 'none',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  };

  const titleStyles = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1F2937',
    fontFamily: 'inherit',
    margin: 0,
  };

  const closeButtonStyles = {
    width: '44px',
    height: '44px',
    minHeight: '44px',
    borderRadius: '8px',
    border: '2px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const contentStyles = {
    fontSize: '16px',
    lineHeight: 1.75,
    color: '#1F2937',
    fontFamily: 'inherit',
  };

  return (
    <div
      style={overlayStyles}
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        style={modalStyles}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div style={headerStyles}>
          <h2
            id="modal-title"
            style={titleStyles}
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            style={closeButtonStyles}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div style={contentStyles}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
