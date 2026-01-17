/**
 * DNS Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createTonApiV2Client } from '../transport/tonApiClient';

export async function executeDnsOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		const apiClient = createTonApiV2Client(credentials);

		switch (operation) {
			case 'resolve': {
				const domain = this.getNodeParameter('domain', itemIndex) as string;
				const result = await apiClient.resolveDns(domain);
				returnData.push({
					json: {
						domain,
						...result,
					} as IDataObject,
				});
				break;
			}

			case 'getDomainInfo': {
				const domain = this.getNodeParameter('domain', itemIndex) as string;
				const info = await apiClient.getDnsInfo(domain);
				returnData.push({ json: info as unknown as IDataObject });
				break;
			}

			default:
				throw new Error(`Unknown DNS operation: ${operation}`);
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
