/**
 * Common Jetton Token Addresses
 *
 * Well-known Jetton master contract addresses on TON mainnet and testnet.
 * These are the addresses of the Jetton master contracts, not individual wallet addresses.
 *
 * @see https://docs.ton.org/develop/dapps/asset-processing/jettons
 */

export interface JettonInfo {
	symbol: string;
	name: string;
	decimals: number;
	masterAddress: string;
	description?: string;
	image?: string;
}

/**
 * Mainnet Jetton Addresses
 */
export const MAINNET_JETTONS: Record<string, JettonInfo> = {
	// Stablecoins
	USDT: {
		symbol: 'USDT',
		name: 'Tether USD',
		decimals: 6,
		masterAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
		description: 'Tether USD on TON',
	},
	USDC: {
		symbol: 'USDC',
		name: 'USD Coin',
		decimals: 6,
		masterAddress: 'EQAZjzNDSNJVu4qf_qNnR8JXrXmX7kNyy_Z7rM6fN5aqpQnX',
		description: 'Circle USD Coin on TON',
	},
	jUSDC: {
		symbol: 'jUSDC',
		name: 'Bridged USDC',
		decimals: 6,
		masterAddress: 'EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728',
		description: 'Bridged USDC from Ethereum',
	},
	jUSDT: {
		symbol: 'jUSDT',
		name: 'Bridged USDT',
		decimals: 6,
		masterAddress: 'EQBynBO23ywHy_CgarY9NK9FTz0yDsG82PtcbSTQgGoXwiuA',
		description: 'Bridged USDT from Ethereum',
	},

	// Native TON Tokens
	STON: {
		symbol: 'STON',
		name: 'STON.fi Token',
		decimals: 9,
		masterAddress: 'EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO',
		description: 'STON.fi DEX governance token',
	},
	SCALE: {
		symbol: 'SCALE',
		name: 'SCALE Token',
		decimals: 9,
		masterAddress: 'EQBlqsm144Dq6SjbPI4jjZvA1hqTIP3CvHovbIfW_t-SCALE',
		description: 'DeDust governance token',
	},

	// Wrapped Tokens
	WTON: {
		symbol: 'WTON',
		name: 'Wrapped TON',
		decimals: 9,
		masterAddress: 'EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez',
		description: 'Wrapped TON for DeFi',
	},
	jWBTC: {
		symbol: 'jWBTC',
		name: 'Bridged WBTC',
		decimals: 8,
		masterAddress: 'EQDcBkGHmC4pTf34x3Gm05XvepO5w60DNxZ-XT4I6-UGG5L5',
		description: 'Bridged Wrapped Bitcoin',
	},
	jETH: {
		symbol: 'jETH',
		name: 'Bridged ETH',
		decimals: 18,
		masterAddress: 'EQBfGHzKqRzNW8F-TmwKvtLoah0iLVTrS-wxaMKCv5T6_bTc',
		description: 'Bridged Ether from Ethereum',
	},

	// Liquid Staking
	tsTON: {
		symbol: 'tsTON',
		name: 'Tonstakers stTON',
		decimals: 9,
		masterAddress: 'EQC98_qAmNEptUtPc7W6xdHh_ZHrBUFpw5Ft_IrdjKUEAIln',
		description: 'Tonstakers liquid staked TON',
	},
	stTON: {
		symbol: 'stTON',
		name: 'Bemo stTON',
		decimals: 9,
		masterAddress: 'EQDNhy-nxYFgUqzfUzImBEP67JqsyMIcyk2S5_RwNNEYku0k',
		description: 'Bemo liquid staked TON',
	},
	hTON: {
		symbol: 'hTON',
		name: 'Hipo staked TON',
		decimals: 9,
		masterAddress: 'EQB-ajMyi5-WKIgOHnbOGApfckUGbl6tDk3Qt8PKmb-xLAvp',
		description: 'Hipo liquid staked TON',
	},

	// Meme Tokens
	PUNK: {
		symbol: 'PUNK',
		name: 'TON Punk',
		decimals: 9,
		masterAddress: 'EQBzyqU-jq0J9dFbHbhPvgLqrUUXHPIZS7-8SWctN2W7_UKB',
		description: 'TON Punk meme token',
	},
	ANON: {
		symbol: 'ANON',
		name: 'Anonymous Telegram Numbers',
		decimals: 9,
		masterAddress: 'EQBl3gg6AAdjgjO2ZoNU5Q5EzUIl8XMNZrix8Z5V55qzLAJW',
		description: 'Anonymous Telegram Numbers token',
	},
};

/**
 * Testnet Jetton Addresses
 */
export const TESTNET_JETTONS: Record<string, JettonInfo> = {
	TEST_USDT: {
		symbol: 'TEST_USDT',
		name: 'Test USDT',
		decimals: 6,
		masterAddress: 'kQBqSpvo4S87mX9tjHaG4zhYZeORhVhMapBJpnMZ64jhrP-A',
		description: 'Testnet USDT for testing',
	},
	TEST_JETTON: {
		symbol: 'TEST',
		name: 'Test Jetton',
		decimals: 9,
		masterAddress: 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT',
		description: 'Generic test jetton',
	},
};

/**
 * Get Jetton info by symbol
 */
export function getJettonBySymbol(symbol: string, network: string = 'mainnet'): JettonInfo | undefined {
	const jettons = network === 'testnet' ? TESTNET_JETTONS : MAINNET_JETTONS;
	return jettons[symbol.toUpperCase()];
}

/**
 * Get Jetton info by master address
 */
export function getJettonByAddress(address: string, network: string = 'mainnet'): JettonInfo | undefined {
	const jettons = network === 'testnet' ? TESTNET_JETTONS : MAINNET_JETTONS;
	return Object.values(jettons).find(j => j.masterAddress === address);
}

/**
 * Get all Jettons for a network
 */
export function getAllJettons(network: string = 'mainnet'): JettonInfo[] {
	const jettons = network === 'testnet' ? TESTNET_JETTONS : MAINNET_JETTONS;
	return Object.values(jettons);
}

/**
 * Common Jetton operation codes (opcodes)
 */
export const JETTON_OPCODES = {
	TRANSFER: 0xf8a7ea5,
	TRANSFER_NOTIFICATION: 0x7362d09c,
	INTERNAL_TRANSFER: 0x178d4519,
	EXCESSES: 0xd53276db,
	BURN: 0x595f07bc,
	BURN_NOTIFICATION: 0x7bdd97de,
	PROVIDE_WALLET_ADDRESS: 0x2c76b973,
	TAKE_WALLET_ADDRESS: 0xd1735400,
	MINT: 21,
	CHANGE_ADMIN: 3,
	CHANGE_CONTENT: 4,
} as const;

/**
 * Forward payload for Jetton transfers
 */
export const JETTON_FORWARD_AMOUNTS = {
	MIN_FORWARD: '50000000', // 0.05 TON - minimum for notification
	DEFAULT_FORWARD: '100000000', // 0.1 TON - recommended
	WITH_COMMENT: '150000000', // 0.15 TON - with text comment
} as const;

/**
 * Known Jettons map (alias for MAINNET_JETTONS)
 */
export const KNOWN_JETTONS = MAINNET_JETTONS;

/**
 * Get Jetton address by symbol (alias for getJettonBySymbol)
 */
export function getJettonAddress(symbol: string, network: string = 'mainnet'): string | undefined {
	const jetton = getJettonBySymbol(symbol, network);
	return jetton?.masterAddress;
}
