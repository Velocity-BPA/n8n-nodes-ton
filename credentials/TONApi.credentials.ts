import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TONApi implements ICredentialType {
	name = 'tonApi';
	displayName = 'TON API';
	documentationUrl = 'https://tonapi.io/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Bearer token for TON API authentication. Obtain from TON API portal for higher rate limits and premium features.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://tonapi.io/v2',
			description: 'Base URL for the TON API',
		},
	];
}