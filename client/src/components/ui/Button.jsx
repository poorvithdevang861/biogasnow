import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { buttonTapMotion } from '../../utils/motion';

/**
 * Premium Motion Button Component
 * Supports micro-interaction spring feedback on hover and tap,
 * clean loading spinners, and dark/light unslop styling.
 */
export const Button = React.forwardRef(function Button(
  {
    children,
    type = 'button',
    variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    color = 'emerald', // 'emerald' | 'amber' | 'teal'
    size = 'md', // 'sm' | 'md' | 'lg'
    loading = false,
    disabled = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    className = '',
    onClick,
    ...props
  },
  ref
) {
  const shouldReduceMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
    md: 'text-xs sm:text-sm px-4 py-2 rounded-xl gap-2 h-9 sm:h-10',
    lg: 'text-sm sm:text-base px-5 py-2.5 rounded-xl gap-2.5 h-11',
  }[size] || sizeClasses.md;

  const colorVariants = {
    primary: {
      emerald: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs focus:ring-emerald-500',
      amber: 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs focus:ring-amber-500',
      teal: 'bg-teal-600 hover:bg-teal-500 text-white shadow-xs focus:ring-teal-500',
    }[color] || 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs focus:ring-emerald-500',
    secondary:
      'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-xs focus:ring-zinc-400',
    outline:
      'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 focus:ring-zinc-400',
    ghost:
      'bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 focus:ring-zinc-400',
    danger:
      'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 focus:ring-rose-500',
  }[variant] || '';

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer';

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      {...(!disabled && !loading && !shouldReduceMotion ? buttonTapMotion : {})}
      className={`inline-flex items-center justify-center font-semibold font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-zinc-900 ${sizeClasses} ${colorVariants} ${disabledClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 13 : 16} className="animate-spin shrink-0 stroke-[2.2]" />
      ) : LeftIcon ? (
        <LeftIcon size={size === 'sm' ? 13 : 16} className="shrink-0 stroke-[2]" />
      ) : null}

      <span>{children}</span>

      {!loading && RightIcon && (
        <RightIcon size={size === 'sm' ? 13 : 16} className="shrink-0 stroke-[2]" />
      )}
    </motion.button>
  );
});

export default Button;