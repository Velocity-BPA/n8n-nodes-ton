/**
 * Jetton Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createTonApiV2Client } from '../transport/tonApiClient';
import { nanoToTon, formatJettonAmount } from '../utils/unitConverter';

export async function executeJettonOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		const apiClient = createTonApiV2Client(credentials);

		switch (operation) {
			case 'getJettonBalance': {
				const ownerAddress = this.getNodeParameter('ownerAddress', itemIndex) as string;
				const jettonAddress = this.getNodeParameter('jettonAddress', itemIndex) as string;
				
				const result = await apiClient.getJettonBalance(ownerAddress, jettonAddress);
				returnData.push({ json: result as unknown as IDataObject });
				break;
			}

			case 'getJettonInfo': {
				const jettonAddress = this.getNodeParameter('jettonAddress', itemIndex) as string;
				const info = await apiClient.getJettonInfo(jettonAddress);
				returnData.push({ json: info as unknown as IDataObject });
				break;
			}

			case 'getAllJettonBalances': {
				const ownerAddress = this.getNodeParameter('ownerAddress', itemIndex) as string;
				const balances = await apiClient.getAllJettonBalances(ownerAddress);
				returnData.push({
					json: {
						ownerAddress,
						balances: balances as unknown as IDataObject[],
						count: balances.length,
					},
				});
				break;
			}

			case 'getJettonHolders': {
				const jettonAddress = this.getNodeParameter('jettonAddress', itemIndex) as string;
				const limit = this.getNodeParameter('limit', itemIndex, 100) as number;
				
				const holders = await apiClient.getJettonHolders(jettonAddress, { limit });
				returnData.push({
					json: {
						jettonAddress,
						holders: holders as unknown as IDataObject[],
						count: holders.length,
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown jetton operation: ${operation}`);
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
