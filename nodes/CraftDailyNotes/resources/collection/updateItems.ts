/**
 * COLLECTION UPDATE ITEMS OPERATION
 * PUT /collections/{collectionId}/items - Update collection items
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCollectionUpdateItems = { operation: ['updateItems'], resource: ['collection'] };

export const collectionUpdateItemsDescription: INodeProperties[] = [
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
		displayOptions: { show: showOnlyForCollectionUpdateItems },
	},

	// Items to Update JSON
	{
		displayName: 'Items to Update (JSON)',
		name: 'itemsToUpdateJson',
		type: 'json',
		default: '{"itemsToUpdate": [{"id": "item-id", "title": "Updated Title", "properties": {}}]}',
		required: true,
		description: 'Items to update in JSON format. Each item must include an "ID" field. Only provided fields will be updated (partial updates supported).',
		displayOptions: { show: showOnlyForCollectionUpdateItems },
		routing: {
			send: {
				type: 'body',
				value: '={{ JSON.parse($value) }}',
			},
		},
	},
];
