'use client';

import { useState, useEffect } from 'react';

export type ChainStats = {
  transactionsToday: number | null;
  avgBlockTimeSec: number | null;
  gasPriceGwei: number | null;
  loading: boolean;
};

export function useChainStats(): ChainStats {
  const [stats, setStats] = useState<ChainStats>({
    transactionsToday: null,
    avgBlockTimeSec: null,
    gasPriceGwei: null,
    loading: true,
  });

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch('https://base.blockscout.com/api/v2/stats', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error();
        const d = await res.json();
        setStats({
          transactionsToday:
            typeof d.transactions_today === 'string'
              ? parseInt(d.transactions_today, 10)
              : (d.transactions_today ?? null),
          avgBlockTimeSec:
            d.average_block_time != null ? Math.round(d.average_block_time / 1000 * 10) / 10 : null,
          gasPriceGwei: d.gas_prices?.average ?? null,
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    })();
    return () => controller.abort();
  }, []);

  return stats;
}
