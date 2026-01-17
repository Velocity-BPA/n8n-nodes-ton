/**
 * TON Cell Utilities
 *
 * Functions for working with TON Cells and BOC (Bag of Cells) format.
 * Cells are the fundamental data structure in TON for storing data and code.
 *
 * @see https://docs.ton.org/develop/data-formats/cell-boc
 */

import { Cell, Builder, Slice, beginCell, Address } from '@ton/core';

/**
 * Cell information structure
 */
export interface CellInfo {
	bitsLength: number;
	refsCount: number;
	hash: string;
	depth: number;
	type: 'ordinary' | 'merkle_proof' | 'merkle_update' | 'pruned';
}

/**
 * Parse BOC (Bag of Cells) from hex string
 */
export function parseBocHex(bocHex: string): Cell {
	const buffer = Buffer.from(bocHex, 'hex');
	return Cell.fromBoc(buffer)[0];
}

/**
 * Parse BOC from base64 string
 */
export function parseBocBase64(bocBase64: string): Cell {
	const buffer = Buffer.from(bocBase64, 'base64');
	return Cell.fromBoc(buffer)[0];
}

/**
 * Convert Cell to BOC hex string
 */
export function cellToBocHex(cell: Cell): string {
	return cell.toBoc().toString('hex');
}

/**
 * Convert Cell to BOC base64 string
 */
export function cellToBocBase64(cell: Cell): string {
	return cell.toBoc().toString('base64');
}

/**
 * Get cell information
 */
export function getCellInfo(cell: Cell): CellInfo {
	const slice = cell.beginParse();

	return {
		bitsLength: slice.remainingBits,
		refsCount: slice.remainingRefs,
		hash: cell.hash().toString('hex'),
		depth: cell.depth(),
		type: 'ordinary', // Would need more inspection for exotic cells
	};
}

/**
 * Create an empty cell
 */
export function emptyCell(): Cell {
	return beginCell().endCell();
}

/**
 * Create a cell containing a text comment
 */
export function createCommentCell(comment: string): Cell {
	return beginCell()
		.storeUint(0, 32) // op = 0 for comment
		.storeStringTail(comment)
		.endCell();
}

/**
 * Decode a comment from a cell
 */
export function decodeComment(cell: Cell): string | null {
	try {
		const slice = cell.beginParse();
		const op = slice.loadUint(32);

		// Comment messages have op = 0
		if (op !== 0) {
			return null;
		}

		return slice.loadStringTail();
	} catch {
		return null;
	}
}

/**
 * Create a cell with an address
 */
export function createAddressCell(address: string | Address): Cell {
	const addr = typeof address === 'string' ? Address.parse(address) : address;
	return beginCell().storeAddress(addr).endCell();
}

/**
 * Create a cell with coins amount
 */
export function createCoinsCell(amount: bigint): Cell {
	return beginCell().storeCoins(amount).endCell();
}

/**
 * Create a state init cell for contract deployment
 */
export function createStateInit(code: Cell, data: Cell): Cell {
	return beginCell()
		.storeBit(0) // split_depth
		.storeBit(0) // special
		.storeBit(1) // code present
		.storeBit(1) // data present
		.storeBit(0) // library
		.storeRef(code)
		.storeRef(data)
		.endCell();
}

/**
 * Parse state init cell
 */
export function parseStateInit(cell: Cell): { code: Cell | null; data: Cell | null } {
	const slice = cell.beginParse();

	slice.loadBit(); // split_depth
	slice.loadBit(); // special

	const hasCode = slice.loadBit();
	const hasData = slice.loadBit();
	slice.loadBit(); // library

	const code = hasCode ? slice.loadRef() : null;
	const data = hasData ? slice.loadRef() : null;

	return { code, data };
}

/**
 * Calculate cell hash
 */
export function calculateCellHash(cell: Cell): string {
	return cell.hash().toString('hex');
}

/**
 * Build a cell from parts using a builder function
 */
export function buildCell(builderFn: (builder: Builder) => void): Cell {
	const builder = beginCell();
	builderFn(builder);
	return builder.endCell();
}

/**
 * Read data from a cell using a reader function
 */
export function readCell<T>(cell: Cell, readerFn: (slice: Slice) => T): T {
	const slice = cell.beginParse();
	return readerFn(slice);
}

/**
 * Serialize data to BOC hex
 */
export function serializeToBoc(builderFn: (builder: Builder) => void): string {
	const cell = buildCell(builderFn);
	return cellToBocHex(cell);
}

/**
 * Count total cells in a cell tree
 */
export function countCells(cell: Cell): number {
	let count = 1;
	const refs = cell.refs;
	for (const ref of refs) {
		count += countCells(ref);
	}
	return count;
}

/**
 * Estimate storage size in bits
 */
export function estimateStorageSize(cell: Cell): number {
	let totalBits = cell.bits.length;
	const refs = cell.refs;
	for (const ref of refs) {
		totalBits += estimateStorageSize(ref);
	}
	return totalBits;
}

/**
 * Compare two cells for equality
 */
export function cellsEqual(cell1: Cell, cell2: Cell): boolean {
	return cell1.hash().equals(cell2.hash());
}

/**
 * Store a dictionary in a cell
 */
export function storeDictionary(
	dict: Map<bigint, Cell>,
	keySize: number,
): Cell {
	const builder = beginCell();

	// This is a simplified version - actual dict encoding is more complex
	// For production use, utilize @ton/core's Dictionary class

	if (dict.size === 0) {
		builder.storeBit(0); // empty dict
	} else {
		builder.storeBit(1); // non-empty dict
		// Would need proper dict cell encoding here
	}

	return builder.endCell();
}

/**
 * Create a cell storing arbitrary bytes
 */
export function bytesToCell(bytes: Buffer): Cell {
	const builder = beginCell();

	// Split into chunks of ~127 bytes (1023 bits max per cell)
	const chunkSize = 127;

	if (bytes.length <= chunkSize) {
		builder.storeBuffer(bytes);
		return builder.endCell();
	}

	// For larger data, chain cells
	builder.storeBuffer(bytes.slice(0, chunkSize));
	builder.storeRef(bytesToCell(bytes.slice(chunkSize)));

	return builder.endCell();
}

/**
 * Extract bytes from a cell chain
 */
export function cellToBytes(cell: Cell): Buffer {
	const slice = cell.beginParse();
	const buffers: Buffer[] = [];

	// Read all bits as buffer
	const bitsLeft = slice.remainingBits;
	if (bitsLeft > 0) {
		const bytes = Math.floor(bitsLeft / 8);
		if (bytes > 0) {
			buffers.push(slice.loadBuffer(bytes));
		}
	}

	// Read refs recursively
	while (slice.remainingRefs > 0) {
		const ref = slice.loadRef();
		buffers.push(cellToBytes(ref));
	}

	return Buffer.concat(buffers);
}

/**
 * Pretty print cell structure for debugging
 */
export function prettyPrintCell(cell: Cell, indent: number = 0): string {
	const prefix = '  '.repeat(indent);
	const slice = cell.beginParse();

	let output = `${prefix}Cell[bits=${slice.remainingBits}, refs=${slice.remainingRefs}]\n`;
	output += `${prefix}  hash: ${cell.hash().toString('hex').slice(0, 16)}...\n`;

	const refs = cell.refs;
	for (let i = 0; i < refs.length; i++) {
		output += `${prefix}  ref[${i}]:\n`;
		output += prettyPrintCell(refs[i], indent + 2);
	}

	return output;
}

// Aliases for backward compatibility
export const bocToHex = cellToBocHex;
export const bocToBase64 = cellToBocBase64;
export const hexToBoc = parseBocHex;
export const base64ToBoc = parseBocBase64;
export const getCellHash = calculateCellHash;

/**
 * Get detailed cell statistics
 */
export function getCellStats(cell: Cell): {
	cells: number;
	bits: number;
	refs: number;
	hash: string;
	depth: number;
} {
	return {
		cells: countCells(cell),
		bits: estimateStorageSize(cell),
		refs: cell.refs.length,
		hash: calculateCellHash(cell),
		depth: cell.depth(),
	};
}
