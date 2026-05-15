'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, TrendingUp, TrendingDown, Layers, ArrowUpDown } from 'lucide-react';
import { useBaseProtocols } from '@/hooks/useBaseProtocols';

type SortKey = 'tvl' | 'name' | 'category';
const CATEGORIES = ['All', 'DEX', 'DEX / AMM', 'Lending', 'Yield'];

function formatTVL(tvl: number | null): string {
  if (tvl === null) return '—';
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
  if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(0)}K`;
  return `$${tvl.toFixed(0)}`;
}

export default function ProtocolsPage() {
  const protocols = useBaseProtocols();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortKey, setSortKey] = useState<SortKey>('tvl');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = protocols
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || p.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      let val = 0;
      if (sortKey === 'tvl') val = (b.tvl ?? -1) - (a.tvl ?? -1);
      if (sortKey === 'name') val = a.name.localeCompare(b.name);
      if (sortKey === 'category') val = a.category.localeCompare(b.category);
      return sortAsc ? -val : val;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const totalTVL = protocols.reduce((s, p) => s + (p.tvl ?? 0), 0);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              Base <span className="text-gradient-blue">Protocols</span>
            </h1>
          </div>
          <p className="text-gray-400">
            Top DeFi protocols on Base — live TVL data from DefiLlama
          </p>
        </motion.div>

        {/* Summary bar */}
        {totalTVL > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center gap-4 border border-blue-500/20"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-300">Combined Base TVL (shown protocols)</span>
            </div>
            <span className="sm:ml-auto text-xl font-black text-green-400">
              {formatTVL(totalTVL)}
            </span>
          </motion.div>
        )}

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
              placeholder="Search protocols..."
              className="w-full glass rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-gray-600"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === c
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'glass text-gray-400 hover:text-white hover:border-blue-500/30'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table header */}
        <div className="glass rounded-t-3xl overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-6 py-3 border-b border-white/5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <button
              className="col-span-4 flex items-center gap-1 hover:text-gray-300 transition-colors text-left"
              onClick={() => toggleSort('name')}
            >
              Protocol <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              className="col-span-2 flex items-center gap-1 hover:text-gray-300 transition-colors"
              onClick={() => toggleSort('category')}
            >
              Category <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              className="col-span-3 flex items-center gap-1 justify-end hover:text-gray-300 transition-colors ml-auto"
              onClick={() => toggleSort('tvl')}
            >
              Base TVL <ArrowUpDown className="w-3 h-3" />
            </button>
            <div className="col-span-2 text-right">24h Change</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((protocol, i) => (
              <motion.div
                key={protocol.slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-white/3 transition-colors group"
              >
                <div className="col-span-1 text-sm font-bold text-gray-500">{i + 1}</div>

                <div className="col-span-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${protocol.color}20`, border: `1px solid ${protocol.color}30` }}
                  >
                    {protocol.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{protocol.name}</p>
                    <p className="text-xs text-gray-500 truncate">{protocol.description.slice(0, 48)}…</p>
                  </div>
                </div>

                <div className="col-span-2">
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: `${protocol.color}20`, color: protocol.color }}
                  >
                    {protocol.category}
                  </span>
                </div>

                <div className="col-span-3 text-right">
                  {protocol.loading ? (
                    <div className="h-5 w-20 bg-white/10 rounded animate-pulse ml-auto" />
                  ) : (
                    <p className="font-black text-sm" style={{ color: protocol.color }}>
                      {formatTVL(protocol.tvl)}
                    </p>
                  )}
                </div>

                <div className="col-span-2 text-right">
                  {!protocol.loading && protocol.change1d !== null ? (
                    <div className={`flex items-center justify-end gap-1 text-xs font-semibold ${protocol.change1d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {protocol.change1d >= 0
                        ? <TrendingUp className="w-3 h-3" />
                        : <TrendingDown className="w-3 h-3" />
                      }
                      {Math.abs(protocol.change1d).toFixed(2)}%
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                  <a
                    href={protocol.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100 mt-1"
                  >
                    Visit <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 glass rounded-b-3xl">
            <p className="text-4xl mb-3">🌊</p>
            <p className="text-gray-400">No protocols match your search.</p>
          </div>
        )}

        <p className="text-xs text-center text-gray-600 mt-6">
          TVL data provided by{' '}
          <a href="https://defillama.com/chain/base" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400">
            DefiLlama
          </a>{' '}
          · Updates every 5 minutes
        </p>
      </div>
    </div>
  );
}
