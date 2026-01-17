/**
 * TON Wallet Contract Versions
 *
 * TON supports multiple wallet contract versions, each with different features.
 * The wallet version determines the contract code deployed for a wallet.
 *
 * @see https://docs.ton.org/participate/wallets/contracts
 */

export interface WalletVersionConfig {
	name: string;
	version: string;
	revision: number;
	features: string[];
	maxMessages: number;
	supportsPlugins: boolean;
	codeHash: string;
	description: string;
}

/**
 * Wallet Version Configurations
 */
export const WALLET_VERSIONS: Record<string, WalletVersionConfig> = {
	v3r1: {
		name: 'Wallet V3R1',
		version: 'v3',
		revision: 1,
		features: ['seqno', 'subwallet_id'],
		maxMessages: 4,
		supportsPlugins: false,
		codeHash: 'thc0Z0RWH4C9p7D7_h_1rDVb7NQS5V2EvxnHLvzqpQA=',
		description: 'Basic wallet with sequence number and subwallet support',
	},
	v3r2: {
		name: 'Wallet V3R2',
		version: 'v3',
		revision: 2,
		features: ['seqno', 'subwallet_id', 'valid_until'],
		maxMessages: 4,
		supportsPlugins: false,
		codeHash: 'hNr6RJ-Ypph3ibJUAx-JDt8Rs3LqG6Bs2w-xZ_7_sBA=',
		description: 'V3 with message expiration support',
	},
	v4r1: {
		name: 'Wallet V4R1',
		version: 'v4',
		revision: 1,
		features: ['seqno', 'subwallet_id', 'valid_until', 'plugins'],
		maxMessages: 4,
		supportsPlugins: true,
		codeHash: 'ZN-YdzxdNyVN2mpZwfDpjGCKwIakO-ujAVVGbGq2rRY=',
		description: 'V4 with plugin support (subscriptions)',
	},
	v4r2: {
		name: 'Wallet V4R2',
		version: 'v4',
		revision: 2,
		features: ['seqno', 'subwallet_id', 'valid_until', 'plugins', 'get_public_key'],
		maxMessages: 4,
		supportsPlugins: true,
		codeHash: 'oM_EfPd7VCVFAl3IVaGLgJefrE9u8KTk4dP-GCdojpI=',
		description: 'Most widely used wallet version with plugins and public key getter',
	},
	v5: {
		name: 'Wallet V5',
		version: 'v5',
		revision: 1,
		features: [
			'seqno',
			'subwallet_id',
			'valid_until',
			'plugins',
			'get_public_key',
			'extensions',
			'signed_external',
			'signed_internal',
			'gasless',
		],
		maxMessages: 255,
		supportsPlugins: true,
		codeHash: '3uEuqL7CWgF1G9O9PYnEW1eGQc3cklIUFGh3dXVfWYI=',
		description: 'Latest wallet with extensions, gasless transactions, and up to 255 messages',
	},
};

/**
 * Default subwallet IDs
 */
export const DEFAULT_SUBWALLET_IDS = {
	MAINNET: 698983191, // Default for mainnet (0x29a9a317)
	TESTNET: 698983191, // Same for testnet
	TONKEEPER: 698983191, // Tonkeeper default
	TONHUB: 698983191, // Tonhub default
} as const;

/**
 * Wallet operation opcodes
 */
export const WALLET_OPCODES = {
	// V3/V4 operations
	SIMPLE_TRANSFER: 0,

	// V4 plugin operations
	INSTALL_PLUGIN: 0x6e6f7465,
	REMOVE_PLUGIN: 0x64737472,

	// V5 operations
	V5_EXTERNAL_SIGNED: 0x7369676e, // 'sign' opcode for external messages
	V5_INTERNAL_SIGNED: 0x73696e74, // 'sint' opcode for internal messages
	V5_EXTENSION_ACTION: 0x6578746e, // 'extn' opcode for extension actions
} as const;

/**
 * Get wallet version configuration
 */
export function getWalletVersionConfig(version: string): WalletVersionConfig | undefined {
	return WALLET_VERSIONS[version];
}

/**
 * Get the recommended wallet version
 */
export function getRecommendedWalletVersion(): string {
	return 'v4r2';
}

/**
 * Check if a wallet version supports plugins
 */
export function supportsPlugins(version: string): boolean {
	const config = WALLET_VERSIONS[version];
	return config?.supportsPlugins ?? false;
}

/**
 * Get maximum messages per transaction for a wallet version
 */
export function getMaxMessages(version: string): number {
	const config = WALLET_VERSIONS[version];
	return config?.maxMessages ?? 4;
}

/**
 * Check if gasless transactions are supported
 */
export function supportsGasless(version: string): boolean {
	return version === 'v5';
}

/**
 * Wallet state types
 */
export const WALLET_STATES = {
	UNINITIALIZED: 'uninit',
	ACTIVE: 'active',
	FROZEN: 'frozen',
} as const;

export type WalletState = typeof WALLET_STATES[keyof typeof WALLET_STATES];
