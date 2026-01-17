/**
 * TON API Client (tonapi.io)
 *
 * Client for the enhanced TON API service (tonconsole.com)
 * providing additional features like events, streaming, and rich metadata.
 *
 * @see https://tonapi.io/docs
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ICredentialDataDecryptedObject } from 'n8n-workflow';

/**
 * TON API configuration
 */
export interface TonApiConfig {
	network: 'mainnet' | 'testnet';
	apiKey?: string;
	timeout?: number;
}

/**
 * Jetton metadata from API
 */
export interface JettonMetadata {
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	image?: string;
	description?: string;
	totalSupply: string;
	mintable: boolean;
	admin?: string;
}

/**
 * NFT item data from API
 */
export interface NftItemData {
	address: string;
	collectionAddress?: string;
	ownerAddress?: string;
	index: number;
	verified: boolean;
	metadata?: {
		name?: string;
		description?: string;
		image?: string;
		attributes?: Array<{ trait_type: string; value: string }>;
	};
	previews?: Array<{
		resolution: string;
		url: string;
	}>;
	sale?: {
		address: string;
		market: string;
		price: string;
	};
}

/**
 * NFT collection data from API
 */
export interface NftCollectionData {
	address: string;
	ownerAddress?: string;
	itemsCount: number;
	metadata?: {
		name?: string;
		description?: string;
		image?: string;
	};
	previews?: Array<{
		resolution: string;
		url: string;
	}>;
}

/**
 * Account event from API
 */
export interface AccountEvent {
	eventId: string;
	timestamp: number;
	account: string;
	isScam: boolean;
	lt: string;
	inProgress: boolean;
	actions: Array<{
		type: string;
		status: string;
		simplePreview: {
			name: string;
			description: string;
		};
	}>;
}

/**
 * Staking pool info
 */
export interface StakingPoolInfo {
	address: string;
	name: string;
	totalAmount: string;
	implementation: string;
	apy: number;
	minStake: string;
	cycleStart: number;
	cycleEnd: number;
	verified: boolean;
}

/**
 * TON API Client for enhanced features
 */
export class TonApiV2Client {
	private client: AxiosInstance;
	private network: string;

	constructor(config: TonApiConfig) {
		const baseURL = config.network === 'testnet'
			? 'https://testnet.tonapi.io/v2'
			: 'https://tonapi.io/v2';

		this.client = axios.create({
			baseURL,
			timeout: config.timeout || 30000,
			headers: {
				'Content-Type': 'application/json',
				...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
			},
		});

		this.network = config.network;
	}

	/**
	 * Get account information
	 */
	async getAccount(address: string): Promise<{
		address: string;
		balance: string;
		status: string;
		name?: string;
		icon?: string;
		interfaces?: string[];
	}> {
		const response = await this.request(`/accounts/${encodeURIComponent(address)}`);
		return {
			address: response.address,
			balance: response.balance?.toString() || '0',
			status: response.status,
			name: response.name,
			icon: response.icon,
			interfaces: response.interfaces,
		};
	}

	/**
	 * Get account events
	 */
	async getAccountEvents(
		address: string,
		options?: {
			limit?: number;
			beforeLt?: string;
			subjectOnly?: boolean;
		},
	): Promise<AccountEvent[]> {
		const params: Record<string, unknown> = {
			limit: options?.limit || 20,
		};

		if (options?.beforeLt) params.before_lt = options.beforeLt;
		if (options?.subjectOnly) params.subject_only = options.subjectOnly;

		const response = await this.request(`/accounts/${encodeURIComponent(address)}/events`, params);
		return response.events || [];
	}

	/**
	 * Get Jetton info
	 */
	async getJettonInfo(address: string): Promise<JettonMetadata> {
		const response = await this.request(`/jettons/${encodeURIComponent(address)}`);

		return {
			address: response.metadata?.address || address,
			name: response.metadata?.name || 'Unknown',
			symbol: response.metadata?.symbol || '???',
			decimals: parseInt(response.metadata?.decimals || '9', 10),
			image: response.metadata?.image,
			description: response.metadata?.description,
			totalSupply: response.total_supply || '0',
			mintable: response.mintable || false,
			admin: response.admin?.address,
		};
	}

	/**
	 * Get Jetton balance for wallet
	 */
	async getJettonBalance(
		ownerAddress: string,
		jettonAddress: string,
	): Promise<{ balance: string; walletAddress: string }> {
		const response = await this.request(
			`/accounts/${encodeURIComponent(ownerAddress)}/jettons/${encodeURIComponent(jettonAddress)}`,
		);

		return {
			balance: response.balance || '0',
			walletAddress: response.wallet_address?.address || '',
		};
	}

	/**
	 * Get all Jetton balances for wallet
	 */
	async getAllJettonBalances(ownerAddress: string): Promise<Array<{
		jetton: JettonMetadata;
		balance: string;
		walletAddress: string;
	}>> {
		const response = await this.request(`/accounts/${encodeURIComponent(ownerAddress)}/jettons`);

		return (response.balances || []).map((item: {
			jetton: {
				address: string;
				name?: string;
				symbol?: string;
				decimals?: string;
				image?: string;
			};
			balance: string;
			wallet_address?: { address: string };
		}) => ({
			jetton: {
				address: item.jetton.address,
				name: item.jetton.name || 'Unknown',
				symbol: item.jetton.symbol || '???',
				decimals: parseInt(item.jetton.decimals || '9', 10),
				image: item.jetton.image,
				totalSupply: '0',
				mintable: false,
			},
			balance: item.balance,
			walletAddress: item.wallet_address?.address || '',
		}));
	}

	/**
	 * Get Jetton holders
	 */
	async getJettonHolders(
		jettonAddress: string,
		options?: { limit?: number; offset?: number },
	): Promise<Array<{ address: string; balance: string }>> {
		const params: Record<string, unknown> = {
			limit: options?.limit || 100,
			offset: options?.offset || 0,
		};

		const response = await this.request(
			`/jettons/${encodeURIComponent(jettonAddress)}/holders`,
			params,
		);

		return (response.addresses || []).map((item: { owner: { address: string }; balance: string }) => ({
			address: item.owner.address,
			balance: item.balance,
		}));
	}

	/**
	 * Get NFT item info
	 */
	async getNftItem(address: string): Promise<NftItemData> {
		const response = await this.request(`/nfts/${encodeURIComponent(address)}`);

		return {
			address: response.address,
			collectionAddress: response.collection?.address,
			ownerAddress: response.owner?.address,
			index: response.index || 0,
			verified: response.verified || false,
			metadata: response.metadata,
			previews: response.previews,
			sale: response.sale ? {
				address: response.sale.address,
				market: response.sale.market?.name || 'Unknown',
				price: response.sale.price?.value || '0',
			} : undefined,
		};
	}

	/**
	 * Get NFT collection info
	 */
	async getNftCollection(address: string): Promise<NftCollectionData> {
		const response = await this.request(`/nfts/collections/${encodeURIComponent(address)}`);

		return {
			address: response.address,
			ownerAddress: response.owner?.address,
			itemsCount: response.next_item_index || 0,
			metadata: response.metadata,
			previews: response.previews,
		};
	}

	/**
	 * Get NFTs owned by address
	 */
	async getNftsByOwner(
		ownerAddress: string,
		options?: { limit?: number; offset?: number; collection?: string },
	): Promise<NftItemData[]> {
		const params: Record<string, unknown> = {
			limit: options?.limit || 100,
			offset: options?.offset || 0,
		};

		if (options?.collection) {
			params.collection = options.collection;
		}

		const response = await this.request(
			`/accounts/${encodeURIComponent(ownerAddress)}/nfts`,
			params,
		);

		return (response.nft_items || []).map((item: {
			address: string;
			collection?: { address: string };
			owner?: { address: string };
			index?: number;
			verified?: boolean;
			metadata?: unknown;
			previews?: unknown;
			sale?: { address: string; market?: { name: string }; price?: { value: string } };
		}) => ({
			address: item.address,
			collectionAddress: item.collection?.address,
			ownerAddress: item.owner?.address,
			index: item.index || 0,
			verified: item.verified || false,
			metadata: item.metadata,
			previews: item.previews,
			sale: item.sale ? {
				address: item.sale.address,
				market: item.sale.market?.name || 'Unknown',
				price: item.sale.price?.value || '0',
			} : undefined,
		}));
	}

	/**
	 * Get NFTs in a collection
	 */
	async getNftsInCollection(
		collectionAddress: string,
		options?: { limit?: number; offset?: number },
	): Promise<NftItemData[]> {
		const params: Record<string, unknown> = {
			limit: options?.limit || 100,
			offset: options?.offset || 0,
		};

		const response = await this.request(
			`/nfts/collections/${encodeURIComponent(collectionAddress)}/items`,
			params,
		);

		return (response.nft_items || []).map((item: {
			address: string;
			collection?: { address: string };
			owner?: { address: string };
			index?: number;
			verified?: boolean;
			metadata?: unknown;
			previews?: unknown;
		}) => ({
			address: item.address,
			collectionAddress: item.collection?.address,
			ownerAddress: item.owner?.address,
			index: item.index || 0,
			verified: item.verified || false,
			metadata: item.metadata,
			previews: item.previews,
		}));
	}

	/**
	 * Resolve DNS domain
	 */
	async resolveDns(domain: string): Promise<{
		wallet?: string;
		site?: string;
		storage?: string;
	}> {
		const response = await this.request(`/dns/${encodeURIComponent(domain)}/resolve`);

		return {
			wallet: response.wallet?.address,
			site: response.sites?.[0],
			storage: response.storage,
		};
	}

	/**
	 * Get DNS domain info
	 */
	async getDnsInfo(domain: string): Promise<{
		address: string;
		name: string;
		expiry?: number;
		owner?: string;
	}> {
		const response = await this.request(`/dns/${encodeURIComponent(domain)}`);

		return {
			address: response.item?.address || '',
			name: response.item?.dns || domain,
			expiry: response.item?.expiring_at,
			owner: response.item?.owner?.address,
		};
	}

	/**
	 * Get staking pools
	 */
	async getStakingPools(): Promise<StakingPoolInfo[]> {
		const response = await this.request('/staking/pools');

		return (response.pools || []).map((pool: {
			address: string;
			name?: string;
			total_amount: string;
			implementation: string;
			apy: number;
			min_stake: string;
			cycle_start: number;
			cycle_end: number;
			verified: boolean;
		}) => ({
			address: pool.address,
			name: pool.name || 'Unknown Pool',
			totalAmount: pool.total_amount,
			implementation: pool.implementation,
			apy: pool.apy,
			minStake: pool.min_stake,
			cycleStart: pool.cycle_start,
			cycleEnd: pool.cycle_end,
			verified: pool.verified,
		}));
	}

	/**
	 * Get staking pool info
	 */
	async getStakingPoolInfo(address: string): Promise<StakingPoolInfo> {
		const response = await this.request(`/staking/pool/${encodeURIComponent(address)}`);

		return {
			address: response.pool.address,
			name: response.pool.name || 'Unknown Pool',
			totalAmount: response.pool.total_amount,
			implementation: response.pool.implementation,
			apy: response.pool.apy,
			minStake: response.pool.min_stake,
			cycleStart: response.pool.cycle_start,
			cycleEnd: response.pool.cycle_end,
			verified: response.pool.verified,
		};
	}

	/**
	 * Get rates (prices)
	 */
	async getRates(tokens: string[], currencies: string[] = ['USD']): Promise<Record<string, Record<string, number>>> {
		const response = await this.request('/rates', {
			tokens: tokens.join(','),
			currencies: currencies.join(','),
		});

		return response.rates || {};
	}

	/**
	 * Get TON price
	 */
	async getTonPrice(): Promise<number> {
		const rates = await this.getRates(['ton']);
		return rates.TON?.USD || 0;
	}

	/**
	 * Search by string
	 */
	async search(query: string): Promise<{
		accounts: Array<{ address: string; name?: string }>;
		collectibles: Array<{ address: string; name?: string }>;
	}> {
		const response = await this.request('/search', { query });

		return {
			accounts: response.accounts || [],
			collectibles: response.collectibles || [],
		};
	}

	/**
	 * Make API request
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async request(path: string, params?: Record<string, unknown>): Promise<any> {
		try {
			const response = await this.client.get(path, { params });
			return response.data;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Handle errors
	 */
	private handleError(error: unknown): Error {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<{ error?: string; message?: string }>;
			const message = axiosError.response?.data?.error
				|| axiosError.response?.data?.message
				|| axiosError.message
				|| 'Unknown API error';

			return new Error(`TON API Error: ${message}`);
		}

		if (error instanceof Error) {
			return error;
		}

		return new Error('Unknown error occurred');
	}
}

/**
 * Create TON API v2 client from credentials
 */
export function createTonApiV2Client(credentials: ICredentialDataDecryptedObject): TonApiV2Client {
	return new TonApiV2Client({
		network: credentials.network === 'testnet' ? 'testnet' : 'mainnet',
		apiKey: credentials.apiKey as string | undefined,
		timeout: credentials.timeout as number | undefined,
	});
}

/**
 * Alias for createTonApiV2Client - accepts credentials directly
 */
export function createTonApiClient(credentials: ICredentialDataDecryptedObject): TonApiV2Client {
	return createTonApiV2Client(credentials);
}
