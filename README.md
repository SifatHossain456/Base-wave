# Base Wave 🌊

**The all-in-one DeFi hub for Base mainnet** — discover protocols, track your portfolio, explore NFTs, and navigate the Base ecosystem with live on-chain data.

> Built natively on Base. No fake data. No demo mode. Everything is real.

---

## What is Base Wave?

Base Wave is an open-source DeFi discovery and portfolio management platform built exclusively on [Base](https://base.org) — the fastest-growing Ethereum L2, backed by Coinbase.

The Base ecosystem has $5B+ TVL and 9M+ daily transactions, but there is no single hub where users can discover protocols, track their wallet, explore NFTs, and monitor the ecosystem — all with live data. Base Wave fills that gap.

---

## Features

### Live Protocol Discovery
Browse every major DeFi protocol on Base with real-time TVL pulled directly from [DefiLlama](https://defillama.com). Protocols include Aerodrome, Moonwell, Aave V3, Uniswap V3, Morpho, Compound V3, Extra Finance, Balancer, and Curve — with live 24h change data and category filtering.

### Wallet Portfolio Tracker
Connect MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet to instantly see your real Base wallet balance, live asset prices (ETH, USDC, cbBTC, AERO via CoinGecko), and a direct link to your Basescan transaction history.

### NFT Collection Explorer
Discover top NFT collections living on Base mainnet — Onchain Gaias, Based Punks, Tiny Based Frogs, and more — with live floor price and volume data fetched from on-chain sources, and direct links to OpenSea and Magic Eden.

### Live Market Ticker
Real-time price feed for ETH, BTC, USDC, and AERO refreshed every 30 seconds via CoinGecko API. Displayed on the homepage and throughout the app.

### Base Ecosystem Stats
Live Base TVL from DefiLlama plus key network metrics: daily transaction volume, block time, and L2 TVL share — all sourced from public APIs.

---

## Coming Soon

| Feature | Description |
|---|---|
| **DeFi Position Tracking** | Automatic detection of Aerodrome LP, Moonwell lending, and Aave positions for connected wallets |
| **Base Arena Tournaments** | On-chain prediction tournaments — bet on ETH/BTC price direction, resolved by Chainlink oracles |
| **Trophy NFTs** | ERC-721 on-chain SVG trophies (Gold/Silver/Bronze) awarded to tournament winners, no IPFS |
| **Leaderboards** | On-chain leaderboards for top Base Arena performers |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Web3 | wagmi v2 + viem |
| Wallets | MetaMask, Coinbase Wallet, WalletConnect |
| Styling | Tailwind CSS + Framer Motion |
| Data | DefiLlama API, CoinGecko API |
| Smart Contracts | Solidity + Foundry |
| Oracles | Chainlink price feeds |
| Network | Base Mainnet (Chain ID: 8453) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or Coinbase Wallet browser extension

### Installation

```bash
git clone https://github.com/SifatHossain456/Base-wave.git
cd Base-wave
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
# Required for WalletConnect (get free at cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Optional — defaults to public Base RPC if not set
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

> MetaMask works out of the box without any API keys.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

---

## Smart Contracts

Located in `/contracts` — built with [Foundry](https://getfoundry.sh).

### BaseArena.sol
On-chain prediction tournament contract. Users predict ETH/BTC/cbBTC price direction. Chainlink oracles resolve outcomes at end time. Winners split the prize pool (5% platform fee). Top 3 winners receive ArenaNFT trophies.

### ArenaNFT.sol
ERC-721 trophy NFT with fully on-chain SVG metadata. Gold, Silver, and Bronze trophies. No IPFS dependency — metadata lives entirely on-chain.

**Chainlink Price Feeds used (Base Mainnet):**
- ETH/USD: `0x71041dddad3595F9CEd3dCCFBe3D1F4b0a16Bb70`
- BTC/USD: `0xCCADC697c55bbB68dc5bCdf8d3CBe83CdD4E071E`
- cbBTC/USD: `0x07DA0E54543a844a80ABE69c8A12F22B3aA59f9D`

### Run contract tests

```bash
cd contracts
forge install
forge test -vvv
```

### Deploy to Base Mainnet

```bash
cd contracts
forge script script/Deploy.s.sol \
  --rpc-url https://mainnet.base.org \
  --broadcast \
  --verify \
  -vvvv
```

---

## Project Structure

```
base-wave/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home — hero, live stats, top protocols
│   │   ├── protocols/        # Protocol discovery with live DefiLlama TVL
│   │   ├── portfolio/        # Wallet portfolio tracker
│   │   ├── nfts/             # Base NFT collection explorer
│   │   └── profile/          # User profile page
│   ├── components/
│   │   ├── layout/           # Navbar, Footer
│   │   └── home/             # Hero, LiveStats, TopProtocols, EcosystemBanner
│   ├── hooks/
│   │   ├── useAssetPrices.ts # CoinGecko live prices
│   │   └── useBaseProtocols.ts # DefiLlama TVL data
│   └── lib/
│       ├── wagmi.ts          # Wallet config (MetaMask, Coinbase, WalletConnect)
│       └── utils.ts          # Helpers
└── contracts/
    ├── src/
    │   ├── BaseArena.sol     # Tournament logic
    │   └── ArenaNFT.sol      # On-chain SVG trophy NFTs
    ├── test/
    └── script/
```

---

## Why Base?

- **Coinbase-backed** — institutional credibility and long-term support
- **#1 Ethereum L2 by growth** — fastest-growing ecosystem
- **Ultra-low gas fees** — near-zero transaction costs
- **EVM compatible** — full Ethereum tooling works out of the box
- **$5B+ TVL** — deep, liquid DeFi ecosystem
- **9M+ daily transactions** — proven demand and adoption

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## License

MIT

---

Built on [Base](https://base.org) · Data from [DefiLlama](https://defillama.com) & [CoinGecko](https://coingecko.com) · Powered by [Chainlink](https://chain.link)
