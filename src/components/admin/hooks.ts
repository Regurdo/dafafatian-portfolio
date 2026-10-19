'use client';
import { useCallback, useEffect, useState } from 'react';
import { listRows, type TableName } from '@/lib/admin-queries';

/** Ambil semua baris sebuah tabel langsung dari database (tanpa fallback). */
export function useRows<T>(table: TableName) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    listRows<T>(table).then(({ data, error }) => {
      if (!alive) return;
      setRows(data ?? []);
      setError(error);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [table]);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await listRows<T>(table);
    setRows(data ?? []);
    setError(error);
    setLoading(false);
  }, [table]);

  return { rows, setRows, loading, error, reload };
}
