/**
 * COLLECTION GET SCHEMA OPERATION
 * GET /collections/{collectionId}/schema - Get collection schema
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCollectionGetSchema = { operation: ['getSchema'], resource: ['collection'] };

export const collectionGetSchemaDescription: INodeProperties[] = [
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
		displayOptions: { show: showOnlyForCollectionGetSchema },
	},

	// Schema Format
	{
		displayName: 'Schema Format',
		name: 'schemaFormat',
		type: 'options',
		options: [
			{
				name: 'JSON Schema (For Validation)',
				value: 'json-schema-items',
				description: 'Returns JSON Schema for validating collection items (use with add/update)',
			},
			{
				name: 'Schema Structure',
				value: 'schema',
				description: 'Returns the collection schema structure (name, properties, types)',
			},
		],
		default: 'json-schema-items',
		description: 'Format of the schema response',
		displayOptions: { show: showOnlyForCollectionGetSchema },
		routing: {
			send: {
				type: 'query',
				property: 'format',
			},
		},
	},
];
