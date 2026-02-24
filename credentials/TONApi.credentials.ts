import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class TONApi implements ICredentialType {
	name = 'tonApi';
	displayName = 'TON API';
	documentationUrl = 'https://toncenter.com/api/v3';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for TON Center API. Required for higher rate limits and advanced features.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://toncenter.com/api/v3',
			description: 'Base URL for the TON API',
		},
	];
}