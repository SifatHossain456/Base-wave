'use client';

import { motion } from 'framer-motion';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { User, Waves, TrendingUp, ExternalLink, Copy, ArrowRight } from 'lucide-react';
import { shortenAddress } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATS = [
  { label: 'Base Network',  value: '#1 L2',    color: 'text-blue-400',   bg: 'bg-blue-400/10'   },
  { label: 'Chain TVL',     value: '$5B+',      color: 'text-green-400',  bg: 'bg-green-400/10'  },
  { label: 'Daily TXNs',    value: '9M+',       color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { label: 'Block Time',    value: '2s',         color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

const QUICK_LINKS = [
  { label: 'Browse Protocols', href: '/protocols', desc: 'Explore top DeFi protocols',     color: '#0052FF' },
  { label: 'View Portfolio',   href: '/portfolio', desc: 'Track your Base assets',         color: '#9333EA' },
  { label: 'Explore NFTs',     href: '/nfts',      desc: 'Top Base NFT collections',       color: '#EC4899' },
];

function NotConnected() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 glow-blue animate-float">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black mb-3">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Connect your wallet to view your profile, Base assets, and on-chain activity.
        </p>
        <Link
          href="/protocols"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity"
        >
          Explore Base Wave <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, chainId: 8453 });
  const { disconnect } = useDisconnect();

  if (!isConnected || !address) return <NotConnected />;

  const copyAddr = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied!');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-1">
            My <span className="text-gradient-blue">Profile</span>
          </h1>
          <p className="text-gray-400">Your Base Wave identity and on-chain presence</p>
        </motion.div>

        {/* Wallet card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="wave-card rounded-3xl p-7 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center text-2xl font-black glow-blue">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-[#030B1A]" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-black">Wave Rider</h2>
              <div className="flex items-center gap-1 glass rounded-full px-2.5 py-1">
                <Waves className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-400 font-medium">Base Mainnet</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="font-mono text-sm">{shortenAddress(address, 8)}</span>
              <button onClick={copyAddr} className="hover:text-white transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-sm text-blue-400 mt-2 font-semibold">
              {balance ? `${parseFloat(balance.formatted).toFixed(4)} ETH` : '—'} on Base
            </p>
          </div>

          <button
            onClick={() => disconnect()}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors self-start sm:self-center"
          >
            Disconnect
          </button>
        </motion.div>

        {/* Network stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="glass rounded-2xl p-5 text-center"
            >
              <p className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Waves className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold">Quick Navigation</h2>
          </div>
          <div className="space-y-3">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/8 transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${link.color}20` }}
                >
                  <TrendingUp className="w-4 h-4" style={{ color: link.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{link.label}</p>
                  <p className="text-xs text-gray-500">{link.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Basescan link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-4 border border-blue-500/20 flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">View on Basescan</p>
            <p className="text-xs text-gray-400">Full transaction history for your wallet</p>
          </div>
          <a
            href={`https://basescan.org/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
          >
            Open →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
