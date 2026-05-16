'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useAssetPrices } from '@/hooks/useAssetPrices';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

function PriceTicker() {
  const prices = useAssetPrices(30000);

  return (
    <motion.div
      {...fadeUp(0.6)}
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {prices.map((p) => {
        const up = (p.change24h ?? 0) >= 0;
        return (
          <div
            key={p.symbol}
            className="flex items-center gap-2.5 card px-4 py-2.5 rounded-xl"
          >
            <span className="text-xs font-semibold text-white">{p.symbol}</span>
            {p.loading ? (
              <div className="h-3.5 w-16 bg-white/10 rounded animate-pulse" />
            ) : p.price === null ? (
              <span className="text-xs text-[var(--text-muted)]">—</span>
            ) : (
              <>
                <span className="text-xs font-mono text-[var(--text-secondary)]">
                  ${p.price >= 1000
                    ? p.price.toLocaleString('en-US', { maximumFractionDigits: 0 })
                    : p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </span>
                {p.change24h !== null && (
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(p.change24h).toFixed(2)}%
                  </span>
                )}
              </>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

const FEATURES = [
  { label: 'Live Protocol TVL' },
  { label: 'Real-Time Prices' },
  { label: 'On-Chain Portfolio' },
  { label: 'NFT Collections' },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid" />

      {/* Subtle center radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,82,255,0.06) 0%, transparent 65%)',
        }}
      />

      {/* Top gradient fade */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[var(--bg-dark)] to-transparent pointer-events-none" />
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[var(--bg-dark)] to-transparent pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">

        {/* Live badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-7">
          <span className="badge">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live on Base Mainnet
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-[clamp(2.6rem,7vw,5rem)] font-bold text-white mb-5"
        >
          The DeFi Command
          <br />
          <span className="text-gradient-blue">Center for Base</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed mb-8"
        >
          Track live yields, discover protocols, manage your on-chain portfolio,
          and explore NFT collections — all connected to Base mainnet.
        </motion.p>

        {/* Feature chips */}
        <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {FEATURES.map((f) => (
            <span
              key={f.label}
              className="text-xs font-medium text-[var(--text-muted)] bg-white/4 border border-white/6 rounded-full px-3 py-1.5"
            >
              {f.label}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.4)}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link href="/protocols" className="btn-primary group">
            Explore Protocols
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/portfolio" className="btn-secondary">
            Track Portfolio
          </Link>
        </motion.div>

        {/* Price ticker */}
        <PriceTicker />

        {/* Bottom stats row */}
        <motion.div
          {...fadeUp(0.75)}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-[var(--text-muted)]"
        >
          <a
            href="https://basescan.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors"
          >
            Basescan <ArrowUpRight className="w-3 h-3" />
          </a>
          <span className="w-px h-3 bg-white/10" />
          <a
            href="https://defillama.com/chain/base"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors"
          >
            DefiLlama <ArrowUpRight className="w-3 h-3" />
          </a>
          <span className="w-px h-3 bg-white/10" />
          <a
            href="https://bridge.base.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors"
          >
            Base Bridge <ArrowUpRight className="w-3 h-3" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
