import { NextResponse } from 'next/server';

export const revalidate = 3600;

const COLLECTIONS = [
  {
    name: 'Onchain Gaias',
    color: '#0052FF',
    tag: 'Art',
    url: 'https://opensea.io/collection/onchain-gaias',
    description: 'The first fully on-chain generative art collection on Base. Supported by Jesse Pollak.',
  },
  {
    name: 'Based Punks',
    color: '#7C3AED',
    tag: 'PFP',
    url: 'https://opensea.io/collection/based-punks',
    description: 'The original punk collection on Base. A tribute to the OG CryptoPunks, now on Base mainnet.',
  },
  {
    name: 'Based Fellas',
    color: '#10B981',
    tag: 'PFP',
    url: 'https://opensea.io/collection/based-fellas',
    description: 'Unique hand-drawn characters celebrating the Base culture and community.',
  },
  {
    name: 'Tiny Based Frogs',
    color: '#22C55E',
    tag: 'Community',
    url: 'https://opensea.io/collection/tinybasedfrog',
    description: 'Tiny frogs living on Base. Jesse Pollak himself holds one. Community-first collection.',
  },
  {
    name: 'Base Gods',
    color: '#F59E0B',
    tag: 'Utility',
    url: 'https://opensea.io/collection/base-gods',
    description: 'Mythological deities reborn on Base mainnet. Holders gain access to exclusive DAO governance.',
  },
  {
    name: 'Mochimons',
    color: '#EC4899',
    tag: 'Art',
    url: 'https://opensea.io/collection/mochimons',
    description: 'Cute and collectible Mochi-style characters native to the Base ecosystem.',
  },
  {
    name: 'NFToshis',
    color: '#F7931A',
    tag: 'Themed',
    url: 'https://opensea.io/collection/nftoshis',
    description: 'Bitcoin-themed NFT collection bridging BTC culture to the Base L2 ecosystem.',
  },
  {
    name: 'Primitives',
    color: '#00D4FF',
    tag: 'On-Chain',
    url: 'https://opensea.io/collection/primitives-base',
    description: 'Geometric on-chain primitives — simple shapes with deep mathematical beauty, fully on-chain.',
  },
];

async function fetchCollection(name: string) {
  const res = await fetch(
    `https://api-base.reservoir.tools/search/collections/v2?name=${encodeURIComponent(name)}&limit=1`,
    {
      headers: { accept: 'application/json', 'x-api-key': 'demo-api-key' },
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.collections?.[0] ?? null;
}

export async function GET() {
  const results = await Promise.allSettled(
    COLLECTIONS.map(async (col) => {
      try {
        const c = await fetchCollection(col.name);
        return {
          ...col,
          image: (c?.image as string | null) ?? null,
          floorPrice: (c?.floorAskPrice?.amount?.native as number | null) ?? null,
          floorPriceUSD: (c?.floorAskPrice?.amount?.usd as number | null) ?? null,
        };
      } catch {
        return { ...col, image: null, floorPrice: null, floorPriceUSD: null };
      }
    })
  );

  const collections = results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { ...COLLECTIONS[i], image: null, floorPrice: null, floorPriceUSD: null }
  );

  return NextResponse.json(collections, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
