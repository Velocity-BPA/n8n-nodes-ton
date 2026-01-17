/**
 * TON Configuration Constants
 *
 * General configuration values, DEX addresses, staking pools,
 * and other commonly used constants for TON blockchain operations.
 */

/**
 * DEX Router Addresses
 */
export const DEX_ROUTERS = {
	mainnet: {
		stonfi: {
			router: 'EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt',
			routerV2: 'EQBIlZX2URWkXCSg3QF2MJZU-wC5XkBoLww-hdWk2G37Jc6N',
			factory: 'EQDuGtS4RjJvW1LLm5WFwN4z3-F0jKcjZ6_vbMsU7xpgkUo_',
			name: 'STON.fi',
			website: 'https://ston.fi',
		},
		dedust: {
			factory: 'EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67',
			vault: {
				native: 'EQDa4VOnTYlLvDJ0gZjNYm5PXfSmmtL6Vs6A_CZEtXCNICq_',
				jetton: 'EQB4tDaYz-8i7fGHVt5EBVz8PX3cQkK0HXYyMxL4vLmJHLgI',
			},
			name: 'DeDust',
			website: 'https://dedust.io',
		},
	},
	testnet: {
		stonfi: {
			router: 'EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt',
			routerV2: 'EQCqX6dCFZwqVMf-By_IC6mf2N6k7s6EPrjhvk-bNEKYADs0',
			factory: 'EQCvJoZQd2I17bqwVp1y2aOzOsHvQ6rCUZ8cqCQLqaC7qqUL',
			name: 'STON.fi (Testnet)',
			website: 'https://testnet.ston.fi',
		},
		dedust: {
			factory: 'EQCb9hBTfYuK25Q3IuVi0mjcnp_m1-wlePjt_n39bFNfC8n2',
			vault: {
				native: 'EQB4tDaYz-8i7fGHVt5EBVz8PX3cQkK0HXYyMxL4vLmJHLgI',
				jetton: 'EQB4tDaYz-8i7fGHVt5EBVz8PX3cQkK0HXYyMxL4vLmJHLgI',
			},
			name: 'DeDust (Testnet)',
			website: 'https://testnet.dedust.io',
		},
	},
} as const;

/**
 * Staking Pool Addresses
 */
export const STAKING_POOLS = {
	mainnet: {
		tonstakers: {
			pool: 'EQCkWxfyhAkim3g2DjKQQg8T5P4g-Q1-K_jErGcDJZ4i-vqR',
			name: 'Tonstakers',
			website: 'https://tonstakers.com',
			minStake: '1000000000', // 1 TON
		},
		bemo: {
			pool: 'EQDNhy-nxYFgUqzfUzImBEP67JqsyMIcyk2S5_RwNNEYku0k',
			name: 'Bemo',
			website: 'https://bemo.finance',
			minStake: '1000000000',
		},
		hipo: {
			pool: 'EQB-ajMyi5-WKIgOHnbOGApfckUGbl6tDk3Qt8PKmb-xLAvp',
			name: 'Hipo',
			website: 'https://hipo.finance',
			minStake: '10000000000', // 10 TON
		},
		tonWhales: {
			pool: 'EQCkR1cGmnsE45N4K0otPl5EnxnRakmGqeJUNua5fkWhales',
			name: 'TON Whales',
			website: 'https://tonwhales.com',
			minStake: '50000000000', // 50 TON
		},
	},
	testnet: {
		testPool: {
			pool: 'kQBs7t3uDYae2Ap4686Bl4zGaPKvpbauBnZO_WSop1whaLEs',
			name: 'Test Pool',
			website: '',
			minStake: '1000000000',
		},
	},
} as const;

/**
 * NFT Marketplace Addresses
 */
export const NFT_MARKETPLACES = {
	mainnet: {
		getgems: {
			marketplace: 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT',
			name: 'Getgems',
			website: 'https://getgems.io',
		},
		fragment: {
			marketplace: 'EQBAjaOyi2wGWlk-EDkSabqqnF-MrrwMadnwqrurKpkla9nE',
			name: 'Fragment',
			website: 'https://fragment.com',
		},
	},
} as const;

/**
 * TON Units and Decimals
 */
export const TON_UNITS = {
	TON_DECIMALS: 9,
	NANOTON_PER_TON: '1000000000', // 10^9
	MIN_TON_RESERVE: '50000000', // 0.05 TON - minimum to keep in wallet for fees
	DEFAULT_GAS_AMOUNT: '100000000', // 0.1 TON - default gas for operations
	MAX_COMMENT_LENGTH: 127, // Maximum bytes for transfer comment
} as const;

/**
 * Gas and Fee Constants
 */
export const GAS_CONSTANTS = {
	// Base fees (in nanoton)
	SIMPLE_TRANSFER_FEE: '5000000', // ~0.005 TON
	JETTON_TRANSFER_FEE: '50000000', // ~0.05 TON
	NFT_TRANSFER_FEE: '50000000', // ~0.05 TON
	CONTRACT_DEPLOY_FEE: '100000000', // ~0.1 TON

	// Forward amounts
	JETTON_FORWARD_MIN: '1', // Minimum forward amount
	JETTON_FORWARD_DEFAULT: '50000000', // 0.05 TON for notification

	// Storage fees (annual, per cell)
	STORAGE_FEE_PER_CELL: '1000', // ~0.000001 TON per cell per year
} as const;

/**
 * Message Opcodes
 */
export const MESSAGE_OPCODES = {
	// Standard operations
	SIMPLE_TRANSFER: 0x0,
	TEXT_COMMENT: 0x00000000,

	// NFT operations (TEP-62)
	NFT_TRANSFER: 0x5fcc3d14,
	NFT_OWNERSHIP_ASSIGNED: 0x05138d91,
	NFT_EXCESSES: 0xd53276db,
	NFT_GET_STATIC_DATA: 0x2fcb26a2,
	NFT_REPORT_STATIC_DATA: 0x8b771735,

	// SBT operations (TEP-85)
	SBT_DESTROY: 0x1f04537a,
	SBT_REVOKE: 0x6f89f5e3,

	// DNS operations (TEP-81)
	DNS_CHANGE_DNS_RECORD: 0x4eb1f0f9,
	DNS_DELETE_DNS_RECORD: 0x4d58c2bf,

	// Subscription operations
	SUBSCRIPTION_PAYMENT: 0x706c7567,
	SUBSCRIPTION_PAYMENT_REQUEST: 0x73756273,
} as const;

/**
 * Common error codes
 */
export const ERROR_CODES = {
	INSUFFICIENT_FUNDS: 37,
	INVALID_SEQNO: 33,
	INVALID_SIGNATURE: 34,
	INVALID_SUBWALLET_ID: 35,
	MESSAGE_EXPIRED: 36,
	ALREADY_DEPLOYED: 0,
	NOT_DEPLOYED: -13,
	OUT_OF_GAS: -14,
} as const;

/**
 * Block timing constants
 */
export const BLOCK_TIMING = {
	MASTERCHAIN_BLOCK_TIME: 5, // seconds
	BASECHAIN_BLOCK_TIME: 5, // seconds
	MESSAGE_LIFETIME_DEFAULT: 60, // seconds
	MESSAGE_LIFETIME_MAX: 3600, // 1 hour
} as const;

/**
 * Address format constants
 */
export const ADDRESS_FORMATS = {
	RAW: 'raw', // workchain:hex format
	USER_FRIENDLY: 'user_friendly', // base64 format
	BOUNCEABLE: 'bounceable', // EQ... prefix
	NON_BOUNCEABLE: 'non_bounceable', // UQ... prefix
	TEST_ONLY: 'test_only', // kQ... or 0Q... prefix (testnet)
} as const;

/**
 * Contract types
 */
export const CONTRACT_TYPES = {
	WALLET: 'wallet',
	JETTON_MASTER: 'jetton_master',
	JETTON_WALLET: 'jetton_wallet',
	NFT_COLLECTION: 'nft_collection',
	NFT_ITEM: 'nft_item',
	DNS_ROOT: 'dns_root',
	DNS_ITEM: 'dns_item',
	POOL: 'pool',
	CUSTOM: 'custom',
} as const;

/**
 * Get DEX router addresses for a network
 */
export function getDexRouters(network: string = 'mainnet') {
	return network === 'testnet' ? DEX_ROUTERS.testnet : DEX_ROUTERS.mainnet;
}

/**
 * Get staking pools for a network
 */
export function getStakingPools(network: string = 'mainnet') {
	return network === 'testnet' ? STAKING_POOLS.testnet : STAKING_POOLS.mainnet;
}
