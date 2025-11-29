/**
 * CREATE OPERATION PROPERTIES
 * Demonstrates: routing.send to add fields to request body
 */
import type { INodeProperties } from 'n8n-workflow';

// Display condition: Show only for Issue resource + Create operation
const showOnlyForIssueCreate = { operation: ['create'], resource: ['issue'] };

export const issueCreateDescription: INodeProperties[] = [
	// BASIC FIELD WITH BODY ROUTING
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showOnlyForIssueCreate },
		description: 'The title of the issue',
		// ROUTING.SEND: Sends this field's value to request body
		routing: {
			send: {
				type: 'body',      // Where to put: 'body', 'query', or 'header'
				property: 'title', // API field name in request body
			},
		},
	},

	// MULTILINE TEXT FIELD
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		typeOptions: { rows: 5 },  // Makes it a textarea
		default: '',
		displayOptions: { show: showOnlyForIssueCreate },
		description: 'The body of the issue',
		routing: {
			send: { type: 'body', property: 'body' },
		},
	},

	// COLLECTION WITH VALUE TRANSFORMATION
	{
		displayName: 'Labels',
		name: 'labels',
		type: 'collection',
		typeOptions: {
			multipleValues: true,              // Allow adding multiple labels
			multipleValueButtonText: 'Add Label',
		},
		displayOptions: { show: showOnlyForIssueCreate },
		default: { label: '' },
		options: [
			{
				displayName: 'Label',
				name: 'label',
				type: 'string',
				default: '',
				description: 'Label to add to issue',
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'labels',
				// VALUE EXPRESSION: Transform collection to array of strings
				// $value = [{label: 'bug'}, {label: 'help'}] → ['bug', 'help']
				value: '={{$value.map((data) => data.label)}}',
			},
		},
	},
];
