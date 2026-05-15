'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Menu, X, Waves, BarChart3, User, Layers, ChevronDown, Wallet, LogOut, Copy, ExternalLink, AlertCircle, Image } from 'lucide-react';
import { cn, shortenAddress } from '@/lib/utils';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/protocols', label: 'Protocols', icon: Layers },
  { href: '/portfolio', label: 'Portfolio', icon: BarChart3 },
  { href: '/nfts', label: 'NFTs', icon: Image },
  { href: '/profile', label: 'Profile', icon: User },
];

const CONNECTOR_META: Record<string, { icon: string; description: string }> = {
  'Coinbase Wallet': { icon: '🔵', description: 'Gasless & instant — powered by Coinbase' },
  'MetaMask':        { icon: '🦊', description: 'Browser extension wallet' },
  'WalletConnect':   { icon: '🔗', description: 'Scan with any mobile wallet' },
  'injected':        { icon: '🌐', description: 'Browser wallet (detected)' },
};

function WalletDropdown({ address, onDisconnect }: { address: string; onDisconnect: () => void }) {
  const [open, setOpen] = useState(false);
  const { data: balance } = useBalance({ address: address as `0x${string}`, chainId: 8453 });

  const copy = () => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied!');
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 glass rounded-xl px-4 py-2 text-sm font-medium hover:border-blue-500/40 transition-all"
      >
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span>{shortenAddress(address)}</span>
        <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 glass rounded-2xl p-2 z-50 shadow-2xl"
            >
              <div className="px-3 py-2 border-b border-white/5 mb-2">
                <p className="text-xs text-gray-400">Connected on Base</p>
                <p className="text-sm font-mono text-white truncate mt-0.5">{shortenAddress(address, 8)}</p>
                {balance && (
                  <p className="text-xs text-blue-400 mt-1">{parseFloat(balance.formatted).toFixed(4)} ETH</p>
                )}
              </div>
              <button onClick={copy} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                <Copy className="w-4 h-4" /> Copy Address
              </button>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> View on Basescan
              </a>
              <button
                onClick={() => { onDisconnect(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" /> Disconnect
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConnectModal({ onClose }: { onClose: () => void }) {
  const { connect, connectors, isPending, error } = useConnect();

  const handleConnect = (connector: (typeof connectors)[0]) => {
    connect(
      { connector },
      {
        onSuccess: () => { toast.success('Wallet connected!'); onClose(); },
        onError: (err) => {
          if (err.message?.includes('not installed') || err.message?.includes('not found')) {
            toast.error(`${connector.name} not installed`);
          } else if (err.message?.includes('rejected') || err.message?.includes('denied')) {
            toast.error('Connection rejected');
          } else {
            toast.error('Connection failed');
          }
        },
      }
    );
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
            <h2 className="text-xl font-bold">Connect Wallet</h2>
            <p className="text-sm text-gray-400 mt-1">Ride the Base Wave</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {connectors.map((connector) => {
            const meta = CONNECTOR_META[connector.name] ?? { icon: '👛', description: connector.name };
            return (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={isPending}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="text-2xl">{meta.icon}</span>
                <div className="text-left flex-1">
                  <p className="font-semibold text-sm">{connector.name}</p>
                  <p className="text-xs text-gray-400">{meta.description}</p>
                </div>
                {isPending
                  ? <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin ml-auto" />
                  : <ChevronDown className="w-4 h-4 ml-auto -rotate-90 text-gray-500 group-hover:text-blue-400 transition-colors" />
                }
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-300">{error.message}</p>
          </div>
        )}

        <p className="text-xs text-center text-gray-500 mt-4">
          By connecting, you agree to Base Wave&apos;s Terms of Use
        </p>
      </motion.div>
    </motion.div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          scrolled ? 'glass shadow-2xl' : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Waves className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="font-bold text-lg">
                <span className="text-gradient-blue">Base</span>
                <span className="text-white"> Wave</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isConnected && address ? (
                <WalletDropdown address={address} onDisconnect={disconnect} />
              ) : (
                <button
                  onClick={() => setConnectOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity glow-blue"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              )}
            </div>

            <button
              className="md:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-white/5"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                        active ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-white/5">
                  {isConnected && address ? (
                    <WalletDropdown address={address} onDisconnect={disconnect} />
                  ) : (
                    <button
                      onClick={() => { setConnectOpen(true); setMobileOpen(false); }}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-3 rounded-xl text-sm font-semibold"
                    >
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {connectOpen && <ConnectModal onClose={() => setConnectOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
