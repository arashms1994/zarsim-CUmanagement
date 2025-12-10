import { useCallback, useRef } from "react";
import { config } from "../api/config";

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay?: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceDelay = delay || config.DEBOUNCE_DELAY;

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, debounceDelay);
    },
    [callback, debounceDelay]
  ) as T;

  return debouncedCallback;
};

export const useDebouncedSearch = <T extends (...args: any[]) => any>(
  searchFunction: T,
  delay?: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceDelay = delay || config.DEBOUNCE_DELAY;

  const debouncedSearch = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        searchFunction(...args);
      }, debounceDelay);
    },
    [searchFunction, debounceDelay]
  );

  return debouncedSearch;
};
