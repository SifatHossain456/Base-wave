'use client';

import { useReadContracts } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';

const ERC20_TOKENS = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`,
    decimals: 6,
    color: '#2775CA',
    coingeckoId: 'usd-coin',
  },
  {
    symbol: 'AERO',
    name: 'Aerodrome',
    address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631' as `0x${string}`,
    decimals: 18,
    color: '#0052FF',
    coingeckoId: 'aerodrome-finance',
  },
  {
    symbol: 'cbBTC',
    name: 'Coinbase BTC',
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf' as `0x${string}`,
    decimals: 8,
    color: '#F7931A',
    coingeckoId: 'bitcoin',
  },
] as const;

export type TokenBalance = {
  symbol: string;
  name: string;
  address: `0x${string}`;
  decimals: number;
  color: string;
  coingeckoId: string;
  balance: number | null;
  loading: boolean;
};

export function useTokenBalances(address?: `0x${string}`): TokenBalance[] {
  const { data, isLoading } = useReadContracts({
    contracts: ERC20_TOKENS.map((token) => ({
      address: token.address,
      abi: erc20Abi,
      functionName: 'balanceOf' as const,
      args: [address ?? '0x0000000000000000000000000000000000000000'],
      chainId: 8453,
    })),
    query: { enabled: !!address, staleTime: 30000 },
  });

  return ERC20_TOKENS.map((token, i) => {
    const result = data?.[i];
    const raw = result?.status === 'success' ? (result.result as bigint) : null;
    const balance = raw !== null && raw !== undefined
      ? parseFloat(formatUnits(raw, token.decimals))
      : null;
    return { ...token, balance, loading: isLoading && !!address };
  });
}
