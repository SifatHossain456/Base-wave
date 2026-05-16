import Link from 'next/link';
import { Waves, Twitter, Github, MessageCircle } from 'lucide-react';

const links = {
  Explore: [
    { label: 'Protocols', href: '/protocols' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'NFTs', href: '/nfts' },
    { label: 'Profile', href: '/profile' },
  ],
  Resources: [
    { label: 'DefiLlama', href: 'https://defillama.com/chain/base', external: true },
    { label: 'Base Docs', href: 'https://docs.base.org', external: true },
    { label: 'BlockScout', href: 'https://base.blockscout.com', external: true },
    { label: 'CoinGecko', href: 'https://www.coingecko.com', external: true },
  ],
  Network: [
    { label: 'Base Mainnet', href: 'https://base.org', external: true },
    { label: 'Basescan', href: 'https://basescan.org', external: true },
    { label: 'Base Bridge', href: 'https://bridge.base.org', external: true },
    { label: 'Base Ecosystem', href: 'https://base.org/ecosystem', external: true },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t mt-16" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white">
                Base <span className="text-blue-400">Wave</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs mb-6">
              Your DeFi command center on Base mainnet. Track protocols, manage portfolio, and explore the on-chain economy.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-white/20 transition-all"
                style={{ borderColor: 'var(--border)' }}
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/SifatHossain456/Base-wave"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-white/20 transition-all"
                style={{ borderColor: 'var(--border)' }}
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:border-white/20 transition-all"
                style={{ borderColor: 'var(--border)' }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    {'external' in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text-muted)] hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-[var(--text-muted)] hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs text-[var(--text-muted)]">
            © 2026 Base Wave. Data from{' '}
            <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
              DefiLlama
            </a>{' '}
            &{' '}
            <a href="https://base.blockscout.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
              BlockScout
            </a>
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-[var(--text-muted)]">Base Mainnet · All systems live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
