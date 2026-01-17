/**
 * TON Client Transport Layer
 *
 * Main client for interacting with TON blockchain through various API providers.
 * Handles network requests, caching, and error handling.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
	TonClient,
	TonClient4,
	Address,
	Cell,
	Contract,
	beginCell,
	toNano,
} from '@ton/ton';
import { getHttpEndpoint, getHttpV4Endpoint } from '@orbs-network/ton-access';
import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
import { getNetworkConfig, NETWORK_CONFIGS } from '../constants/networks';

/**
 * Client configuration options
 */
export interface TonClientConfig {
	network: 'mainnet' | 'testnet' | 'custom';
	apiProvider: 'toncenter' | 'tonapi' | 'tonhub' | 'orbs';
	apiKey?: string;
	customEndpoint?: string;
	timeout?: number;
}

/**
 * Transaction result
 */
export interface TransactionResult {
	hash: string;
	lt: string;
	success: boolean;
	fee: string;
	exitCode?: number;
}

/**
 * Account state information
 */
export interface AccountState {
	address: string;
	balance: string;
	state: 'active' | 'uninit' | 'frozen';
	lastTransactionLt?: string;
	lastTransactionHash?: string;
	code?: string;
	data?: string;
}

/**
 * Get method result
 */
export interface GetMethodResult {
	success: boolean;
	exitCode: number;
	stack: unknown[];
	gasUsed: number;
}

/**
 * Create TON client from n8n credentials
 */
export async function createTonClient(
	credentials: ICredentialDataDecryptedObject,
): Promise<TonClient> {
	const network = credentials.network as string;
	const apiProvider = credentials.apiProvider as string;
	const apiKey = credentials.apiKey as string | undefined;
	const customEndpoint = credentials.customEndpoint as string | undefined;
	const timeout = (credentials.timeout as number) || 30000;

	// Get endpoint URL
	let endpoint: string;

	if (network === 'custom' && customEndpoint) {
		endpoint = customEndpoint;
	} else if (apiProvider === 'orbs') {
		// Use Orbs decentralized access
		endpoint = await getHttpEndpoint({
			network: network === 'testnet' ? 'testnet' : 'mainnet',
		});
	} else {
		const config = getNetworkConfig(network);
		endpoint = config.endpoints[apiProvider as keyof typeof config.endpoints] || config.endpoints.toncenter;
	}

	// Create client with API key if provided
	const client = new TonClient({
		endpoint,
		apiKey: apiKey || undefined,
		timeout,
	});

	return client;
}

/**
 * Create TON Client V4 (for enhanced features)
 */
export async function createTonClientV4(
	credentials: ICredentialDataDecryptedObject,
): Promise<TonClient4> {
	const network = credentials.network as string;
	const timeout = (credentials.timeout as number) || 30000;

	// V4 endpoint
	const endpoint = await getHttpV4Endpoint({
		network: network === 'testnet' ? 'testnet' : 'mainnet',
	});

	const client = new TonClient4({
		endpoint,
		timeout,
	});

	return client;
}

/**
 * API Client wrapper for direct API calls
 */
export class TonApiClient {
	private client: AxiosInstance;
	private network: string;

	constructor(config: TonClientConfig) {
		const baseURL = this.getBaseUrl(config);

		this.client = axios.create({
			baseURL,
			timeout: config.timeout || 30000,
			headers: {
				'Content-Type': 'application/json',
				...(config.apiKey ? { 'X-API-Key': config.apiKey } : {}),
			},
		});

		this.network = config.network;
	}

	private getBaseUrl(config: TonClientConfig): string {
		if (config.network === 'custom' && config.customEndpoint) {
			return config.customEndpoint;
		}

		const networkConfig = NETWORK_CONFIGS[config.network] || NETWORK_CONFIGS.mainnet;
		return networkConfig.endpoints[config.apiProvider as keyof typeof networkConfig.endpoints]
			|| networkConfig.endpoints.toncenter;
	}

	/**
	 * Get account information
	 */
	async getAccountInfo(address: string): Promise<AccountState> {
		try {
			const response = await this.client.get('/getAddressInformation', {
				params: { address },
			});

			const result = response.data.result;

			return {
				address,
				balance: result.balance || '0',
				state: result.state || 'uninit',
				lastTransactionLt: result.last_transaction_id?.lt,
				lastTransactionHash: result.last_transaction_id?.hash,
				code: result.code,
				data: result.data,
			};
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Get account balance
	 */
	async getBalance(address: string): Promise<string> {
		try {
			const response = await this.client.get('/getAddressBalance', {
				params: { address },
			});

			return response.data.result || '0';
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Get transactions for an address
	 */
	async getTransactions(
		address: string,
		limit: number = 20,
		lt?: string,
		hash?: string,
	): Promise<unknown[]> {
		try {
			const params: Record<string, unknown> = {
				address,
				limit,
			};

			if (lt) params.lt = lt;
			if (hash) params.hash = hash;

			const response = await this.client.get('/getTransactions', { params });

			return response.data.result || [];
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Send BOC (serialized message)
	 */
	async sendBoc(boc: string): Promise<{ hash: string }> {
		try {
			const response = await this.client.post('/sendBoc', {
				boc,
			});

			return {
				hash: response.data.result?.hash || '',
			};
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Run get method on a contract
	 */
	async runGetMethod(
		address: string,
		method: string,
		stack: unknown[] = [],
	): Promise<GetMethodResult> {
		try {
			const response = await this.client.post('/runGetMethod', {
				address,
				method,
				stack,
			});

			const result = response.data.result;

			return {
				success: result.exit_code === 0,
				exitCode: result.exit_code,
				stack: result.stack || [],
				gasUsed: result.gas_used || 0,
			};
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Get masterchain info
	 */
	async getMasterchainInfo(): Promise<{
		lastBlockSeqno: number;
		lastBlockShard: string;
		lastBlockWorkchain: number;
		timestamp: number;
	}> {
		try {
			const response = await this.client.get('/getMasterchainInfo');
			const result = response.data.result;

			return {
				lastBlockSeqno: result.last?.seqno || 0,
				lastBlockShard: result.last?.shard || '',
				lastBlockWorkchain: result.last?.workchain || 0,
				timestamp: result.last?.utime || 0,
			};
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Get block header
	 */
	async getBlockHeader(
		workchain: number,
		shard: string,
		seqno: number,
	): Promise<unknown> {
		try {
			const response = await this.client.get('/getBlockHeader', {
				params: { workchain, shard, seqno },
			});

			return response.data.result;
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Estimate fees for a message
	 */
	async estimateFee(
		address: string,
		body: string,
		initCode?: string,
		initData?: string,
	): Promise<{ inFwdFee: string; storageFee: string; gasFee: string; fwdFee: string }> {
		try {
			const response = await this.client.post('/estimateFee', {
				address,
				body,
				init_code: initCode,
				init_data: initData,
			});

			const fees = response.data.result?.source_fees || {};

			return {
				inFwdFee: fees.in_fwd_fee?.toString() || '0',
				storageFee: fees.storage_fee?.toString() || '0',
				gasFee: fees.gas_fee?.toString() || '0',
				fwdFee: fees.fwd_fee?.toString() || '0',
			};
		} catch (error) {
			throw this.handleError(error);
		}
	}

	/**
	 * Get wallet seqno
	 */
	async getSeqno(address: string): Promise<number> {
		try {
			const result = await this.runGetMethod(address, 'seqno');

			if (result.success && result.stack.length > 0) {
				const seqnoEntry = result.stack[0] as { type: string; value: string };
				if (seqnoEntry.type === 'num') {
					return parseInt(seqnoEntry.value, 16);
				}
			}

			return 0;
		} catch {
			// If contract not deployed, seqno is 0
			return 0;
		}
	}

	/**
	 * Wait for transaction to be confirmed
	 */
	async waitForTransaction(
		address: string,
		lt: string,
		hash: string,
		timeout: number = 60000,
	): Promise<boolean> {
		const startTime = Date.now();

		while (Date.now() - startTime < timeout) {
			try {
				const txs = await this.getTransactions(address, 5);

				for (const tx of txs) {
					const transaction = tx as { transaction_id?: { lt?: string; hash?: string } };
					if (
						transaction.transaction_id?.lt === lt ||
						transaction.transaction_id?.hash === hash
					) {
						return true;
					}
				}
			} catch {
				// Ignore errors and retry
			}

			// Wait before next check
			await new Promise(resolve => setTimeout(resolve, 2000));
		}

		return false;
	}

	/**
	 * Handle API errors
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

	/**
	 * Get network name
	 */
	getNetwork(): string {
		return this.network;
	}
}

/**
 * Create API client from credentials
 */
export function createApiClient(credentials: ICredentialDataDecryptedObject): TonApiClient {
	return new TonApiClient({
		network: credentials.network as 'mainnet' | 'testnet' | 'custom',
		apiProvider: credentials.apiProvider as 'toncenter' | 'tonapi' | 'tonhub' | 'orbs',
		apiKey: credentials.apiKey as string | undefined,
		customEndpoint: credentials.customEndpoint as string | undefined,
		timeout: credentials.timeout as number | undefined,
	});
}

/**
 * Parse contract state from API response
 */
export function parseContractState(state: string): 'active' | 'uninit' | 'frozen' {
	switch (state.toLowerCase()) {
		case 'active':
			return 'active';
		case 'frozen':
			return 'frozen';
		case 'uninit':
		case 'uninitialized':
		default:
			return 'uninit';
	}
}

/**
 * Format address for API requests
 */
export function formatAddressForApi(address: string | Address): string {
	if (typeof address === 'string') {
		return address;
	}
	return address.toString();
}
