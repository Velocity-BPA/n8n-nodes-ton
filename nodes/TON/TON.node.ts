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
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Jetton',
            value: 'jetton',
          },
          {
            name: 'NFT',
            value: 'nFT',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Domain',
            value: 'domain',
          },
          {
            name: 'Staking',
            value: 'staking',
          },
          {
            name: 'Blockchain',
            value: 'blockchain',
          },
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
          }
        ],
        default: 'account',
      },
      // Operation dropdowns per resource
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['account'],
		},
	},
	options: [
		{
			name: 'Get Account',
			value: 'getAccount',
			description: 'Get account info by address',
			action: 'Get account info',
		},
		{
			name: 'Run Get Method',
			value: 'runGetMethod',
			description: 'Execute get method for account',
			action: 'Run get method for account',
		},
		{
			name: 'Get Account Jettons',
			value: 'getAccountJettons',
			description: "Get account's jetton balances",
			action: 'Get account jetton balances',
		},
		{
			name: 'Get Account Events',
			value: 'getAccountEvents',
			description: 'Get account transaction events',
			action: 'Get account transaction events',
		},
		{
			name: 'Get Bulk Accounts',
			value: 'getBulkAccounts',
			description: 'Get multiple accounts info',
			action: 'Get multiple accounts info',
		},
		{
			name: 'Get Account Diff',
			value: 'getAccountDiff',
			description: 'Get account state changes',
			action: 'Get account state changes',
		},
	],
	default: 'getAccount',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['jetton'],
		},
	},
	options: [
		{
			name: 'Get Jetton',
			value: 'getJetton',
			description: 'Get jetton metadata and info',
			action: 'Get jetton metadata and info',
		},
		{
			name: 'Get Jettons',
			value: 'getJettons',
			description: 'Get list of jettons',
			action: 'Get list of jettons',
		},
		{
			name: 'Get Jetton Holders',
			value: 'getJettonHolders',
			description: 'Get jetton holders list',
			action: 'Get jetton holders list',
		},
		{
			name: 'Get Bulk Jettons',
			value: 'getBulkJettons',
			description: 'Get multiple jettons info',
			action: 'Get multiple jettons info',
		},
		{
			name: 'Get Jetton Transfers',
			value: 'getJettonTransfers',
			description: 'Get jetton transfer history',
			action: 'Get jetton transfer history',
		},
	],
	default: 'getJetton',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['nFT'] } },
  options: [
    {
      name: 'Get NFT Collections',
      value: 'getNFTCollections',
      description: 'Get NFT collections list',
      action: 'Get NFT collections',
    },
    {
      name: 'Get NFT Collection',
      value: 'getNFTCollection',
      description: 'Get NFT collection info',
      action: 'Get NFT collection',
    },
    {
      name: 'Get Collection Items',
      value: 'getCollectionItems',
      description: 'Get NFT items in collection',
      action: 'Get collection items',
    },
    {
      name: 'Get NFT',
      value: 'getNFT',
      description: 'Get individual NFT info',
      action: 'Get NFT',
    },
    {
      name: 'Get NFT History',
      value: 'getNFTHistory',
      description: 'Get NFT transfer history',
      action: 'Get NFT history',
    },
    {
      name: 'Get Bulk NFTs',
      value: 'getBulkNFTs',
      description: 'Get multiple NFTs info',
      action: 'Get bulk NFTs',
    },
  ],
  default: 'getNFTCollections',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transaction'] } },
  options: [
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction by hash', action: 'Get transaction by hash' },
    { name: 'Get Bulk Transactions', value: 'getBulkTransactions', description: 'Get multiple transactions', action: 'Get multiple transactions' },
    { name: 'Get Transactions', value: 'getTransactions', description: 'Get transactions list', action: 'Get transactions list' },
    { name: 'Get Transaction Trace', value: 'getTransactionTrace', description: 'Get transaction execution trace', action: 'Get transaction execution trace' },
    { name: 'Emulate Transaction', value: 'emulateTransaction', description: 'Emulate transaction execution', action: 'Emulate transaction execution' }
  ],
  default: 'getTransaction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['domain'] } },
  options: [
    { name: 'Resolve Domain', value: 'resolveDomain', description: 'Resolve domain to address', action: 'Resolve domain to address' },
    { name: 'Get Domain Bids', value: 'getDomainBids', description: 'Get domain auction bids', action: 'Get domain auction bids' },
    { name: 'Get Domains Auctions', value: 'getDomainsAuctions', description: 'Get active domain auctions', action: 'Get active domain auctions' },
    { name: 'Get Domain Info', value: 'getDomainInfo', description: 'Get domain registration info', action: 'Get domain registration info' },
    { name: 'Bulk Resolve Domains', value: 'bulkResolveDomains', description: 'Resolve multiple domains', action: 'Resolve multiple domains' }
  ],
  default: 'resolveDomain',
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
			name: 'Get Staking Pools',
			value: 'getStakingPools',
			description: 'Get list of staking pools',
			action: 'Get staking pools',
		},
		{
			name: 'Get Staking Pool',
			value: 'getStakingPool',
			description: 'Get staking pool info',
			action: 'Get staking pool',
		},
		{
			name: 'Get Pool History',
			value: 'getPoolHistory',
			description: 'Get pool staking history',
			action: 'Get pool history',
		},
		{
			name: 'Get Account Staking',
			value: 'getAccountStaking',
			description: 'Get account staking info',
			action: 'Get account staking',
		},
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
			name: 'Delegate Stake',
			value: 'delegateStake',
			description: 'Delegate stake to validator',
			action: 'Delegate stake',
		},
	],
	default: 'getStakingPools',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['blockchain'] } },
  options: [
    { name: 'Get Masterchain Info', value: 'getMasterchainInfo', description: 'Get masterchain head block info', action: 'Get masterchain info' },
    { name: 'Get Blockchain Block', value: 'getBlockchainBlock', description: 'Get block information', action: 'Get blockchain block' },
    { name: 'Get Block Transactions', value: 'getBlockTransactions', description: 'Get block transactions', action: 'Get block transactions' },
    { name: 'Get Validators', value: 'getValidators', description: 'Get current validators set', action: 'Get validators' },
    { name: 'Get Blockchain Config', value: 'getBlockchainConfig', description: 'Get blockchain configuration', action: 'Get blockchain config' },
    { name: 'Get Status', value: 'getStatus', description: 'Get blockchain status and info', action: 'Get status' }
  ],
  default: 'getMasterchainInfo',
},
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
      // Parameter definitions
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccount'],
		},
	},
	default: '',
	placeholder: 'EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF',
	description: 'Account identifier (address)',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['runGetMethod'],
		},
	},
	default: '',
	placeholder: 'EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF',
	description: 'Account identifier (address)',
},
{
	displayName: 'Method Name',
	name: 'methodName',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['runGetMethod'],
		},
	},
	default: '',
	placeholder: 'get_balance',
	description: 'Method name to execute',
},
{
	displayName: 'Arguments',
	name: 'args',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['runGetMethod'],
		},
	},
	default: '',
	placeholder: '["arg1", "arg2"]',
	description: 'JSON array of method arguments',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountJettons'],
		},
	},
	default: '',
	placeholder: 'EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF',
	description: 'Account identifier (address)',
},
{
	displayName: 'Currencies',
	name: 'currencies',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountJettons'],
		},
	},
	default: '',
	placeholder: 'ton,usdt',
	description: 'Comma-separated list of currencies to filter by',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountEvents'],
		},
	},
	default: '',
	placeholder: 'EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF',
	description: 'Account identifier (address)',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountEvents'],
		},
	},
	default: 100,
	description: 'Maximum number of events to return',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountEvents'],
		},
	},
	default: '',
	description: 'Start date for events filter',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountEvents'],
		},
	},
	default: '',
	description: 'End date for events filter',
},
{
	displayName: 'Account IDs',
	name: 'accountIds',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getBulkAccounts'],
		},
	},
	default: '',
	placeholder: 'EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF,EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
	description: 'Comma-separated list of account addresses',
},
{
	displayName: 'Account ID',
	name: 'accountId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountDiff'],
		},
	},
	default: '',
	placeholder: 'EQDKbjIcfM6ezt8KjKJJLshZJJSqX7XOA4ff-W72r5gqPrHF',
	description: 'Account identifier (address)',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountDiff'],
		},
	},
	default: '',
	description: 'Start date for diff comparison',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	required: true,
	displayOptions: {
		show: {
			resource: ['account'],
			operation: ['getAccountDiff'],
		},
	},
	default: '',
	description: 'End date for diff comparison',
},
{
	displayName: 'Jetton ID',
	name: 'jettonId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJetton'],
		},
	},
	default: '',
	description: 'The jetton identifier',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettons'],
		},
	},
	default: 100,
	description: 'Maximum number of jettons to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettons'],
		},
	},
	default: 0,
	description: 'Number of jettons to skip',
},
{
	displayName: 'Jetton ID',
	name: 'jettonId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettonHolders'],
		},
	},
	default: '',
	description: 'The jetton identifier',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettonHolders'],
		},
	},
	default: 100,
	description: 'Maximum number of holders to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettonHolders'],
		},
	},
	default: 0,
	description: 'Number of holders to skip',
},
{
	displayName: 'Jetton IDs',
	name: 'jettonIds',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getBulkJettons'],
		},
	},
	default: '',
	description: 'Comma-separated list of jetton identifiers',
},
{
	displayName: 'Jetton ID',
	name: 'jettonId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettonTransfers'],
		},
	},
	default: '',
	description: 'The jetton identifier',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettonTransfers'],
		},
	},
	default: 100,
	description: 'Maximum number of transfers to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettonTransfers'],
		},
	},
	default: 0,
	description: 'Number of transfers to skip',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettonTransfers'],
		},
	},
	default: '',
	description: 'Filter transfers from this date',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['jetton'],
			operation: ['getJettonTransfers'],
		},
	},
	default: '',
	description: 'Filter transfers until this date',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getNFTCollections'],
    },
  },
  default: 50,
  description: 'Maximum number of collections to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getNFTCollections'],
    },
  },
  default: 0,
  description: 'Number of collections to skip',
},
{
  displayName: 'Collection Address',
  name: 'collectionAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getNFTCollection', 'getCollectionItems'],
    },
  },
  default: '',
  description: 'The address of the NFT collection',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getCollectionItems'],
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
      resource: ['nFT'],
      operation: ['getCollectionItems'],
    },
  },
  default: 0,
  description: 'Number of items to skip',
},
{
  displayName: 'NFT Address',
  name: 'nftAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getNFT', 'getNFTHistory'],
    },
  },
  default: '',
  description: 'The address of the NFT',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getNFTHistory'],
    },
  },
  default: 50,
  description: 'Maximum number of history records to return',
},
{
  displayName: 'Start Date',
  name: 'startDate',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getNFTHistory'],
    },
  },
  default: '',
  description: 'Start date for history query (Unix timestamp)',
},
{
  displayName: 'End Date',
  name: 'endDate',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getNFTHistory'],
    },
  },
  default: '',
  description: 'End date for history query (Unix timestamp)',
},
{
  displayName: 'NFT Addresses',
  name: 'nftAddresses',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nFT'],
      operation: ['getBulkNFTs'],
    },
  },
  default: '',
  description: 'Comma-separated list of NFT addresses',
},
{
  displayName: 'Transaction ID',
  name: 'transactionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransaction']
    }
  },
  default: '',
  description: 'Transaction hash to retrieve'
},
{
  displayName: 'Transaction IDs',
  name: 'transactionIds',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getBulkTransactions']
    }
  },
  default: '',
  description: 'Comma-separated list of transaction IDs'
},
{
  displayName: 'Workchain',
  name: 'workchain',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransactions']
    }
  },
  default: 0,
  description: 'Workchain ID'
},
{
  displayName: 'Shard',
  name: 'shard',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransactions']
    }
  },
  default: '',
  description: 'Shard ID in hex format'
},
{
  displayName: 'Sequence Number',
  name: 'seqno',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransactions']
    }
  },
  default: 0,
  description: 'Sequence number'
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransactions']
    }
  },
  default: 100,
  description: 'Maximum number of transactions to return'
},
{
  displayName: 'Transaction ID',
  name: 'transactionId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['getTransactionTrace']
    }
  },
  default: '',
  description: 'Transaction hash to get execution trace for'
},
{
  displayName: 'BOC',
  name: 'boc',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transaction'],
      operation: ['emulateTransaction']
    }
  },
  default: '',
  description: 'Bag of Cells (BOC) data for transaction emulation'
},
{
  displayName: 'Domain Name',
  name: 'domainName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['domain'], operation: ['resolveDomain'] } },
  default: '',
  description: 'The domain name to resolve'
},
{
  displayName: 'Domain Name',
  name: 'domainName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['domain'], operation: ['getDomainBids'] } },
  default: '',
  description: 'The domain name to get auction bids for'
},
{
  displayName: 'TLD',
  name: 'tld',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['domain'], operation: ['getDomainsAuctions'] } },
  default: '',
  description: 'Top-level domain to filter auctions'
},
{
  displayName: 'Domain Name',
  name: 'domainName',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['domain'], operation: ['getDomainInfo'] } },
  default: '',
  description: 'The domain name to get registration info for'
},
{
  displayName: 'Domains',
  name: 'domains',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['domain'], operation: ['bulkResolveDomains'] } },
  default: '',
  description: 'Comma-separated list of domains to resolve',
  typeOptions: {
    alwaysOpenEditWindow: true,
    rows: 3,
  },
},
{
	displayName: 'Available For',
	name: 'available_for',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getStakingPools'],
		},
	},
	default: '',
	description: 'Filter pools available for specific criteria',
},
{
	displayName: 'Include Unverified',
	name: 'include_unverified',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getStakingPools'],
		},
	},
	default: false,
	description: 'Whether to include unverified pools',
},
{
	displayName: 'Pool ID',
	name: 'pool_id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getStakingPool', 'getPoolHistory'],
		},
	},
	default: '',
	description: 'The staking pool ID',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getPoolHistory'],
		},
	},
	default: 100,
	description: 'Maximum number of records to return',
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getPoolHistory'],
		},
	},
	default: 0,
	description: 'Number of records to skip',
},
{
	displayName: 'Account ID',
	name: 'account_id',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['staking'],
			operation: ['getAccountStaking'],
		},
	},
	default: '',
	description: 'The account ID to get staking info for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getValidators', 'getNominators'],
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
      operation: ['getValidators', 'getNominators'],
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
{
  displayName: 'Block ID',
  name: 'blockId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchain'],
      operation: ['getBlockchainBlock', 'getBlockTransactions']
    }
  },
  default: '',
  description: 'The block ID to retrieve information for',
},
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
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'jetton':
        return [await executeJettonOperations.call(this, items)];
      case 'nFT':
        return [await executeNFTOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'domain':
        return [await executeDomainOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      case 'blockchain':
        return [await executeBlockchainOperations.call(this, items)];
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
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
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
				case 'getAccount': {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/accounts/${accountId}`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'runGetMethod': {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const methodName = this.getNodeParameter('methodName', i) as string;
					const args = this.getNodeParameter('args', i) as string;

					const queryParams = new URLSearchParams();
					if (args) {
						queryParams.append('args', args);
					}

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/accounts/${accountId}/methods/${methodName}${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break