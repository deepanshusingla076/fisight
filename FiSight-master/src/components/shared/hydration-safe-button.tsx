'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface HydrationSafeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  motionProps?: any;
}

/**
 * A button component that's safe from hydration mismatches.
 * Uses suppressHydrationWarning to prevent issues with browser extensions
 * that add attributes like fdprocessedid.
 */
export const HydrationSafeButton = forwardRef<HTMLButtonElement, HydrationSafeButtonProps>(
  ({ children, motionProps, ...props }, ref) => {
    if (motionProps) {
      return (
        <motion.button
          ref={ref}
          {...props}
          {...motionProps}
          suppressHydrationWarning={true}
        >
          {children}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        {...props}
        suppressHydrationWarning={true}
      >
        {children}
      </button>
    );
  }
);

HydrationSafeButton.displayName = 'HydrationSafeButton';
