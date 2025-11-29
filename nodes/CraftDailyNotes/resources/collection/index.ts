/**
 * COLLECTION RESOURCE INDEX
 * Operations: List, Get Schema, Get Items, Add Items, Update Items, Delete Items
 */
import type { INodeProperties } from 'n8n-workflow';

import { collectionListDescription } from './list';
import { collectionGetSchemaDescription } from './getSchema';
import { collectionGetItemsDescription } from './getItems';
import { collectionAddItemsDescription } from './addItems';
import { collectionUpdateItemsDescription } from './updateItems';
import { collectionDeleteItemsDescription } from './deleteItems';

const showOnlyForCollections = { resource: ['collection'] };

export const collectionDescription: INodeProperties[] = [
	// OPERATION SELECTOR
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCollections },
		options: [
			{
				name: 'Add Items',
				value: 'addItems',
				action: 'Add items to collection',
				description: 'Add new items to a specific collection',
				routing: {
					request: {
						method: 'POST',
						url: '=/collections/{{$parameter.collectionId}}/items',
					},
				},
			},
			{
				name: 'Delete Items',
				value: 'deleteItems',
				action: 'Delete collection items',
				description: 'Delete items from a collection by their IDs',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/collections/{{$parameter.collectionId}}/items',
					},
				},
			},
			{
				name: 'Get Items',
				value: 'getItems',
				action: 'Get collection items',
				description: 'Retrieve all items from a specific collection',
				routing: {
					request: {
						method: 'GET',
						url: '=/collections/{{$parameter.collectionId}}/items',
					},
				},
			},
			{
				name: 'Get Schema',
				value: 'getSchema',
				action: 'Get collection schema',
				description: 'Get the schema for a collection by its ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/collections/{{$parameter.collectionId}}/schema',
					},
				},
			},
			{
				name: 'List',
				value: 'list',
				action: 'List all collections',
				description: 'Retrieve all collections across daily notes',
				routing: {
					request: {
						method: 'GET',
						url: '/collections',
					},
				},
			},
			{
				name: 'Update Items',
				value: 'updateItems',
				action: 'Update collection items',
				description: 'Update existing items in a collection',
				routing: {
					request: {
						method: 'PUT',
						url: '=/collections/{{$parameter.collectionId}}/items',
					},
				},
			},
		],
		default: 'list',
	},

	// Spread operation-specific fields
	...collectionListDescription,
	...collectionGetSchemaDescription,
	...collectionGetItemsDescription,
	...collectionAddItemsDescription,
	...collectionUpdateItemsDescription,
	...collectionDeleteItemsDescription,
];
