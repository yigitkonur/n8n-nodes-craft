/**
 * COLLECTION ADD ITEMS OPERATION
 * POST /collections/{collectionId}/items - Add items to collection
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCollectionAddItems = { operation: ['addItems'], resource: ['collection'] };

export const collectionAddItemsDescription: INodeProperties[] = [
	// Collection ID
	{
		displayName: 'Collection Name or ID',
		name: 'collectionId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCollections',
		},
		default: '',
		required: true,
		description: 'Select a collection from your daily notes. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: { show: showOnlyForCollectionAddItems },
	},

	// Items JSON
	{
		displayName: 'Items (JSON)',
		name: 'itemsJson',
		type: 'json',
		default: '{"items": [{"title": "New Item", "properties": {}}]}',
		required: true,
		description:
			'Items to add in JSON format. Use "Get Schema" operation first to understand the required structure. Each item needs at least a "title" field.',
		displayOptions: { show: showOnlyForCollectionAddItems },
		routing: {
			send: {
				type: 'body',
				value: '={{ JSON.parse($value) }}',
			},
		},
	},
];
