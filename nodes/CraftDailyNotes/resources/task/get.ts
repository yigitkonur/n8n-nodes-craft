/**
 * TASK GET OPERATION
 * GET /tasks - Retrieve tasks filtered by scope
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskGet = { operation: ['get'], resource: ['task'] };

export const taskGetDescription: INodeProperties[] = [
	// Scope selector
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		options: [
			{
				name: 'Active',
				value: 'active',
				description:
					'Active tasks from inbox and other documents (tasks due before now that are not completed/cancelled)',
			},
			{
				name: 'Upcoming',
				value: 'upcoming',
				description:
					'Upcoming tasks from inbox and other documents (tasks scheduled after now)',
			},
			{
				name: 'Inbox',
				value: 'inbox',
				description: 'Only tasks in the task inbox',
			},
			{
				name: 'Logbook',
				value: 'logbook',
				description: 'Only tasks in the task logbook (completed and cancelled tasks)',
			},
		],
		default: 'active',
		required: true,
		description: 'Filter tasks by scope',
		displayOptions: { show: showOnlyForTaskGet },
		routing: {
			send: {
				type: 'query',
				property: 'scope',
			},
		},
	},
];
