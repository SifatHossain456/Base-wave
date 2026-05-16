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
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-medium text-[var(--text-muted)] tracking-wide uppercase">Live TVL from DefiLlama</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
              Top Base Protocols
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              The leading DeFi protocols running on Base mainnet
            </p>
          </div>
          <Link
            href="/protocols"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Protocol grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {top6.map((protocol, i) => (
            <motion.div
              key={protocol.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="card card-hover rounded-2xl p-5 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: `${protocol.color}15`,
                      border: `1px solid ${protocol.color}25`,
                    }}
                  >
                    {protocol.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white">{protocol.name}</p>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${protocol.color}12`, color: protocol.color }}
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
                  className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-[var(--text-muted)] hover:text-white opacity-0 group-hover:opacity-100"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 line-clamp-2">
                {protocol.description}
              </p>

              {/* Stats */}
              <div className="flex items-end justify-between pt-3 border-t border-white/5">
                <div>
                  <p className="text-xs text-[var(--text-muted)] mb-1">Base TVL</p>
                  {protocol.loading ? (
                    <div className="h-6 w-20 bg-white/8 rounded-lg animate-pulse" />
                  ) : (
                    <p className="text-lg font-bold" style={{ color: protocol.color }}>
                      {formatTVL(protocol.tvl)}
                    </p>
                  )}
                </div>
                {!protocol.loading && protocol.change1d !== null && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${protocol.change1d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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

        {/* Mobile view all */}
        <div className="flex justify-center mt-6 sm:hidden">
          <Link href="/protocols" className="btn-secondary text-sm">
            View all protocols <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
