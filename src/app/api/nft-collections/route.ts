import { NextResponse } from 'next/server';

// Force this to be a real server route — never statically pre-rendered
export const dynamic = 'force-dynamic';

const COLLECTIONS = [
  {
    name: 'Onchain Gaias',
    slug: 'onchain-gaias',
    color: '#0052FF',
    tag: 'Art',
    url: 'https://opensea.io/collection/onchain-gaias',
    description: 'The first fully on-chain generative art collection on Base. Supported by Jesse Pollak.',
  },
  {
    name: 'Based Punks',
    slug: 'based-punks',
    color: '#7C3AED',
    tag: 'PFP',
    url: 'https://opensea.io/collection/based-punks',
    description: 'The original punk collection on Base. A tribute to the OG CryptoPunks, now on Base mainnet.',
  },
  {
    name: 'Based Fellas',
    slug: 'based-fellas',
    color: '#10B981',
    tag: 'PFP',
    url: 'https://opensea.io/collection/based-fellas',
    description: 'Unique hand-drawn characters celebrating the Base culture and community.',
  },
  {
    name: 'Tiny Based Frogs',
    slug: 'tinybasedfrog',
    color: '#22C55E',
    tag: 'Community',
    url: 'https://opensea.io/collection/tinybasedfrog',
    description: 'Tiny frogs living on Base. Jesse Pollak himself holds one. Community-first collection.',
  },
  {
    name: 'Base Gods',
    slug: 'base-gods',
    color: '#F59E0B',
    tag: 'Utility',
    url: 'https://opensea.io/collection/base-gods',
    description: 'Mythological deities reborn on Base mainnet. Holders gain access to exclusive DAO governance.',
  },
  {
    name: 'Mochimons',
    slug: 'mochimons',
    color: '#EC4899',
    tag: 'Art',
    url: 'https://opensea.io/collection/mochimons',
    description: 'Cute and collectible Mochi-style characters native to the Base ecosystem.',
  },
  {
    name: 'NFToshis',
    slug: 'nftoshis',
    color: '#F7931A',
    tag: 'Themed',
    url: 'https://opensea.io/collection/nftoshis',
    description: 'Bitcoin-themed NFT collection bridging BTC culture to the Base L2 ecosystem.',
  },
  {
    name: 'Primitives',
    slug: 'primitives-base',
    color: '#00D4FF',
    tag: 'On-Chain',
    url: 'https://opensea.io/collection/primitives-base',
    description: 'Geometric on-chain primitives — simple shapes with deep mathematical beauty, fully on-chain.',
  },
];

type ReservoirCollection = {
  image?: string;
  banner?: string;
  floorAsk?: { price?: { amount?: { native?: number; usd?: number } } };
};

async function fetchReservoir(url: string): Promise<ReservoirCollection | null> {
  try {
    const res = await fetch(url, {
      headers: { accept: 'application/json' },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.collections?.[0] ?? null) as ReservoirCollection | null;
  } catch {
    return null;
  }
}

async function getCollectionData(col: typeof COLLECTIONS[0]) {
  const base = 'https://api-base.reservoir.tools/collections/v7';

  // Try by slug first (most precise), then by name
  let c = await fetchReservoir(`${base}?slug=${col.slug}&limit=1`);
  if (!c?.image) c = await fetchReservoir(`${base}?name=${encodeURIComponent(col.name)}&limit=1`);

  const image = c?.image ?? c?.banner ?? null;
  const floorPrice = c?.floorAsk?.price?.amount?.native ?? null;
  const floorPriceUSD = c?.floorAsk?.price?.amount?.usd ?? null;

  return { ...col, image, floorPrice, floorPriceUSD };
}

export async function GET() {
  const results = await Promise.allSettled(COLLECTIONS.map(getCollectionData));

  const collections = results.map((r, i) =>
    r.status === 'fulfilled'
      ? r.value
      : { ...COLLECTIONS[i], image: null, floorPrice: null, floorPriceUSD: null }
  );

  return NextResponse.json(collections, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
