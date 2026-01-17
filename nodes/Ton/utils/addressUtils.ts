/**
 * TON Address Utilities
 *
 * Functions for working with TON addresses including:
 * - Format conversion (raw, user-friendly, bounceable, non-bounceable)
 * - Validation
 * - Parsing and encoding
 *
 * @see https://docs.ton.org/learn/overviews/addresses
 */

import { Address } from '@ton/core';

/**
 * Address format types
 */
export type AddressFormat = 'raw' | 'bounceable' | 'nonBounceable' | 'testOnly';

/**
 * Parsed address information
 */
export interface ParsedAddress {
	workchain: number;
	hash: Buffer;
	isBounceable: boolean;
	isTestOnly: boolean;
	raw: string;
	bounceable: string;
	nonBounceable: string;
}

/**
 * Validate if a string is a valid TON address
 */
export function isValidAddress(address: string): boolean {
	try {
		Address.parse(address);
		return true;
	} catch {
		return false;
	}
}

/**
 * Parse a TON address string into an Address object
 */
export function parseAddress(address: string): Address {
	return Address.parse(address);
}

/**
 * Parse address and return detailed information
 */
export function parseAddressInfo(address: string): ParsedAddress {
	const addr = Address.parse(address);

	return {
		workchain: addr.workChain,
		hash: addr.hash,
		isBounceable: true, // Default from parsed
		isTestOnly: false,
		raw: toRawAddress(addr),
		bounceable: toBounceableAddress(addr),
		nonBounceable: toNonBounceableAddress(addr),
	};
}

/**
 * Convert address to raw format (workchain:hex)
 */
export function toRawAddress(address: Address | string): string {
	const addr = typeof address === 'string' ? Address.parse(address) : address;
	return `${addr.workChain}:${addr.hash.toString('hex')}`;
}

/**
 * Convert address to bounceable user-friendly format (EQ...)
 */
export function toBounceableAddress(address: Address | string, testOnly: boolean = false): string {
	const addr = typeof address === 'string' ? Address.parse(address) : address;
	return addr.toString({ bounceable: true, testOnly });
}

/**
 * Convert address to non-bounceable user-friendly format (UQ...)
 */
export function toNonBounceableAddress(address: Address | string, testOnly: boolean = false): string {
	const addr = typeof address === 'string' ? Address.parse(address) : address;
	return addr.toString({ bounceable: false, testOnly });
}

/**
 * Convert address to the specified format
 */
export function convertAddress(address: string, format: AddressFormat, testOnly: boolean = false): string {
	const addr = Address.parse(address);

	switch (format) {
		case 'raw':
			return toRawAddress(addr);
		case 'bounceable':
			return toBounceableAddress(addr, testOnly);
		case 'nonBounceable':
			return toNonBounceableAddress(addr, testOnly);
		case 'testOnly':
			return addr.toString({ bounceable: true, testOnly: true });
		default:
			return addr.toString();
	}
}

/**
 * Create address from raw format (workchain:hex)
 */
export function fromRawAddress(raw: string): Address {
	const [workchainStr, hexHash] = raw.split(':');
	const workchain = parseInt(workchainStr, 10);
	const hash = Buffer.from(hexHash, 'hex');

	return new Address(workchain, hash);
}

/**
 * Check if address is in raw format
 */
export function isRawAddress(address: string): boolean {
	return /^-?\d+:[a-fA-F0-9]{64}$/.test(address);
}

/**
 * Check if address is user-friendly format
 */
export function isUserFriendlyAddress(address: string): boolean {
	// Base64 encoded, starts with E, U, k, or 0
	return /^[EUk0][A-Za-z0-9_-]{47}$/.test(address);
}

/**
 * Check if address is bounceable (starts with EQ or kQ for testnet)
 */
export function isBounceableAddress(address: string): boolean {
	return address.startsWith('EQ') || address.startsWith('kQ');
}

/**
 * Check if address is non-bounceable (starts with UQ or 0Q for testnet)
 */
export function isNonBounceableAddress(address: string): boolean {
	return address.startsWith('UQ') || address.startsWith('0Q');
}

/**
 * Check if address is testnet format
 */
export function isTestnetAddress(address: string): boolean {
	return address.startsWith('kQ') || address.startsWith('0Q');
}

/**
 * Get the workchain from an address
 */
export function getWorkchain(address: string): number {
	const addr = Address.parse(address);
	return addr.workChain;
}

/**
 * Check if address is on masterchain
 */
export function isMasterchainAddress(address: string): boolean {
	return getWorkchain(address) === -1;
}

/**
 * Check if address is on basechain
 */
export function isBasechainAddress(address: string): boolean {
	return getWorkchain(address) === 0;
}

/**
 * Compare two addresses for equality
 */
export function addressEquals(addr1: string, addr2: string): boolean {
	try {
		const a1 = Address.parse(addr1);
		const a2 = Address.parse(addr2);
		return a1.equals(a2);
	} catch {
		return false;
	}
}

/**
 * Normalize address to a standard format for comparison
 */
export function normalizeAddress(address: string): string {
	try {
		const addr = Address.parse(address);
		return addr.toString({ bounceable: true, testOnly: false });
	} catch {
		return address;
	}
}

/**
 * Create a zero address for a workchain
 */
export function zeroAddress(workchain: number = 0): Address {
	return new Address(workchain, Buffer.alloc(32, 0));
}

/**
 * Get address hash as hex string
 */
export function getAddressHash(address: string): string {
	const addr = Address.parse(address);
	return addr.hash.toString('hex');
}

/**
 * Format address for display (shortened)
 */
export function shortenAddress(address: string, chars: number = 4): string {
	const userFriendly = normalizeAddress(address);
	if (userFriendly.length <= chars * 2 + 3) {
		return userFriendly;
	}
	return `${userFriendly.slice(0, chars + 2)}...${userFriendly.slice(-chars)}`;
}

/**
 * Get explorer URL for an address
 */
export function getExplorerUrl(address: string, network: string = 'mainnet', type: 'address' | 'tx' = 'address'): string {
	const baseUrl = network === 'testnet' ? 'https://testnet.tonviewer.com' : 'https://tonviewer.com';
	return type === 'tx' ? `${baseUrl}/transaction/${address}` : `${baseUrl}/${address}`;
}

/**
 * Alias for convertAddress for backward compatibility
 */
export function convertAddressFormat(address: string, format: AddressFormat, testOnly: boolean = false): string {
	return convertAddress(address, format, testOnly);
}
