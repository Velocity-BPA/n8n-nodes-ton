/**
 * Staking Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createTonApiV2Client } from '../transport/tonApiClient';
import { nanoToTon } from '../utils/unitConverter';

export async function executeStakingOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		const apiClient = createTonApiV2Client(credentials);

		switch (operation) {
			case 'getStakingPools': {
				const pools = await apiClient.getStakingPools();
				returnData.push({
					json: {
						pools: pools.map(pool => ({
							...pool,
							totalAmountTon: nanoToTon(pool.totalAmount),
							minStakeTon: nanoToTon(pool.minStake),
						})) as unknown as IDataObject[],
						count: pools.length,
					},
				});
				break;
			}

			case 'getPoolInfo': {
				const poolAddress = this.getNodeParameter('poolAddress', itemIndex) as string;
				const pool = await apiClient.getStakingPoolInfo(poolAddress);
				returnData.push({
					json: {
						...pool,
						totalAmountTon: nanoToTon(pool.totalAmount),
						minStakeTon: nanoToTon(pool.minStake),
					} as unknown as IDataObject,
				});
				break;
			}

			default:
				throw new Error(`Unknown staking operation: ${operation}`);
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
