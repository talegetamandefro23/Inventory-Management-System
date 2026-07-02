import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

/**
 * Generic hook for async API calls with loading/error states.
 *
 * Usage:
 *   const { data, loading, error, execute } = useApi(() => itemsService.list());
 *   const { data, execute } = useApi(() => itemsService.list(), { immediate: false });
 */
export function useApi<T>(
  apiFn: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options.immediate ?? true,
    error: null,
  });
  const mountedRef = useRef(true);

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const result = await apiFn();
        if (mountedRef.current) {
          setState({ data: result, loading: false, error: null });
        }
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        if (mountedRef.current) {
          setState((s) => ({ ...s, loading: false, error: message }));
        }
        throw err;
      }
    },
    [apiFn]
  );

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

/**
 * Hook for mutation operations (POST/PUT/DELETE) with loading/error states.
 *
 * Usage:
 *   const { execute, loading, error } = useMutation();
 *   await execute(() => itemsService.create(newItem));
 */
export function useMutation<TInput, TResult = void>() {
  const [state, setState] = useState<UseApiState<TResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiFn: (input: TInput) => Promise<TResult>, input: TInput): Promise<TResult> => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await apiFn(input);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        setState({ data: null, loading: false, error: message });
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
