/**
 * Account Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../transport/tonClient';
import { createTonApiV2Client } from '../transport/tonApiClient';
import { nanoToTon } from '../utils/unitConverter';

export async function executeAccountOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		switch (operation) {
			case 'getAccountInfo': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const apiClient = createTonApiV2Client(credentials);
				const info = await apiClient.getAccount(address);
				
				returnData.push({
					json: {
						...info,
						balanceTon: nanoToTon(info.balance),
					} as unknown as IDataObject,
				});
				break;
			}

			case 'getBalance': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const apiClient = createApiClient(credentials);
				const balance = await apiClient.getBalance(address);
				
				returnData.push({
					json: {
						address,
						balance,
						balanceTon: nanoToTon(balance),
					},
				});
				break;
			}

			case 'getAccountState': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const apiClient = createApiClient(credentials);
				const state = await apiClient.getAccountInfo(address);
				
				returnData.push({ json: state as unknown as IDataObject });
				break;
			}

			case 'getTransactionHistory': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
				const apiClient = createApiClient(credentials);
				const transactions = await apiClient.getTransactions(address, limit);
				
				returnData.push({
					json: {
						address,
						transactions: transactions as IDataObject[],
						count: (transactions as unknown[]).length,
					},
				});
				break;
			}

			case 'getAccountEvents': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
				const apiClient = createTonApiV2Client(credentials);
				const events = await apiClient.getAccountEvents(address, { limit });
				
				returnData.push({
					json: {
						address,
						events: events as unknown as IDataObject[],
						count: events.length,
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown account operation: ${operation}`);
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
