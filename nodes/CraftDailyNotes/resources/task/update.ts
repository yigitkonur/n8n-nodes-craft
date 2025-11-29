/**
 * TASK UPDATE OPERATION
 * PUT /tasks - Update existing tasks
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTaskUpdate = { operation: ['update'], resource: ['task'] };

export const taskUpdateDescription: INodeProperties[] = [
	// Tasks to Update
	{
		displayName: 'Tasks to Update',
		name: 'tasksToUpdate',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Task',
		displayOptions: { show: showOnlyForTaskUpdate },
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
						description: 'New deadline date (optional)',
					},
					{
						displayName: 'New Content',
						name: 'markdown',
						type: 'string',
						default: '',
						placeholder: 'Updated task content',
						description: 'The new task content (optional)',
					},
					{
						displayName: 'Schedule Date',
						name: 'scheduleDate',
						type: 'string',
						default: '',
						placeholder: 'today, tomorrow, or YYYY-MM-DD',
						description: 'New schedule date (optional)',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'options',
						options: [
							{
								name: "Don't Change",
								value: '',
								description: 'Keep the current task state',
							},
							{
								name: 'To Do',
								value: 'todo',
							},
							{
								name: 'Done',
								value: 'done',
							},
							{
								name: 'Cancelled',
								value: 'cancelled',
							},
						],
						default: '',
						description: 'The task state (leave empty to keep current state, marking as done/cancelled moves to logbook)',
					},
					{
						displayName: 'Task ID',
						name: 'id',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'Task ID',
						description: 'The ID of the task to update',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'tasksToUpdate',
				value:
					'={{ $value.taskValues ? $value.taskValues.map(t => { const task = { id: t.id }; if (t.markdown) task.markdown = t.markdown; const taskInfo = {}; if (t.state && t.state !== "") taskInfo.state = t.state; if (t.scheduleDate) taskInfo.scheduleDate = t.scheduleDate; if (t.deadlineDate) taskInfo.deadlineDate = t.deadlineDate; if (Object.keys(taskInfo).length > 0) task.taskInfo = taskInfo; return task; }) : [] }}',
			},
		},
	},
];
