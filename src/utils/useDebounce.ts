import { useRef } from "react";

export function useDebounce(fn: any, delay: number) {
  const timeoutRef = useRef(null);

  function debouncedFn(...args) {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      fn(...args);
    }, delay);
  }

  return debouncedFn;
}