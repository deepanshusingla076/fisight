'use client';

// Suppress hydration warnings for browser extension attributes
export function suppressHydrationWarnings() {
  if (typeof window !== 'undefined') {
    // Store original console.error
    const originalConsoleError = console.error;
    
    // Override console.error to filter out hydration warnings for browser extensions
    console.error = (...args) => {
      const message = args[0];
      
      // Skip hydration warnings caused by browser extensions
      if (
        typeof message === 'string' && 
        (
          message.includes('fdprocessedid') ||
          message.includes('data-lastpass') ||
          message.includes('data-1password') ||
          message.includes('data-bitwarden') ||
          message.includes('browser extension') ||
          (message.includes('hydration') && message.includes('attributes'))
        )
      ) {
        return; // Suppress these warnings
      }
      
      // Log all other errors normally
      originalConsoleError.apply(console, args);
    };
  }
}

// Auto-initialize on import
if (typeof window !== 'undefined') {
  suppressHydrationWarnings();
}
