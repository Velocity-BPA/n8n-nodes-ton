/**
 * Utility Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { Address } from '@ton/ton';
import { TonWalletClient } from '../transport/walletClient';
import { nanoToTon, tonToNano, formatJettonAmount } from '../utils/unitConverter';
import { NETWORK_CONFIGS } from '../constants/networks';

export async function executeUtilityOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		switch (operation) {
			case 'convertNanotonToTon': {
				const nanoton = this.getNodeParameter('amount', itemIndex) as string;
				const ton = nanoToTon(nanoton);
				returnData.push({
					json: {
						nanoton,
						ton,
					},
				});
				break;
			}

			case 'convertTonToNanoton': {
				const ton = this.getNodeParameter('amount', itemIndex) as string;
				const nanoton = tonToNano(ton);
				returnData.push({
					json: {
						ton,
						nanoton: nanoton.toString(),
					},
				});
				break;
			}

			case 'validateAddress': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				let isValid = false;
				let parsed: IDataObject | undefined;
				
				try {
					const addr = Address.parse(address);
					isValid = true;
					parsed = {
						bounceable: addr.toString({ bounceable: true }),
						nonBounceable: addr.toString({ bounceable: false }),
						raw: `${addr.workChain}:${addr.hash.toString('hex')}`,
						workchain: addr.workChain,
					};
				} catch {
					isValid = false;
				}
				
				returnData.push({
					json: {
						address,
						isValid,
						...(parsed ? { parsed } : {}),
					},
				});
				break;
			}

			case 'convertAddressFormat': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const parsed = Address.parse(address);
				
				returnData.push({
					json: {
						original: address,
						bounceable: parsed.toString({ bounceable: true }),
						nonBounceable: parsed.toString({ bounceable: false }),
						raw: `${parsed.workChain}:${parsed.hash.toString('hex')}`,
						workchain: parsed.workChain,
					},
				});
				break;
			}

			case 'getExplorerUrl': {
				const address = this.getNodeParameter('address', itemIndex) as string;
				const network = credentials.network as string || 'mainnet';
				const config = NETWORK_CONFIGS[network] || NETWORK_CONFIGS.mainnet;
				
				returnData.push({
					json: {
						address,
						explorerUrl: `${config.explorer}/address/${address}`,
						network,
					},
				});
				break;
			}

			case 'generateMnemonic': {
				const wallet = await TonWalletClient.generateNewWallet();
				returnData.push({
					json: {
						mnemonic: wallet.mnemonic.join(' '),
						publicKey: wallet.publicKey,
						warning: 'Keep your mnemonic safe and never share it!',
					},
				});
				break;
			}

			case 'validateMnemonic': {
				const mnemonic = this.getNodeParameter('mnemonic', itemIndex) as string;
				const isValid = await TonWalletClient.validateMnemonic(mnemonic);
				returnData.push({
					json: {
						isValid,
						wordCount: mnemonic.trim().split(/\s+/).length,
					},
				});
				break;
			}

			case 'formatJettonAmount': {
				const amount = this.getNodeParameter('amount', itemIndex) as string;
				const decimals = this.getNodeParameter('decimals', itemIndex, 9) as number;
				const formatted = formatJettonAmount(amount, decimals);
				
				returnData.push({
					json: {
						raw: amount,
						decimals,
						formatted,
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown utility operation: ${operation}`);
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
