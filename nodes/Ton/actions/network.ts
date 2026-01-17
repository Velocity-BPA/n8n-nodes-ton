/**
 * Network Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../transport/tonClient';
import { createTonApiV2Client } from '../transport/tonApiClient';
import { NETWORK_CONFIGS, API_PROVIDERS } from '../constants/networks';

export async function executeNetworkOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		switch (operation) {
			case 'getNetworkInfo': {
				const network = credentials.network as string || 'mainnet';
				const config = NETWORK_CONFIGS[network] || NETWORK_CONFIGS.mainnet;
				const apiClient = createApiClient(credentials);
				const masterchainInfo = await apiClient.getMasterchainInfo();
				
				returnData.push({
					json: {
						network,
						name: config.name,
						chainId: config.chainId,
						isTestnet: config.isTestnet,
						explorer: config.explorer,
						lastBlock: masterchainInfo,
					} as unknown as IDataObject,
				});
				break;
			}

			case 'getNetworkStatus': {
				const apiClient = createApiClient(credentials);
				const info = await apiClient.getMasterchainInfo();
				
				returnData.push({
					json: {
						online: true,
						lastBlockSeqno: info.lastBlockSeqno,
						timestamp: info.timestamp,
						timestampDate: new Date(info.timestamp * 1000).toISOString(),
					},
				});
				break;
			}

			case 'getSupportedProviders': {
				const providers = Object.entries(API_PROVIDERS).map(([key, value]) => ({
					id: key,
					name: value.name,
					requiresApiKey: value.requiresApiKey,
					features: value.features,
				}));
				
				returnData.push({
					json: {
						providers: providers as unknown as IDataObject[],
						count: providers.length,
					},
				});
				break;
			}

			case 'getTonPrice': {
				const apiClient = createTonApiV2Client(credentials);
				const price = await apiClient.getTonPrice();
				
				returnData.push({
					json: {
						token: 'TON',
						priceUsd: price,
						timestamp: new Date().toISOString(),
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown network operation: ${operation}`);
		}
	} catch (error) {
		if (this.continueOnFail()) {
			returnData.push({ json: { error: error instanceof Error ? error.message : 'Unknown error' } });
		} else {
			throw error;
		}
	}

	return returnData;
}
