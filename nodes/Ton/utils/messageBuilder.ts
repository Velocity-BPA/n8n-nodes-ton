/**
 * TON Message Builder Utilities
 *
 * Functions for building internal and external messages
 * for TON blockchain transactions.
 *
 * @see https://docs.ton.org/develop/smart-contracts/messages
 */

import {
	Address,
	Cell,
	beginCell,
	storeMessage,
	MessageRelaxed,
	Message,
	internal,
	external,
	SendMode,
	StateInit,
} from '@ton/core';

/**
 * Message types
 */
export type MessageType = 'internal' | 'external_in' | 'external_out';

/**
 * Internal message parameters
 */
export interface InternalMessageParams {
	to: Address | string;
	value: bigint;
	bounce?: boolean;
	body?: Cell;
	stateInit?: StateInit;
	sendMode?: SendMode;
}

/**
 * External message parameters
 */
export interface ExternalMessageParams {
	to: Address | string;
	body?: Cell;
	stateInit?: StateInit;
}

/**
 * Transfer message parameters
 */
export interface TransferParams {
	to: Address | string;
	value: bigint;
	bounce?: boolean;
	comment?: string;
	body?: Cell;
}

/**
 * Jetton transfer parameters
 */
export interface JettonTransferParams {
	jettonWalletAddress: Address | string;
	to: Address | string;
	jettonAmount: bigint;
	responseAddress?: Address | string;
	forwardTonAmount?: bigint;
	forwardPayload?: Cell;
	queryId?: bigint;
}

/**
 * NFT transfer parameters
 */
export interface NftTransferParams {
	nftAddress: Address | string;
	newOwner: Address | string;
	responseAddress?: Address | string;
	forwardAmount?: bigint;
	forwardPayload?: Cell;
	queryId?: bigint;
}

/**
 * Build an internal message
 */
export function buildInternalMessage(params: InternalMessageParams): MessageRelaxed {
	const to = typeof params.to === 'string' ? Address.parse(params.to) : params.to;

	return internal({
		to,
		value: params.value,
		bounce: params.bounce ?? true,
		body: params.body,
		init: params.stateInit,
	});
}

/**
 * Build an external message
 */
export function buildExternalMessage(params: ExternalMessageParams): Message {
	const to = typeof params.to === 'string' ? Address.parse(params.to) : params.to;

	return external({
		to,
		body: params.body,
		init: params.stateInit,
	});
}

/**
 * Build a simple transfer message
 */
export function buildTransferMessage(params: TransferParams): MessageRelaxed {
	const to = typeof params.to === 'string' ? Address.parse(params.to) : params.to;

	let body = params.body;
	if (!body && params.comment) {
		body = buildCommentBody(params.comment);
	}

	return internal({
		to,
		value: params.value,
		bounce: params.bounce ?? true,
		body,
	});
}

/**
 * Build a comment body cell
 */
export function buildCommentBody(comment: string): Cell {
	return beginCell()
		.storeUint(0, 32) // op = 0 for text comment
		.storeStringTail(comment)
		.endCell();
}

/**
 * Build Jetton transfer body
 */
export function buildJettonTransferBody(params: {
	to: Address | string;
	amount: bigint;
	responseAddress?: Address | string;
	forwardTonAmount?: bigint;
	forwardPayload?: Cell;
	queryId?: bigint;
}): Cell {
	const to = typeof params.to === 'string' ? Address.parse(params.to) : params.to;
	const responseAddr = params.responseAddress
		? (typeof params.responseAddress === 'string' ? Address.parse(params.responseAddress) : params.responseAddress)
		: to;

	const builder = beginCell()
		.storeUint(0xf8a7ea5, 32) // Jetton transfer op
		.storeUint(params.queryId ?? 0n, 64) // query_id
		.storeCoins(params.amount) // jetton amount
		.storeAddress(to) // destination
		.storeAddress(responseAddr) // response_destination
		.storeBit(0) // no custom_payload
		.storeCoins(params.forwardTonAmount ?? 0n); // forward_ton_amount

	// Forward payload
	if (params.forwardPayload) {
		builder.storeBit(1).storeRef(params.forwardPayload);
	} else {
		builder.storeBit(0);
	}

	return builder.endCell();
}

/**
 * Build NFT transfer body
 */
export function buildNftTransferBody(params: {
	newOwner: Address | string;
	responseAddress?: Address | string;
	forwardAmount?: bigint;
	forwardPayload?: Cell;
	queryId?: bigint;
}): Cell {
	const newOwner = typeof params.newOwner === 'string' ? Address.parse(params.newOwner) : params.newOwner;
	const responseAddr = params.responseAddress
		? (typeof params.responseAddress === 'string' ? Address.parse(params.responseAddress) : params.responseAddress)
		: newOwner;

	const builder = beginCell()
		.storeUint(0x5fcc3d14, 32) // NFT transfer op
		.storeUint(params.queryId ?? 0n, 64) // query_id
		.storeAddress(newOwner) // new_owner
		.storeAddress(responseAddr) // response_destination
		.storeBit(0) // no custom_payload
		.storeCoins(params.forwardAmount ?? 0n); // forward_amount

	// Forward payload
	if (params.forwardPayload) {
		builder.storeBit(1).storeRef(params.forwardPayload);
	} else {
		builder.storeBit(0);
	}

	return builder.endCell();
}

/**
 * Build Jetton burn body
 */
export function buildJettonBurnBody(params: {
	amount: bigint;
	responseAddress?: Address | string;
	queryId?: bigint;
}): Cell {
	const builder = beginCell()
		.storeUint(0x595f07bc, 32) // Jetton burn op
		.storeUint(params.queryId ?? 0n, 64) // query_id
		.storeCoins(params.amount); // amount

	if (params.responseAddress) {
		const addr = typeof params.responseAddress === 'string'
			? Address.parse(params.responseAddress)
			: params.responseAddress;
		builder.storeAddress(addr);
	}

	return builder.endCell();
}

/**
 * Serialize message to BOC
 */
export function serializeMessage(message: MessageRelaxed | Message): Cell {
	// Use type assertion to handle type variance
	return beginCell().store(storeMessage(message as unknown as Message)).endCell();
}

/**
 * Get message hash
 */
export function getMessageHash(message: MessageRelaxed | Message): string {
	return serializeMessage(message).hash().toString('hex');
}

/**
 * Build state init for contract deployment
 */
export function buildStateInit(code: Cell, data: Cell): StateInit {
	return {
		code,
		data,
	};
}

/**
 * Calculate deployed contract address
 */
export function calculateContractAddress(workchain: number, stateInit: StateInit): Address {
	const stateInitCell = beginCell()
		.storeBit(0) // split_depth
		.storeBit(0) // special
		.storeBit(1) // code present
		.storeBit(1) // data present
		.storeBit(0) // library
		.storeRef(stateInit.code!)
		.storeRef(stateInit.data!)
		.endCell();

	const hash = stateInitCell.hash();
	return new Address(workchain, hash);
}

/**
 * Send modes for messages
 */
export const SEND_MODES = {
	/** Pay fees separately */
	PAY_GAS_SEPARATELY: SendMode.PAY_GAS_SEPARATELY,
	/** Ignore errors */
	IGNORE_ERRORS: SendMode.IGNORE_ERRORS,
	/** Carry all remaining value */
	CARRY_ALL_REMAINING_BALANCE: SendMode.CARRY_ALL_REMAINING_BALANCE,
	/** Carry all remaining incoming value */
	CARRY_ALL_REMAINING_INCOMING_VALUE: SendMode.CARRY_ALL_REMAINING_INCOMING_VALUE,
	/** Normal mode - default */
	NORMAL: 0,
	/** Mode 128: destroy if zero (manual value since it may not be exported) */
	DESTROY_IF_ZERO: 32,
} as const;

/**
 * Build multiple messages for batch send
 */
export function buildBatchMessages(transfers: TransferParams[]): MessageRelaxed[] {
	return transfers.map(transfer => buildTransferMessage(transfer));
}

/**
 * Generate a random query ID
 */
export function generateQueryId(): bigint {
	return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
}

/**
 * Build deploy message with state init
 */
export function buildDeployMessage(params: {
	to: Address | string;
	value: bigint;
	code: Cell;
	data: Cell;
	body?: Cell;
}): MessageRelaxed {
	const to = typeof params.to === 'string' ? Address.parse(params.to) : params.to;
	const stateInit = buildStateInit(params.code, params.data);

	return internal({
		to,
		value: params.value,
		bounce: false, // Don't bounce deploy messages
		init: stateInit,
		body: params.body,
	});
}

/**
 * Encode message body for get method call (off-chain)
 */
export function encodeGetMethodCall(method: string, args: Array<bigint | Cell | Address>): Cell {
	const builder = beginCell();

	// Method name hash (simplified - real implementation uses crc32)
	const methodHash = BigInt('0x' + Buffer.from(method).toString('hex').slice(0, 8));
	builder.storeUint(methodHash, 32);

	// Store arguments (simplified)
	for (const arg of args) {
		if (typeof arg === 'bigint') {
			builder.storeInt(arg, 257);
		} else if (arg instanceof Address) {
			builder.storeAddress(arg);
		} else if (arg instanceof Cell) {
			builder.storeRef(arg);
		}
	}

	return builder.endCell();
}
