/**
 * Premium Motion Design Tokens & Animation Architecture
 * Built on Motion for React (motion/react).
 * Follows 120-180ms fast, 180-280ms standard, 300-450ms large duration hierarchy.
 * All animations prioritize GPU-accelerated transform & opacity.
 */

export const motionTokens = {
  duration: {
    instant: 0.1,
    fast: 0.16,
    standard: 0.24,
    slow: 0.36,
  },
  ease: {
    // Premium custom cubic bezier curve (smooth deceleration without excessive bounce)
    out: [0.16, 1, 0.3, 1],
    inOut: [0.65, 0, 0.35, 1],
    in: [0.32, 0, 0.67, 0],
  },
  spring: {
    snappy: { type: 'spring', stiffness: 500, damping: 32 },
    smooth: { type: 'spring', stiffness: 380, damping: 28 },
    gentle: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

// Fade Variants (Simple opacity transitions)
export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out } },
  exit: { opacity: 0, transition: { duration: motionTokens.duration.instant, ease: motionTokens.ease.in } },
};

// Dropdown / Popover Variants (Scale & slight Y slide)
export const dropdownVariants = {
  initial: { opacity: 0, scale: 0.95, y: -6 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -6,
    transition: { duration: motionTokens.duration.instant, ease: motionTokens.ease.in },
  },
};

// Modal / Dialog Variants
export const modalVariants = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: motionTokens.duration.standard, ease: motionTokens.ease.out } },
    exit: { opacity: 0, transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.in } },
  },
  dialog: {
    initial: { opacity: 0, scale: 0.96, y: 10 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: motionTokens.duration.standard, ease: motionTokens.ease.out },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 10,
      transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.in },
    },
  },
};

// Step Slide Transition (Horizontal slide for wizards)
export const stepSlideVariants = {
  initial: (direction = 1) => ({
    opacity: 0,
    x: direction > 0 ? 16 : -16,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: motionTokens.duration.standard, ease: motionTokens.ease.out },
  },
  exit: (direction = 1) => ({
    opacity: 0,
    x: direction > 0 ? -16 : 16,
    transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.in },
  }),
};

// Tab Content Fade-Slide
export const tabContentVariants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.standard, ease: motionTokens.ease.out },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.in },
  },
};

// Stagger Container & Items (Lists & Grid cards)
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.standard, ease: motionTokens.ease.out },
  },
};

// Micro-interaction props for Buttons
export const buttonTapMotion = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { duration: motionTokens.duration.instant },
};

// Micro-interaction props for Interactive Cards
export const cardHoverMotion = {
  whileHover: {
    y: -2,
    transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.out },
  },
  whileTap: { scale: 0.99 },
};
