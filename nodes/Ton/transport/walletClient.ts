/**
 * TON Wallet Client
 *
 * Handles wallet operations including:
 * - Wallet creation and management
 * - Transaction signing and sending
 * - Multi-message transactions
 *
 * Security: Never logs mnemonics or private keys
 */

import {
	TonClient,
	WalletContractV3R1,
	WalletContractV3R2,
	WalletContractV4,
	Address,
	Cell,
	beginCell,
	internal,
	external,
	SendMode,
	MessageRelaxed,
	storeMessage,
	toNano,
	fromNano,
	OpenedContract,
} from '@ton/ton';
import { KeyPair, mnemonicToPrivateKey, mnemonicNew, mnemonicValidate } from '@ton/crypto';
import type { ICredentialDataDecryptedObject } from 'n8n-workflow';
import { createTonClient, TonApiClient, createApiClient } from './tonClient';
import { getWalletVersionConfig, DEFAULT_SUBWALLET_IDS } from '../constants/walletVersions';

/**
 * Wallet types
 */
export type WalletVersion = 'v3r1' | 'v3r2' | 'v4r1' | 'v4r2';

/**
 * Wallet contract type
 */
export type WalletContract =
	| WalletContractV3R1
	| WalletContractV3R2
	| WalletContractV4;

/**
 * Transfer parameters
 */
export interface TransferParams {
	to: Address | string;
	value: bigint;
	body?: Cell;
	bounce?: boolean;
	sendMode?: SendMode;
}

/**
 * Wallet info
 */
export interface WalletInfo {
	address: string;
	rawAddress: string;
	balance: string;
	seqno: number;
	state: 'active' | 'uninit' | 'frozen';
	walletVersion: string;
	publicKey: string;
	workchain: number;
	subwalletId: number;
}

/**
 * Send result
 */
export interface SendResult {
	success: boolean;
	hash?: string;
	lt?: string;
	error?: string;
}

/**
 * TON Wallet Client
 */
export class TonWalletClient {
	private client: TonClient;
	private apiClient: TonApiClient;
	private keyPair: KeyPair | null = null;
	private walletVersion: WalletVersion;
	private workchain: number;
	private subwalletId: number;
	private wallet: WalletContract | null = null;

	constructor(
		client: TonClient,
		apiClient: TonApiClient,
		options: {
			walletVersion?: WalletVersion;
			workchain?: number;
			subwalletId?: number;
		} = {},
	) {
		this.client = client;
		this.apiClient = apiClient;
		this.walletVersion = options.walletVersion || 'v4r2';
		this.workchain = options.workchain ?? 0;
		this.subwalletId = options.subwalletId ?? DEFAULT_SUBWALLET_IDS.MAINNET;
	}

	/**
	 * Initialize wallet from mnemonic
	 * Security: Mnemonic is never logged or stored in plain text
	 */
	async initFromMnemonic(mnemonic: string): Promise<void> {
		const words = mnemonic.trim().split(/\s+/);

		if (words.length !== 24) {
			throw new Error('Invalid mnemonic: expected 24 words');
		}

		const isValid = await mnemonicValidate(words);
		if (!isValid) {
			throw new Error('Invalid mnemonic phrase');
		}

		this.keyPair = await mnemonicToPrivateKey(words);
		this.wallet = this.createWalletContract(this.keyPair.publicKey);
	}

	/**
	 * Initialize wallet from keypair (for testing)
	 */
	initFromKeyPair(keyPair: KeyPair): void {
		this.keyPair = keyPair;
		this.wallet = this.createWalletContract(keyPair.publicKey);
	}

	/**
	 * Create a new wallet (generate mnemonic)
	 */
	static async generateNewWallet(): Promise<{
		mnemonic: string[];
		publicKey: string;
		secretKey: string;
	}> {
		const mnemonic = await mnemonicNew(24);
		const keyPair = await mnemonicToPrivateKey(mnemonic);

		return {
			mnemonic,
			publicKey: Buffer.from(keyPair.publicKey).toString('hex'),
			secretKey: Buffer.from(keyPair.secretKey).toString('hex'),
		};
	}

	/**
	 * Create wallet contract based on version
	 */
	private createWalletContract(publicKey: Buffer): WalletContract {
		switch (this.walletVersion) {
			case 'v3r1':
				return WalletContractV3R1.create({
					workchain: this.workchain,
					publicKey,
				});

			case 'v3r2':
				return WalletContractV3R2.create({
					workchain: this.workchain,
					publicKey,
				});

			case 'v4r1':
			case 'v4r2':
			default:
				return WalletContractV4.create({
					workchain: this.workchain,
					publicKey,
				});
		}
	}

	/**
	 * Get wallet address
	 */
	getAddress(): Address {
		if (!this.wallet) {
			throw new Error('Wallet not initialized. Call initFromMnemonic first.');
		}
		return this.wallet.address;
	}

	/**
	 * Get wallet address as string
	 */
	getAddressString(bounceable: boolean = true): string {
		return this.getAddress().toString({ bounceable });
	}

	/**
	 * Get wallet info
	 */
	async getWalletInfo(): Promise<WalletInfo> {
		if (!this.wallet || !this.keyPair) {
			throw new Error('Wallet not initialized');
		}

		const address = this.wallet.address;
		const state = await this.apiClient.getAccountInfo(address.toString());
		const seqno = await this.apiClient.getSeqno(address.toString());

		return {
			address: address.toString({ bounceable: true }),
			rawAddress: `${address.workChain}:${address.hash.toString('hex')}`,
			balance: state.balance,
			seqno,
			state: state.state as 'active' | 'uninit' | 'frozen',
			walletVersion: this.walletVersion,
			publicKey: Buffer.from(this.keyPair.publicKey).toString('hex'),
			workchain: this.workchain,
			subwalletId: this.subwalletId,
		};
	}

	/**
	 * Get wallet balance
	 */
	async getBalance(): Promise<string> {
		if (!this.wallet) {
			throw new Error('Wallet not initialized');
		}

		return await this.apiClient.getBalance(this.wallet.address.toString());
	}

	/**
	 * Get current seqno
	 */
	async getSeqno(): Promise<number> {
		if (!this.wallet) {
			throw new Error('Wallet not initialized');
		}

		return await this.apiClient.getSeqno(this.wallet.address.toString());
	}

	/**
	 * Check if wallet is deployed
	 */
	async isDeployed(): Promise<boolean> {
		if (!this.wallet) {
			throw new Error('Wallet not initialized');
		}

		const state = await this.apiClient.getAccountInfo(this.wallet.address.toString());
		return state.state === 'active';
	}

	/**
	 * Deploy wallet contract
	 */
	async deploy(): Promise<SendResult> {
		if (!this.wallet || !this.keyPair) {
			throw new Error('Wallet not initialized');
		}

		const isDeployed = await this.isDeployed();
		if (isDeployed) {
			return {
				success: true,
				error: 'Wallet already deployed',
			};
		}

		// Create deploy message
		const openedWallet = this.client.open(this.wallet);
		const seqno = 0;

		// Create transfer with state init
		const transfer = this.wallet.createTransfer({
			seqno,
			secretKey: this.keyPair.secretKey,
			messages: [],
		});

		// Send deployment message
		try {
			const boc = beginCell()
				.storeWritable(storeMessage(external({
					to: this.wallet.address,
					init: this.wallet.init,
					body: transfer,
				})))
				.endCell()
				.toBoc()
				.toString('base64');

			const result = await this.apiClient.sendBoc(boc);

			return {
				success: true,
				hash: result.hash,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	/**
	 * Send TON to an address
	 */
	async sendTon(
		to: string | Address,
		amount: bigint,
		options?: {
			comment?: string;
			body?: Cell;
			bounce?: boolean;
			sendMode?: SendMode;
		},
	): Promise<SendResult> {
		const toAddress = typeof to === 'string' ? Address.parse(to) : to;

		let body = options?.body;
		if (!body && options?.comment) {
			body = beginCell()
				.storeUint(0, 32)
				.storeStringTail(options.comment)
				.endCell();
		}

		return await this.sendTransfer({
			to: toAddress,
			value: amount,
			body,
			bounce: options?.bounce ?? true,
			sendMode: options?.sendMode,
		});
	}

	/**
	 * Send transfer
	 */
	async sendTransfer(params: TransferParams): Promise<SendResult> {
		return await this.sendMultipleTransfers([params]);
	}

	/**
	 * Send multiple transfers in one transaction
	 */
	async sendMultipleTransfers(transfers: TransferParams[]): Promise<SendResult> {
		if (!this.wallet || !this.keyPair) {
			throw new Error('Wallet not initialized');
		}

		const versionConfig = getWalletVersionConfig(this.walletVersion);
		if (transfers.length > (versionConfig?.maxMessages || 4)) {
			throw new Error(`Wallet ${this.walletVersion} supports max ${versionConfig?.maxMessages || 4} messages`);
		}

		try {
			const seqno = await this.getSeqno();

			// Build internal messages
			const messages: MessageRelaxed[] = transfers.map(transfer => {
				const to = typeof transfer.to === 'string' ? Address.parse(transfer.to) : transfer.to;

				return internal({
					to,
					value: transfer.value,
					body: transfer.body,
					bounce: transfer.bounce ?? true,
				});
			});

			// Create signed transfer
			const transfer = this.wallet.createTransfer({
				seqno,
				secretKey: this.keyPair.secretKey,
				messages,
				sendMode: transfers[0]?.sendMode ?? SendMode.PAY_GAS_SEPARATELY,
			});

			// Create external message
			const extMessage = external({
				to: this.wallet.address,
				init: seqno === 0 ? this.wallet.init : undefined,
				body: transfer,
			});

			const boc = beginCell()
				.storeWritable(storeMessage(extMessage))
				.endCell()
				.toBoc()
				.toString('base64');

			// Send message
			const result = await this.apiClient.sendBoc(boc);

			return {
				success: true,
				hash: result.hash,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	/**
	 * Estimate transfer fee
	 */
	async estimateFee(params: TransferParams): Promise<{
		totalFee: string;
		inFwdFee: string;
		storageFee: string;
		gasFee: string;
		fwdFee: string;
	}> {
		if (!this.wallet || !this.keyPair) {
			throw new Error('Wallet not initialized');
		}

		const to = typeof params.to === 'string' ? Address.parse(params.to) : params.to;

		const message = internal({
			to,
			value: params.value,
			body: params.body,
			bounce: params.bounce ?? true,
		});

		const seqno = await this.getSeqno();

		const transfer = this.wallet.createTransfer({
			seqno,
			secretKey: this.keyPair.secretKey,
			messages: [message],
		});

		const body = transfer.toBoc().toString('base64');

		const fees = await this.apiClient.estimateFee(
			this.wallet.address.toString(),
			body,
		);

		const totalFee = (
			BigInt(fees.inFwdFee) +
			BigInt(fees.storageFee) +
			BigInt(fees.gasFee) +
			BigInt(fees.fwdFee)
		).toString();

		return {
			totalFee,
			...fees,
		};
	}

	/**
	 * Sign a message (for external use)
	 */
	signMessage(message: Cell): Buffer {
		if (!this.keyPair) {
			throw new Error('Wallet not initialized');
		}

		const { sign } = require('@ton/crypto');
		return sign(message.hash(), this.keyPair.secretKey);
	}

	/**
	 * Get public key
	 */
	getPublicKey(): string {
		if (!this.keyPair) {
			throw new Error('Wallet not initialized');
		}

		return Buffer.from(this.keyPair.publicKey).toString('hex');
	}

	/**
	 * Validate mnemonic
	 */
	static async validateMnemonic(mnemonic: string): Promise<boolean> {
		const words = mnemonic.trim().split(/\s+/);
		if (words.length !== 24) {
			return false;
		}
		return await mnemonicValidate(words);
	}

	/**
	 * Get address from mnemonic without full initialization
	 */
	static async getAddressFromMnemonic(
		mnemonic: string,
		options?: {
			walletVersion?: WalletVersion;
			workchain?: number;
		},
	): Promise<{
		address: string;
		rawAddress: string;
		publicKey: string;
	}> {
		const words = mnemonic.trim().split(/\s+/);
		const keyPair = await mnemonicToPrivateKey(words);

		const walletVersion = options?.walletVersion || 'v4r2';
		const workchain = options?.workchain ?? 0;

		let wallet: WalletContract;

		switch (walletVersion) {
			case 'v3r1':
				wallet = WalletContractV3R1.create({ workchain, publicKey: keyPair.publicKey });
				break;
			case 'v3r2':
				wallet = WalletContractV3R2.create({ workchain, publicKey: keyPair.publicKey });
				break;
			case 'v4r1':
			case 'v4r2':
			default:
				wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
		}

		return {
			address: wallet.address.toString({ bounceable: true }),
			rawAddress: `${wallet.address.workChain}:${wallet.address.hash.toString('hex')}`,
			publicKey: Buffer.from(keyPair.publicKey).toString('hex'),
		};
	}
}

/**
 * Create wallet client from credentials
 */
export async function createWalletClient(
	credentials: ICredentialDataDecryptedObject,
): Promise<TonWalletClient> {
	const client = await createTonClient(credentials);
	const apiClient = createApiClient(credentials);

	const walletClient = new TonWalletClient(client, apiClient, {
		walletVersion: credentials.walletVersion as WalletVersion,
		workchain: credentials.workchain as number,
		subwalletId: credentials.subwalletId as number,
	});

	// Initialize from mnemonic if provided
	if (credentials.enableWallet && credentials.mnemonic) {
		await walletClient.initFromMnemonic(credentials.mnemonic as string);
	}

	return walletClient;
}

// Convenience exports for direct access
export const generateMnemonic = () => TonWalletClient.generateNewWallet();
export const validateMnemonic = (mnemonic: string) => TonWalletClient.validateMnemonic(mnemonic);
export const getAddressFromMnemonic = TonWalletClient.getAddressFromMnemonic;

// WalletClient alias
export { TonWalletClient as WalletClient };
