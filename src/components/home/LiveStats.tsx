'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, TrendingUp, Zap, DollarSign } from 'lucide-react';
import { useBaseTVL } from '@/hooks/useBaseProtocols';

function CountUp({ end, prefix = '', suffix = '', decimals = 0 }: {
  end: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || end === 0) { setCount(0); return; }
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, end);
      setCount(current);
      if (current >= end) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, end]);

  const formatted = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString();

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

function TVLStat() {
  const { tvl, change, loading } = useBaseTVL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0 }}
      className="glass glass-hover rounded-3xl p-6 text-center border border-green-400/20"
    >
      <div className="w-12 h-12 bg-green-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <DollarSign className="w-6 h-6 text-green-400" />
      </div>
      {loading ? (
        <div className="h-10 w-28 bg-white/10 rounded-xl animate-pulse mx-auto mb-2" />
      ) : (
        <p className="text-3xl sm:text-4xl font-black text-green-400 mb-1">
          {tvl ? `$${(tvl / 1e9).toFixed(2)}B` : '$5B+'}
        </p>
      )}
      <p className="text-sm text-gray-400 mb-1">Base Ecosystem TVL</p>
      {!loading && change !== null && (
        <p className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}% (24h)
        </p>
      )}
    </motion.div>
  );
}

const STATIC_STATS = [
  {
    icon: Activity,
    label: 'Daily Transactions',
    value: 9,
    suffix: 'M+',
    note: 'Avg daily on Base mainnet',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    delay: 0.1,
  },
  {
    icon: Zap,
    label: 'Block Time',
    value: 2,
    suffix: 's',
    note: 'Lightning-fast finality',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
    delay: 0.2,
  },
  {
    icon: TrendingUp,
    label: 'L2 TVL Share',
    value: 46,
    suffix: '%',
    note: 'Of all Ethereum L2 TVL',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    delay: 0.3,
  },
];

export function LiveStats() {
  return (
    <section className="relative py-20 px-4">
      {/* Subtle wave divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Base by the <span className="text-gradient-blue">Numbers</span>
          </h2>
          <p className="text-gray-400">Live data from the #1 Ethereum Layer 2 network</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Live TVL from DefiLlama */}
          <TVLStat />

          {/* Static stats with countup */}
          {STATIC_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: stat.delay }}
                className={`glass glass-hover rounded-3xl p-6 text-center border ${stat.border}`}
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className={`text-3xl sm:text-4xl font-black ${stat.color} mb-1`}>
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-600">{stat.note}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
