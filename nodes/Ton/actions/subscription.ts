/**
 * Subscription Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../transport/tonClient';

export async function executeSubscriptionOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		const apiClient = createApiClient(credentials);

		switch (operation) {
			case 'getSubscriptionInfo': {
				const contractAddress = this.getNodeParameter('contractAddress', itemIndex) as string;
				const result = await apiClient.runGetMethod(contractAddress, 'get_subscription_data');
				
				returnData.push({
					json: {
						address: contractAddress,
						...result,
					} as unknown as IDataObject,
				});
				break;
			}

			case 'checkSubscriptionStatus': {
				const contractAddress = this.getNodeParameter('contractAddress', itemIndex) as string;
				const result = await apiClient.runGetMethod(contractAddress, 'get_subscription_data');
				
				returnData.push({
					json: {
						address: contractAddress,
						active: result.success,
						exitCode: result.exitCode,
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown subscription operation: ${operation}`);
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
