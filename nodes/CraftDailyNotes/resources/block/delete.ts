/**
 * BLOCK DELETE OPERATION
 * DELETE /blocks - Delete blocks by their IDs
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBlockDelete = { operation: ['delete'], resource: ['block'] };

export const blockDeleteDescription: INodeProperties[] = [
	// Block IDs to delete
	{
		displayName: 'Block IDs',
		name: 'blockIds',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'ID1, ID2, ID3 or ["ID1", "ID2"]',
		description:
			'Block IDs to delete. Provide as comma-separated values or JSON array.',
		displayOptions: { show: showOnlyForBlockDelete },
		routing: {
			send: {
				type: 'body',
				property: 'blockIds',
				value:
					'={{ $value.startsWith("[") ? JSON.parse($value) : $value.split(",").map(id => id.trim()) }}',
			},
		},
	},
];
