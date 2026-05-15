# Base Arena — Smart Contracts

Solidity contracts for the Base Arena prediction tournament platform.

## Setup

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts
forge install smartcontractkit/chainlink
```

## Test

```bash
forge test -vvv
```

## Deploy to Base Mainnet

```bash
# Set env vars
cp ../../.env.example .env
# Fill PRIVATE_KEY, BASE_RPC_URL, BASESCAN_API_KEY

forge script script/Deploy.s.sol \
  --rpc-url base_mainnet \
  --broadcast \
  --verify \
  -vvvv
```

## Contracts

| Contract | Description |
|---|---|
| `BaseArena.sol` | Main tournament logic with Chainlink price resolution |
| `ArenaNFT.sol` | ERC-721 trophy NFTs with fully on-chain SVG metadata |
