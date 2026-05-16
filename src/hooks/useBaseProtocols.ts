'use client';

import { useState, useEffect } from 'react';

export type Protocol = {
  name: string;
  slug: string;
  category: string;
  emoji: string;
  color: string;
  tvl: number | null;
  change1d: number | null;
  loading: boolean;
  url: string;
  description: string;
};

const PROTOCOLS: Omit<Protocol, 'tvl' | 'change1d' | 'loading'>[] = [
  {
    name: 'Aerodrome',
    slug: 'aerodrome-finance',
    category: 'DEX / AMM',
    emoji: '✈️',
    color: '#0052FF',
    url: 'https://aerodrome.finance',
    description: 'The central liquidity marketplace on Base — Base\'s leading AMM and DEX.',
  },
  {
    name: 'Moonwell',
    slug: 'moonwell',
    category: 'Lending',
    emoji: '🌙',
    color: '#9333EA',
    url: 'https://moonwell.fi',
    description: 'Open and accessible lending and borrowing protocol on Base mainnet.',
  },
  {
    name: 'Aave V3',
    slug: 'aave-v3',
    category: 'Lending',
    emoji: '👻',
    color: '#B6509E',
    url: 'https://app.aave.com',
    description: 'The leading decentralized liquidity protocol with isolated lending markets.',
  },
  {
    name: 'Uniswap V3',
    slug: 'uniswap-v3',
    category: 'DEX',
    emoji: '🦄',
    color: '#FF007A',
    url: 'https://app.uniswap.org',
    description: 'The most trusted decentralized trading protocol with concentrated liquidity.',
  },
  {
    name: 'Morpho',
    slug: 'morpho',
    category: 'Lending',
    emoji: '🔷',
    color: '#00B8D9',
    url: 'https://morpho.org',
    description: 'Decentralized lending protocol optimizing rates through peer-to-peer matching.',
  },
  {
    name: 'Compound V3',
    slug: 'compound-v3',
    category: 'Lending',
    emoji: '⚗️',
    color: '#00D395',
    url: 'https://compound.finance',
    description: 'Battle-tested lending protocol with efficient capital utilization on Base.',
  },
  {
    name: 'Extra Finance',
    slug: 'extra-finance',
    category: 'Yield',
    emoji: '💎',
    color: '#F59E0B',
    url: 'https://app.extrafi.io',
    description: 'Leveraged yield farming and lending protocol native to Base ecosystem.',
  },
  {
    name: 'Balancer',
    slug: 'balancer-v2',
    category: 'DEX',
    emoji: '⚖️',
    color: '#8247E5',
    url: 'https://app.balancer.fi',
    description: 'Flexible AMM with weighted pools, stable pools, and boosted pools on Base.',
  },
  {
    name: 'Curve Finance',
    slug: 'curve-dex',
    category: 'DEX',
    emoji: '🌀',
    color: '#F7C464',
    url: 'https://curve.fi',
    description: 'Stablecoin and pegged-asset DEX with deep liquidity and low slippage.',
  },
];

export function useBaseProtocols() {
  const [protocols, setProtocols] = useState<Protocol[]>(
    PROTOCOLS.map((p) => ({ ...p, tvl: null, change1d: null, loading: true }))
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchAll = async () => {
      try {
        const res = await fetch('https://api.llama.fi/protocols', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('API error');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const all: any[] = await res.json();

        setProtocols(
          PROTOCOLS.map((p) => {
            const found = all.find(
              (ap) => ap.slug === p.slug || ap.name.toLowerCase() === p.name.toLowerCase()
            );
            const baseTvl: number | null =
              found?.chainTvls?.Base?.tvl ?? found?.chainTvls?.base?.tvl ?? found?.tvl ?? null;
            const change: number | null = found?.change_1d ?? null;
            return { ...p, tvl: baseTvl, change1d: change, loading: false };
          })
        );
      } catch {
        setProtocols((prev) =>
          prev.map((p) => ({ ...p, loading: false }))
        );
      }
    };

    fetchAll();
    return () => controller.abort();
  }, []);

  return protocols;
}

export function useBaseTVL() {
  const [tvl, setTvl] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTVL = async () => {
      try {
        const res = await fetch('https://api.llama.fi/v2/chains');
        if (!res.ok) throw new Error();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chains: any[] = await res.json();
        const base = chains.find((c) => c.name === 'Base');
        if (base) {
          setTvl(base.tvl ?? null);
          setChange(base.change_1d ?? null);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchTVL();
  }, []);

  return { tvl, change, loading };
}
