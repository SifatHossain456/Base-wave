'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, ExternalLink, Search } from 'lucide-react';

type NFTCollection = {
  name: string;
  color: string;
  description: string;
  url: string;
  tag: string;
  image: string | null;
  floorPrice: number | null;
  floorPriceUSD: number | null;
};

const TAGS = ['All', 'Art', 'PFP', 'On-Chain', 'Community', 'Utility', 'Themed'];

export default function NFTsPage() {
  const [collections, setCollections] = useState<NFTCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('All');
  const [imgErrors, setImgErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/nft-collections')
      .then((r) => r.json())
      .then((data) => setCollections(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = collections.filter((c) => {
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

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card rounded-3xl p-5 animate-pulse">
                <div className="w-full aspect-square rounded-2xl bg-white/5 mb-4" />
                <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* NFT Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((col, i) => {
              const showImg = col.image && !imgErrors.has(col.name);
              return (
                <motion.a
                  key={col.name}
                  href={col.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="card card-hover rounded-3xl p-5 group block"
                >
                  {/* Image area */}
                  <div
                    className="w-full aspect-square rounded-2xl mb-4 overflow-hidden relative"
                    style={!showImg ? { background: `linear-gradient(135deg, ${col.color}25, ${col.color}08)` } : {}}
                  >
                    {showImg ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={col.image!}
                        alt={col.name}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() =>
                          setImgErrors((prev) => {
                            const next = new Set(prev);
                            next.add(col.name);
                            return next;
                          })
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div
                          className="w-16 h-16 rounded-2xl"
                          style={{ background: `${col.color}30`, border: `1px solid ${col.color}40` }}
                        />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: `radial-gradient(circle at center, ${col.color}15, transparent 70%)` }}
                    />
                  </div>

                  {/* Name + tag */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm">{col.name}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${col.color}20`, color: col.color }}
                      >
                        {col.tag}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-xl text-gray-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {col.description}
                  </p>

                  {/* Floor price + CTA */}
                  <div className="flex items-center justify-between">
                    {col.floorPrice !== null ? (
                      <div>
                        <p className="text-xs text-gray-500">Floor</p>
                        <p className="text-sm font-bold" style={{ color: col.color }}>
                          {col.floorPrice.toFixed(4)} ETH
                        </p>
                      </div>
                    ) : (
                      <div />
                    )}
                    <div
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                      style={{ background: `${col.color}15`, color: col.color }}
                    >
                      View →
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🌊</div>
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
