import { clsx, type ClassValue } from "clsx"
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const useDebounce = (callback: () => void, delay: number) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);
};