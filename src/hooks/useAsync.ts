import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Tiny data-fetching helper. Runs `fn` on mount and whenever `deps` change.
 * Backend developer: this works the same whether services hit mock data or a
 * real API — no changes needed here.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoFn = useCallback(fn, deps);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    memoFn()
      .then((res) => active && setData(res))
      .catch((e) => active && setError(e instanceof Error ? e.message : 'Something went wrong'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [memoFn, nonce]);

  return { data, loading, error, reload: () => setNonce((n) => n + 1) };
}
