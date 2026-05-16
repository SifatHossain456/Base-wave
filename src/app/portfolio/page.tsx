'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useAccount, useBalance, useDisconnect,
  useSendTransaction, useWriteContract, useWaitForTransactionReceipt,
} from 'wagmi';
import { formatUnits, parseEther, parseUnits, isAddress, erc20Abi } from 'viem';
import {
  BarChart3, TrendingUp, TrendingDown, Wallet, ExternalLink, Copy, ArrowRight,
  Waves, ArrowUpRight, ArrowDownLeft, Clock, Send, X,
} from 'lucide-react';
import { shortenAddress } from '@/lib/utils';
import { useAssetPrices } from '@/hooks/useAssetPrices';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import Link from 'next/link';
import toast from 'react-hot-toast';

/* ─── Token list for send modal ─── */
const TOKEN_LIST = [
  { symbol: 'ETH',   name: 'Ethereum',     decimals: 18, address: null as `0x${string}` | null,                            color: '#627EEA' },
  { symbol: 'USDC',  name: 'USD Coin',     decimals: 6,  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`, color: '#2775CA' },
  { symbol: 'AERO',  name: 'Aerodrome',    decimals: 18, address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631' as `0x${string}`, color: '#FF0420' },
  { symbol: 'cbBTC', name: 'Coinbase BTC', decimals: 8,  address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf' as `0x${string}`, color: '#F7931A' },
];

/* ─── Send Token Modal ─── */
function SendTokenModal({ onClose }: { onClose: () => void }) {
  const [selectedToken, setSelectedToken] = useState(TOKEN_LIST[0]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { sendTransaction, isPending: isSendPending } = useSendTransaction();
  const { writeContract, isPending: isWritePending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  const isPending = isSendPending || isWritePending || isConfirming;
  const isValidRecipient = recipient.length > 0 && isAddress(recipient);
  const isValidAmount = parseFloat(amount) > 0 && !isNaN(parseFloat(amount));
  const canSend = isValidRecipient && isValidAmount && !isPending;

  const handleSend = () => {
    if (!canSend) return;

    const onSuccess = (hash: `0x${string}`) => {
      setTxHash(hash);
      toast.success('Transaction submitted!');
    };
    const onError = (err: Error) => {
      if (err.message.includes('rejected') || err.message.includes('denied') || err.message.includes('cancel')) {
        toast.error('Transaction rejected');
      } else {
        toast.error('Transaction failed');
      }
    };

    if (selectedToken.address === null) {
      sendTransaction(
        { to: recipient as `0x${string}`, value: parseEther(amount), chainId: 8453 },
        { onSuccess, onError }
      );
    } else {
      writeContract(
        {
          address: selectedToken.address,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [recipient as `0x${string}`, parseUnits(amount, selectedToken.decimals)],
          chainId: 8453,
        },
        { onSuccess, onError }
      );
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm glass rounded-3xl p-6 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Send Token</h2>
            <p className="text-sm text-gray-400 mt-0.5">Base Mainnet · Gas only</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <p className="font-bold text-green-400 text-lg mb-1">Confirmed!</p>
            <p className="text-xs text-gray-500 mb-4">Transaction landed on Base mainnet</p>
            {txHash && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 justify-center mb-4"
              >
                View on Basescan <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button onClick={onClose} className="w-full btn-secondary text-sm">Done</button>
          </div>
        ) : (
          <>
            {/* Token selector */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-2 block font-medium">Token</label>
              <div className="grid grid-cols-4 gap-2">
                {TOKEN_LIST.map((token) => {
                  const active = selectedToken.symbol === token.symbol;
                  return (
                    <button
                      key={token.symbol}
                      onClick={() => setSelectedToken(token)}
                      className="p-2 rounded-xl text-xs font-semibold transition-all border"
                      style={
                        active
                          ? { background: `${token.color}20`, borderColor: `${token.color}50`, color: token.color }
                          : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)', color: '#6B7B99' }
                      }
                    >
                      {token.symbol}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-2 block font-medium">Recipient Address</label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className={`w-full glass rounded-xl px-4 py-3 text-sm font-mono outline-none transition-colors ${
                  recipient && !isValidRecipient ? 'border border-red-500/50' : ''
                }`}
              />
              {recipient && !isValidRecipient && (
                <p className="text-xs text-red-400 mt-1">Invalid address</p>
              )}
            </div>

            {/* Amount */}
            <div className="mb-6">
              <label className="text-xs text-gray-400 mb-2 block font-medium">Amount ({selectedToken.symbol})</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="any"
                className="w-full glass rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>

            {/* Confirming state */}
            {isConfirming && txHash && (
              <div className="mb-4 flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl px-4 py-3">
                <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-400 font-semibold">Confirming on Base...</p>
                  <a
                    href={`https://basescan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-300 hover:underline font-mono"
                  >
                    {txHash.slice(0, 20)}…
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={!canSend}
              className="w-full flex items-center justify-center gap-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isConfirming ? 'Confirming…' : 'Sending…'}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send {selectedToken.symbol}
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-600 mt-3">
              You only pay Base mainnet gas (~$0.01)
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Recent transactions via BlockScout ─── */
type Txn = {
  hash: string;
  from: { hash: string };
  to: { hash: string } | null;
  value: string;
  status: string;
  timestamp: string;
};

function useRecentTxns(address?: string) {
  const [txns, setTxns] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    fetch(
      `https://base.blockscout.com/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from&limit=5`
    )
      .then((r) => r.json())
      .then((d) => { setTxns(d.items ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [address]);

  return { txns, loading };
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function RecentTransactions({ address }: { address: string }) {
  const { txns, loading } = useRecentTxns(address);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="glass rounded-3xl p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold text-lg">Recent Transactions</h2>
        </div>
        <a
          href={`https://basescan.org/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
        >
          All on Basescan <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && txns.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No transactions found on Base mainnet.
        </div>
      )}

      {!loading && txns.length > 0 && (
        <div className="space-y-2">
          {txns.map((tx) => {
            const isOut = tx.from.hash.toLowerCase() === address.toLowerCase();
            const valueEth = parseFloat(formatUnits(BigInt(tx.value || '0'), 18));
            const ok = tx.status === 'ok';
            return (
              <a
                key={tx.hash}
                href={`https://basescan.org/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/4 hover:bg-white/8 rounded-2xl transition-colors group"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isOut ? 'bg-red-500/15' : 'bg-green-500/15'}`}>
                  {isOut
                    ? <ArrowUpRight className="w-4 h-4 text-red-400" />
                    : <ArrowDownLeft className="w-4 h-4 text-green-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{isOut ? 'Sent' : 'Received'}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${ok ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                      {ok ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate font-mono">{tx.hash.slice(0, 20)}…</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${isOut ? 'text-red-400' : 'text-green-400'}`}>
                    {isOut ? '-' : '+'}{valueEth > 0 ? valueEth.toFixed(5) : '0'} ETH
                  </p>
                  <p className="text-xs text-gray-600">{timeAgo(tx.timestamp)}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ─── Not connected ─── */
function NotConnected() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black mb-3">Connect to View Portfolio</h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Connect your wallet to track your Base assets, DeFi positions, and on-chain portfolio.
        </p>
        <Link
          href="/protocols"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity"
        >
          Explore Protocols <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}

/* ─── Main page ─── */
export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, chainId: 8453 });
  const { disconnect } = useDisconnect();
  const prices = useAssetPrices(60000);
  const tokenBalances = useTokenBalances(address);
  const [sendOpen, setSendOpen] = useState(false);

  if (!isConnected || !address) return <NotConnected />;

  const ethPrice = prices.find((p) => p.symbol === 'ETH')?.price ?? 0;
  const ethBalance = balance ? parseFloat(formatUnits(balance.value, balance.decimals)) : 0;
  const ethUsdValue = ethBalance * ethPrice;

  const usdcBalance = tokenBalances.find((t) => t.symbol === 'USDC')?.balance ?? null;
  const totalUsd = ethUsdValue + (usdcBalance ?? 0);

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
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="wave-card rounded-3xl p-7 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl flex items-center justify-center text-2xl font-black">
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

          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Portfolio Value</p>
              <p className="text-3xl font-black text-gradient-blue">
                {totalUsd > 0 ? `$${totalUsd.toFixed(2)}` : ethUsdValue > 0 ? `$${ethUsdValue.toFixed(2)}` : '—'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSendOpen(true)}
                className="flex items-center gap-2 btn-primary text-sm px-4 py-2"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
              <button
                onClick={() => disconnect()}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </motion.div>

        {/* Token balances — ETH + ERC20 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* ETH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass glass-hover rounded-2xl p-5"
          >
            {(() => {
              const priceData = prices.find((p) => p.symbol === 'ETH');
              return (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{ background: '#627EEA20', border: '1px solid #627EEA30', color: '#627EEA' }}>
                      ET
                    </div>
                    <div>
                      <p className="font-bold text-sm">ETH</p>
                      <p className="text-xs text-gray-500">Ethereum</p>
                    </div>
                    {priceData?.change24h !== null && (
                      <div className={`ml-auto flex items-center gap-1 text-xs ${(priceData?.change24h ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(priceData?.change24h ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(priceData?.change24h ?? 0).toFixed(2)}%
                      </div>
                    )}
                  </div>
                  <p className="text-xl font-black" style={{ color: '#627EEA' }}>
                    {balance ? `${ethBalance.toFixed(4)} ETH` : '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {ethUsdValue > 0 ? `≈ $${ethUsdValue.toFixed(2)}` : priceData?.price ? `$${priceData.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '—'}
                  </p>
                </>
              );
            })()}
          </motion.div>

          {/* ERC20 tokens */}
          {tokenBalances.map((token, i) => {
            const priceData = prices.find((p) => p.coingeckoId === token.coingeckoId);
            const usdVal = token.balance !== null && priceData?.price
              ? token.balance * priceData.price
              : null;
            return (
              <motion.div
                key={token.symbol}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 + i * 0.07 }}
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
                  {priceData?.change24h !== null && (
                    <div className={`ml-auto flex items-center gap-1 text-xs ${(priceData?.change24h ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(priceData?.change24h ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(priceData?.change24h ?? 0).toFixed(2)}%
                    </div>
                  )}
                </div>
                {token.loading ? (
                  <div className="h-6 w-24 bg-white/10 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-xl font-black" style={{ color: token.color }}>
                    {token.balance !== null
                      ? `${token.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${token.symbol}`
                      : '0.00'}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {usdVal !== null && usdVal > 0
                    ? `≈ $${usdVal.toFixed(2)}`
                    : priceData?.price
                    ? `$${priceData.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
                    : '—'}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <RecentTransactions address={address} />

        {/* DeFi Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Waves className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-lg">DeFi Positions</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl mb-2">🌊</div>
            <p className="font-semibold text-gray-300">DeFi position tracking coming soon</p>
            <p className="text-sm text-gray-500 max-w-xs">
              Automatic detection of your Aerodrome, Moonwell, Aave and other Base protocol positions.
            </p>
            <Link href="/protocols" className="mt-2 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Explore yield opportunities →
            </Link>
          </div>
        </motion.div>

        {/* Basescan CTA */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
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

      {/* Send Token Modal */}
      <AnimatePresence>
        {sendOpen && <SendTokenModal onClose={() => setSendOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
