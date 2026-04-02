/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { TON } from '../nodes/TON/TON.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('TON Node', () => {
  let node: TON;

  beforeAll(() => {
    node = new TON();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('TON');
      expect(node.description.name).toBe('ton');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearerToken: 'test-token',
				baseUrl: 'https://tonapi.io/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	it('should get account info successfully', async () => {
		const mockResponse = { account_id: 'test-account', balance: 1000 };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccount')
			.mockReturnValueOnce('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
			method: 'GET',
			url: 'https://tonapi.io/v2/accounts/EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF',
			headers: {
				Authorization: 'Bearer test-token',
				'Content-Type': 'application/json',
			},
			json: true,
		});
	});

	it('should run get method successfully', async () => {
		const mockResponse = { result: [100] };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('runGetMethod')
			.mockReturnValueOnce('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')
			.mockReturnValueOnce('get_balance')
			.mockReturnValueOnce('[]');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should get account jettons successfully', async () => {
		const mockResponse = { balances: [] };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccountJettons')
			.mockReturnValueOnce('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')
			.mockReturnValueOnce('ton,usdt');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should get account events successfully', async () => {
		const mockResponse = { events: [] };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccountEvents')
			.mockReturnValueOnce('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')
			.mockReturnValueOnce(100)
			.mockReturnValueOnce('2024-01-01T00:00:00Z')
			.mockReturnValueOnce('2024-01-02T00:00:00Z');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should get bulk accounts successfully', async () => {
		const mockResponse = { accounts: [] };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getBulkAccounts')
			.mockReturnValueOnce('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF,EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should get account diff successfully', async () => {
		const mockResponse = { diff: {} };
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getAccountDiff')
			.mockReturnValueOnce('EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF')
			.mockReturnValueOnce('2024-01-01T00:00:00Z')
			.mockReturnValueOnce('2024-01-02T00:00:00Z');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
	});

	it('should handle errors when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccount');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
	});

	it('should throw errors when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccount');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('Jetton Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://tonapi.io/v2'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	describe('getJetton operation', () => {
		it('should get jetton successfully', async () => {
			const jettonData = { address: '0:123', symbol: 'TEST', decimals: 9 };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getJetton';
				if (param === 'jettonId') return '0:123';
				return null;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(jettonData);

			const result = await executeJettonOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: jettonData, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://tonapi.io/v2/jettons/0:123',
				headers: { Authorization: 'Bearer test-key' },
				json: true,
			});
		});

		it('should handle getJetton error', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getJetton';
				if (param === 'jettonId') return '0:123';
				return null;
			});
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeJettonOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getJettons operation', () => {
		it('should get jettons list successfully', async () => {
			const jettonsData = { jettons: [], total: 0 };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getJettons';
				if (param === 'limit') return 100;
				if (param === 'offset') return 0;
				return null;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(jettonsData);

			const result = await executeJettonOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: jettonsData, pairedItem: { item: 0 } }]);
		});
	});

	describe('getJettonHolders operation', () => {
		it('should get jetton holders successfully', async () => {
			const holdersData = { holders: [], total: 0 };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getJettonHolders';
				if (param === 'jettonId') return '0:123';
				if (param === 'limit') return 100;
				if (param === 'offset') return 0;
				return null;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(holdersData);

			const result = await executeJettonOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: holdersData, pairedItem: { item: 0 } }]);
		});
	});

	describe('getBulkJettons operation', () => {
		it('should get bulk jettons successfully', async () => {
			const bulkData = { jettons: [] };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getBulkJettons';
				if (param === 'jettonIds') return '0:123,0:456';
				return null;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(bulkData);

			const result = await executeJettonOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: bulkData, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://tonapi.io/v2/jettons/_bulk',
				headers: { Authorization: 'Bearer test-key', 'Content-Type': 'application/json' },
				body: { jetton_ids: ['0:123', '0:456'] },
				json: true,
			});
		});
	});

	describe('getJettonTransfers operation', () => {
		it('should get jetton transfers successfully', async () => {
			const transfersData = { transfers: [], total: 0 };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getJettonTransfers';
				if (param === 'jettonId') return '0:123';
				if (param === 'limit') return 100;
				if (param === 'offset') return 0;
				if (param === 'startDate') return '';
				if (param === 'endDate') return '';
				return null;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(transfersData);

			const result = await executeJettonOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: transfersData, pairedItem: { item: 0 } }]);
		});
	});
});

describe('NFT Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        bearerToken: 'test-token',
        baseUrl: 'https://tonapi.io/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get NFT collections successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNFTCollections')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      collections: [],
    });

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://tonapi.io/v2/nfts/collections',
      headers: {
        Authorization: 'Bearer test-token',
      },
      qs: {
        limit: 50,
        offset: 0,
      },
      json: true,
    });
  });

  it('should get NFT collection info successfully', async () => {
    const collectionAddress = 'EQD2_7ql9l0Z5mDyFxMm4iOhH3yd6xvqZm7-MlXPrEaADxpK';
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNFTCollection')
      .mockReturnValueOnce(collectionAddress);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      collection: {},
    });

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: `https://tonapi.io/v2/nfts/collections/${collectionAddress}`,
      headers: {
        Authorization: 'Bearer test-token',
      },
      json: true,
    });
  });

  it('should get collection items successfully', async () => {
    const collectionAddress = 'EQD2_7ql9l0Z5mDyFxMm4iOhH3yd6xvqZm7-MlXPrEaADxpK';
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCollectionItems')
      .mockReturnValueOnce(collectionAddress)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      items: [],
    });

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: `https://tonapi.io/v2/nfts/collections/${collectionAddress}/items`,
      headers: {
        Authorization: 'Bearer test-token',
      },
      qs: {
        limit: 50,
        offset: 0,
      },
      json: true,
    });
  });

  it('should get NFT info successfully', async () => {
    const nftAddress = 'EQANHCRwKOe9B-H-1vPK3m8AzQ5L6S2QqIlWJfcJKTUi7_Ul';
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNFT')
      .mockReturnValueOnce(nftAddress);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      nft: {},
    });

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: `https://tonapi.io/v2/nfts/${nftAddress}`,
      headers: {
        Authorization: 'Bearer test-token',
      },
      json: true,
    });
  });

  it('should get NFT history successfully', async () => {
    const nftAddress = 'EQANHCRwKOe9B-H-1vPK3m8AzQ5L6S2QqIlWJfcJKTUi7_Ul';
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNFTHistory')
      .mockReturnValueOnce(nftAddress)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce('2024-01-01T00:00:00.000Z')
      .mockReturnValueOnce('2024-01-31T23:59:59.999Z');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      history: [],
    });

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: `https://tonapi.io/v2/nfts/${nftAddress}/history`,
      headers: {
        Authorization: 'Bearer test-token',
      },
      qs: {
        limit: 50,
        start_date: 1704067200,
        end_date: 1706745599,
      },
      json: true,
    });
  });

  it('should get bulk NFTs successfully', async () => {
    const nftAddresses = 'EQANHCRwKOe9B-H-1vPK3m8AzQ5L6S2QqIlWJfcJKTUi7_Ul,EQD2_7ql9l0Z5mDyFxMm4iOhH3yd6xvqZm7-MlXPrEaADxpK';
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBulkNFTs')
      .mockReturnValueOnce(nftAddresses);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      nfts: [],
    });

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://tonapi.io/v2/nfts/_bulk',
      headers: {
        Authorization: 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: {
        nft_addresses: ['EQANHCRwKOe9B-H-1vPK3m8AzQ5L6S2QqIlWJfcJKTUi7_Ul', 'EQD2_7ql9l0Z5mDyFxMm4iOhH3yd6xvqZm7-MlXPrEaADxpK'],
      },
      json: true,
    });
  });

  it('should handle errors and continue on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getNFTCollections');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continue on fail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getNFTCollections');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(
      executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeNFTOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transaction Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        bearerToken: 'test-token', 
        baseUrl: 'https://tonapi.io/v2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn() 
      },
    };
  });

  it('should get transaction by hash', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('abc123');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ hash: 'abc123', status: 'success' });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://tonapi.io/v2/blockchain/transactions/abc123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
    expect(result).toEqual([{ json: { hash: 'abc123', status: 'success' }, pairedItem: { item: 0 } }]);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransaction');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('invalid');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Not found'));

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'Not found' }, pairedItem: { item: 0 } }]);
  });

  it('should get bulk transactions', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBulkTransactions');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('hash1,hash2,hash3');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([{ hash: 'hash1' }, { hash: 'hash2' }]);

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://tonapi.io/v2/blockchain/transactions/_bulk',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: {
        transaction_ids: ['hash1', 'hash2', 'hash3']
      },
      json: true
    });
    expect(result).toEqual([{ json: [{ hash: 'hash1' }, { hash: 'hash2' }], pairedItem: { item: 0 } }]);
  });

  it('should get transactions with filters', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransactions');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce(0);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('8000000000000000');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce(123456);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce(50);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ transactions: [] });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/blockchain/transactions?'),
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        },
        json: true
      })
    );
    expect(result).toEqual([{ json: { transactions: [] }, pairedItem: { item: 0 } }]);
  });

  it('should get transaction trace', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getTransactionTrace');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('abc123');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ trace: 'execution_trace' });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://tonapi.io/v2/blockchain/transactions/abc123/trace',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      json: true
    });
    expect(result).toEqual([{ json: { trace: 'execution_trace' }, pairedItem: { item: 0 } }]);
  });

  it('should emulate transaction', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('emulateTransaction');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('te6ccgEBAQEAKgAAT4AJxYOcYO...BOC_DATA');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true, result: 'emulation_result' });

    const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://tonapi.io/v2/wallet/emulate',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      },
      body: {
        boc: 'te6ccgEBAQEAKgAAT4AJxYOcYO...BOC_DATA'
      },
      json: true
    });
    expect(result).toEqual([{ json: { success: true, result: 'emulation_result' }, pairedItem: { item: 0 } }]);
  });
});

describe('Domain Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        bearer_token: 'test-token',
        baseUrl: 'https://tonapi.io/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should resolve domain successfully', async () => {
    const mockResponse = { address: 'EQD1...' };
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('resolveDomain').mockReturnValueOnce('test.ton');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://tonapi.io/v2/dns/test.ton',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get domain bids successfully', async () => {
    const mockResponse = { bids: [] };
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getDomainBids').mockReturnValueOnce('test.ton');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get domains auctions successfully', async () => {
    const mockResponse = { auctions: [] };
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getDomainsAuctions').mockReturnValueOnce('ton');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get domain info successfully', async () => {
    const mockResponse = { domain: 'test.ton', registration_date: 1234567890 };
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getDomainInfo').mockReturnValueOnce('test.ton');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should bulk resolve domains successfully', async () => {
    const mockResponse = { resolved: [] };
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('bulkResolveDomains').mockReturnValueOnce('test1.ton, test2.ton');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://tonapi.io/v2/dns/resolve',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      body: {
        domains: ['test1.ton', 'test2.ton'],
      },
      json: true,
    });
  });

  it('should handle errors with continueOnFail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('resolveDomain').mockReturnValueOnce('test.ton');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeDomainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Staking Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				bearer_token: 'test-token',
				baseUrl: 'https://tonapi.io/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getStakingPools', () => {
		it('should get staking pools successfully', async () => {
			const mockResponse = { pools: [{ id: 'pool1', name: 'Test Pool' }] };
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getStakingPools';
					case 'available_for': return 'test';
					case 'include_unverified': return true;
					default: return undefined;
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors in getStakingPools', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getStakingPools');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeStakingPools.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getStakingPool', () => {
		it('should get staking pool successfully', async () => {
			const mockResponse = { id: 'pool1', name: 'Test Pool' };
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getStakingPool';
					case 'pool_id': return 'pool1';
					default: return undefined;
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getPoolHistory', () => {
		it('should get pool history successfully', async () => {
			const mockResponse = { history: [{ timestamp: 1234567890, amount: '1000' }] };
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getPoolHistory';
					case 'pool_id': return 'pool1';
					case 'limit': return 50;
					case 'offset': return 10;
					default: return undefined;
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAccountStaking', () => {
		it('should get account staking successfully', async () => {
			const mockResponse = { account: 'test-account', staking_info: {} };
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation': return 'getAccountStaking';
					case 'account_id': return 'test-account';
					default: return undefined;
				}
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Blockchain Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        bearerToken: 'test-token',
        baseUrl: 'https://tonapi.io/v2'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getMasterchainInfo', () => {
    it('should get masterchain info successfully', async () => {
      const mockResponse = { workchain: -1, shard: '-9223372036854775808', seqno: 12345 };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getMasterchainInfo');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://tonapi.io/v2/blockchain/masterchain-head',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in getMasterchainInfo', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getMasterchainInfo');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlockchainBlock', () => {
    it('should get blockchain block successfully', async () => {
      const mockResponse = { workchain: 0, shard: '8000000000000000', seqno: 67890 };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockchainBlock')
        .mockReturnValueOnce('test-block-id');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://tonapi.io/v2/blockchain/blocks/test-block-id',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in getBlockchainBlock', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockchainBlock')
        .mockReturnValueOnce('test-block-id');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Block not found'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'Block not found' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlockTransactions', () => {
    it('should get block transactions successfully', async () => {
      const mockResponse = { transactions: [{ hash: 'tx1' }, { hash: 'tx2' }] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockTransactions')
        .mockReturnValueOnce('test-block-id');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://tonapi.io/v2/blockchain/blocks/test-block-id/transactions',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getValidators', () => {
    it('should get validators successfully', async () => {
      const mockResponse = { validators: [{ address: 'val1' }, { address: 'val2' }] };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getValidators');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://tonapi.io/v2/blockchain/validators',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlockchainConfig', () => {
    it('should get blockchain config successfully', async () => {
      const mockResponse = { config: { parameter1: 'value1', parameter2: 'value2' } };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockchainConfig');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://tonapi.io/v2/blockchain/config',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getStatus', () => {
    it('should get blockchain status successfully', async () => {
      const mockResponse = { ready: true, last_known_masterchain_seqno: 12345 };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getStatus');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://tonapi.io/v2/blockchain/status',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});
});
