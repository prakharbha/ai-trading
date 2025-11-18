// Block console spam

console.log = () => {};
console.info = () => {};
console.debug = () => {};
console.warn = () => {};

if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args[0];
    if (typeof message === 'string') {
      if (
        message.includes('Download the React DevTools') ||
        message.includes('reactjs.org/link/react-devtools') ||
        message.includes('react-devtools')
      ) {
        return;
      }
      if (
        message.includes('[vite]') ||
        message.includes('vite') ||
        message.includes('HMR') ||
        message.includes('Fast Refresh')
      ) {
        return;
      }
    }
    originalError.apply(console, args);
  };
}

export {};

