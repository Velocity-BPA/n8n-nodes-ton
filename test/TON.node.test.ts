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

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
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
describe('Wallets Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://toncenter.com/api/v3',
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

  describe('getAddressInformation', () => {
    it('should successfully get address information', async () => {
      const mockResponse = {
        balance: '1000000000',
        state: 'active',
        code: 'base64encoded',
        data: 'base64encoded'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAddressInformation';
        if (param === 'address') return 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWalletsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://toncenter.com/api/v3/addressInformation?address=EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
        headers: {
          'X-API-Key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle invalid address format', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAddressInformation';
        if (param === 'address') return 'invalid-address';
        return undefined;
      });

      await expect(executeWalletsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid address format');
    });
  });

  describe('getTransactions', () => {
    it('should successfully get transactions', async () => {
      const mockResponse = {
        transactions: [
          { hash: 'tx1', lt: '123456', value: '100000000' },
          { hash: 'tx2', lt: '123455', value: '200000000' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'getTransactions';
        if (param === 'address') return 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        if (param === 'limit') return defaultValue || 10;
        return defaultValue || '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWalletsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('runGetMethod', () => {
    it('should successfully run get method', async () => {
      const mockResponse = {
        gas_used: 1000,
        exit_code: 0,
        stack: [['num', '0x64']]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'runGetMethod';
        if (param === 'address') return 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        if (param === 'method') return 'get_balance';
        if (param === 'stack') return '[]';
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeWalletsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://toncenter.com/api/v3/runGetMethod',
        headers: {
          'X-API-Key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          address: 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
          method: 'get_balance',
          stack: [],
        },
        json: true,
      });
    });

    it('should handle invalid JSON in stack parameter', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'runGetMethod';
        if (param === 'address') return 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        if (param === 'method') return 'get_balance';
        if (param === 'stack') return 'invalid-json';
        return undefined;
      });

      await expect(executeWalletsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid JSON format for stack parameter');
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAddressInformation';
        if (param === 'address') return 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        return undefined;
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeWalletsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Jettons Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://toncenter.com/api/v3',
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

  describe('getJettonMasters', () => {
    it('should get jetton masters successfully', async () => {
      const mockResponse = {
        jetton_masters: [
          { address: '0:123...', total_supply: '1000000' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getJettonMasters';
          case 'limit': return 10;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJettonsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://toncenter.com/api/v3/jetton/masters',
        headers: { 'X-API-Key': 'test-api-key' },
        qs: { limit: 10, offset: 0 },
        json: true,
      });
    });

    it('should handle errors properly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getJettonMasters';
        return 10;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeJettonsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getJettonWallets', () => {
    it('should get jetton wallets successfully', async () => {
      const mockResponse = {
        jetton_wallets: [
          { address: '0:456...', balance: '500000', jetton: '0:123...' }
        ]
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getJettonWallets';
          case 'ownerAddress': return '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
          case 'jettonAddress': return '0:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJettonsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should validate addresses', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getJettonWallets';
          case 'ownerAddress': return 'invalid-address';
          default: return '';
        }
      });

      await expect(
        executeJettonsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid owner address format');
    });
  });

  describe('createJettonTransfer', () => {
    it('should create jetton transfer successfully', async () => {
      const mockResponse = {
        success: true,
        transaction_hash: 'abc123...'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createJettonTransfer';
          case 'jettonAddress': return '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
          case 'fromAddress': return '0:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
          case 'toAddress': return '0:fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321';
          case 'amount': return '1000000';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeJettonsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://toncenter.com/api/v3/jetton/transfer',
        headers: {
          'X-API-Key': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          jetton_address: '0:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          from_address: '0:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          to_address: '0:fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
          amount: '1000000',
        },
        json: true,
      });
    });

    it('should validate transfer parameters', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'createJettonTransfer';
          case 'jettonAddress': return 'invalid-address';
          default: return '';
        }
      });

      await expect(
        executeJettonsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid jetton address format');
    });
  });
});

describe('NFTs Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://toncenter.com/api/v3',
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

  test('should get NFT collections successfully', async () => {
    const mockCollections = { collections: [{ address: 'test-collection' }] };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getNftCollections';
        case 'limit': return 100;
        case 'offset': return 0;
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCollections);
    
    const items = [{ json: {} }];
    const result = await executeNFTsOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockCollections);
  });

  test('should get NFT items for collection successfully', async () => {
    const mockItems = { items: [{ address: 'test-item' }] };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getNftItems';
        case 'collection_address': return '-1:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        case 'limit': return 100;
        case 'offset': return 0;
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockItems);
    
    const items = [{ json: {} }];
    const result = await executeNFTsOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockItems);
  });

  test('should get NFT transfers successfully', async () => {
    const mockTransfers = { transfers: [{ from: 'test-from', to: 'test-to' }] };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getNftTransfers';
        case 'nft_address': return '-1:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        case 'direction': return 'both';
        case 'start_utime': return '';
        case 'end_utime': return '';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransfers);
    
    const items = [{ json: {} }];
    const result = await executeNFTsOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockTransfers);
  });

  test('should get NFT item details successfully', async () => {
    const mockItem = { address: 'test-item', metadata: {} };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getNftItem';
        case 'address': return '-1:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockItem);
    
    const items = [{ json: {} }];
    const result = await executeNFTsOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockItem);
  });

  test('should get NFT collection details successfully', async () => {
    const mockCollection = { address: 'test-collection', metadata: {} };
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getNftCollection';
        case 'address': return '-1:1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCollection);
    
    const items = [{ json: {} }];
    const result = await executeNFTsOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockCollection);
  });

  test('should handle invalid address format', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getNftItem';
        case 'address': return 'invalid-address';
        default: return undefined;
      }
    });
    
    const items = [{ json: {} }];
    
    await expect(executeNFTsOperations.call(mockExecuteFunctions, items))
      .rejects.toThrow('Invalid TON address format');
  });

  test('should handle API errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getNftCollections';
        case 'limit': return 100;
        case 'offset': return 0;
        default: return undefined;
      }
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    
    const items = [{ json: {} }];
    const result = await executeNFTsOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });
});

describe('SmartContracts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://toncenter.com/api/v3',
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

  test('runGetMethod should execute smart contract get method', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'runGetMethod';
        case 'address': return 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        case 'method': return 'get_balance';
        case 'stack': return [];
        case 'network': return 'mainnet';
        default: return undefined;
      }
    });

    const mockResponse = {
      ok: true,
      result: {
        gas_used: 100,
        stack: [['num', '1000000000']],
        exit_code: 0,
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSmartContractsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://toncenter.com/api/v3/runGetMethod',
        body: {
          address: 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t',
          method: 'get_balance',
          stack: [],
        },
      })
    );
  });

  test('sendBoc should send transaction to blockchain', async () => {
    const testBoc = Buffer.from('test transaction data').toString('base64');
    
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'sendBoc';
        case 'boc': return testBoc;
        case 'network': return 'mainnet';
        default: return undefined;
      }
    });

    const mockResponse = {
      ok: true,
      result: {
        message_hash: 'abcd1234567890',
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSmartContractsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://toncenter.com/api/v3/sendBoc',
        body: { boc: testBoc },
      })
    );
  });

  test('estimateFee should estimate transaction fees', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'estimateFee';
        case 'address': return 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        case 'body': return 'te6ccgEBAQEAJAAAQ4ABAP0U+r49EOJ7JAqSLMVNG1IPK5xQiquPS//NcmapoOnr/VhpL0';
        case 'init_code': return '';
        case 'init_data': return '';
        case 'network': return 'mainnet';
        default: return undefined;
      }
    });

    const mockResponse = {
      ok: true,
      result: {
        source_fees: {
          in_fwd_fee: 1000000,
          storage_fee: 0,
          gas_fee: 1000000,
          fwd_fee: 666672,
        },
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSmartContractsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('getConfigParam should get blockchain configuration', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getConfigParam';
        case 'config_id': return 15;
        case 'network': return 'mainnet';
        default: return undefined;
      }
    });

    const mockResponse = {
      ok: true,
      result: {
        config: {
          validators_elected_for: 65536,
          elections_start_before: 32768,
        },
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeSmartContractsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://toncenter.com/api/v3/getConfigParam?config_id=15',
      })
    );
  });

  test('should handle invalid address format', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'runGetMethod';
        case 'address': return 'invalid-address';
        case 'method': return 'get_balance';
        case 'stack': return [];
        case 'network': return 'mainnet';
        default: return undefined;
      }
    });

    await expect(
      executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Invalid TON address format');
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'runGetMethod';
        case 'address': return 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
        case 'method': return 'get_balance';
        case 'stack': return [];
        case 'network': return 'mainnet';
        default: return undefined;
      }
    });

    const apiError = new Error('API Error');
    (apiError as any).httpCode = 400;
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    await expect(
      executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});

describe('DNS Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://toncenter.com/api/v3',
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

  describe('resolveDns', () => {
    it('should resolve DNS domain successfully', async () => {
      const mockResponse = { address: 'EQTest123...', ok: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'resolveDns';
        if (param === 'domain_name') return 'test.ton';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeDNSOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://toncenter.com/api/v3/dns/resolve',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: { domain_name: 'test.ton' },
        json: true,
      });
    });

    it('should handle missing domain name', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'resolveDns';
        if (param === 'domain_name') return '';
        return undefined;
      });

      const items = [{ json: {} }];
      
      await expect(executeDNSOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Domain name is required');
    });
  });

  describe('getDnsDomains', () => {
    it('should get DNS domains successfully', async () => {
      const mockResponse = { domains: ['test1.ton', 'test2.ton'], ok: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue: any) => {
        if (param === 'operation') return 'getDnsDomains';
        if (param === 'limit') return defaultValue || 50;
        if (param === 'offset') return defaultValue || 10;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeDNSOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://toncenter.com/api/v3/dns/domains',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: { limit: 50, offset: 10 },
        json: true,
      });
    });
  });

  describe('getDnsAuctions', () => {
    it('should get DNS auctions successfully', async () => {
      const mockResponse = { auctions: [{ domain: 'test.ton', price: '1000000000' }], ok: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue: any) => {
        if (param === 'operation') return 'getDnsAuctions';
        if (param === 'limit') return defaultValue || 25;
        if (param === 'offset') return defaultValue || 0;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeDNSOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getDnsDomain', () => {
    it('should get specific domain information successfully', async () => {
      const mockResponse = { domain: 'test.ton', owner: 'EQTest123...', ok: true };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getDnsDomain';
        if (param === 'domain') return 'test.ton';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeDNSOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://toncenter.com/api/v3/dns/domain/test.ton',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createDnsBid', () => {
    it('should create DNS bid successfully', async () => {
      const mockResponse = { success: true, transaction_hash: '0xabc123' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'createDnsBid';
        if (param === 'domain') return 'test.ton';
        if (param === 'amount') return '1000000000';
        if (param === 'bidder_address') return 'EQTest123456789012345678901234567890123456789012345678';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeDNSOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://toncenter.com/api/v3/dns/bids',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          domain: 'test.ton',
          amount: '1000000000',
          bidder_address: 'EQTest123456789012345678901234567890123456789012345678',
        },
        json: true,
      });
    });

    it('should handle invalid TON address', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'createDnsBid';
        if (param === 'domain') return 'test.ton';
        if (param === 'amount') return '1000000000';
        if (param === 'bidder_address') return 'invalid-address';
        return undefined;
      });

      const items = [{ json: {} }];
      
      await expect(executeDNSOperations.call(mockExecuteFunctions, items))
        .rejects.toThrow('Invalid TON address format');
    });
  });

  describe('error handling', () => {
    it('should handle API errors with continueOnFail', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('resolveDns');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const items = [{ json: {} }];
      const result = await executeDNSOperations.call(mockExecuteFunctions, items);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Staking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://toncenter.com/api/v3',
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

  describe('getValidators', () => {
    it('should get validators successfully', async () => {
      const mockResponse = {
        validators: [
          { address: 'validator1', stake: '1000000' },
          { address: 'validator2', stake: '2000000' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidators';
          case 'limit': return 50;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://toncenter.com/api/v3/validators',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: { limit: 50, offset: 0 },
        json: true,
      });
    });
  });

  describe('getNominators', () => {
    it('should get nominators successfully', async () => {
      const mockResponse = {
        nominators: [
          { address: 'nominator1', pool: 'pool1' },
          { address: 'nominator2', pool: 'pool2' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getNominators';
          case 'limit': return 25;
          case 'offset': return 10;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
    });
  });

  describe('getStakes', () => {
    it('should get stakes successfully', async () => {
      const mockResponse = {
        stakes: [
          { validator: 'validator1', amount: '1000000' },
          { validator: 'validator2', amount: '500000' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getStakes';
          case 'nominatorAddress': return 'EQAbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMn';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
    });

    it('should throw error for invalid address', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getStakes';
          case 'nominatorAddress': return 'invalid-address';
          default: return undefined;
        }
      });

      await expect(
        executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid TON address format: invalid-address');
    });
  });

  describe('getStakingPools', () => {
    it('should get staking pools successfully', async () => {
      const mockResponse = {
        pools: [
          { id: 'pool1', validators: 5, totalStake: '10000000' },
          { id: 'pool2', validators: 3, totalStake: '5000000' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getStakingPools';
          case 'limit': return 20;
          case 'offset': return 5;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
    });
  });

  describe('delegateStake', () => {
    it('should delegate stake successfully', async () => {
      const mockResponse = {
        success: true,
        transactionId: 'tx123',
        amount: '1000000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'delegateStake';
          case 'validatorAddress': return 'EQValidator1234567890AbCdEfGhIjKlMnOpQrStUvWxYz123';
          case 'amount': return '1000000000';
          case 'nominatorAddress': return 'EQNominator1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: mockResponse, pairedItem: { item: 0 } },
      ]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://toncenter.com/api/v3/staking/delegate',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          validator_address: 'EQValidator1234567890AbCdEfGhIjKlMnOpQrStUvWxYz123',
          amount: '1000000000',
          nominator_address: 'EQNominator1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12',
        },
        json: true,
      });
    });

    it('should throw error for invalid validator address', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'delegateStake';
          case 'validatorAddress': return 'invalid-validator';
          case 'amount': return '1000000000';
          case 'nominatorAddress': return 'EQNominator1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12';
          default: return undefined;
        }
      });

      await expect(
        executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid validator address format: invalid-validator');
    });
  });

  describe('error handling', () => {
    it('should handle API errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidators';
          case 'limit': return 50;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getValidators';
          case 'limit': return 50;
          case 'offset': return 0;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: { error: 'API Error' }, pairedItem: { item: 0 } },
      ]);
    });
  });
});
});
