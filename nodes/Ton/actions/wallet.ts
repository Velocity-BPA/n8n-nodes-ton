/**
 * Wallet Operations
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { Address } from '@ton/ton';
import { createWalletClient } from '../transport/walletClient';
import { createApiClient } from '../transport/tonClient';
import { nanoToTon } from '../utils/unitConverter';

export async function executeWalletOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		switch (operation) {
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

			case 'getWalletInfo': {
				const walletClient = await createWalletClient(credentials);
				const info = await walletClient.getWalletInfo();
				returnData.push({ json: info as unknown as IDataObject });
				break;
			}

			case 'getSeqno': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const apiClient = createApiClient(credentials);
				const seqno = await apiClient.getSeqno(address);
				returnData.push({ json: { address, seqno } });
				break;
			}

			case 'getWalletAddress': {
				const walletClient = await createWalletClient(credentials);
				const address = walletClient.getAddress();
				returnData.push({
					json: {
						address: address.toString({ bounceable: true }),
						rawAddress: `${address.workChain}:${address.hash.toString('hex')}`,
						nonBounceableAddress: address.toString({ bounceable: false }),
					},
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

			case 'validateAddress': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				let isValid = false;
				let parsedAddress: IDataObject | undefined;
				
				try {
					const parsed = Address.parse(address);
					isValid = true;
					parsedAddress = {
						bounceable: parsed.toString({ bounceable: true }),
						nonBounceable: parsed.toString({ bounceable: false }),
						raw: `${parsed.workChain}:${parsed.hash.toString('hex')}`,
						workchain: parsed.workChain,
					};
				} catch {
					isValid = false;
				}
				
				returnData.push({
					json: { address, isValid, ...(parsedAddress ? { parsed: parsedAddress } : {}) },
				});
				break;
			}

			case 'convertAddress': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const format = this.getNodeParameter('format', itemIndex, 'bounceable') as string;
				const parsed = Address.parse(address);
				let converted: string;
				
				switch (format) {
					case 'bounceable': converted = parsed.toString({ bounceable: true }); break;
					case 'non-bounceable': converted = parsed.toString({ bounceable: false }); break;
					case 'raw': converted = `${parsed.workChain}:${parsed.hash.toString('hex')}`; break;
					default: converted = parsed.toString();
				}
				
				returnData.push({ json: { original: address, converted, format } });
				break;
			}

			default:
				throw new Error(`Unknown wallet operation: ${operation}`);
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
