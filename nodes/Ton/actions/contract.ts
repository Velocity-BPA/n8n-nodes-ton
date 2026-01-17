/**
 * Contract Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../transport/tonClient';

export async function executeContractOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		const apiClient = createApiClient(credentials);

		switch (operation) {
			case 'runGetMethod': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const method = this.getNodeParameter('method', itemIndex) as string;
				const stack = this.getNodeParameter('stack', itemIndex, []) as unknown[];
				
				const result = await apiClient.runGetMethod(address, method, stack);
				returnData.push({ json: result as unknown as IDataObject });
				break;
			}

			case 'getContractState': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const info = await apiClient.getAccountInfo(address);
				returnData.push({ json: info as unknown as IDataObject });
				break;
			}

			case 'estimateFee': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const body = this.getNodeParameter('body', itemIndex) as string;
				
				const fees = await apiClient.estimateFee(address, body);
				returnData.push({ json: fees as unknown as IDataObject });
				break;
			}

			case 'sendBoc': {
				const boc = this.getNodeParameter('boc', itemIndex) as string;
				const result = await apiClient.sendBoc(boc);
				returnData.push({ json: result as unknown as IDataObject });
				break;
			}

			default:
				throw new Error(`Unknown contract operation: ${operation}`);
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
