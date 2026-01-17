/**
 * Block Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../transport/tonClient';

export async function executeBlockOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		const apiClient = createApiClient(credentials);

		switch (operation) {
			case 'getMasterchainInfo': {
				const info = await apiClient.getMasterchainInfo();
				returnData.push({ json: info as unknown as IDataObject });
				break;
			}

			case 'getBlockHeader': {
				const workchain = this.getNodeParameter('workchain', itemIndex, -1) as number;
				const shard = this.getNodeParameter('shard', itemIndex) as string;
				const seqno = this.getNodeParameter('seqno', itemIndex) as number;
				
				const header = await apiClient.getBlockHeader(workchain, shard, seqno);
				returnData.push({ json: header as unknown as IDataObject });
				break;
			}

			case 'getLatestBlock': {
				const info = await apiClient.getMasterchainInfo();
				returnData.push({
					json: {
						seqno: info.lastBlockSeqno,
						shard: info.lastBlockShard,
						workchain: info.lastBlockWorkchain,
						timestamp: info.timestamp,
						timestampDate: new Date(info.timestamp * 1000).toISOString(),
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown block operation: ${operation}`);
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
