/**
 * NFT Operations
 */

import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createTonApiV2Client } from '../transport/tonApiClient';

export async function executeNftOperation(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData[]> {
	const credentials = await this.getCredentials('tonNetwork');
	const returnData: INodeExecutionData[] = [];

	try {
		const apiClient = createTonApiV2Client(credentials);

		switch (operation) {
			case 'getNftItemInfo': {
				const nftAddress = this.getNodeParameter('nftAddress', itemIndex) as string;
				const info = await apiClient.getNftItem(nftAddress);
				returnData.push({ json: info as unknown as IDataObject });
				break;
			}

			case 'getCollectionInfo': {
				const collectionAddress = this.getNodeParameter('collectionAddress', itemIndex) as string;
				const info = await apiClient.getNftCollection(collectionAddress);
				returnData.push({ json: info as unknown as IDataObject });
				break;
			}

			case 'getCollectionItems': {
				const collectionAddress = this.getNodeParameter('collectionAddress', itemIndex) as string;
				const limit = this.getNodeParameter('limit', itemIndex, 100) as number;
				const offset = this.getNodeParameter('offset', itemIndex, 0) as number;
				
				const items = await apiClient.getNftsInCollection(collectionAddress, { limit, offset });
				returnData.push({
					json: {
						collectionAddress,
						items: items as unknown as IDataObject[],
						count: items.length,
					},
				});
				break;
			}

			case 'getNftsByOwner': {
				const ownerAddress = this.getNodeParameter('ownerAddress', itemIndex) as string;
				const limit = this.getNodeParameter('limit', itemIndex, 100) as number;
				
				const nfts = await apiClient.getNftsByOwner(ownerAddress, { limit });
				returnData.push({
					json: {
						ownerAddress,
						nfts: nfts as unknown as IDataObject[],
						count: nfts.length,
					},
				});
				break;
			}

			default:
				throw new Error(`Unknown NFT operation: ${operation}`);
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
