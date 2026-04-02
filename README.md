# n8n-nodes-ton

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with The Open Network (TON) blockchain, offering 7 core resources for managing accounts, jettons, NFTs, transactions, domains, staking operations, and blockchain data. Build powerful blockchain automation workflows with complete TON ecosystem access.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TON](https://img.shields.io/badge/TON-Blockchain-0088cc)
![Crypto](https://img.shields.io/badge/Crypto-API-green)
![Web3](https://img.shields.io/badge/Web3-Integration-purple)

## Features

- **Account Management** - Query account details, balances, and transaction history across TON network
- **Jetton Operations** - Manage TON's native token standard with transfer, balance, and metadata operations
- **NFT Integration** - Complete NFT lifecycle management including minting, transfers, and metadata retrieval
- **Transaction Processing** - Send, track, and analyze TON blockchain transactions with detailed status monitoring
- **Domain Services** - Interact with TON DNS for domain registration, resolution, and management
- **Staking Operations** - Manage validator staking, delegation, and reward distribution workflows
- **Blockchain Data** - Access real-time blockchain information, block details, and network statistics
- **Error Handling** - Comprehensive error management with detailed blockchain-specific error codes

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
| API Key | TON API access key for authenticated requests | Yes |
| Network | TON network environment (mainnet/testnet) | Yes |
| Endpoint URL | Custom API endpoint (optional) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve account information and balance |
| Get Transactions | Fetch account transaction history |
| Get Methods | Execute account smart contract methods |
| Send Transaction | Send TON from account |

### 2. Jetton

| Operation | Description |
|-----------|-------------|
| Get Info | Retrieve jetton token information |
| Get Balance | Check jetton balance for account |
| Transfer | Send jetton tokens between accounts |
| Get Holders | List token holders and their balances |

### 3. NFT

| Operation | Description |
|-----------|-------------|
| Get Collection | Retrieve NFT collection details |
| Get Item | Fetch specific NFT item information |
| Transfer | Transfer NFT ownership |
| Get Items | List all items in collection |

### 4. Transaction

| Operation | Description |
|-----------|-------------|
| Get Transaction | Retrieve transaction by hash |
| Send | Send new transaction to network |
| Get Status | Check transaction confirmation status |
| Trace | Get detailed transaction execution trace |

### 5. Domain

| Operation | Description |
|-----------|-------------|
| Resolve | Resolve domain to TON address |
| Get Info | Retrieve domain registration details |
| Check Availability | Check if domain is available |
| Get Auctions | List active domain auctions |

### 6. Staking

| Operation | Description |
|-----------|-------------|
| Get Pools | List available staking pools |
| Stake | Delegate TON to validator pool |
| Unstake | Withdraw staked TON |
| Get Rewards | Retrieve staking reward information |

### 7. Blockchain

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve blockchain block information |
| Get Config | Fetch network configuration parameters |
| Get Stats | Get network statistics and metrics |
| Get Validators | List active network validators |

## Usage Examples

```javascript
// Check account balance and recent transactions
const accountInfo = await tonNode.account.getAccount({
  address: "EQD-cvR0Nz6XAyRBpDeWWNoVt3p8xOiVyJrNMoS2B4WR_9dN"
});

// Transfer jetton tokens
const jettonTransfer = await tonNode.jetton.transfer({
  from: "EQD-cvR0Nz6XAyRBpDeWWNoVt3p8xOiVyJrNMoS2B4WR_9dN",
  to: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
  amount: "1000000000",
  jettonAddress: "EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA"
});

// Get NFT collection details
const nftCollection = await tonNode.nft.getCollection({
  address: "EQD-cvR0Nz6XAyRBpDeWWNoVt3p8xOiVyJrNMoS2B4WR_9dN"
});

// Resolve TON domain to address
const domainInfo = await tonNode.domain.resolve({
  domain: "alice.ton"
});
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid Address | Provided TON address format is incorrect | Verify address format and checksum |
| Insufficient Balance | Account doesn't have enough TON for operation | Check account balance before transaction |
| Network Timeout | TON network request timed out | Retry request or check network status |
| Invalid API Key | Authentication failed with provided credentials | Verify API key and permissions |
| Contract Error | Smart contract execution failed | Check contract state and method parameters |
| Rate Limit | API request rate limit exceeded | Implement request throttling and backoff |

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
- **TON Documentation**: [TON Developer Portal](https://docs.ton.org/)
- **Community**: [TON Discord](https://discord.gg/ton)