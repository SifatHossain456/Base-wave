import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Base Wave | Surf the DeFi Wave on Base',
  description:
    'Base Wave is the ultimate DeFi discovery, yield tracking, and portfolio platform built on Base mainnet. Explore top protocols, track yields, and surf the on-chain wave.',
  keywords: ['Base', 'Base Wave', 'DeFi', 'Yield', 'Portfolio', 'Coinbase', 'Ethereum L2', 'Aerodrome', 'Moonwell'],
  openGraph: {
    title: 'Base Wave',
    description: 'Surf the DeFi Wave on Base.',
    siteName: 'Base Wave',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Wave',
    description: 'Surf the DeFi Wave on Base.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
