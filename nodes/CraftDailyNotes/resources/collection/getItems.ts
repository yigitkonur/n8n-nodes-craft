/**
 * COLLECTION GET ITEMS OPERATION
 * GET /collections/{collectionId}/items - Retrieve collection items
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCollectionGetItems = { operation: ['getItems'], resource: ['collection'] };

export const collectionGetItemsDescription: INodeProperties[] = [
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
		displayOptions: { show: showOnlyForCollectionGetItems },
	},

	// Max Depth
	{
		displayName: 'Max Depth',
		name: 'maxDepth',
		type: 'number',
		typeOptions: {
			minValue: -1,
			maxValue: 10,
		},
		default: -1,
		description:
			'Maximum depth of nested content to fetch for each item. -1 for all, 0 for item properties only.',
		displayOptions: { show: showOnlyForCollectionGetItems },
		routing: {
			send: {
				type: 'query',
				property: 'maxDepth',
			},
		},
	},
];
