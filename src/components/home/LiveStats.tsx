'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Zap, DollarSign, Fuel } from 'lucide-react';
import { useBaseTVL } from '@/hooks/useBaseProtocols';
import { useChainStats } from '@/hooks/useChainStats';

function CountUp({ end, prefix = '', suffix = '', decimals = 0 }: {
  end: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || end === 0) { setCount(0); return; }
    const duration = 1800;
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

function Skeleton() {
  return <div className="h-10 w-28 bg-white/10 rounded-xl animate-pulse mx-auto mb-2" />;
}

function TVLCard() {
  const { tvl, change, loading } = useBaseTVL();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: 0 }}
      className="glass glass-hover rounded-3xl p-6 text-center border border-green-400/20"
    >
      <div className="w-12 h-12 bg-green-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <DollarSign className="w-6 h-6 text-green-400" />
      </div>
      {loading ? <Skeleton /> : (
        <p className="text-3xl sm:text-4xl font-black text-green-400 mb-1">
          {tvl ? `$${(tvl / 1e9).toFixed(2)}B` : '—'}
        </p>
      )}
      <p className="text-sm text-gray-400 mb-1">Base Ecosystem TVL</p>
      {!loading && change !== null && (
        <p className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}% (24h)
        </p>
      )}
      <p className="text-xs text-gray-600 mt-1">via DefiLlama</p>
    </motion.div>
  );
}

function TxnsCard({ value, loading }: { value: number | null; loading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: 0.1 }}
      className="glass glass-hover rounded-3xl p-6 text-center border border-blue-400/20"
    >
      <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Activity className="w-6 h-6 text-blue-400" />
      </div>
      {loading ? <Skeleton /> : (
        <p className="text-3xl sm:text-4xl font-black text-blue-400 mb-1">
          {value !== null
            ? <CountUp end={value} suffix="" />
            : '—'}
        </p>
      )}
      <p className="text-sm text-gray-400 mb-1">Txns Today</p>
      <p className="text-xs text-gray-600">Live from BlockScout</p>
    </motion.div>
  );
}

function BlockTimeCard({ value, loading }: { value: number | null; loading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: 0.2 }}
      className="glass glass-hover rounded-3xl p-6 text-center border border-yellow-400/20"
    >
      <div className="w-12 h-12 bg-yellow-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Zap className="w-6 h-6 text-yellow-400" />
      </div>
      {loading ? <Skeleton /> : (
        <p className="text-3xl sm:text-4xl font-black text-yellow-400 mb-1">
          {value !== null ? `${value}s` : '—'}
        </p>
      )}
      <p className="text-sm text-gray-400 mb-1">Avg Block Time</p>
      <p className="text-xs text-gray-600">Live from BlockScout</p>
    </motion.div>
  );
}

function GasCard({ value, loading }: { value: number | null; loading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: 0.3 }}
      className="glass glass-hover rounded-3xl p-6 text-center border border-purple-400/20"
    >
      <div className="w-12 h-12 bg-purple-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Fuel className="w-6 h-6 text-purple-400" />
      </div>
      {loading ? <Skeleton /> : (
        <p className="text-3xl sm:text-4xl font-black text-purple-400 mb-1">
          {value !== null ? `${value.toFixed(4)}` : '—'}
        </p>
      )}
      <p className="text-sm text-gray-400 mb-1">Gas Price (Gwei)</p>
      <p className="text-xs text-gray-600">Live from BlockScout</p>
    </motion.div>
  );
}

export function LiveStats() {
  const { transactionsToday, avgBlockTimeSec, gasPriceGwei, loading } = useChainStats();

  return (
    <section className="relative py-20 px-4">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Base by the <span className="text-gradient-blue">Numbers</span>
          </h2>
          <p className="text-gray-400">
            Live data from Base mainnet · Updates every page load
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <TVLCard />
          <TxnsCard value={transactionsToday} loading={loading} />
          <BlockTimeCard value={avgBlockTimeSec} loading={loading} />
          <GasCard value={gasPriceGwei} loading={loading} />
        </div>
      </div>
    </section>
  );
}
