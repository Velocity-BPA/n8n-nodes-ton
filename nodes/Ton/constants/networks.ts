/**
 * TON Network Configurations
 *
 * Defines network endpoints, chain IDs, and API configurations
 * for mainnet, testnet, and common API providers.
 */

export interface NetworkConfig {
	name: string;
	chainId: number;
	workchain: number;
	endpoints: {
		toncenter: string;
		tonapi: string;
		tonhub: string;
		orbs: string;
	};
	explorer: string;
	isTestnet: boolean;
}

/**
 * Mainnet Configuration
 */
export const MAINNET_CONFIG: NetworkConfig = {
	name: 'TON Mainnet',
	chainId: -239,
	workchain: 0,
	endpoints: {
		toncenter: 'https://toncenter.com/api/v2',
		tonapi: 'https://tonapi.io/v2',
		tonhub: 'https://tonhubapi.com',
		orbs: 'https://ton.access.orbs.network/1/rpc',
	},
	explorer: 'https://tonviewer.com',
	isTestnet: false,
};

/**
 * Testnet Configuration
 */
export const TESTNET_CONFIG: NetworkConfig = {
	name: 'TON Testnet',
	chainId: -3,
	workchain: 0,
	endpoints: {
		toncenter: 'https://testnet.toncenter.com/api/v2',
		tonapi: 'https://testnet.tonapi.io/v2',
		tonhub: 'https://testnet.tonhubapi.com',
		orbs: 'https://testnet.ton.access.orbs.network/1/rpc',
	},
	explorer: 'https://testnet.tonviewer.com',
	isTestnet: true,
};

/**
 * Network configurations map
 */
export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
	mainnet: MAINNET_CONFIG,
	testnet: TESTNET_CONFIG,
};

/**
 * API Provider Configurations
 */
export interface ApiProviderConfig {
	name: string;
	requiresApiKey: boolean;
	rateLimit: {
		free: number;
		withKey: number;
	};
	features: string[];
}

export const API_PROVIDERS: Record<string, ApiProviderConfig> = {
	toncenter: {
		name: 'TON Center',
		requiresApiKey: false,
		rateLimit: {
			free: 1, // requests per second
			withKey: 10,
		},
		features: ['jsonrpc', 'rest', 'getmethods'],
	},
	tonapi: {
		name: 'TON API',
		requiresApiKey: true,
		rateLimit: {
			free: 1,
			withKey: 100,
		},
		features: ['rest', 'streaming', 'nft', 'jettons', 'events'],
	},
	tonhub: {
		name: 'TON Hub',
		requiresApiKey: false,
		rateLimit: {
			free: 5,
			withKey: 50,
		},
		features: ['rest', 'connector'],
	},
	orbs: {
		name: 'Orbs TON Access',
		requiresApiKey: false,
		rateLimit: {
			free: 10,
			withKey: 10,
		},
		features: ['jsonrpc', 'decentralized'],
	},
};

/**
 * Workchain IDs
 */
export const WORKCHAIN = {
	MASTERCHAIN: -1,
	BASECHAIN: 0,
} as const;

/**
 * TON DNS Root Contract Addresses
 */
export const DNS_ROOT_ADDRESSES = {
	mainnet: 'EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz',
	testnet: 'EQDjPtM6QusgMgWfl9kMHG3-C8XdKuG3FMddS0O1BkgUPwVE',
};

/**
 * Configuration Parameter Indices
 * These are used to query specific parameters from the masterchain config
 */
export const CONFIG_PARAMS = {
	CONFIG_ADDR: 0, // Config contract address
	ELECTOR_ADDR: 1, // Elector contract address
	MINTER_ADDR: 2, // Minter contract address
	FEE_COLLECTOR_ADDR: 3, // Fee collector address
	DNS_ROOT_ADDR: 4, // DNS root contract address
	MINT_NEW_PRICE: 6, // Price to mint new currency
	GLOBAL_VERSION: 8, // Global blockchain version
	MANDATORY_PARAMS: 9, // List of mandatory config params
	CRITICAL_PARAMS: 10, // List of critical config params
	VOTING_SETUP: 11, // Voting setup for config changes
	WORKCHAINS: 12, // List of active workchains
	COMPLAINT_PRICING: 13, // Complaint pricing
	BLOCK_CREATE_FEES: 14, // Block creation fees
	VALIDATORS_ELECTED_FOR: 15, // Validator election duration
	ELECTIONS_CONFIG: 16, // Elections configuration
	STAKE_CONFIG: 17, // Validator stake configuration
	STORAGE_PRICES: 18, // Storage prices
	GAS_PRICES_MC: 20, // Gas prices for masterchain
	GAS_PRICES_WC: 21, // Gas prices for workchains
	BLOCK_LIMITS_MC: 22, // Block limits for masterchain
	BLOCK_LIMITS_WC: 23, // Block limits for workchains
	MSG_FORWARD_PRICES_MC: 24, // Message forwarding prices (MC)
	MSG_FORWARD_PRICES_WC: 25, // Message forwarding prices (WC)
	CATCHAIN_CONFIG: 28, // Catchain configuration
	CONSENSUS_CONFIG: 29, // Consensus configuration
	FUNDAMENTAL_MC_ADDR: 31, // Fundamental MC smart contracts
	PREV_VALIDATORS: 32, // Previous validator set
	PREV_VALIDATORS_TMP: 33, // Previous temp validator set
	CURR_VALIDATORS: 34, // Current validator set
	CURR_VALIDATORS_TMP: 35, // Current temp validator set
	NEXT_VALIDATORS: 36, // Next validator set
	NEXT_VALIDATORS_TMP: 37, // Next temp validator set
	SUSPENDED_ADDRESSES: 44, // Suspended addresses list
} as const;

/**
 * Get explorer URL for an address
 */
export function getExplorerAddressUrl(address: string, network: string = 'mainnet'): string {
	const config = NETWORK_CONFIGS[network] || MAINNET_CONFIG;
	return `${config.explorer}/address/${address}`;
}

/**
 * Get explorer URL for a transaction
 */
export function getExplorerTxUrl(hash: string, network: string = 'mainnet'): string {
	const config = NETWORK_CONFIGS[network] || MAINNET_CONFIG;
	return `${config.explorer}/transaction/${hash}`;
}

/**
 * Get the network configuration based on network name
 */
export function getNetworkConfig(network: string): NetworkConfig {
	return NETWORK_CONFIGS[network] || MAINNET_CONFIG;
}

/**
 * API Endpoints map (alias for convenience)
 */
export const API_ENDPOINTS = {
	mainnet: MAINNET_CONFIG.endpoints,
	testnet: TESTNET_CONFIG.endpoints,
};

/**
 * Default values for network operations
 */
export const DEFAULT_VALUES = {
	timeout: 30000,
	workchain: 0,
	network: 'mainnet',
	apiProvider: 'toncenter',
};
