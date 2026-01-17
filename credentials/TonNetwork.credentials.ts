/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

/**
 * TON Network Credentials
 *
 * Supports multiple API providers and networks for connecting to the TON blockchain.
 * Includes wallet configuration with mnemonic support for signing transactions.
 *
 * Security Notes:
 * - Mnemonics are stored encrypted and never logged
 * - API keys are optional for public endpoints
 * - Custom endpoints allow for private node connections
 */
export class TonNetwork implements ICredentialType {
	name = 'tonNetwork';
	displayName = 'TON Network';
	documentationUrl = 'https://docs.ton.org/develop/dapps/apis/';
	icon = 'file:ton.svg' as const;

	properties: INodeProperties[] = [
		// Network Selection
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			default: 'mainnet',
			description: 'The TON network to connect to',
			options: [
				{
					name: 'Mainnet',
					value: 'mainnet',
					description: 'TON production network',
				},
				{
					name: 'Testnet',
					value: 'testnet',
					description: 'TON test network for development',
				},
				{
					name: 'Custom',
					value: 'custom',
					description: 'Custom endpoint configuration',
				},
			],
		},

		// API Provider Selection
		{
			displayName: 'API Provider',
			name: 'apiProvider',
			type: 'options',
			default: 'toncenter',
			description: 'The API provider to use for blockchain access',
			displayOptions: {
				hide: {
					network: ['custom'],
				},
			},
			options: [
				{
					name: 'TON Center',
					value: 'toncenter',
					description: 'Official TON Center API (toncenter.com)',
				},
				{
					name: 'TON API (tonconsole)',
					value: 'tonapi',
					description: 'TON API service (tonconsole.com)',
				},
				{
					name: 'TON Hub',
					value: 'tonhub',
					description: 'TON Hub API',
				},
				{
					name: 'Orbs TON Access',
					value: 'orbs',
					description: 'Decentralized TON Access by Orbs',
				},
			],
		},

		// API Key (for providers that require/support it)
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for the selected provider (optional for some providers, required for higher rate limits)',
			displayOptions: {
				show: {
					apiProvider: ['toncenter', 'tonapi'],
				},
				hide: {
					network: ['custom'],
				},
			},
		},

		// Custom Endpoint Configuration
		{
			displayName: 'Custom Endpoint URL',
			name: 'customEndpoint',
			type: 'string',
			default: '',
			placeholder: 'https://your-ton-node.example.com/jsonRPC',
			description: 'Custom RPC endpoint URL for TON network access',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
		},
		{
			displayName: 'Custom API Key',
			name: 'customApiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for custom endpoint (if required)',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
		},

		// Wallet Configuration Section
		{
			displayName: 'Wallet Configuration',
			name: 'walletConfigNotice',
			type: 'notice',
			default: '',
			displayOptions: {
				show: {
					'/enableWallet': [true],
				},
			},
		},
		{
			displayName: 'Enable Wallet Operations',
			name: 'enableWallet',
			type: 'boolean',
			default: false,
			description: 'Whether to enable wallet operations requiring a mnemonic (sending transactions, signing messages)',
		},
		{
			displayName: 'Wallet Mnemonic',
			name: 'mnemonic',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 3,
			},
			default: '',
			placeholder: 'word1 word2 word3 ... word24',
			description: 'Your 24-word wallet recovery phrase (stored encrypted, never logged)',
			displayOptions: {
				show: {
					enableWallet: [true],
				},
			},
		},
		{
			displayName: 'Wallet Version',
			name: 'walletVersion',
			type: 'options',
			default: 'v4r2',
			description: 'The wallet contract version to use',
			displayOptions: {
				show: {
					enableWallet: [true],
				},
			},
			options: [
				{
					name: 'Wallet V3R1',
					value: 'v3r1',
					description: 'Wallet version 3 revision 1',
				},
				{
					name: 'Wallet V3R2',
					value: 'v3r2',
					description: 'Wallet version 3 revision 2',
				},
				{
					name: 'Wallet V4R1',
					value: 'v4r1',
					description: 'Wallet version 4 revision 1',
				},
				{
					name: 'Wallet V4R2 (Recommended)',
					value: 'v4r2',
					description: 'Wallet version 4 revision 2 - most widely used',
				},
				{
					name: 'Wallet V5',
					value: 'v5',
					description: 'Wallet version 5 - latest features',
				},
			],
		},
		{
			displayName: 'Subwallet ID',
			name: 'subwalletId',
			type: 'number',
			default: 698983191,
			description: 'Subwallet ID for wallet derivation (default: 698983191 for mainnet)',
			displayOptions: {
				show: {
					enableWallet: [true],
				},
			},
		},
		{
			displayName: 'Workchain',
			name: 'workchain',
			type: 'options',
			default: 0,
			description: 'The workchain to use for wallet operations',
			displayOptions: {
				show: {
					enableWallet: [true],
				},
			},
			options: [
				{
					name: 'Basechain (0)',
					value: 0,
					description: 'Main workchain for user wallets and contracts',
				},
				{
					name: 'Masterchain (-1)',
					value: -1,
					description: 'Masterchain for validators and system contracts',
				},
			],
		},

		// Advanced Settings
		{
			displayName: 'Request Timeout',
			name: 'timeout',
			type: 'number',
			default: 30000,
			description: 'Request timeout in milliseconds',
		},
	];

	/**
	 * Test the credentials by making a simple API call
	 */
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$self.getEndpointUrl()}}',
			url: '/getMasterchainInfo',
			method: 'GET',
		},
	};

	/**
	 * Authenticate requests using the API key header
	 */
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey || $credentials.customApiKey || ""}}',
			},
		},
	};
}

/**
 * Helper function to get the API endpoint URL based on credentials
 */
export function getEndpointUrl(credentials: ICredentialDataDecryptedObject): string {
	const network = credentials.network as string;
	const apiProvider = credentials.apiProvider as string;

	if (network === 'custom') {
		return credentials.customEndpoint as string;
	}

	const isTestnet = network === 'testnet';

	switch (apiProvider) {
		case 'toncenter':
			return isTestnet
				? 'https://testnet.toncenter.com/api/v2'
				: 'https://toncenter.com/api/v2';

		case 'tonapi':
			return isTestnet
				? 'https://testnet.tonapi.io/v2'
				: 'https://tonapi.io/v2';

		case 'tonhub':
			return isTestnet
				? 'https://testnet.tonhubapi.com'
				: 'https://tonhubapi.com';

		case 'orbs':
			return isTestnet
				? 'https://testnet.ton.access.orbs.network/1/rpc'
				: 'https://ton.access.orbs.network/1/rpc';

		default:
			return 'https://toncenter.com/api/v2';
	}
}

/**
 * Helper function to get TON API v2 endpoint (for enhanced features)
 */
export function getTonApiEndpoint(credentials: ICredentialDataDecryptedObject): string {
	const network = credentials.network as string;
	const isTestnet = network === 'testnet';

	return isTestnet
		? 'https://testnet.tonapi.io/v2'
		: 'https://tonapi.io/v2';
}
