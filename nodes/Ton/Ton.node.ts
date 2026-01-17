/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * TON Node
 *
 * Main n8n action node for TON (The Open Network) blockchain operations.
 * Provides comprehensive access to wallet, transaction, Jetton, NFT,
 * smart contract, DNS, staking, DEX, and network operations.
 *
 * @see https://docs.ton.org/
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Import resource handlers
import * as wallet from './actions/wallet';
import * as transaction from './actions/transaction';
import * as jetton from './actions/jetton';
import * as nft from './actions/nft';
import * as contract from './actions/contract';
import * as dns from './actions/dns';
import * as subscription from './actions/subscription';
import * as staking from './actions/staking';
import * as dex from './actions/dex';
import * as block from './actions/block';

// Licensing notice - logged once per module load
const LICENSING_NOTICE_LOGGED = Symbol.for('n8n-nodes-ton.licensing.logged');
if (!(globalThis as Record<symbol, boolean>)[LICENSING_NOTICE_LOGGED]) {
	console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
	(globalThis as Record<symbol, boolean>)[LICENSING_NOTICE_LOGGED] = true;
}
import * as account from './actions/account';
import * as network from './actions/network';
import * as utility from './actions/utility';

/**
 * TON Node Implementation
 */
export class Ton implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TON',
		name: 'ton',
		icon: 'file:ton.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the TON (The Open Network) blockchain',
		defaults: {
			name: 'TON',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tonNetwork',
				required: true,
			},
		],
		properties: [
			// Resource Selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
						description: 'Account state and information operations',
					},
					{
						name: 'Block',
						value: 'block',
						description: 'Block and chain data operations',
					},
					{
						name: 'Contract',
						value: 'contract',
						description: 'Smart contract interactions',
					},
					{
						name: 'DEX',
						value: 'dex',
						description: 'Decentralized exchange operations (STON.fi, DeDust)',
					},
					{
						name: 'DNS',
						value: 'dns',
						description: 'TON DNS resolution and management',
					},
					{
						name: 'Jetton',
						value: 'jetton',
						description: 'Jetton (TON token) operations - TEP-74',
					},
					{
						name: 'Network',
						value: 'network',
						description: 'Network configuration and statistics',
					},
					{
						name: 'NFT',
						value: 'nft',
						description: 'NFT operations - TEP-62',
					},
					{
						name: 'Staking',
						value: 'staking',
						description: 'Staking and validator operations',
					},
					{
						name: 'Subscription',
						value: 'subscription',
						description: 'TON Payments subscription operations',
					},
					{
						name: 'Transaction',
						value: 'transaction',
						description: 'Transaction operations',
					},
					{
						name: 'Utility',
						value: 'utility',
						description: 'Utility functions (unit conversion, address format, etc.)',
					},
					{
						name: 'Wallet',
						value: 'wallet',
						description: 'Wallet management operations',
					},
				],
				default: 'wallet',
			},

			// =====================
			// WALLET Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['wallet'],
					},
				},
				options: [
					{ name: 'Convert Address', value: 'convertAddress', description: 'Convert address format', action: 'Convert address format' },
					{ name: 'Create Wallet', value: 'createWallet', description: 'Create/deploy a new wallet', action: 'Create deploy a new wallet' },
					{ name: 'Estimate Deploy Fee', value: 'estimateDeployFee', description: 'Estimate wallet deployment fee', action: 'Estimate wallet deployment fee' },
					{ name: 'Get Balance', value: 'getBalance', description: 'Get wallet TON balance', action: 'Get wallet TON balance' },
					{ name: 'Get Seqno', value: 'getSeqno', description: 'Get wallet sequence number', action: 'Get wallet sequence number' },
					{ name: 'Get Transactions', value: 'getTransactions', description: 'Get wallet transactions', action: 'Get wallet transactions' },
					{ name: 'Get Wallet Address', value: 'getWalletAddress', description: 'Get wallet address from mnemonic', action: 'Get wallet address from mnemonic' },
					{ name: 'Get Wallet Info', value: 'getWalletInfo', description: 'Get comprehensive wallet information', action: 'Get comprehensive wallet information' },
					{ name: 'Get Wallet Public Key', value: 'getWalletPublicKey', description: 'Get wallet public key', action: 'Get wallet public key' },
					{ name: 'Get Wallet State', value: 'getWalletState', description: 'Get wallet deployment state', action: 'Get wallet deployment state' },
					{ name: 'Get Wallet Type', value: 'getWalletType', description: 'Detect wallet contract version', action: 'Detect wallet contract version' },
					{ name: 'Validate Address', value: 'validateAddress', description: 'Validate a TON address', action: 'Validate a TON address' },
				],
				default: 'getBalance',
			},

			// =====================
			// TRANSACTION Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['transaction'],
					},
				},
				options: [
					{ name: 'Decode Transaction', value: 'decodeTransaction', description: 'Decode transaction details', action: 'Decode transaction details' },
					{ name: 'Estimate Fee', value: 'estimateFee', description: 'Estimate transaction fee', action: 'Estimate transaction fee' },
					{ name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction by hash or lt', action: 'Get transaction by hash or lt' },
					{ name: 'Get Transaction Status', value: 'getTransactionStatus', description: 'Check transaction confirmation status', action: 'Check transaction confirmation status' },
					{ name: 'Get Transactions', value: 'getTransactions', description: 'Get transactions for address', action: 'Get transactions for address' },
					{ name: 'Send Raw Message', value: 'sendRawMessage', description: 'Send a raw BOC message', action: 'Send a raw BOC message' },
					{ name: 'Send TON', value: 'sendTon', description: 'Send TON to an address', action: 'Send TON to an address' },
					{ name: 'Send TON with Comment', value: 'sendTonWithComment', description: 'Send TON with a text comment', action: 'Send TON with a text comment' },
					{ name: 'Wait for Transaction', value: 'waitForTransaction', description: 'Wait for transaction confirmation', action: 'Wait for transaction confirmation' },
				],
				default: 'sendTon',
			},

			// =====================
			// JETTON Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['jetton'],
					},
				},
				options: [
					{ name: 'Burn Jettons', value: 'burnJettons', description: 'Burn Jetton tokens', action: 'Burn jetton tokens' },
					{ name: 'Estimate Transfer Fee', value: 'estimateTransferFee', description: 'Estimate Jetton transfer fee', action: 'Estimate jetton transfer fee' },
					{ name: 'Get Jetton Balance', value: 'getJettonBalance', description: 'Get Jetton balance for wallet', action: 'Get jetton balance for wallet' },
					{ name: 'Get Jetton Holders', value: 'getJettonHolders', description: 'Get top Jetton holders', action: 'Get top jetton holders' },
					{ name: 'Get Jetton Info', value: 'getJettonInfo', description: 'Get Jetton master contract info', action: 'Get jetton master contract info' },
					{ name: 'Get Jetton Metadata', value: 'getJettonMetadata', description: 'Get Jetton metadata', action: 'Get jetton metadata' },
					{ name: 'Get Jetton Total Supply', value: 'getJettonTotalSupply', description: 'Get Jetton total supply', action: 'Get jetton total supply' },
					{ name: 'Get Jetton Transfers', value: 'getJettonTransfers', description: 'Get Jetton transfer history', action: 'Get jetton transfer history' },
					{ name: 'Get Jetton Wallet Address', value: 'getJettonWalletAddress', description: 'Get Jetton wallet address for owner', action: 'Get jetton wallet address for owner' },
					{ name: 'Transfer Jetton', value: 'transferJetton', description: 'Transfer Jetton tokens', action: 'Transfer jetton tokens' },
				],
				default: 'getJettonBalance',
			},

			// =====================
			// NFT Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['nft'],
					},
				},
				options: [
					{ name: 'Estimate Transfer Fee', value: 'estimateTransferFee', description: 'Estimate NFT transfer fee', action: 'Estimate NFT transfer fee' },
					{ name: 'Get Collection Info', value: 'getCollectionInfo', description: 'Get NFT collection information', action: 'Get NFT collection information' },
					{ name: 'Get Collection Items Count', value: 'getCollectionItemsCount', description: 'Get number of items in collection', action: 'Get number of items in collection' },
					{ name: 'Get NFT Attributes', value: 'getNftAttributes', description: 'Get NFT attributes/traits', action: 'Get NFT attributes traits' },
					{ name: 'Get NFT Image URL', value: 'getNftImageUrl', description: 'Get NFT image URL', action: 'Get NFT image URL' },
					{ name: 'Get NFT Item Info', value: 'getNftItemInfo', description: 'Get NFT item information', action: 'Get NFT item information' },
					{ name: 'Get NFT Metadata', value: 'getNftMetadata', description: 'Get NFT metadata', action: 'Get NFT metadata' },
					{ name: 'Get NFT Sale Info', value: 'getNftSaleInfo', description: 'Get NFT sale/listing information', action: 'Get NFT sale listing information' },
					{ name: 'Get NFTs by Owner', value: 'getNftsByOwner', description: 'Get NFTs owned by address', action: 'Get NFTs owned by address' },
					{ name: 'Get NFTs in Collection', value: 'getNftsInCollection', description: 'Get NFTs in a collection', action: 'Get NFTs in a collection' },
					{ name: 'Transfer NFT', value: 'transferNft', description: 'Transfer NFT to another address', action: 'Transfer NFT to another address' },
				],
				default: 'getNftItemInfo',
			},

			// =====================
			// CONTRACT Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contract'],
					},
				},
				options: [
					{ name: 'Deploy Contract', value: 'deployContract', description: 'Deploy a smart contract', action: 'Deploy a smart contract' },
					{ name: 'Estimate Execution Fee', value: 'estimateExecutionFee', description: 'Estimate contract execution fee', action: 'Estimate contract execution fee' },
					{ name: 'Get Contract Code', value: 'getContractCode', description: 'Get contract code', action: 'Get contract code' },
					{ name: 'Get Contract Data', value: 'getContractData', description: 'Get contract data', action: 'Get contract data' },
					{ name: 'Get Contract State', value: 'getContractState', description: 'Get contract state', action: 'Get contract state' },
					{ name: 'Get Contract Transactions', value: 'getContractTransactions', description: 'Get contract transactions', action: 'Get contract transactions' },
					{ name: 'Run Get Method', value: 'runGetMethod', description: 'Execute contract getter method', action: 'Execute contract getter method' },
					{ name: 'Send Internal Message', value: 'sendInternalMessage', description: 'Send internal message to contract', action: 'Send internal message to contract' },
					{ name: 'Send External Message', value: 'sendExternalMessage', description: 'Send external message to contract', action: 'Send external message to contract' },
					{ name: 'Simulate Message', value: 'simulateMessage', description: 'Simulate message execution', action: 'Simulate message execution' },
				],
				default: 'getContractState',
			},

			// =====================
			// DNS Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dns'],
					},
				},
				options: [
					{ name: 'Check Domain Availability', value: 'checkDomainAvailability', description: 'Check if domain is available', action: 'Check if domain is available' },
					{ name: 'Get All DNS Records', value: 'getAllDnsRecords', description: 'Get all DNS records for domain', action: 'Get all DNS records for domain' },
					{ name: 'Get Domain Expiry', value: 'getDomainExpiry', description: 'Get domain expiration date', action: 'Get domain expiration date' },
					{ name: 'Get Domain Info', value: 'getDomainInfo', description: 'Get domain information', action: 'Get domain information' },
					{ name: 'Get Domain Owner', value: 'getDomainOwner', description: 'Get domain owner address', action: 'Get domain owner address' },
					{ name: 'Get Domain Records', value: 'getDomainRecords', description: 'Get specific DNS records', action: 'Get specific DNS records' },
					{ name: 'Get Subdomains', value: 'getSubdomains', description: 'Get subdomains', action: 'Get subdomains' },
					{ name: 'Lookup Reverse DNS', value: 'lookupReverseDns', description: 'Lookup domain from address', action: 'Lookup domain from address' },
					{ name: 'Resolve Domain', value: 'resolveDomain', description: 'Resolve domain to address', action: 'Resolve domain to address' },
				],
				default: 'resolveDomain',
			},

			// =====================
			// SUBSCRIPTION Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['subscription'],
					},
				},
				options: [
					{ name: 'Get Payment Channel Info', value: 'getPaymentChannelInfo', description: 'Get payment channel information', action: 'Get payment channel information' },
					{ name: 'Get Subscription History', value: 'getSubscriptionHistory', description: 'Get subscription payment history', action: 'Get subscription payment history' },
					{ name: 'Get Subscription Info', value: 'getSubscriptionInfo', description: 'Get subscription details', action: 'Get subscription details' },
					{ name: 'Get Subscriptions', value: 'getSubscriptions', description: 'Get subscriptions for wallet', action: 'Get subscriptions for wallet' },
				],
				default: 'getSubscriptionInfo',
			},

			// =====================
			// STAKING Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['staking'],
					},
				},
				options: [
					{ name: 'Get Current Validator Set', value: 'getCurrentValidatorSet', description: 'Get current validators', action: 'Get current validators' },
					{ name: 'Get Elections Info', value: 'getElectionsInfo', description: 'Get validator elections info', action: 'Get validator elections info' },
					{ name: 'Get Nominator Pool Info', value: 'getNominatorPoolInfo', description: 'Get nominator pool info', action: 'Get nominator pool info' },
					{ name: 'Get Pending Deposits', value: 'getPendingDeposits', description: 'Get pending stake deposits', action: 'Get pending stake deposits' },
					{ name: 'Get Pending Withdrawals', value: 'getPendingWithdrawals', description: 'Get pending withdrawals', action: 'Get pending withdrawals' },
					{ name: 'Get Pool APY', value: 'getPoolApy', description: 'Get staking pool APY', action: 'Get staking pool APY' },
					{ name: 'Get Pool Info', value: 'getPoolInfo', description: 'Get staking pool information', action: 'Get staking pool information' },
					{ name: 'Get Staker Info', value: 'getStakerInfo', description: 'Get staker information', action: 'Get staker information' },
					{ name: 'Get Staking Pools', value: 'getStakingPools', description: 'Get available staking pools', action: 'Get available staking pools' },
					{ name: 'Get Staking Rewards', value: 'getStakingRewards', description: 'Get staking rewards', action: 'Get staking rewards' },
					{ name: 'Get Validators', value: 'getValidators', description: 'Get network validators', action: 'Get network validators' },
				],
				default: 'getStakingPools',
			},

			// =====================
			// DEX Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dex'],
					},
				},
				options: [
					{ name: 'Add Liquidity', value: 'addLiquidity', description: 'Add liquidity to pool', action: 'Add liquidity to pool' },
					{ name: 'Calculate Price Impact', value: 'calculatePriceImpact', description: 'Calculate swap price impact', action: 'Calculate swap price impact' },
					{ name: 'Execute Swap', value: 'executeSwap', description: 'Execute a token swap', action: 'Execute a token swap' },
					{ name: 'Get DEX Statistics', value: 'getDexStatistics', description: 'Get DEX statistics', action: 'Get DEX statistics' },
					{ name: 'Get Liquidity Pools', value: 'getLiquidityPools', description: 'Get available liquidity pools', action: 'Get available liquidity pools' },
					{ name: 'Get Pool Info', value: 'getPoolInfo', description: 'Get pool information', action: 'Get pool information' },
					{ name: 'Get Pool Reserves', value: 'getPoolReserves', description: 'Get pool reserves', action: 'Get pool reserves' },
					{ name: 'Get Swap Quote', value: 'getSwapQuote', description: 'Get swap price quote', action: 'Get swap price quote' },
					{ name: 'Get Token Price', value: 'getTokenPrice', description: 'Get token price', action: 'Get token price' },
					{ name: 'Remove Liquidity', value: 'removeLiquidity', description: 'Remove liquidity from pool', action: 'Remove liquidity from pool' },
				],
				default: 'getSwapQuote',
			},

			// =====================
			// BLOCK Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['block'],
					},
				},
				options: [
					{ name: 'Get Block by Unix Time', value: 'getBlockByUnixTime', description: 'Get block at specific timestamp', action: 'Get block at specific timestamp' },
					{ name: 'Get Block Header', value: 'getBlockHeader', description: 'Get block header information', action: 'Get block header information' },
					{ name: 'Get Block Transactions', value: 'getBlockTransactions', description: 'Get transactions in block', action: 'Get transactions in block' },
					{ name: 'Get Latest Block', value: 'getLatestBlock', description: 'Get latest block', action: 'Get latest block' },
					{ name: 'Get Masterchain Block', value: 'getMasterchainBlock', description: 'Get masterchain block', action: 'Get masterchain block' },
					{ name: 'Get Shardchain Block', value: 'getShardchainBlock', description: 'Get shardchain block', action: 'Get shardchain block' },
					{ name: 'Get Shards', value: 'getShards', description: 'Get shards for masterchain block', action: 'Get shards for masterchain block' },
					{ name: 'Lookup Block', value: 'lookupBlock', description: 'Lookup block by parameters', action: 'Lookup block by parameters' },
				],
				default: 'getLatestBlock',
			},

			// =====================
			// ACCOUNT Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['account'],
					},
				},
				options: [
					{ name: 'Check Account Active', value: 'checkAccountActive', description: 'Check if account is active', action: 'Check if account is active' },
					{ name: 'Get Account Balance', value: 'getAccountBalance', description: 'Get account balance', action: 'Get account balance' },
					{ name: 'Get Account Code Hash', value: 'getAccountCodeHash', description: 'Get account code hash', action: 'Get account code hash' },
					{ name: 'Get Account Last Activity', value: 'getAccountLastActivity', description: 'Get last activity timestamp', action: 'Get last activity timestamp' },
					{ name: 'Get Account State', value: 'getAccountState', description: 'Get full account state', action: 'Get full account state' },
					{ name: 'Get Account Transactions', value: 'getAccountTransactions', description: 'Get account transactions', action: 'Get account transactions' },
					{ name: 'Get Account Type', value: 'getAccountType', description: 'Get account type (wallet, contract, etc.)', action: 'Get account type wallet contract etc' },
				],
				default: 'getAccountState',
			},

			// =====================
			// NETWORK Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['network'],
					},
				},
				options: [
					{ name: 'Get Config Parameter', value: 'getConfigParameter', description: 'Get specific config parameter', action: 'Get specific config parameter' },
					{ name: 'Get Gas Prices', value: 'getGasPrices', description: 'Get current gas prices', action: 'Get current gas prices' },
					{ name: 'Get Global Config', value: 'getGlobalConfig', description: 'Get global network config', action: 'Get global network config' },
					{ name: 'Get Masterchain Info', value: 'getMasterchainInfo', description: 'Get masterchain information', action: 'Get masterchain information' },
					{ name: 'Get Network Config', value: 'getNetworkConfig', description: 'Get network configuration', action: 'Get network configuration' },
					{ name: 'Get Network Stats', value: 'getNetworkStats', description: 'Get network statistics', action: 'Get network statistics' },
					{ name: 'Get Storage Prices', value: 'getStoragePrices', description: 'Get current storage prices', action: 'Get current storage prices' },
					{ name: 'Get Validators', value: 'getValidators', description: 'Get validator list', action: 'Get validator list' },
					{ name: 'Get Workchain Info', value: 'getWorkchainInfo', description: 'Get workchain information', action: 'Get workchain information' },
				],
				default: 'getMasterchainInfo',
			},

			// =====================
			// UTILITY Operations
			// =====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['utility'],
					},
				},
				options: [
					{ name: 'BOC to Hex', value: 'bocToHex', description: 'Convert BOC to hex string', action: 'Convert BOC to hex string' },
					{ name: 'Calculate Address', value: 'calculateAddress', description: 'Calculate address from state init', action: 'Calculate address from state init' },
					{ name: 'Calculate Message Hash', value: 'calculateMessageHash', description: 'Calculate message hash', action: 'Calculate message hash' },
					{ name: 'Convert Address Format', value: 'convertAddressFormat', description: 'Convert between address formats', action: 'Convert between address formats' },
					{ name: 'Convert Nanoton to TON', value: 'convertNanotonToTon', description: 'Convert nanoton to TON', action: 'Convert nanoton to TON' },
					{ name: 'Convert TON to Nanoton', value: 'convertTonToNanoton', description: 'Convert TON to nanoton', action: 'Convert TON to nanoton' },
					{ name: 'Decode Comment', value: 'decodeComment', description: 'Decode transfer comment', action: 'Decode transfer comment' },
					{ name: 'Encode Comment', value: 'encodeComment', description: 'Encode transfer comment', action: 'Encode transfer comment' },
					{ name: 'Generate Mnemonic', value: 'generateMnemonic', description: 'Generate new wallet mnemonic', action: 'Generate new wallet mnemonic' },
					{ name: 'Get Address from Mnemonic', value: 'getAddressFromMnemonic', description: 'Get address from mnemonic', action: 'Get address from mnemonic' },
					{ name: 'Hex to BOC', value: 'hexToBoc', description: 'Convert hex string to BOC', action: 'Convert hex string to BOC' },
					{ name: 'Validate Mnemonic', value: 'validateMnemonic', description: 'Validate mnemonic phrase', action: 'Validate mnemonic phrase' },
				],
				default: 'convertNanotonToTon',
			},

			// =====================
			// Parameters for operations
			// =====================

			// Common address parameter
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'EQD...or 0:...',
				description: 'TON address (user-friendly or raw format)',
				displayOptions: {
					show: {
						resource: ['wallet', 'account', 'contract'],
						operation: [
							'getBalance', 'getWalletInfo', 'getWalletState', 'getSeqno', 'getTransactions',
							'getWalletType', 'getWalletPublicKey', 'validateAddress', 'convertAddress',
							'getAccountState', 'getAccountBalance', 'getAccountType', 'getAccountTransactions',
							'getAccountCodeHash', 'checkAccountActive', 'getAccountLastActivity',
							'getContractState', 'getContractCode', 'getContractData', 'runGetMethod',
							'sendInternalMessage', 'sendExternalMessage', 'getContractTransactions',
							'estimateExecutionFee', 'simulateMessage',
						],
					},
				},
			},

			// Destination address for transfers
			{
				displayName: 'To Address',
				name: 'toAddress',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'EQD...',
				description: 'Destination TON address',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['sendTon', 'sendTonWithComment', 'estimateFee'],
					},
				},
			},

			// Amount for transfers
			{
				displayName: 'Amount (TON)',
				name: 'amount',
				type: 'number',
				default: 0,
				required: true,
				typeOptions: {
					numberPrecision: 9,
					minValue: 0,
				},
				description: 'Amount in TON to send',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['sendTon', 'sendTonWithComment', 'estimateFee'],
					},
				},
			},

			// Comment for transfers
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Optional text comment for the transfer',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['sendTonWithComment'],
					},
				},
			},

			// Transaction hash
			{
				displayName: 'Transaction Hash',
				name: 'transactionHash',
				type: 'string',
				default: '',
				required: true,
				description: 'Transaction hash',
				displayOptions: {
					show: {
						resource: ['transaction'],
						operation: ['getTransaction', 'getTransactionStatus', 'waitForTransaction'],
					},
				},
			},

			// Jetton master address
			{
				displayName: 'Jetton Address',
				name: 'jettonAddress',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'EQC...',
				description: 'Jetton master contract address',
				displayOptions: {
					show: {
						resource: ['jetton'],
						operation: [
							'getJettonInfo', 'getJettonBalance', 'getJettonWalletAddress',
							'getJettonMetadata', 'getJettonTotalSupply', 'getJettonHolders',
							'transferJetton', 'burnJettons', 'getJettonTransfers',
							'estimateTransferFee',
						],
					},
				},
			},

			// Owner address for Jetton operations
			{
				displayName: 'Owner Address',
				name: 'ownerAddress',
				type: 'string',
				default: '',
				required: true,
				description: 'Wallet owner address',
				displayOptions: {
					show: {
						resource: ['jetton'],
						operation: ['getJettonBalance', 'getJettonWalletAddress', 'getJettonTransfers'],
					},
				},
			},

			// Jetton amount
			{
				displayName: 'Jetton Amount',
				name: 'jettonAmount',
				type: 'string',
				default: '',
				required: true,
				description: 'Amount of Jettons (in base units)',
				displayOptions: {
					show: {
						resource: ['jetton'],
						operation: ['transferJetton', 'burnJettons'],
					},
				},
			},

			// NFT address
			{
				displayName: 'NFT Address',
				name: 'nftAddress',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'EQC...',
				description: 'NFT item contract address',
				displayOptions: {
					show: {
						resource: ['nft'],
						operation: [
							'getNftItemInfo', 'getNftMetadata', 'getNftImageUrl',
							'getNftAttributes', 'getNftSaleInfo', 'transferNft',
							'estimateTransferFee',
						],
					},
				},
			},

			// NFT collection address
			{
				displayName: 'Collection Address',
				name: 'collectionAddress',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'EQC...',
				description: 'NFT collection contract address',
				displayOptions: {
					show: {
						resource: ['nft'],
						operation: ['getCollectionInfo', 'getNftsInCollection', 'getCollectionItemsCount'],
					},
				},
			},

			// DNS domain
			{
				displayName: 'Domain',
				name: 'domain',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'example.ton',
				description: 'TON DNS domain name',
				displayOptions: {
					show: {
						resource: ['dns'],
						operation: [
							'resolveDomain', 'getDomainInfo', 'getDomainRecords',
							'getSubdomains', 'checkDomainAvailability', 'getDomainOwner',
							'getDomainExpiry', 'getAllDnsRecords',
						],
					},
				},
			},

			// Staking pool address
			{
				displayName: 'Pool Address',
				name: 'poolAddress',
				type: 'string',
				default: '',
				required: true,
				description: 'Staking pool contract address',
				displayOptions: {
					show: {
						resource: ['staking'],
						operation: ['getPoolInfo', 'getPoolApy', 'getNominatorPoolInfo'],
					},
				},
			},

			// DEX selection
			{
				displayName: 'DEX',
				name: 'dex',
				type: 'options',
				default: 'stonfi',
				options: [
					{ name: 'STON.fi', value: 'stonfi' },
					{ name: 'DeDust', value: 'dedust' },
				],
				description: 'Decentralized exchange to use',
				displayOptions: {
					show: {
						resource: ['dex'],
					},
				},
			},

			// Token for DEX operations
			{
				displayName: 'From Token',
				name: 'fromToken',
				type: 'string',
				default: 'TON',
				description: 'Token to swap from (address or "TON")',
				displayOptions: {
					show: {
						resource: ['dex'],
						operation: ['getSwapQuote', 'executeSwap', 'calculatePriceImpact'],
					},
				},
			},
			{
				displayName: 'To Token',
				name: 'toToken',
				type: 'string',
				default: '',
				required: true,
				description: 'Token to swap to (Jetton address)',
				displayOptions: {
					show: {
						resource: ['dex'],
						operation: ['getSwapQuote', 'executeSwap', 'calculatePriceImpact'],
					},
				},
			},

			// Contract method
			{
				displayName: 'Method Name',
				name: 'methodName',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'get_wallet_data',
				description: 'Name of the contract getter method to call',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['runGetMethod'],
					},
				},
			},

			// Method arguments
			{
				displayName: 'Method Arguments',
				name: 'methodArgs',
				type: 'json',
				default: '[]',
				description: 'Arguments for the method call (JSON array)',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['runGetMethod'],
					},
				},
			},

			// Block seqno
			{
				displayName: 'Block Seqno',
				name: 'blockSeqno',
				type: 'number',
				default: 0,
				description: 'Block sequence number',
				displayOptions: {
					show: {
						resource: ['block'],
						operation: ['getMasterchainBlock', 'getShardchainBlock', 'getBlockHeader', 'getBlockTransactions', 'getShards'],
					},
				},
			},

			// Utility conversions
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				required: true,
				description: 'Value to convert',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['convertNanotonToTon', 'convertTonToNanoton', 'convertAddressFormat', 'bocToHex', 'hexToBoc', 'calculateMessageHash', 'decodeComment', 'encodeComment'],
					},
				},
			},

			// Address format
			{
				displayName: 'Target Format',
				name: 'targetFormat',
				type: 'options',
				default: 'bounceable',
				options: [
					{ name: 'Raw (workchain:hex)', value: 'raw' },
					{ name: 'Bounceable (EQ...)', value: 'bounceable' },
					{ name: 'Non-Bounceable (UQ...)', value: 'nonBounceable' },
					{ name: 'Testnet', value: 'testOnly' },
				],
				displayOptions: {
					show: {
						resource: ['utility', 'wallet'],
						operation: ['convertAddressFormat', 'convertAddress'],
					},
				},
			},

			// Additional options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Bounce',
						name: 'bounce',
						type: 'boolean',
						default: true,
						description: 'Whether to bounce message if destination not active',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 20,
						description: 'Maximum number of results to return',
					},
					{
						displayName: 'Timeout (Seconds)',
						name: 'timeout',
						type: 'number',
						default: 60,
						description: 'Timeout for waiting operations',
					},
				],
				displayOptions: {
					show: {
						resource: ['wallet', 'transaction', 'jetton', 'nft', 'account'],
					},
				},
			},
		],
	};

	/**
	 * Execute the node
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('tonNetwork');

		for (let i = 0; i < items.length; i++) {
			try {
				let results: INodeExecutionData[] = [];

				// Route to appropriate handler based on resource
				switch (resource) {
					case 'wallet':
						results = await wallet.executeWalletOperation.call(this, operation, i);
						break;
					case 'transaction':
						results = await transaction.executeTransactionOperation.call(this, operation, i);
						break;
					case 'jetton':
						results = await jetton.executeJettonOperation.call(this, operation, i);
						break;
					case 'nft':
						results = await nft.executeNftOperation.call(this, operation, i);
						break;
					case 'contract':
						results = await contract.executeContractOperation.call(this, operation, i);
						break;
					case 'dns':
						results = await dns.executeDnsOperation.call(this, operation, i);
						break;
					case 'subscription':
						results = await subscription.executeSubscriptionOperation.call(this, operation, i);
						break;
					case 'staking':
						results = await staking.executeStakingOperation.call(this, operation, i);
						break;
					case 'dex':
						results = await dex.executeDexOperation.call(this, operation, i);
						break;
					case 'block':
						results = await block.executeBlockOperation.call(this, operation, i);
						break;
					case 'account':
						results = await account.executeAccountOperation.call(this, operation, i);
						break;
					case 'network':
						results = await network.executeNetworkOperation.call(this, operation, i);
						break;
					case 'utility':
						results = await utility.executeUtilityOperation.call(this, operation, i);
						break;
					default:
						throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				// Add results with pairedItem
				for (const result of results) {
					returnData.push({
						...result,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
