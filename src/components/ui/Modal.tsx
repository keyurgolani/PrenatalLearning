import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  testId?: string;
  maxWidth?: string;
  showCloseButton?: boolean;
  closeButtonClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  testId = 'modal',
  maxWidth = 'max-w-md',
  showCloseButton = true,
  closeButtonClassName = 'text-white bg-white/20 hover:bg-white/30',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Trap focus
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
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

    document.addEventListener('keydown', handleTabKey);
    
    // Focus first element on open
    const timer = setTimeout(() => {
      firstElement?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${testId}-title` : undefined}
      data-testid={testId}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm theme-colors"
        style={{ transitionProperty: 'opacity, background-color', transitionDuration: 'var(--duration-standard)' }}
        aria-hidden="true"
      />

      {/* Modal Container Wrapper */}
      <div 
        className="relative min-h-screen flex items-center justify-center p-4 outline-none"
        onClick={handleBackdropClick}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          ref={modalRef}
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden animate-pop-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-2 rounded-full icon-interactive focus-ring ${closeButtonClassName}`}
              aria-label="Close modal"
              data-testid={`${testId}-close-button`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};
