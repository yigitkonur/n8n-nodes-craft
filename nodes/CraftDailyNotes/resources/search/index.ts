/**
 * SEARCH RESOURCE INDEX
 * Operations: Search Across Daily Notes
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSearch = { resource: ['search'] };

export const searchDescription: INodeProperties[] = [
	// OPERATION SELECTOR
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForSearch },
		options: [
			{
				name: 'Search Across Daily Notes',
				value: 'searchAcrossNotes',
				action: 'Search across multiple daily notes',
				description:
					'Search content across multiple daily notes using relevance-based ranking',
				routing: {
					request: {
						method: 'GET',
						url: '/daily-notes/search',
					},
				},
			},
		],
		default: 'searchAcrossNotes',
	},

	// Search Terms
	{
		displayName: 'Search Terms',
		name: 'include',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'project alpha',
		description: 'Search terms to include. Results are ranked by relevance (top 20).',
		displayOptions: {
			show: {
				...showOnlyForSearch,
				operation: ['searchAcrossNotes'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'include',
			},
		},
	},

	// Date Range Options
	{
		displayName: 'Filter by Date Range',
		name: 'filterByDateRange',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyForSearch,
				operation: ['searchAcrossNotes'],
			},
		},
		description: 'Whether to filter search to a specific date range',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		default: '',
		placeholder: 'today, yesterday, or YYYY-MM-DD',
		description: 'Only search daily notes on or after this date',
		displayOptions: {
			show: {
				...showOnlyForSearch,
				operation: ['searchAcrossNotes'],
				filterByDateRange: [true],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'startDate',
				value: '={{ $value || undefined }}',
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'string',
		default: '',
		placeholder: 'today, tomorrow, or YYYY-MM-DD',
		description: 'Only search daily notes on or before this date',
		displayOptions: {
			show: {
				...showOnlyForSearch,
				operation: ['searchAcrossNotes'],
				filterByDateRange: [true],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'endDate',
				value: '={{ $value || undefined }}',
			},
		},
	},
];
