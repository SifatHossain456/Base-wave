'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, ExternalLink, TrendingUp, Search } from 'lucide-react';

type NFTCollection = {
  name: string;
  emoji: string;
  floorEth: number;
  volumeEth: number;
  items: number;
  owners: number;
  color: string;
  description: string;
  url: string;
  tag: string;
};

const NFT_COLLECTIONS: NFTCollection[] = [
  {
    name: 'Onchain Gaias',
    emoji: '🌌',
    floorEth: 1.63,
    volumeEth: 2702,
    items: 8888,
    owners: 3421,
    color: '#0052FF',
    description: 'The first fully on-chain generative art collection on Base. Supported by Jesse Pollak.',
    url: 'https://opensea.io/collection/onchain-gaias',
    tag: 'Art',
  },
  {
    name: 'Based Punks',
    emoji: '😤',
    floorEth: 0.47,
    volumeEth: 1715,
    items: 10000,
    owners: 4890,
    color: '#7C3AED',
    description: 'The original punk collection on Base. A tribute to the OG CryptoPunks, now on Base mainnet.',
    url: 'https://opensea.io/collection/based-punks',
    tag: 'PFP',
  },
  {
    name: 'Based Fellas',
    emoji: '😎',
    floorEth: 0.28,
    volumeEth: 890,
    items: 5000,
    owners: 2311,
    color: '#10B981',
    description: 'Unique hand-drawn characters celebrating the Base culture and community.',
    url: 'https://opensea.io/collection/based-fellas',
    tag: 'PFP',
  },
  {
    name: 'Tiny Based Frogs',
    emoji: '🐸',
    floorEth: 0.12,
    volumeEth: 654,
    items: 6969,
    owners: 2987,
    color: '#22C55E',
    description: 'Tiny frogs living on Base. Jesse Pollak himself holds one. Community-first collection.',
    url: 'https://opensea.io/collection/tinybasedfrog',
    tag: 'Community',
  },
  {
    name: 'Base Gods',
    emoji: '⚡',
    floorEth: 0.09,
    volumeEth: 423,
    items: 3333,
    owners: 1540,
    color: '#F59E0B',
    description: 'Mythological deities reborn on Base mainnet. Holders gain access to exclusive DAO governance.',
    url: 'https://opensea.io/collection/base-gods',
    tag: 'Utility',
  },
  {
    name: 'Mochimons',
    emoji: '🌸',
    floorEth: 0.07,
    volumeEth: 318,
    items: 8000,
    owners: 3201,
    color: '#EC4899',
    description: 'Cute and collectible Mochi-style characters native to the Base ecosystem.',
    url: 'https://opensea.io/collection/mochimons',
    tag: 'Art',
  },
  {
    name: 'NFToshis',
    emoji: '₿',
    floorEth: 0.15,
    volumeEth: 512,
    items: 2100,
    owners: 987,
    color: '#F7931A',
    description: 'Bitcoin-themed NFT collection bridging BTC culture to the Base L2 ecosystem.',
    url: 'https://opensea.io/collection/nftoshis',
    tag: 'Themed',
  },
  {
    name: 'Primitives',
    emoji: '🔷',
    floorEth: 0.22,
    volumeEth: 741,
    items: 4444,
    owners: 1876,
    color: '#00D4FF',
    description: 'Geometric on-chain primitives — simple shapes with deep mathematical beauty, fully on-chain.',
    url: 'https://opensea.io/collection/primitives-base',
    tag: 'On-Chain',
  },
];

const TAGS = ['All', 'Art', 'PFP', 'On-Chain', 'Community', 'Utility', 'Themed'];

export default function NFTsPage() {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState<'volume' | 'floor' | 'name'>('volume');

  const filtered = NFT_COLLECTIONS
    .filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchTag = tag === 'All' || c.tag === tag;
      return matchSearch && matchTag;
    })
    .sort((a, b) => {
      if (sort === 'volume') return b.volumeEth - a.volumeEth;
      if (sort === 'floor') return b.floorEth - a.floorEth;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              Base <span className="text-gradient-blue">NFT Collections</span>
            </h1>
          </div>
          <p className="text-gray-400">Top NFT collections on Base mainnet — by volume and floor price</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search collections..."
              className="w-full glass rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-600"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="glass rounded-2xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors appearance-none bg-transparent cursor-pointer"
          >
            <option value="volume" className="bg-[#0B1E3D]">Sort: Volume</option>
            <option value="floor" className="bg-[#0B1E3D]">Sort: Floor Price</option>
            <option value="name" className="bg-[#0B1E3D]">Sort: Name</option>
          </select>
        </motion.div>

        {/* Tag filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tag === t
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'glass text-gray-400 hover:text-white hover:border-blue-500/30'
              }`}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((col, i) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="wave-card glass-hover rounded-3xl p-5 group"
            >
              {/* NFT image placeholder */}
              <div
                className="w-full aspect-square rounded-2xl mb-4 flex items-center justify-center text-6xl relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${col.color}20, ${col.color}08)` }}
              >
                <span>{col.emoji}</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(circle at center, ${col.color}20, transparent 70%)` }}
                />
              </div>

              {/* Name + tag */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold">{col.name}</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${col.color}20`, color: col.color }}
                  >
                    {col.tag}
                  </span>
                </div>
                <a
                  href={col.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                {col.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Floor</p>
                  <p className="font-bold text-sm" style={{ color: col.color }}>
                    {col.floorEth} ETH
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Volume</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <p className="font-bold text-sm text-green-400">
                      {col.volumeEth >= 1000
                        ? `${(col.volumeEth / 1000).toFixed(1)}K`
                        : col.volumeEth} ETH
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>{col.items.toLocaleString()} items</span>
                <span>{col.owners.toLocaleString()} owners</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🌊</p>
            <p className="text-gray-400">No collections match your search.</p>
          </div>
        )}

        <p className="text-xs text-center text-gray-600 mt-8">
          Data sourced from public NFT market activity on Base ·{' '}
          <a href="https://opensea.io/collection/base" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">
            Browse on OpenSea
          </a>
        </p>
      </div>
    </div>
  );
}
