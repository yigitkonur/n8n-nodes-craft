/**
 * TASK DELETE OPERATION
 * DELETE /tasks - Delete tasks by their IDs
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskDelete = { operation: ['delete'], resource: ['task'] };

export const taskDeleteDescription: INodeProperties[] = [
	// Task IDs to delete
	{
		displayName: 'Task IDs',
		name: 'taskIds',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'ID1, ID2, ID3 or ["ID1", "ID2"]',
		description: 'Task IDs to delete. Provide as comma-separated values or JSON array.',
		displayOptions: { show: showOnlyForTaskDelete },
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
