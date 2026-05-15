'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useBaseProtocols } from '@/hooks/useBaseProtocols';

function formatTVL(tvl: number | null): string {
  if (tvl === null) return '—';
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
  if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(0)}K`;
  return `$${tvl.toFixed(0)}`;
}

export function TopProtocols() {
  const protocols = useBaseProtocols();
  const top6 = protocols.slice(0, 6);

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/8 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 mb-4 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-gray-300">Live TVL from DefiLlama</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              Top <span className="text-gradient-blue">Base Protocols</span>
            </h2>
            <p className="text-gray-400">The biggest DeFi protocols running on Base mainnet</p>
          </div>
          <Link
            href="/protocols"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {top6.map((protocol, i) => (
            <motion.div
              key={protocol.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="wave-card glass-hover rounded-3xl p-6 group cursor-pointer"
            >
              {/* Top color bar already provided by wave-card::before via color */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      background: `${protocol.color}20`,
                      border: `1px solid ${protocol.color}30`,
                    }}
                  >
                    {protocol.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-base">{protocol.name}</p>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${protocol.color}20`, color: protocol.color }}
                    >
                      {protocol.category}
                    </span>
                  </div>
                </div>
                <a
                  href={protocol.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-500 hover:text-white opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">
                {protocol.description}
              </p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Base TVL</p>
                  {protocol.loading ? (
                    <div className="h-7 w-24 bg-white/10 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-black" style={{ color: protocol.color }}>
                      {formatTVL(protocol.tvl)}
                    </p>
                  )}
                </div>
                {!protocol.loading && protocol.change1d !== null && (
                  <div className={`flex items-center gap-1 text-xs font-semibold ${protocol.change1d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {protocol.change1d >= 0
                      ? <TrendingUp className="w-3.5 h-3.5" />
                      : <TrendingDown className="w-3.5 h-3.5" />
                    }
                    {Math.abs(protocol.change1d).toFixed(2)}%
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8 sm:hidden">
          <Link
            href="/protocols"
            className="flex items-center gap-2 glass px-6 py-3 rounded-2xl text-sm font-semibold hover:border-blue-500/40 transition-all"
          >
            View all protocols <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
