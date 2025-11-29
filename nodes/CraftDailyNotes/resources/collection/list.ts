/**
 * COLLECTION LIST OPERATION
 * GET /collections - Retrieve all collections across daily notes
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCollectionList = { operation: ['list'], resource: ['collection'] };

export const collectionListDescription: INodeProperties[] = [
	// Date Range filters
	{
		displayName: 'Filter by Date Range',
		name: 'filterByDateRange',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnlyForCollectionList },
		description: 'Whether to filter collections by daily note date range',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'string',
		default: '',
		placeholder: 'today, yesterday, or YYYY-MM-DD',
		description: 'Only include collections in daily notes on or after this date',
		displayOptions: {
			show: {
				...showOnlyForCollectionList,
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
		description: 'Only include collections in daily notes on or before this date',
		displayOptions: {
			show: {
				...showOnlyForCollectionList,
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
