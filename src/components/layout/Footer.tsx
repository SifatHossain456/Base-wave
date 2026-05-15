import Link from 'next/link';
import { Waves, Twitter, Github, MessageCircle } from 'lucide-react';

const links = {
  explore: [
    { label: 'Protocols', href: '/protocols' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'NFTs', href: '/nfts' },
    { label: 'Profile', href: '/profile' },
  ],
  resources: [
    { label: 'DefiLlama', href: 'https://defillama.com/chain/base', external: true },
    { label: 'Base Docs', href: 'https://docs.base.org', external: true },
    { label: 'Bug Bounty', href: '#' },
    { label: 'Audit Report', href: '#' },
  ],
  network: [
    { label: 'Base Mainnet', href: 'https://base.org', external: true },
    { label: 'Base Explorer', href: 'https://basescan.org', external: true },
    { label: 'Base Bridge', href: 'https://bridge.base.org', external: true },
    { label: 'Base Ecosystem', href: 'https://base.org/ecosystem', external: true },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-[#071228] to-transparent pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-gradient-blue">Base</span>
                <span> Wave</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              The ultimate DeFi discovery and yield platform built natively on Base mainnet.
              Surf the wave of on-chain finance.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="p-2 glass rounded-xl hover:border-blue-500/40 transition-all text-gray-400 hover:text-white">
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/SifatHossain456/Base-wave"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 glass rounded-xl hover:border-blue-500/40 transition-all text-gray-400 hover:text-white"
              >
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 glass rounded-xl hover:border-blue-500/40 transition-all text-gray-400 hover:text-white">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    {'external' in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Base Wave. Built on{' '}
            <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
              Base
            </a>{' '}
            — Powered by the decentralized future.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-500">Base Mainnet Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
