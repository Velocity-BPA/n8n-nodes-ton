/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * TON Connect Credentials
 *
 * Used for dApp integrations with TON Connect protocol.
 * TON Connect enables secure wallet connections for decentralized applications.
 *
 * @see https://docs.ton.org/develop/dapps/ton-connect/overview
 */
export class TonConnect implements ICredentialType {
	name = 'tonConnect';
	displayName = 'TON Connect';
	documentationUrl = 'https://docs.ton.org/develop/dapps/ton-connect/overview';
	icon = 'file:ton.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'Manifest URL',
			name: 'manifestUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://your-app.com/tonconnect-manifest.json',
			description: 'URL to your TON Connect manifest JSON file. The manifest describes your application for wallet connections.',
			hint: 'The manifest should contain: url, name, iconUrl fields',
		},
		{
			displayName: 'Bridge URL',
			name: 'bridgeUrl',
			type: 'string',
			default: 'https://bridge.tonapi.io/bridge',
			description: 'TON Connect bridge URL for wallet communication',
		},
		{
			displayName: 'App Name',
			name: 'appName',
			type: 'string',
			default: '',
			placeholder: 'My dApp',
			description: 'Application name displayed to users during wallet connection',
		},
		{
			displayName: 'App URL',
			name: 'appUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-app.com',
			description: 'URL of your application',
		},
		{
			displayName: 'Icon URL',
			name: 'iconUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-app.com/icon.png',
			description: 'URL to your application icon (recommended: 180x180 PNG)',
		},
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			default: 'mainnet',
			description: 'The TON network for TON Connect sessions',
			options: [
				{
					name: 'Mainnet',
					value: 'mainnet',
					description: 'TON production network',
				},
				{
					name: 'Testnet',
					value: 'testnet',
					description: 'TON test network',
				},
			],
		},
		{
			displayName: 'Session Timeout',
			name: 'sessionTimeout',
			type: 'number',
			default: 300000,
			description: 'Session timeout in milliseconds (default: 5 minutes)',
		},
	];
}
