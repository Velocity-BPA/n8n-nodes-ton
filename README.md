# n8n-nodes-ton

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with The Open Network (TON) blockchain. This node provides 6 comprehensive resources covering all major TON ecosystem operations including wallet management, jetton transfers, NFT operations, smart contract interactions, DNS resolution, and staking functionality.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TON](https://img.shields.io/badge/TON-Blockchain-0088cc)
![Web3](https://img.shields.io/badge/Web3-Integration-00d4aa)

## Features

- **Wallet Operations** - Create, import, and manage TON wallets with balance checks and transaction history
- **Jetton Management** - Transfer, mint, and burn jetton tokens with metadata retrieval
- **NFT Integration** - Mint, transfer, and query NFT collections and individual items
- **Smart Contract Interaction** - Deploy, call methods, and execute smart contracts on TON
- **DNS Resolution** - Resolve TON DNS domains and manage domain records
- **Staking Operations** - Participate in TON validation with stake management and rewards tracking
- **Comprehensive Error Handling** - Detailed error messages and retry mechanisms for blockchain operations
- **Flexible Authentication** - Support for multiple API key configurations and endpoint customization

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-ton`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-ton
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-ton.git
cd n8n-nodes-ton
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ton
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | TON API key for accessing blockchain data | Yes |
| API Endpoint | Custom API endpoint URL (defaults to TON mainnet) | No |
| Network | Network selection (mainnet/testnet) | Yes |
| Private Key | Wallet private key for transaction signing | No |

## Resources & Operations

### 1. Wallets

| Operation | Description |
|-----------|-------------|
| Create Wallet | Generate a new TON wallet with mnemonic phrase |
| Import Wallet | Import existing wallet using mnemonic or private key |
| Get Balance | Retrieve TON and jetton balances for a wallet |
| Get Transactions | Fetch transaction history for a wallet address |
| Send TON | Transfer TON coins between wallets |
| Get Wallet Info | Retrieve detailed wallet information and state |

### 2. Jettons

| Operation | Description |
|-----------|-------------|
| Transfer Jetton | Transfer jetton tokens between wallets |
| Get Jetton Info | Retrieve jetton metadata and total supply |
| Get Jetton Balance | Check jetton balance for specific wallet |
| Mint Jettons | Create new jetton tokens (requires minter rights) |
| Burn Jettons | Destroy jetton tokens from circulation |
| Get Jetton Holders | List all holders of a specific jetton |

### 3. NFTs

| Operation | Description |
|-----------|-------------|
| Mint NFT | Create new NFT item in a collection |
| Transfer NFT | Transfer NFT ownership between wallets |
| Get NFT Info | Retrieve NFT metadata and ownership details |
| Get NFT Collection | Fetch collection information and statistics |
| Get Owner NFTs | List all NFTs owned by a specific wallet |
| Update NFT Metadata | Modify NFT metadata (if editable) |

### 4. Smart Contracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy smart contract to TON blockchain |
| Call Get Method | Execute read-only smart contract methods |
| Send Message | Send message to smart contract |
| Get Contract State | Retrieve current contract state and data |
| Get Contract Code | Fetch smart contract source code |
| Estimate Fees | Calculate transaction fees for contract interactions |

### 5. DNS

| Operation | Description |
|-----------|-------------|
| Resolve Domain | Resolve TON DNS domain to wallet address |
| Get Domain Info | Retrieve domain registration and expiry details |
| Register Domain | Register new TON DNS domain |
| Update Records | Modify DNS records for owned domains |
| Transfer Domain | Transfer domain ownership |
| Get Subdomains | List all subdomains of a parent domain |

### 6. Staking

| Operation | Description |
|-----------|-------------|
| Stake TON | Delegate TON to validator pools |
| Unstake TON | Withdraw staked TON from validators |
| Get Stake Info | Retrieve staking balance and rewards |
| Get Validators | List active validators and their details |
| Claim Rewards | Withdraw earned staking rewards |
| Get Pool Info | Fetch staking pool statistics and APY |

## Usage Examples

### Transfer TON Coins
```javascript
// Send 10 TON from one wallet to another
{
  "operation": "Send TON",
  "fromAddress": "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
  "toAddress": "EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG",
  "amount": "10.5",
  "comment": "Payment for services"
}
```

### Mint NFT
```javascript
// Create a new NFT in collection
{
  "operation": "Mint NFT",
  "collectionAddress": "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N",
  "itemIndex": "1",
  "ownerAddress": "EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG",
  "metadata": {
    "name": "Awesome NFT #1",
    "description": "First NFT in our collection",
    "image": "https://example.com/nft1.jpg"
  }
}
```

### Transfer Jettons
```javascript
// Transfer 1000 USDT jettons
{
  "operation": "Transfer Jetton",
  "jettonMaster": "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
  "fromAddress": "EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t",
  "toAddress": "EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG",
  "amount": "1000.00"
}
```

### Stake TON
```javascript
// Stake 100 TON with validator
{
  "operation": "Stake TON",
  "validatorAddress": "Ef8zMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzM0vF",
  "amount": "100.0",
  "poolAddress": "EQDrLq-X6qzWX-h0sFxr_8Rw7e9b9v0J2W_gE_JgL5T1r9r1"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid Address | Wallet address format is incorrect | Verify address format and checksum |
| Insufficient Balance | Not enough TON for transaction | Check wallet balance and reduce amount |
| Network Timeout | API request timed out | Retry operation or check network connection |
| Invalid Private Key | Private key format or permissions invalid | Verify key format and wallet access |
| Contract Error | Smart contract execution failed | Check contract state and method parameters |
| Rate Limited | API rate limit exceeded | Implement delays between requests |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ton/issues)
- **TON Documentation**: [docs.ton.org](https://docs.ton.org)
- **TON Community**: [t.me/toncoin](https://t.me/toncoin)