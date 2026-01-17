/**
 * DEX Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createTonApiV2Client } from '../transport/tonApiClient';
import { DEX_ROUTERS } from '../constants/config';

export async function executeDexOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		const apiClient = createTonApiV2Client(credentials);
		const network = credentials.network as string || 'mainnet';
		const routers = DEX_ROUTERS[network as keyof typeof DEX_ROUTERS] || DEX_ROUTERS.mainnet;

		switch (operation) {
			case 'getSupportedDexes': {
				const dexes = Object.entries(routers).map(([key, value]) => ({
					id: key,
					name: value.name,
					website: value.website,
					router: 'router' in value ? value.router : value.factory,
				}));
				
				returnData.push({
					json: {
						dexes: dexes as unknown as IDataObject[],
						count: dexes.length,
					},
				});
				break;
			}

			case 'getTonPrice': {
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

			case 'getRates': {
				const tokens = this.getNodeParameter('tokens', itemIndex, 'ton') as string;
				const tokenList = tokens.split(',').map(t => t.trim());
				const rates = await apiClient.getRates(tokenList);
				
				returnData.push({
					json: {
						rates: rates as unknown as IDataObject,
						timestamp: new Date().toISOString(),
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown DEX operation: ${operation}`);
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
