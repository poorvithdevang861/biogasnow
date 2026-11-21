import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { modalVariants } from '../../utils/motion';

/**
 * Premium Motion Modal Dialog Component
 * Handles smooth entrance/exit with AnimatePresence, backdrop blur,
 * escape key handling, and light/dark styling.
 */
export function Modal({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : modalVariants.backdrop.initial}
            animate={shouldReduceMotion ? { opacity: 1 } : modalVariants.backdrop.animate}
            exit={shouldReduceMotion ? { opacity: 0 } : modalVariants.backdrop.exit}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            initial={shouldReduceMotion ? { opacity: 1 } : modalVariants.dialog.initial}
            animate={shouldReduceMotion ? { opacity: 1 } : modalVariants.dialog.animate}
            exit={shouldReduceMotion ? { opacity: 0 } : modalVariants.dialog.exit}
            className={`relative w-full ${maxWidth} bg-white rounded-2xl border border-zinc-200 shadow-2xl z-10 my-auto text-zinc-900 overflow-hidden ${className}`}
          >
            {/* Header */}
            {(title || onClose) && (
              <div className="flex items-start justify-between p-5 sm:p-6 border-b border-zinc-100 gap-3">
                <div className="min-w-0">
                  {title && (
                    <h3 id="modal-title" className="text-base sm:text-lg font-bold text-zinc-900">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>

                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700:text-zinc-200 hover:bg-zinc-100:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    aria-label="Close dialog"
                  >
                    <X size={18} className="stroke-[2.2]" />
                  </button>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="p-5 sm:p-6 max-h-[calc(85vh-120px)] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;