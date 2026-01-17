/**
 * Transaction Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { toNano, beginCell } from '@ton/ton';
import { createWalletClient } from '../transport/walletClient';
import { createApiClient } from '../transport/tonClient';
import { nanoToTon } from '../utils/unitConverter';

export async function executeTransactionOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		switch (operation) {
			case 'sendTon': {
				const toAddress = this.getNodeParameter('toAddress', itemIndex) as string;
				const amount = this.getNodeParameter('amount', itemIndex) as string;
				const comment = this.getNodeParameter('comment', itemIndex, '') as string;
				
				const walletClient = await createWalletClient(credentials);
				const result = await walletClient.sendTon(toAddress, toNano(amount), { comment });
				
				returnData.push({ json: result as unknown as IDataObject });
				break;
			}

			case 'getTransaction': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const lt = this.getNodeParameter('lt', itemIndex, '') as string;
				const hash = this.getNodeParameter('hash', itemIndex, '') as string;
				
				const apiClient = createApiClient(credentials);
				const transactions = await apiClient.getTransactions(address, 1, lt || undefined, hash || undefined);
				
				returnData.push({
					json: { transaction: (transactions as IDataObject[])[0] || null },
				});
				break;
			}

			case 'getTransactions': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const limit = this.getNodeParameter('limit', itemIndex, 20) as number;
				
				const apiClient = createApiClient(credentials);
				const transactions = await apiClient.getTransactions(address, limit);
				
				returnData.push({
					json: { address, transactions: transactions as IDataObject[], count: (transactions as unknown[]).length },
				});
				break;
			}

			case 'estimateFee': {
				const toAddress = this.getNodeParameter('toAddress', itemIndex) as string;
				const amount = this.getNodeParameter('amount', itemIndex) as string;
				
				const walletClient = await createWalletClient(credentials);
				const fees = await walletClient.estimateFee({
					to: toAddress,
					value: toNano(amount),
				});
				
				returnData.push({
					json: {
						...fees,
						totalFeeTon: nanoToTon(fees.totalFee),
					},
				});
				break;
			}

			case 'waitForTransaction': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const lt = this.getNodeParameter('lt', itemIndex) as string;
				const hash = this.getNodeParameter('hash', itemIndex) as string;
				const timeout = this.getNodeParameter('timeout', itemIndex, 60000) as number;
				
				const apiClient = createApiClient(credentials);
				const confirmed = await apiClient.waitForTransaction(address, lt, hash, timeout);
				
				returnData.push({ json: { address, lt, hash, confirmed } });
				break;
			}

			default:
				throw new Error(`Unknown transaction operation: ${operation}`);
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
