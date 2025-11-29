/**
 * COLLECTION DELETE ITEMS OPERATION
 * DELETE /collections/{collectionId}/items - Delete collection items
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCollectionDeleteItems = { operation: ['deleteItems'], resource: ['collection'] };

export const collectionDeleteItemsDescription: INodeProperties[] = [
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
		displayOptions: { show: showOnlyForCollectionDeleteItems },
	},

	// Item IDs to delete
	{
		displayName: 'Item IDs',
		name: 'itemIds',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'ID1, ID2, ID3 or ["ID1", "ID2"]',
		description:
			'Item IDs to delete. Provide as comma-separated values or JSON array. Non-existent IDs will be silently skipped.',
		displayOptions: { show: showOnlyForCollectionDeleteItems },
		routing: {
			send: {
				type: 'body',
				property: 'idsToDelete',
				value:
					'={{ $value.startsWith("[") ? JSON.parse($value) : $value.split(",").map(id => id.trim()) }}',
			},
		},
	},
];
