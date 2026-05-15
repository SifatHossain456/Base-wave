'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, ExternalLink, Search } from 'lucide-react';

type NFTCollection = {
  name: string;
  emoji: string;
  color: string;
  description: string;
  url: string;
  tag: string;
};

const NFT_COLLECTIONS: NFTCollection[] = [
  {
    name: 'Onchain Gaias',
    emoji: '🌌',
    color: '#0052FF',
    description: 'The first fully on-chain generative art collection on Base. Supported by Jesse Pollak.',
    url: 'https://opensea.io/collection/onchain-gaias',
    tag: 'Art',
  },
  {
    name: 'Based Punks',
    emoji: '😤',
    color: '#7C3AED',
    description: 'The original punk collection on Base. A tribute to the OG CryptoPunks, now on Base mainnet.',
    url: 'https://opensea.io/collection/based-punks',
    tag: 'PFP',
  },
  {
    name: 'Based Fellas',
    emoji: '😎',
    color: '#10B981',
    description: 'Unique hand-drawn characters celebrating the Base culture and community.',
    url: 'https://opensea.io/collection/based-fellas',
    tag: 'PFP',
  },
  {
    name: 'Tiny Based Frogs',
    emoji: '🐸',
    color: '#22C55E',
    description: 'Tiny frogs living on Base. Jesse Pollak himself holds one. Community-first collection.',
    url: 'https://opensea.io/collection/tinybasedfrog',
    tag: 'Community',
  },
  {
    name: 'Base Gods',
    emoji: '⚡',
    color: '#F59E0B',
    description: 'Mythological deities reborn on Base mainnet. Holders gain access to exclusive DAO governance.',
    url: 'https://opensea.io/collection/base-gods',
    tag: 'Utility',
  },
  {
    name: 'Mochimons',
    emoji: '🌸',
    color: '#EC4899',
    description: 'Cute and collectible Mochi-style characters native to the Base ecosystem.',
    url: 'https://opensea.io/collection/mochimons',
    tag: 'Art',
  },
  {
    name: 'NFToshis',
    emoji: '₿',
    color: '#F7931A',
    description: 'Bitcoin-themed NFT collection bridging BTC culture to the Base L2 ecosystem.',
    url: 'https://opensea.io/collection/nftoshis',
    tag: 'Themed',
  },
  {
    name: 'Primitives',
    emoji: '🔷',
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

  const filtered = NFT_COLLECTIONS.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchTag = tag === 'All' || c.tag === tag;
    return matchSearch && matchTag;
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
          <p className="text-gray-400">
            Featured NFT collections on Base mainnet —{' '}
            <a
              href="https://opensea.io/explore-collections/base"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              view live stats on OpenSea
            </a>
          </p>
        </motion.div>

        {/* Search */}
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
            <motion.a
              key={col.name}
              href={col.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="wave-card glass-hover rounded-3xl p-5 group block"
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
                <div className="p-1.5 rounded-xl hover:bg-white/5 text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                {col.description}
              </p>

              <div
                className="w-full text-center text-xs font-semibold py-2 rounded-xl transition-colors"
                style={{ background: `${col.color}15`, color: col.color }}
              >
                View on OpenSea →
              </div>
            </motion.a>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🌊</p>
            <p className="text-gray-400">No collections match your search.</p>
          </div>
        )}

        <p className="text-xs text-center text-gray-600 mt-8">
          Curated Base NFT collections ·{' '}
          <a
            href="https://opensea.io/explore-collections/base"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400"
          >
            Browse all on OpenSea
          </a>
          {' '}·{' '}
          <a
            href="https://magiceden.io/collections/base"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-400"
          >
            Magic Eden
          </a>
        </p>
      </div>
    </div>
  );
}
