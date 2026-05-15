'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Waves } from 'lucide-react';

const FEATURES = [
  { emoji: '⚡', label: 'Ultra-Low Gas Fees',  desc: 'Near-zero transaction costs on Base L2'     },
  { emoji: '🔵', label: 'Coinbase Backed',    desc: 'Built and incubated by Coinbase'             },
  { emoji: '🔗', label: 'EVM Compatible',     desc: 'Full Ethereum tooling compatibility'          },
  { emoji: '💧', label: 'Deep Liquidity',     desc: '$5B+ TVL and growing daily'                  },
  { emoji: '🌊', label: 'Massive Ecosystem',  desc: '500+ dApps live on Base mainnet'             },
  { emoji: '🏆', label: 'Top L2 by TVL',      desc: '46.6% of all Ethereum L2 liquidity'          },
];

export function EcosystemBanner() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Why Build on <span className="text-gradient-blue">Base?</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Base is the fastest-growing Ethereum L2 — backed by Coinbase, secured by Ethereum,
            and home to the most vibrant on-chain economy.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass glass-hover rounded-2xl p-5 flex items-start gap-4"
            >
              <span className="text-3xl">{f.emoji}</span>
              <div>
                <p className="font-semibold text-sm">{f.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* BG */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600" />
          <div className="absolute inset-0 bg-gradient-radial from-white/10 via-transparent to-transparent" />

          {/* Animated wave overlays */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 80 }}>
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full">
              <path
                className="wave-svg"
                d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,80 L0,80 Z"
                fill="rgba(255,255,255,0.06)"
              />
              <path
                className="wave-svg-2"
                d="M0,55 C300,20 600,70 900,45 C1150,25 1350,65 1440,55 L1440,80 L0,80 Z"
                fill="rgba(255,255,255,0.04)"
              />
            </svg>
          </div>

          {/* Orb glows */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-800/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center py-16 px-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 text-sm font-medium">
              <Waves className="w-4 h-4" />
              Riding the Wave — Base is live
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-4 text-white">
              Ready to Surf the Base Wave?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Connect your wallet and explore the best DeFi opportunities across the Base ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/protocols"
                className="group flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Explore Protocols
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/nfts"
                className="flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:border-white/60 hover:bg-white/10 transition-all"
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
