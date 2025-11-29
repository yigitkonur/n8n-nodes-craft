/**
 * TASK ADD OPERATION
 * POST /tasks - Create new tasks
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskAdd = { operation: ['add'], resource: ['task'] };

export const taskAddDescription: INodeProperties[] = [
	// Tasks to Add
	{
		displayName: 'Tasks to Add',
		name: 'tasksToAdd',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Task',
		displayOptions: { show: showOnlyForTaskAdd },
		options: [
			{
				name: 'taskValues',
				displayName: 'Task',
				values: [
					{
						displayName: 'Deadline Date',
						name: 'deadlineDate',
						type: 'string',
						default: '',
						placeholder: 'tomorrow, or YYYY-MM-DD',
						description: 'Task deadline date (optional)',
					},
					{
						displayName: 'Location Date',
						name: 'locationDate',
						type: 'string',
						default: 'today',
						placeholder: 'today, tomorrow, or YYYY-MM-DD',
						description: 'Which daily note to add the task to',
					},
					{
						displayName: 'Location Type',
						name: 'locationType',
						type: 'options',
						options: [
							{
								name: 'Daily Note',
								value: 'dailyNote',
								description: 'Add task to a specific daily note',
							},
							{
								name: 'Inbox',
								value: 'inbox',
								description: 'Add task to inbox',
							},
						],
						default: 'inbox',
						description: 'Where to add the task',
					},
					{
						displayName: 'Schedule Date',
						name: 'scheduleDate',
						type: 'string',
						default: '',
						placeholder: 'today, tomorrow, or YYYY-MM-DD',
						description: 'When the task should be scheduled (optional)',
					},
					{
						displayName: 'Task Content',
						name: 'markdown',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'Buy groceries',
						description: 'The task content in markdown format',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'tasks',
				value:
					'={{ $value.taskValues ? $value.taskValues.map(t => { const task = { markdown: t.markdown }; if (t.scheduleDate || t.deadlineDate) { task.taskInfo = {}; if (t.scheduleDate) task.taskInfo.scheduleDate = t.scheduleDate; if (t.deadlineDate) task.taskInfo.deadlineDate = t.deadlineDate; } if (t.locationType === "inbox") { task.location = { type: "inbox" }; } else if (t.locationType === "dailyNote") { task.location = { type: "dailyNote", date: t.locationDate || "today" }; } return task; }) : [] }}',
			},
		},
	},
];
