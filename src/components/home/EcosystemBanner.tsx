'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Link as LinkIcon, BarChart2, Globe, Award } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    label: 'Ultra-Low Gas',
    desc: 'Near-zero transaction costs — a fraction of Ethereum mainnet.',
    color: '#F59E0B',
  },
  {
    icon: Shield,
    label: 'Coinbase Backed',
    desc: 'Built and incubated by Coinbase, the most trusted crypto exchange.',
    color: '#0052FF',
  },
  {
    icon: LinkIcon,
    label: 'EVM Compatible',
    desc: 'Full Ethereum tooling — any EVM contract runs on Base unchanged.',
    color: '#8B5CF6',
  },
  {
    icon: BarChart2,
    label: 'Deep Liquidity',
    desc: '$5B+ TVL across the ecosystem and growing every day.',
    color: '#10B981',
  },
  {
    icon: Globe,
    label: 'Massive Ecosystem',
    desc: '500+ dApps, protocols, and tools live on Base mainnet.',
    color: '#06B6D4',
  },
  {
    icon: Award,
    label: '#1 L2 by TVL',
    desc: 'The leading Ethereum Layer 2 network by total value locked.',
    color: '#F97316',
  },
];

export function EcosystemBanner() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Why Base?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
            Base is the fastest-growing Ethereum L2 — backed by Coinbase, secured by Ethereum,
            and home to a thriving on-chain economy.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                className="card card-hover rounded-2xl p-5 flex items-start gap-4"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white mb-1">{f.label}</p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0A1A4A 0%, #0D2260 40%, #0A1535 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 70% 50%, rgba(0,82,255,0.2) 0%, transparent 60%)',
            }}
          />
          {/* Top border accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.6), rgba(0,184,255,0.4), transparent)' }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-12">
            <div className="text-center md:text-left">
              <p className="text-xs font-medium text-blue-300 uppercase tracking-widest mb-3">
                Base Wave
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                Start exploring Base DeFi<br className="hidden sm:block" /> with real data
              </h2>
              <p className="text-sm text-blue-200/70 max-w-md leading-relaxed">
                Connect your wallet and get live TVL, yields, portfolio tracking,
                and NFT browsing — all on Base mainnet.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
              <Link
                href="/protocols"
                className="group flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold text-sm px-7 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Explore Protocols
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/nfts"
                className="flex items-center justify-center gap-2 border border-blue-400/30 text-blue-200 font-medium text-sm px-7 py-3 rounded-xl hover:border-blue-400/60 hover:bg-blue-400/10 transition-all"
              >
                Browse NFTs
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
