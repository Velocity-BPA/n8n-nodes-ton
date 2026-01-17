/**
 * TON Unit Converter Utilities
 *
 * Functions for converting between TON units and handling
 * large number formatting.
 *
 * 1 TON = 10^9 nanoton (nano)
 */

import BigNumber from 'bignumber.js';

// Configure BigNumber for precise calculations
BigNumber.config({
	DECIMAL_PLACES: 18,
	ROUNDING_MODE: BigNumber.ROUND_DOWN,
	EXPONENTIAL_AT: [-30, 30],
});

/**
 * TON decimal places
 */
export const TON_DECIMALS = 9;
export const NANOTON_MULTIPLIER = new BigNumber(10).pow(TON_DECIMALS);

/**
 * Convert TON to nanoton (bigint)
 */
export function toNano(ton: string | number | BigNumber): bigint {
	const value = new BigNumber(ton);
	const nano = value.times(NANOTON_MULTIPLIER);
	return BigInt(nano.integerValue(BigNumber.ROUND_DOWN).toFixed());
}

/**
 * Convert nanoton to TON (string)
 */
export function fromNano(nanoton: bigint | string | number): string {
	const value = new BigNumber(nanoton.toString());
	return value.dividedBy(NANOTON_MULTIPLIER).toFixed();
}

/**
 * Convert nanoton to TON with specified decimal places
 */
export function fromNanoFormatted(nanoton: bigint | string | number, decimals: number = 4): string {
	const value = new BigNumber(nanoton.toString());
	return value.dividedBy(NANOTON_MULTIPLIER).toFixed(decimals);
}

/**
 * Convert between token units with custom decimals
 */
export function convertUnits(
	amount: string | number | bigint,
	fromDecimals: number,
	toDecimals: number,
): string {
	const value = new BigNumber(amount.toString());
	const multiplier = new BigNumber(10).pow(toDecimals - fromDecimals);
	return value.times(multiplier).toFixed();
}

/**
 * Convert human-readable amount to base units
 */
export function toBaseUnits(amount: string | number, decimals: number): bigint {
	const value = new BigNumber(amount);
	const multiplier = new BigNumber(10).pow(decimals);
	return BigInt(value.times(multiplier).integerValue(BigNumber.ROUND_DOWN).toFixed());
}

/**
 * Convert base units to human-readable amount
 */
export function fromBaseUnits(amount: bigint | string | number, decimals: number): string {
	const value = new BigNumber(amount.toString());
	const divisor = new BigNumber(10).pow(decimals);
	return value.dividedBy(divisor).toFixed();
}

/**
 * Format TON amount for display
 */
export function formatTon(nanoton: bigint | string | number, options?: {
	decimals?: number;
	showSymbol?: boolean;
	compact?: boolean;
}): string {
	const decimals = options?.decimals ?? 4;
	const showSymbol = options?.showSymbol ?? true;
	const compact = options?.compact ?? false;

	const value = new BigNumber(nanoton.toString()).dividedBy(NANOTON_MULTIPLIER);

	let formatted: string;
	if (compact) {
		formatted = formatCompact(value);
	} else {
		formatted = value.toFixed(decimals);
	}

	// Remove trailing zeros
	if (formatted.includes('.')) {
		formatted = formatted.replace(/\.?0+$/, '');
	}

	return showSymbol ? `${formatted} TON` : formatted;
}

/**
 * Format Jetton amount for display
 */
export function formatJetton(
	amount: bigint | string | number,
	decimals: number,
	symbol?: string,
	options?: { compact?: boolean },
): string {
	const value = new BigNumber(amount.toString()).dividedBy(new BigNumber(10).pow(decimals));

	let formatted: string;
	if (options?.compact) {
		formatted = formatCompact(value);
	} else {
		formatted = value.toFixed(Math.min(decimals, 6));
	}

	// Remove trailing zeros
	if (formatted.includes('.')) {
		formatted = formatted.replace(/\.?0+$/, '');
	}

	return symbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Format number in compact notation (K, M, B)
 */
function formatCompact(value: BigNumber): string {
	const abs = value.abs();

	if (abs.gte(1e9)) {
		return value.dividedBy(1e9).toFixed(2) + 'B';
	}
	if (abs.gte(1e6)) {
		return value.dividedBy(1e6).toFixed(2) + 'M';
	}
	if (abs.gte(1e3)) {
		return value.dividedBy(1e3).toFixed(2) + 'K';
	}

	return value.toFixed(2);
}

/**
 * Parse TON amount string to nanoton
 */
export function parseTonAmount(input: string): bigint {
	// Remove currency symbol and whitespace
	const cleaned = input.replace(/[TON\s,]/gi, '').trim();
	return toNano(cleaned);
}

/**
 * Validate amount string
 */
export function isValidAmount(amount: string): boolean {
	try {
		const value = new BigNumber(amount);
		return !value.isNaN() && value.isFinite() && value.gte(0);
	} catch {
		return false;
	}
}

/**
 * Compare two amounts
 */
export function compareAmounts(a: bigint | string, b: bigint | string): -1 | 0 | 1 {
	const valueA = new BigNumber(a.toString());
	const valueB = new BigNumber(b.toString());
	return valueA.comparedTo(valueB) as -1 | 0 | 1;
}

/**
 * Add amounts
 */
export function addAmounts(...amounts: (bigint | string)[]): bigint {
	let total = new BigNumber(0);
	for (const amount of amounts) {
		total = total.plus(amount.toString());
	}
	return BigInt(total.toFixed());
}

/**
 * Subtract amounts
 */
export function subtractAmounts(a: bigint | string, b: bigint | string): bigint {
	const result = new BigNumber(a.toString()).minus(b.toString());
	return BigInt(result.toFixed());
}

/**
 * Multiply amount by percentage
 */
export function multiplyByPercentage(amount: bigint | string, percentage: number): bigint {
	const result = new BigNumber(amount.toString()).times(percentage).dividedBy(100);
	return BigInt(result.integerValue(BigNumber.ROUND_DOWN).toFixed());
}

/**
 * Calculate percentage of amount
 */
export function calculatePercentage(amount: bigint | string, total: bigint | string): number {
	const amountBN = new BigNumber(amount.toString());
	const totalBN = new BigNumber(total.toString());

	if (totalBN.isZero()) {
		return 0;
	}

	return amountBN.dividedBy(totalBN).times(100).toNumber();
}

/**
 * Check if amount is zero
 */
export function isZero(amount: bigint | string): boolean {
	return new BigNumber(amount.toString()).isZero();
}

/**
 * Get minimum of amounts
 */
export function minAmount(...amounts: (bigint | string)[]): bigint {
	let min = new BigNumber(amounts[0].toString());
	for (let i = 1; i < amounts.length; i++) {
		const current = new BigNumber(amounts[i].toString());
		if (current.lt(min)) {
			min = current;
		}
	}
	return BigInt(min.toFixed());
}

/**
 * Get maximum of amounts
 */
export function maxAmount(...amounts: (bigint | string)[]): bigint {
	let max = new BigNumber(amounts[0].toString());
	for (let i = 1; i < amounts.length; i++) {
		const current = new BigNumber(amounts[i].toString());
		if (current.gt(max)) {
			max = current;
		}
	}
	return BigInt(max.toFixed());
}

/**
 * Convert gas price to human readable format
 */
export function formatGasPrice(gasPriceNano: bigint | string): string {
	const value = new BigNumber(gasPriceNano.toString());
	const ton = value.dividedBy(NANOTON_MULTIPLIER);

	if (ton.lt(0.001)) {
		return `${value.toFixed()} nanoTON`;
	}

	return `${ton.toFixed(6)} TON`;
}

/**
 * Estimate storage fee in TON
 */
export function estimateStorageFee(
	cells: number,
	bits: number,
	durationDays: number,
): bigint {
	// Simplified estimation - actual calculation depends on network config
	const cellFeePerDay = 1000n; // nanoton per cell per day
	const bitFeePerDay = 1n; // nanoton per bit per day

	const cellFee = BigInt(cells) * cellFeePerDay * BigInt(durationDays);
	const bitFee = BigInt(bits) * bitFeePerDay * BigInt(durationDays);

	return cellFee + bitFee;
}

/**
 * Format USD value
 */
export function formatUsd(amount: number, decimals: number = 2): string {
	return `$${amount.toFixed(decimals)}`;
}

/**
 * Convert TON to USD (requires price)
 */
export function tonToUsd(nanoton: bigint | string, tonPriceUsd: number): string {
	const ton = new BigNumber(nanoton.toString()).dividedBy(NANOTON_MULTIPLIER);
	const usd = ton.times(tonPriceUsd);
	return formatUsd(usd.toNumber());
}

// Aliases for backward compatibility
export const toNanoton = toNano;
export const fromNanoton = fromNano;
export const parseAmount = parseTonAmount;
export const formatJettonAmount = formatJetton;

/**
 * Calculate staking rewards based on APY and duration
 */
export function calculateStakingRewards(
	stakedAmountNano: bigint | string,
	apyPercent: number,
	durationDays: number,
): bigint {
	const amount = new BigNumber(stakedAmountNano.toString());
	const dailyRate = apyPercent / 365 / 100;
	const rewards = amount.times(dailyRate).times(durationDays);
	return BigInt(rewards.integerValue(BigNumber.ROUND_DOWN).toFixed());
}

// Convenience aliases
export const nanoToTon = fromNano;
export const tonToNano = toNano;
