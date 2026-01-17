/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * TON Trigger Node
 *
 * Polling-based trigger for TON blockchain events.
 */

import type {
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { createApiClient } from './transport/tonClient';
import { createTonApiV2Client } from './transport/tonApiClient';
import { nanoToTon } from './utils/unitConverter';

export class TonTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TON Trigger',
		name: 'tonTrigger',
		icon: 'file:ton.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers on TON blockchain events',
		defaults: {
			name: 'TON Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'tonNetwork',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'newTransaction',
				options: [
					{
						name: 'New Transaction',
						value: 'newTransaction',
						description: 'Triggers when a new transaction is detected',
					},
					{
						name: 'TON Received',
						value: 'tonReceived',
						description: 'Triggers when TON is received at an address',
					},
					{
						name: 'TON Sent',
						value: 'tonSent',
						description: 'Triggers when TON is sent from an address',
					},
					{
						name: 'Balance Change',
						value: 'balanceChange',
						description: 'Triggers when balance changes',
					},
				],
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'EQC...',
				description: 'The TON address to monitor',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Min Amount (TON)',
						name: 'minAmount',
						type: 'number',
						default: 0,
						description: 'Minimum amount in TON to trigger',
					},
					{
						displayName: 'Include Failed',
						name: 'includeFailed',
						type: 'boolean',
						default: false,
						description: 'Whether to include failed transactions',
					},
				],
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const credentials = await this.getCredentials('tonNetwork');
		const event = this.getNodeParameter('event') as string;
		const address = this.getNodeParameter('address') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		const webhookData = this.getWorkflowStaticData('node');
		const lastLt = webhookData.lastLt as string | undefined;
		const lastBalance = webhookData.lastBalance as string | undefined;

		const returnData: INodeExecutionData[] = [];

		try {
			const apiClient = createApiClient(credentials);

			switch (event) {
				case 'newTransaction':
				case 'tonReceived':
				case 'tonSent': {
					const transactions = await apiClient.getTransactions(address, 10);
					const txArray = transactions as Array<{
						transaction_id?: { lt?: string; hash?: string };
						in_msg?: { value?: string; source?: string };
						out_msgs?: Array<{ value?: string; destination?: string }>;
						fee?: string;
						utime?: number;
					}>;

					for (const tx of txArray) {
						const txLt = tx.transaction_id?.lt;
						
						// Skip if we've seen this transaction
						if (lastLt && txLt && BigInt(txLt) <= BigInt(lastLt)) {
							continue;
						}

						// Filter by event type
						if (event === 'tonReceived') {
							const inValue = BigInt(tx.in_msg?.value || '0');
							if (inValue <= 0n) continue;
							
							const minAmount = options.minAmount as number || 0;
							if (minAmount > 0 && Number(nanoToTon(inValue.toString())) < minAmount) {
								continue;
							}
						}

						if (event === 'tonSent') {
							const outValue = tx.out_msgs?.reduce(
								(sum, msg) => sum + BigInt(msg.value || '0'),
								0n
							) || 0n;
							if (outValue <= 0n) continue;
						}

						returnData.push({
							json: {
								event,
								address,
								transactionId: tx.transaction_id,
								inMessage: tx.in_msg,
								outMessages: tx.out_msgs,
								fee: tx.fee,
								timestamp: tx.utime,
								timestampDate: tx.utime ? new Date(tx.utime * 1000).toISOString() : null,
							},
						});
					}

					// Update last seen LT
					if (txArray.length > 0 && txArray[0].transaction_id?.lt) {
						webhookData.lastLt = txArray[0].transaction_id.lt;
					}
					break;
				}

				case 'balanceChange': {
					const balance = await apiClient.getBalance(address);
					
					if (lastBalance && balance !== lastBalance) {
						const change = BigInt(balance) - BigInt(lastBalance);
						
						returnData.push({
							json: {
								event: 'balanceChange',
								address,
								previousBalance: lastBalance,
								currentBalance: balance,
								previousBalanceTon: nanoToTon(lastBalance),
								currentBalanceTon: nanoToTon(balance),
								change: change.toString(),
								changeTon: nanoToTon(change.toString()),
								increased: change > 0n,
								timestamp: new Date().toISOString(),
							},
						});
					}
					
					webhookData.lastBalance = balance;
					break;
				}
			}
		} catch (error) {
			// Return error info for debugging
			returnData.push({
				json: {
					error: error instanceof Error ? error.message : 'Unknown error',
					event,
					address,
					timestamp: new Date().toISOString(),
				},
			});
		}

		if (returnData.length === 0) {
			return null;
		}

		return [returnData];
	}
}
