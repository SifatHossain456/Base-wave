'use client';

import { motion } from 'framer-motion';
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { BarChart3, TrendingUp, Wallet, ExternalLink, Copy, ArrowRight, Waves } from 'lucide-react';
import { shortenAddress } from '@/lib/utils';
import { useAssetPrices } from '@/hooks/useAssetPrices';
import Link from 'next/link';
import toast from 'react-hot-toast';

const BASE_TOKENS = [
  { symbol: 'ETH',   name: 'Ethereum',     color: '#627EEA', coingeckoId: 'ethereum'          },
  { symbol: 'USDC',  name: 'USD Coin',      color: '#2775CA', coingeckoId: 'usd-coin'          },
  { symbol: 'cbBTC', name: 'Coinbase BTC',  color: '#0052FF', coingeckoId: 'bitcoin'           },
  { symbol: 'AERO',  name: 'Aerodrome',     color: '#0052FF', coingeckoId: 'aerodrome-finance' },
];

const DEFI_POSITIONS = [
  {
    protocol: 'Aerodrome',
    type: 'LP Position',
    pair: 'ETH / USDC',
    apy: '24.5%',
    color: '#0052FF',
    emoji: '✈️',
  },
  {
    protocol: 'Moonwell',
    type: 'Lending',
    pair: 'USDC Supply',
    apy: '8.2%',
    color: '#9333EA',
    emoji: '🌙',
  },
  {
    protocol: 'Aave V3',
    type: 'Borrowing',
    pair: 'ETH Collateral',
    apy: '3.1%',
    color: '#B6509E',
    emoji: '👻',
  },
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
          <Wallet className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black mb-3">Connect to View Portfolio</h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Connect your wallet to track your Base assets, DeFi positions, and on-chain portfolio.
        </p>
        <Link
          href="/protocols"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity glow-blue"
        >
          Explore Protocols <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, chainId: 8453 });
  const { disconnect } = useDisconnect();
  const prices = useAssetPrices(60000);

  if (!isConnected || !address) return <NotConnected />;

  const ethPrice = prices.find((p) => p.symbol === 'ETH')?.price ?? 0;
  const ethBalance = balance ? parseFloat(balance.formatted) : 0;
  const ethUsdValue = ethBalance * ethPrice;

  const copyAddr = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied!');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              My <span className="text-gradient-blue">Portfolio</span>
            </h1>
          </div>
          <p className="text-gray-400">Track your assets and DeFi positions on Base mainnet</p>
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
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-[#030B1A] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-900" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-black">Base Wallet</h2>
              <div className="flex items-center gap-1 bg-green-400/10 border border-green-400/20 rounded-full px-2 py-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
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
            <p className="text-sm text-blue-400 font-semibold">
              {balance ? `${ethBalance.toFixed(4)} ETH` : '—'} on Base
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Portfolio Value</p>
            <p className="text-3xl font-black text-gradient-blue">
              {ethUsdValue > 0 ? `$${ethUsdValue.toFixed(2)}` : '—'}
            </p>
            <button
              onClick={() => disconnect()}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors mt-2"
            >
              Disconnect
            </button>
          </div>
        </motion.div>

        {/* ETH Balance card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {BASE_TOKENS.map((token, i) => {
            const priceData = prices.find((p) => p.symbol === token.symbol || p.coingeckoId === token.coingeckoId);
            const isETH = token.symbol === 'ETH';
            return (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="glass glass-hover rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ background: `${token.color}20`, border: `1px solid ${token.color}30`, color: token.color }}
                  >
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{token.symbol}</p>
                    <p className="text-xs text-gray-500">{token.name}</p>
                  </div>
                  {priceData && priceData.change24h !== null && (
                    <div className={`ml-auto flex items-center gap-1 text-xs ${(priceData.change24h ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp className="w-3 h-3" />
                      {Math.abs(priceData.change24h ?? 0).toFixed(2)}%
                    </div>
                  )}
                </div>
                <p className="text-xl font-black" style={{ color: token.color }}>
                  {isETH && balance
                    ? `${ethBalance.toFixed(4)} ETH`
                    : priceData?.loading
                    ? '...'
                    : '0.00'
                  }
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {priceData?.price
                    ? `$${priceData.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    : '—'
                  }
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* DeFi Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Waves className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-lg">DeFi Positions</h2>
            <span className="ml-auto text-xs text-gray-500">Sample positions — connect to see yours</span>
          </div>
          <div className="space-y-3">
            {DEFI_POSITIONS.map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/8 transition-colors"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${pos.color}20` }}
                >
                  {pos.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{pos.protocol}</p>
                  <p className="text-xs text-gray-500">{pos.type} · {pos.pair}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">{pos.apy} APY</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Link
            href="/protocols"
            className="block text-center mt-5 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Explore more yield opportunities →
          </Link>
        </motion.div>

        {/* Basescan link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-4 border border-blue-500/20 flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <ExternalLink className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">Full transaction history on Basescan</p>
            <p className="text-xs text-gray-400">View all on-chain activity for your wallet</p>
          </div>
          <a
            href={`https://basescan.org/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
          >
            Open Basescan →
          </a>
        </motion.div>
      </div>
    </div>
  );
}
