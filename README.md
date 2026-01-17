# n8n-nodes-ton

> [!IMPORTANT]
> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **TON (The Open Network)** blockchain providing 13 resources and 50+ operations for wallets, transactions, Jettons, NFTs, smart contracts, DNS, staking, and DEX operations. Includes polling-based trigger node for real-time blockchain event monitoring.

![TON](https://img.shields.io/badge/TON-0098EA?style=flat&logo=ton&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat&logo=n8n&logoColor=white)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

### Wallet Operations
- Get wallet balance, info, and state
- Create and deploy wallets (v3r1, v3r2, v4r1, v4r2)
- Get transaction history
- Address validation and conversion (raw, bounceable, non-bounceable)

### Transaction Operations
- Send TON with optional comments
- Get transaction details and status
- Wait for transaction confirmation
- Estimate transaction fees

### Jetton Operations (TEP-74)
- Get Jetton balances and metadata
- Transfer Jettons between wallets
- Get Jetton holders and transfer history
- Support for popular Jettons (USDT, USDC, NOT, STON, etc.)

### NFT Operations (TEP-62)
- Get NFT item and collection info
- Transfer NFTs
- Get NFTs owned by address
- Get collection items

### Smart Contract Operations
- Run get methods on contracts
- Deploy new contracts
- Send messages to contracts
- Get contract state

### DNS Operations (TEP-81)
- Resolve .ton and .t.me domains
- Get domain info and records

### Staking Operations
- Get staking pool information
- View pool details and APY

### DEX Operations
- Get swap quotes (STON.fi, DeDust)
- Get token prices and rates

### Blockchain Data
- Get latest blocks and masterchain info
- Get block headers and shard information

### Network Information
- Network status and statistics
- Supported providers info
- TON price data

### Trigger Node
- Monitor wallet for new transactions
- Track TON received/sent events
- Monitor balance changes

---

## Installation

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-ton`
4. Click **Install**

### Manual Installation

```bash
# In your n8n custom nodes directory
cd ~/.n8n/custom
npm install n8n-nodes-ton
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-ton.zip
cd n8n-nodes-ton

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ton

# 5. Restart n8n
n8n start
```

---

## Credentials Setup

### TON Network Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Network | mainnet, testnet, or custom | Yes |
| API Provider | toncenter, tonapi, tonhub, orbs | Yes |
| API Key | API key for the provider | No |
| Custom Endpoint | URL for custom network | If custom |
| Enable Wallet | Enable transaction signing | No |
| Mnemonic | 24-word seed phrase | If wallet enabled |
| Wallet Version | v3r1, v3r2, v4r1, v4r2 | If wallet enabled |

### Supported API Providers

| Provider | Mainnet Endpoint | Testnet Endpoint |
|----------|-----------------|------------------|
| TON Center | `https://toncenter.com/api/v2` | `https://testnet.toncenter.com/api/v2` |
| TON API | `https://tonapi.io/v2` | `https://testnet.tonapi.io/v2` |
| TON Hub | `https://mainnet.tonhubapi.com` | `https://testnet.tonhubapi.com` |
| Orbs | `https://ton.access.orbs.network` | `https://testnet.ton.access.orbs.network` |

---

## Resources & Operations

### Wallet
| Operation | Description |
|-----------|-------------|
| Get Balance | Get wallet TON balance |
| Get Wallet Info | Get wallet state and details |
| Get Seqno | Get wallet sequence number |
| Get Wallet Address | Derive address from mnemonic |
| Get Transactions | Get wallet transaction history |
| Validate Address | Check if address is valid |
| Convert Address | Convert between address formats |

### Transaction
| Operation | Description |
|-----------|-------------|
| Send TON | Send TON to an address |
| Get Transaction | Get transaction by hash |
| Get Transactions | Get multiple transactions |
| Estimate Fee | Estimate transaction fee |
| Wait for Transaction | Wait for confirmation |

### Jetton
| Operation | Description |
|-----------|-------------|
| Get Jetton Balance | Get token balance for address |
| Get Jetton Info | Get token metadata |
| Get All Jetton Balances | Get all token balances |
| Get Jetton Holders | Get token holder list |

### NFT
| Operation | Description |
|-----------|-------------|
| Get NFT Item Info | Get NFT metadata |
| Get Collection Info | Get collection details |
| Get Collection Items | List items in collection |
| Get NFTs by Owner | Get NFTs owned by address |

### Contract
| Operation | Description |
|-----------|-------------|
| Run Get Method | Execute contract getter |
| Get Contract State | Get contract code/data |
| Estimate Fee | Estimate execution fee |
| Send BOC | Send serialized message |

### DNS
| Operation | Description |
|-----------|-------------|
| Resolve | Resolve domain to address |
| Get Domain Info | Get domain details |

### Staking
| Operation | Description |
|-----------|-------------|
| Get Staking Pools | List available pools |
| Get Pool Info | Get pool details and APY |

### DEX
| Operation | Description |
|-----------|-------------|
| Get Supported DEXes | List available DEXes |
| Get TON Price | Get current TON price |
| Get Rates | Get token exchange rates |

### Block
| Operation | Description |
|-----------|-------------|
| Get Masterchain Info | Get chain state |
| Get Block Header | Get block details |
| Get Latest Block | Get most recent block |

### Account
| Operation | Description |
|-----------|-------------|
| Get Account Info | Get account details |
| Get Balance | Get account balance |
| Get Account State | Get account state |
| Get Transaction History | Get account transactions |
| Get Account Events | Get account events |

### Network
| Operation | Description |
|-----------|-------------|
| Get Network Info | Get network details |
| Get Network Status | Get network health |
| Get Supported Providers | List API providers |
| Get TON Price | Get current price |

### Utility
| Operation | Description |
|-----------|-------------|
| Convert Nanoton to TON | Unit conversion |
| Convert TON to Nanoton | Unit conversion |
| Validate Address | Check address validity |
| Convert Address Format | Address format conversion |
| Get Explorer URL | Generate explorer link |
| Generate Mnemonic | Create new seed phrase |
| Validate Mnemonic | Check seed phrase |
| Format Jetton Amount | Format token amounts |

---

## Trigger Node

The TON Trigger node polls for blockchain events:

| Event | Description |
|-------|-------------|
| New Transaction | Any new transaction |
| TON Received | Incoming TON transfers |
| TON Sent | Outgoing TON transfers |
| Balance Change | Any balance modification |

### Configuration
- **Address**: Wallet address to monitor
- **Events**: Event types to listen for
- **Poll Interval**: Check frequency (default: 1 minute)
- **Min Amount**: Minimum amount filter (optional)
- **Include Failed**: Include failed transactions

---

## Usage Examples

### Get Wallet Balance

```json
{
  "resource": "wallet",
  "operation": "getBalance",
  "address": "EQBvW8Z5huBkMJYdnfAEM5JqTNLuOKLmHHq1T2FLvFW9VZGc"
}
```

### Send TON

```json
{
  "resource": "transaction",
  "operation": "sendTon",
  "toAddress": "EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2",
  "amount": "1.5",
  "comment": "Payment for services"
}
```

### Get Jetton Balance

```json
{
  "resource": "jetton",
  "operation": "getJettonBalance",
  "ownerAddress": "EQBvW8Z5huBkMJYdnfAEM5JqTNLuOKLmHHq1T2FLvFW9VZGc",
  "jettonMasterAddress": "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs"
}
```

### Monitor Wallet (Trigger)

```json
{
  "events": ["tonReceived", "balanceChange"],
  "address": "EQBvW8Z5huBkMJYdnfAEM5JqTNLuOKLmHHq1T2FLvFW9VZGc",
  "minAmount": "1"
}
```

---

## TON Blockchain Concepts

### Address Formats
- **Raw**: `0:6f5bc6798ae064309619ddf0043392684cd2ee38a2e61c7ab54f614bbc55bd55`
- **Bounceable**: `EQBvW8Z5huBkMJYdnfAEM5JqTNLuOKLmHHq1T2FLvFW9VZGc`
- **Non-bounceable**: `UQBvW8Z5huBkMJYdnfAEM5JqTNLuOKLmHHq1T2FLvFW9VZGC`

### Units
- **TON**: Main unit (1 TON)
- **nanoTON**: Smallest unit (1 TON = 1,000,000,000 nanoTON)

### Jettons (TEP-74)
TEP-74 is the TON token standard (similar to ERC-20). Each Jetton has:
- Master contract (token definition)
- Wallet contracts (per user)

### NFTs (TEP-62)
TEP-62 is the TON NFT standard (similar to ERC-721). Includes:
- Collection contracts
- Individual item contracts

---

## Networks

| Network | Description | Use Case |
|---------|-------------|----------|
| Mainnet | Production network | Real transactions |
| Testnet | Test network | Development/testing |
| Custom | Private endpoint | Custom infrastructure |

---

## Error Handling

The node includes comprehensive error handling:

- **Network errors**: Automatic retry with configurable attempts
- **Invalid addresses**: Clear validation messages
- **Insufficient balance**: Descriptive error responses
- **API rate limits**: Graceful degradation
- **Contract errors**: Detailed error codes

Use the `continueOnFail` option in n8n to handle errors gracefully in workflows.

---

## Security Best Practices

1. **Never share your mnemonic**: Keep your 24-word seed phrase secure
2. **Use testnet first**: Test all workflows on testnet before mainnet
3. **Limit API key permissions**: Use read-only keys where possible
4. **Monitor transactions**: Set up alerts for large transfers
5. **Use environment variables**: Store sensitive data in n8n credentials
6. **Rotate credentials**: Regularly update API keys

---

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Lint
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

---

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support

- [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ton/issues)
- [n8n Community Forum](https://community.n8n.io/)

---

## Acknowledgments

- [TON Foundation](https://ton.org/) for the blockchain infrastructure
- [n8n](https://n8n.io/) for the workflow automation platform
- [@ton/ton](https://github.com/ton-org/ton) for the JavaScript SDK
