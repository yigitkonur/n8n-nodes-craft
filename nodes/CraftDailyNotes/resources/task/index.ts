/**
 * TASK RESOURCE INDEX
 * Operations: Get, Add, Update, Delete
 */
import type { INodeProperties } from 'n8n-workflow';

import { taskGetDescription } from './get';
import { taskAddDescription } from './add';
import { taskUpdateDescription } from './update';
import { taskDeleteDescription } from './delete';

const showOnlyForTasks = { resource: ['task'] };

export const taskDescription: INodeProperties[] = [
	// OPERATION SELECTOR
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTasks },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get tasks by scope',
				description: 'Retrieve tasks filtered by scope (active, upcoming, inbox, logbook)',
				routing: {
					request: {
						method: 'GET',
						url: '/tasks',
					},
				},
			},
			{
				name: 'Add',
				value: 'add',
				action: 'Add new tasks',
				description: 'Create new tasks in inbox or daily notes',
				routing: {
					request: {
						method: 'POST',
						url: '/tasks',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update existing tasks',
				description: 'Update task content, state, schedule, or deadline',
				routing: {
					request: {
						method: 'PUT',
						url: '/tasks',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete tasks',
				description: 'Delete tasks by their IDs',
				routing: {
					request: {
						method: 'DELETE',
						url: '/tasks',
					},
				},
			},
		],
		default: 'get',
	},

	// Spread operation-specific fields
	...taskGetDescription,
	...taskAddDescription,
	...taskUpdateDescription,
	...taskDeleteDescription,
];
