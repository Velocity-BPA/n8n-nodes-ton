/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-ton/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class TON implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'TON',
    name: 'ton',
    icon: 'file:ton.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the TON API',
    defaults: {
      name: 'TON',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'tonApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Wallets',
            value: 'wallets',
          },
          {
            name: 'Jettons',
            value: 'jettons',
          },
          {
            name: 'NFTs',
            value: 'nFTs',
          },
          {
            name: 'SmartContracts',
            value: 'smartContracts',
          },
          {
            name: 'DNS',
            value: 'dNS',
          },
          {
            name: 'Staking',
            value: 'staking',
          }
        ],
        default: 'wallets',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['wallets'],
    },
  },
  options: [
    {
      name: 'Get Address Information',
      value: 'getAddressInformation',
      description: 'Get wallet balance and state information',
      action: 'Get address information',
    },
    {
      name: 'Get Transactions',
      value: 'getTransactions',
      description: 'Get transaction history for an address',
      action: 'Get transactions',
    },
    {
      name: 'Get Address Book',
      value: 'getAddressBook',
      description: 'Get address book information',
      action: 'Get address book',
    },
    {
      name: 'Detect Address',
      value: 'detectAddress',
      description: 'Detect and validate address format',
      action: 'Detect address',
    },
    {
      name: 'Run Get Method',
      value: 'runGetMethod',
      description: 'Execute get method on wallet contract',
      action: 'Run get method',
    },
  ],
  default: 'getAddressInformation',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['jettons'],
    },
  },
  options: [
    {
      name: 'Get Jetton Masters',
      value: 'getJettonMasters',
      description: 'Get list of jetton master contracts',
      action: 'Get jetton masters',
    },
    {
      name: 'Get Jetton Wallets',
      value: 'getJettonWallets',
      description: 'Get jetton wallet information',
      action: 'Get jetton wallets',
    },
    {
      name: 'Get Jetton Transfers',
      value: 'getJettonTransfers',
      description: 'Get jetton transfer history',
      action: 'Get jetton transfers',
    },
    {
      name: 'Get Jetton Burns',
      value: 'getJettonBurns',
      description: 'Get jetton burn transactions',
      action: 'Get jetton burns',
    },
    {
      name: 'Create Jetton Transfer',
      value: 'createJettonTransfer',
      description: 'Create jetton transfer transaction',
      action: 'Create jetton transfer',
    },
  ],
  default: 'getJettonMasters',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['nFTs'],
    },
  },
  options: [
    {
      name: 'Get NFT Collections',
      value: 'getNftCollections',
      description: 'Get NFT collections list',
      action: 'Get NFT collections',
    },
    {
      name: 'Get NFT Items',
      value: 'getNftItems',
      description: 'Get NFT items in collection',
      action: 'Get NFT items in collection',
    },
    {
      name: 'Get NFT Transfers',
      value: 'getNftTransfers',
      description: 'Get NFT transfer history',
      action: 'Get NFT transfer history',
    },
    {
      name: 'Get NFT Item',
      value: 'getNftItem',
      description: 'Get specific NFT item details',
      action: 'Get NFT item details',
    },
    {
      name: 'Get NFT Collection',
      value: 'getNftCollection',
      description: 'Get NFT collection details',
      action: 'Get NFT collection details',
    },
  ],
  default: 'getNftCollections',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
    },
  },
  options: [
    {
      name: 'Run Get Method',
      value: 'runGetMethod',
      description: 'Execute get method on smart contract',
      action: 'Run get method on smart contract',
    },
    {
      name: 'Send BOC',
      value: 'sendBoc',
      description: 'Send serialized transaction to blockchain',
      action: 'Send serialized transaction to blockchain',
    },
    {
      name: 'Estimate Fee',
      value: 'estimateFee',
      description: 'Estimate transaction fees',
      action: 'Estimate transaction fees',
    },
    {
      name: 'Get Config Parameter',
      value: 'getConfigParam',
      description: 'Get blockchain configuration parameter',
      action: 'Get blockchain configuration parameter',
    },
    {
      name: 'Send Query',
      value: 'sendQuery',
      description: 'Send query to smart contract',
      action: 'Send query to smart contract',
    },
  ],
  default: 'runGetMethod',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['dNS'],
    },
  },
  options: [
    {
      name: 'Resolve DNS',
      value: 'resolveDns',
      description: 'Resolve DNS domain to address',
      action: 'Resolve DNS domain to address',
    },
    {
      name: 'Get DNS Domains',
      value: 'getDnsDomains',
      description: 'Get list of DNS domains',
      action: 'Get list of DNS domains',
    },
    {
      name: 'Get DNS Auctions',
      value: 'getDnsAuctions',
      description: 'Get active DNS auctions',
      action: 'Get active DNS auctions',
    },
    {
      name: 'Get DNS Domain',
      value: 'getDnsDomain',
      description: 'Get specific domain information',
      action: 'Get specific domain information',
    },
    {
      name: 'Create DNS Bid',
      value: 'createDnsBid',
      description: 'Create bid for DNS auction',
      action: 'Create bid for DNS auction',
    },
  ],
  default: 'resolveDns',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['staking'],
    },
  },
  options: [
    {
      name: 'Get Validators',
      value: 'getValidators',
      description: 'Get list of active validators',
      action: 'Get validators',
    },
    {
      name: 'Get Nominators',
      value: 'getNominators',
      description: 'Get nominator pool information',
      action: 'Get nominators',
    },
    {
      name: 'Get Stakes',
      value: 'getStakes',
      description: 'Get staking information for address',
      action: 'Get stakes',
    },
    {
      name: 'Get Staking Pools',
      value: 'getStakingPools',
      description: 'Get available staking pools',
      action: 'Get staking pools',
    },
    {
      name: 'Delegate Stake',
      value: 'delegateStake',
      description: 'Delegate stake to validator',
      action: 'Delegate stake',
    },
  ],
  default: 'getValidators',
},
      // Parameter definitions
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['getAddressInformation'],
    },
  },
  default: '',
  description: 'Wallet address to get information for (raw or user-friendly format)',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Wallet address to get transactions for (raw or user-friendly format)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['getTransactions'],
    },
  },
  default: 10,
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Logical Time (LT)',
  name: 'lt',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Logical time to start from (optional)',
},
{
  displayName: 'Hash',
  name: 'hash',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Transaction hash to start from (optional)',
},
{
  displayName: 'To Logical Time (to_lt)',
  name: 'to_lt',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Logical time to end at (optional)',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['getAddressBook'],
    },
  },
  default: '',
  description: 'Address to get address book information for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['detectAddress'],
    },
  },
  default: '',
  description: 'Address to detect and validate format',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['runGetMethod'],
    },
  },
  default: '',
  description: 'Contract address to execute get method on',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['runGetMethod'],
    },
  },
  default: '',
  description: 'Method name to execute',
},
{
  displayName: 'Stack',
  name: 'stack',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['wallets'],
      operation: ['runGetMethod'],
    },
  },
  default: '[]',
  description: 'Stack parameters for the method call',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 10,
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['getJettonMasters'],
    },
  },
  description: 'Maximum number of jetton masters to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['getJettonMasters'],
    },
  },
  description: 'Number of jetton masters to skip',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  default: '',
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['getJettonWallets'],
    },
  },
  description: 'Owner address of the jetton wallet',
},
{
  displayName: 'Jetton Address',
  name: 'jettonAddress',
  type: 'string',
  default: '',
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['getJettonWallets', 'getJettonTransfers', 'getJettonBurns', 'createJettonTransfer'],
    },
  },
  description: 'Address of the jetton master contract',
},
{
  displayName: 'Direction',
  name: 'direction',
  type: 'options',
  default: 'both',
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['getJettonTransfers'],
    },
  },
  options: [
    {
      name: 'Both',
      value: 'both',
    },
    {
      name: 'In',
      value: 'in',
    },
    {
      name: 'Out',
      value: 'out',
    },
  ],
  description: 'Direction of transfers to query',
},
{
  displayName: 'Start Time',
  name: 'startUtime',
  type: 'number',
  default: 0,
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['getJettonTransfers', 'getJettonBurns'],
    },
  },
  description: 'Start time (Unix timestamp)',
},
{
  displayName: 'End Time',
  name: 'endUtime',
  type: 'number',
  default: 0,
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['getJettonTransfers', 'getJettonBurns'],
    },
  },
  description: 'End time (Unix timestamp)',
},
{
  displayName: 'From Address',
  name: 'fromAddress',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['createJettonTransfer'],
    },
  },
  description: 'Source address for the jetton transfer',
},
{
  displayName: 'To Address',
  name: 'toAddress',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['createJettonTransfer'],
    },
  },
  description: 'Destination address for the jetton transfer',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  default: '',
  displayOptions: {
    show: {
      resource: ['jettons'],
      operation: ['createJettonTransfer'],
    },
  },
  description: 'Amount to transfer (in smallest units)',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNftCollections', 'getNftItems'],
    },
  },
  default: 100,
  description: 'Maximum number of items to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNftCollections', 'getNftItems'],
    },
  },
  default: 0,
  description: 'Number of items to skip',
},
{
  displayName: 'Collection Address',
  name: 'collection_address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNftItems'],
    },
  },
  default: '',
  description: 'NFT collection address',
},
{
  displayName: 'NFT Address',
  name: 'nft_address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNftTransfers'],
    },
  },
  default: '',
  description: 'NFT item address',
},
{
  displayName: 'Direction',
  name: 'direction',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNftTransfers'],
    },
  },
  options: [
    {
      name: 'In',
      value: 'in',
    },
    {
      name: 'Out',
      value: 'out',
    },
    {
      name: 'Both',
      value: 'both',
    },
  ],
  default: 'both',
  description: 'Transfer direction',
},
{
  displayName: 'Start Time',
  name: 'start_utime',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNftTransfers'],
    },
  },
  default: '',
  description: 'Start time (Unix timestamp)',
},
{
  displayName: 'End Time',
  name: 'end_utime',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNftTransfers'],
    },
  },
  default: '',
  description: 'End time (Unix timestamp)',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFTs'],
      operation: ['getNftItem', 'getNftCollection'],
    },
  },
  default: '',
  description: 'NFT item or collection address',
},
{
  displayName: 'Contract Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['runGetMethod', 'estimateFee', 'sendQuery'],
    },
  },
  default: '',
  description: 'The smart contract address (raw or user-friendly format)',
},
{
  displayName: 'Method Name',
  name: 'method',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['runGetMethod'],
    },
  },
  default: '',
  description: 'Name of the get method to execute',
},
{
  displayName: 'Stack Parameters',
  name: 'stack',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['runGetMethod'],
    },
  },
  default: '[]',
  description: 'Array of parameters for the method call',
},
{
  displayName: 'BOC (Bag of Cells)',
  name: 'boc',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['sendBoc'],
    },
  },
  default: '',
  description: 'Base64-encoded serialized transaction (BOC format)',
},
{
  displayName: 'Body',
  name: 'body',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['estimateFee', 'sendQuery'],
    },
  },
  default: '',
  description: 'Base64-encoded message body',
},
{
  displayName: 'Init Code',
  name: 'init_code',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['estimateFee'],
    },
  },
  default: '',
  description: 'Base64-encoded initial code (optional)',
},
{
  displayName: 'Init Data',
  name: 'init_data',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['estimateFee'],
    },
  },
  default: '',
  description: 'Base64-encoded initial data (optional)',
},
{
  displayName: 'Config ID',
  name: 'config_id',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getConfigParam'],
    },
  },
  default: 0,
  description: 'Configuration parameter ID to retrieve',
},
{
  displayName: 'Network',
  name: 'network',
  type: 'options',
  options: [
    {
      name: 'Mainnet',
      value: 'mainnet',
    },
    {
      name: 'Testnet',
      value: 'testnet',
    },
  ],
  default: 'mainnet',
  description: 'Choose the TON network',
},
{
  displayName: 'Domain Name',
  name: 'domain_name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dNS'],
      operation: ['resolveDns'],
    },
  },
  default: '',
  description: 'The DNS domain name to resolve',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['dNS'],
      operation: ['getDnsDomains', 'getDnsAuctions'],
    },
  },
  default: 100,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['dNS'],
      operation: ['getDnsDomains', 'getDnsAuctions'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
},
{
  displayName: 'Domain',
  name: 'domain',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dNS'],
      operation: ['getDnsDomain'],
    },
  },
  default: '',
  description: 'The specific domain to get information for',
},
{
  displayName: 'Domain',
  name: 'domain',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dNS'],
      operation: ['createDnsBid'],
    },
  },
  default: '',
  description: 'The domain to bid on',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dNS'],
      operation: ['createDnsBid'],
    },
  },
  default: '',
  description: 'The bid amount in nanotons',
},
{
  displayName: 'Bidder Address',
  name: 'bidder_address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['dNS'],
      operation: ['createDnsBid'],
    },
  },
  default: '',
  description: 'The address of the bidder',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getValidators', 'getNominators', 'getStakingPools'],
    },
  },
  default: 50,
  description: 'Maximum number of items to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getValidators', 'getNominators', 'getStakingPools'],
    },
  },
  default: 0,
  description: 'Number of items to skip',
},
{
  displayName: 'Nominator Address',
  name: 'nominatorAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakes'],
    },
  },
  default: '',
  description: 'The nominator address to get staking information for',
},
{
  displayName: 'Validator Address',
  name: 'validatorAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['delegateStake'],
    },
  },
  default: '',
  description: 'The validator address to delegate stake to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['delegateStake'],
    },
  },
  default: '',
  description: 'The amount to stake (in nanoTON)',
},
{
  displayName: 'Nominator Address',
  name: 'nominatorAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['delegateStake'],
    },
  },
  default: '',
  description: 'The nominator address making the delegation',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'wallets':
        return [await executeWalletsOperations.call(this, items)];
      case 'jettons':
        return [await executeJettonsOperations.call(this, items)];
      case 'nFTs':
        return [await executeNFTsOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'dNS':
        return [await executeDNSOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeWalletsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tonApi') as any;

  function validateAddress(address: string): boolean {
    if (!address) return false;
    // Basic validation for TON address formats
    return address.length >= 48 && (address.includes(':') || address.match(/^[A-Za-z0-9_-]+$/));
  }

  function buildQueryParams(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    return searchParams.toString();
  }

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAddressInformation': {
          const address = this.getNodeParameter('address', i) as string;
          
          if (!validateAddress(address)) {
            throw new NodeOperationError(this.getNode(), 'Invalid address format');
          }

          const queryParams = buildQueryParams({ address });
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/addressInformation?${queryParams}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTransactions': {
          const address = this.getNodeParameter('address', i) as string;
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const lt = this.getNodeParameter('lt', i, '') as string;
          const hash = this.getNodeParameter('hash', i, '') as string;
          const to_lt = this.getNodeParameter('to_lt', i, '') as string;
          
          if (!validateAddress(address)) {
            throw new NodeOperationError(this.getNode(), 'Invalid address format');
          }

          const queryParams = buildQueryParams({ 
            address, 
            limit: Math.min(limit, 100), // Limit max to 100 for API constraints
            lt, 
            hash, 
            to_lt 
          });
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getTransactions?${queryParams}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressBook': {
          const address = this.getNodeParameter('address', i) as string;
          
          if (!validateAddress(address)) {
            throw new NodeOperationError(this.getNode(), 'Invalid address format');
          }

          const queryParams = buildQueryParams({ address });
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/addressBook?${queryParams}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'detectAddress': {
          const address = this.getNodeParameter('address', i) as string;
          
          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Address parameter is required');
          }

          const queryParams = buildQueryParams({ address });
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/detectAddress?${queryParams}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'runGetMethod': {
          const address = this.getNodeParameter('address', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const stackParam = this.getNodeParameter('stack', i, '[]') as string;
          
          if (!validateAddress(address)) {
            throw new NodeOperationError(this.getNode(), 'Invalid address format');
          }

          if (!method) {
            throw new NodeOperationError(this.getNode(), 'Method parameter is required');
          }

          let stack: any[];
          try {
            stack = typeof stackParam === 'string' ? JSON.parse(stackParam) : stackParam;
          } catch (parseError: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON format for stack parameter');
          }

          const requestBody: any = {
            address,
            method,
            stack,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/runGetMethod`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: result, 
        pairedItem: { item: i } 
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

function validateTonAddress(address: string): boolean {
  if (!address) return false;
  
  // Basic TON address validation - can be raw format (0:hex) or user-friendly format
  const rawFormat = /^-?[0-9]:[a-fA-F0-9]{64}$/;
  const userFriendlyFormat = /^[a-zA-Z0-9_-]{48}$/;
  
  return rawFormat.test(address) || userFriendlyFormat.test(address);
}

async function executeJettonsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getJettonMasters': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/jetton/masters`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getJettonWallets': {
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
          const jettonAddress = this.getNodeParameter('jettonAddress', i) as string;

          if (ownerAddress && !validateTonAddress(ownerAddress)) {
            throw new NodeOperationError(this.getNode(), 'Invalid owner address format');
          }
          if (jettonAddress && !validateTonAddress(jettonAddress)) {
            throw new NodeOperationError(this.getNode(), 'Invalid jetton address format');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/jetton/wallets`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {},
            json: true,
          };

          if (ownerAddress) options.qs.owner_address = ownerAddress;
          if (jettonAddress) options.qs.jetton_address = jettonAddress;

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getJettonTransfers': {
          const jettonAddress = this.getNodeParameter('jettonAddress', i) as string;
          const direction = this.getNodeParameter('direction', i) as string;
          const startUtime = this.getNodeParameter('startUtime', i) as number;
          const endUtime = this.getNodeParameter('endUtime', i) as number;

          if (!validateTonAddress(jettonAddress)) {
            throw new NodeOperationError(this.getNode(), 'Invalid jetton address format');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/jetton/transfers`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              jetton_address: jettonAddress,
            },
            json: true,
          };

          if (direction && direction !== 'both') options.qs.direction = direction;
          if (startUtime) options.qs.start_utime = startUtime;
          if (endUtime) options.qs.end_utime = endUtime;

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getJettonBurns': {
          const jettonAddress = this.getNodeParameter('jettonAddress', i) as string;
          const startUtime = this.getNodeParameter('startUtime', i) as number;
          const endUtime = this.getNodeParameter('endUtime', i) as number;

          if (!validateTonAddress(jettonAddress)) {
            throw new NodeOperationError(this.getNode(), 'Invalid jetton address format');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/jetton/burns`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              jetton_address: jettonAddress,
            },
            json: true,
          };

          if (startUtime) options.qs.start_utime = startUtime;
          if (endUtime) options.qs.end_utime = endUtime;

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createJettonTransfer': {
          const jettonAddress = this.getNodeParameter('jettonAddress', i) as string;
          const fromAddress = this.getNodeParameter('fromAddress', i) as string;
          const toAddress = this.getNodeParameter('toAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;

          if (!validateTonAddress(jettonAddress)) {
            throw new NodeOperationError(this.getNode(), 'Invalid jetton address format');
          }
          if (!validateTonAddress(fromAddress)) {
            throw new NodeOperationError(this.getNode(), 'Invalid from address format');
          }
          if (!validateTonAddress(toAddress)) {
            throw new NodeOperationError(this.getNode(), 'Invalid to address format');
          }
          if (!amount || isNaN(Number(amount))) {
            throw new NodeOperationError(this.getNode(), 'Invalid amount format');
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/jetton/transfer`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              jetton_address: jettonAddress,
              from_address: fromAddress,
              to_address: toAddress,
              amount: amount,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error.responseBody, { httpCode: error.httpCode });
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

function validateTonAddress(address: string): string {
  if (!address) {
    throw new Error('Address is required');
  }
  
  // Basic TON address validation - check if it's raw or user-friendly format
  const rawAddressPattern = /^-?1:[a-fA-F0-9]{64}$/;
  const userFriendlyPattern = /^[A-Za-z0-9_-]{48}$/;
  
  if (!rawAddressPattern.test(address) && !userFriendlyPattern.test(address)) {
    throw new Error('Invalid TON address format');
  }
  
  return address;
}

async function executeNFTsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getNftCollections': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/nft/collections`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getNftItems': {
          const collectionAddress = this.getNodeParameter('collection_address', i) as string;
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          validateTonAddress(collectionAddress);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/nft/items`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              collection_address: collectionAddress,
              limit,
              offset,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getNftTransfers': {
          const nftAddress = this.getNodeParameter('nft_address', i) as string;
          const direction = this.getNodeParameter('direction', i, 'both') as string;
          const startUtime = this.getNodeParameter('start_utime', i, '') as number;
          const endUtime = this.getNodeParameter('end_utime', i, '') as number;
          
          validateTonAddress(nftAddress);
          
          const queryParams: any = {
            nft_address: nftAddress,
            direction,
          };
          
          if (startUtime) {
            queryParams.start_utime = startUtime;
          }
          
          if (endUtime) {
            queryParams.end_utime = endUtime;
          }
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/nft/transfers`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            qs: queryParams,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getNftItem': {
          const address = this.getNodeParameter('address', i) as string;
          
          validateTonAddress(address);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/nft/items/${encodeURIComponent(address)}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getNftCollection': {
          const address = this.getNodeParameter('address', i) as string;
          
          validateTonAddress(address);
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/nft/collections/${encodeURIComponent(address)}`,
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

function validateTonAddress(address: string): boolean {
  if (!address) return false;
  
  // Raw address format: 64 hex characters with optional prefix
  const rawFormat = /^(-?[0-9]+:)?[0-9a-fA-F]{64}$/;
  
  // User-friendly format: base64url encoded
  const friendlyFormat = /^[A-Za-z0-9_-]{48}$/;
  
  return rawFormat.test(address) || friendlyFormat.test(address);
}

function getApiUrl(network: string, endpoint: string): string {
  const baseUrl = network === 'testnet' 
    ? 'https://testnet.toncenter.com/api/v3' 
    : 'https://toncenter.com/api/v3';
  return `${baseUrl}${endpoint}`;
}

async function executeSmartContractsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const network = this.getNodeParameter('network', i, 'mainnet') as string;

      switch (operation) {
        case 'runGetMethod': {
          const address = this.getNodeParameter('address', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const stack = this.getNodeParameter('stack', i, []) as any[];

          if (!validateTonAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid TON address format: ${address}`);
          }

          const body = {
            address,
            method,
            stack,
          };

          const options: any = {
            method: 'POST',
            url: getApiUrl(network, '/runGetMethod'),
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'sendBoc': {
          const boc = this.getNodeParameter('boc', i) as string;

          if (!boc) {
            throw new NodeOperationError(this.getNode(), 'BOC parameter is required');
          }

          // Validate base64 encoding
          try {
            Buffer.from(boc, 'base64');
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid base64 BOC format: ${error.message}`);
          }

          const body = { boc };

          const options: any = {
            method: 'POST',
            url: getApiUrl(network, '/sendBoc'),
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateFee': {
          const address = this.getNodeParameter('address', i) as string;
          const body = this.getNodeParameter('body', i) as string;
          const init_code = this.getNodeParameter('init_code', i, '') as string;
          const init_data = this.getNodeParameter('init_data', i, '') as string;

          if (!validateTonAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid TON address format: ${address}`);
          }

          if (!body) {
            throw new NodeOperationError(this.getNode(), 'Body parameter is required');
          }

          const requestBody: any = {
            address,
            body,
          };

          if (init_code) {
            requestBody.init_code = init_code;
          }

          if (init_data) {
            requestBody.init_data = init_data;
          }

          const options: any = {
            method: 'POST',
            url: getApiUrl(network, '/estimateFee'),
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getConfigParam': {
          const config_id = this.getNodeParameter('config_id', i) as number;

          if (typeof config_id !== 'number' || config_id < 0) {
            throw new NodeOperationError(this.getNode(), 'Config ID must be a non-negative number');
          }

          const options: any = {
            method: 'GET',
            url: getApiUrl(network, `/getConfigParam?config_id=${config_id}`),
            headers: {
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'sendQuery': {
          const address = this.getNodeParameter('address', i) as string;
          const body = this.getNodeParameter('body', i) as string;

          if (!validateTonAddress(address)) {
            throw new NodeOperationError(this.getNode(), `Invalid TON address format: ${address}`);
          }

          if (!body) {
            throw new NodeOperationError(this.getNode(), 'Body parameter is required');
          }

          const requestBody = {
            address,
            body,
          };

          const options: any = {
            method: 'POST',
            url: getApiUrl(network, '/sendQuery'),
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

function validateTonAddress(address: string): boolean {
  // Basic validation for TON address format
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Raw address format (64 hex characters)
  if (/^[0-9a-fA-F]{64}$/.test(address)) {
    return true;
  }
  
  // User-friendly format (starts with EQ, UQ, or kQ and contains base64 characters)
  if (/^[EUkQ]{1}[QA-Za-z0-9_-]{46,47}$/.test(address)) {
    return true;
  }
  
  return false;
}

async function executeDNSOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'resolveDns': {
          const domainName = this.getNodeParameter('domain_name', i) as string;
          
          if (!domainName) {
            throw new NodeOperationError(this.getNode(), 'Domain name is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/dns/resolve`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              domain_name: domainName,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDnsDomains': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/dns/domains`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit: limit,
              offset: offset,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDnsAuctions': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/dns/auctions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit: limit,
              offset: offset,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDnsDomain': {
          const domain = this.getNodeParameter('domain', i) as string;
          
          if (!domain) {
            throw new NodeOperationError(this.getNode(), 'Domain is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/dns/domain/${encodeURIComponent(domain)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createDnsBid': {
          const domain = this.getNodeParameter('domain', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const bidderAddress = this.getNodeParameter('bidder_address', i) as string;
          
          if (!domain) {
            throw new NodeOperationError(this.getNode(), 'Domain is required');
          }
          
          if (!amount) {
            throw new NodeOperationError(this.getNode(), 'Amount is required');
          }
          
          if (!bidderAddress) {
            throw new NodeOperationError(this.getNode(), 'Bidder address is required');
          }
          
          if (!validateTonAddress(bidderAddress)) {
            throw new NodeOperationError(this.getNode(), 'Invalid TON address format');
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/dns/bids`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              domain: domain,
              amount: amount,
              bidder_address: bidderAddress,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

function validateTonAddress(address: string): boolean {
  // Basic TON address validation
  if (!address || typeof address !== 'string') {
    return false;
  }
  
  // Raw address format (64 hex characters)
  if (/^[0-9a-fA-F]{64}$/.test(address)) {
    return true;
  }
  
  // User-friendly format (starts with EQ, UQ, or kQ)
  if (/^(EQ|UQ|kQ)[A-Za-z0-9_-]{46}$/.test(address)) {
    return true;
  }
  
  return false;
}

async function executeStakingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('tonApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getValidators': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/validators`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNominators': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/nominators`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStakes': {
          const nominatorAddress = this.getNodeParameter('nominatorAddress', i) as string;

          if (!validateTonAddress(nominatorAddress)) {
            throw new NodeOperationError(
              this.getNode(),
              `Invalid TON address format: ${nominatorAddress}`,
            );
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/stakes`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              nominator_address: nominatorAddress,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStakingPools': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/staking/pools`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delegateStake': {
          const validatorAddress = this.getNodeParameter('validatorAddress', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const nominatorAddress = this.getNodeParameter('nominatorAddress', i) as string;

          if (!validateTonAddress(validatorAddress)) {
            throw new NodeOperationError(
              this.getNode(),
              `Invalid validator address format: ${validatorAddress}`,
            );
          }

          if (!validateTonAddress(nominatorAddress)) {
            throw new NodeOperationError(
              this.getNode(),
              `Invalid nominator address format: ${nominatorAddress}`,
            );
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/staking/delegate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              validator_address: validatorAddress,
              amount,
              nominator_address: nominatorAddress,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
