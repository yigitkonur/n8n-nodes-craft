/**
 * GET MANY OPERATION PROPERTIES
 * Demonstrates: pagination, output limiting, filters collection
 */
import type { INodeProperties } from 'n8n-workflow';
import { parseLinkHeader } from '../../shared/utils';

const showOnlyForIssueGetMany = { operation: ['getAll'], resource: ['issue'] };

export const issueGetManyDescription: INodeProperties[] = [
	// LIMIT FIELD: Controls max results when not using "Return All"
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForIssueGetMany,
				returnAll: [false],  // Only show when Return All is OFF
			},
		},
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		routing: {
			send: {
				type: 'query',         // Adds to URL: ?per_page=50
				property: 'per_page',
			},
			output: {
				maxResults: '={{$value}}',  // Truncate response to this many items
			},
		},
		description: 'Max number of results to return',
	},

	// RETURN ALL FIELD: Enables pagination to fetch all pages
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: showOnlyForIssueGetMany },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',  // Enable pagination when true
				type: 'query',
				property: 'per_page',
				value: '100',               // Request max per page when paginating
			},
			// PAGINATION CONFIG: How to fetch next pages
			operations: {
				pagination: {
					type: 'generic',
					properties: {
						// CONTINUE: Expression that returns true if more pages exist
						// Parses Link header: <url>; rel="next" → checks if 'next' exists
						continue: `={{ !!(${parseLinkHeader.toString()})($response.headers?.link).next }}`,
						request: {
							// URL: Get next page URL from Link header, fallback to current
							url: `={{ (${parseLinkHeader.toString()})($response.headers?.link)?.next ?? $request.url }}`,
						},
					},
				},
			},
		},
	},

	// FILTERS COLLECTION: Optional query parameters grouped together
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',  // Groups optional fields, shows "Add Filter" button
		typeOptions: { multipleValueButtonText: 'Add Filter' },
		displayOptions: { show: showOnlyForIssueGetMany },
		default: {},
		options: [
			// DATETIME FILTER: routing.request.qs adds to query string
			{
				displayName: 'Updated Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				description: 'Return only issues updated at or after this time',
				routing: {
					request: {
						qs: { since: '={{$value}}' },  // Adds ?since=2024-01-01T00:00:00Z
					},
				},
			},
			// OPTIONS FILTER: Dropdown for state selection
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{ name: 'All', value: 'all', description: 'Returns issues with any state' },
					{ name: 'Closed', value: 'closed', description: 'Return issues with "closed" state' },
					{ name: 'Open', value: 'open', description: 'Return issues with "open" state' },
				],
				default: 'open',
				description: 'The issue state to filter on',
				routing: {
					request: {
						qs: { state: '={{$value}}' },  // Adds ?state=open
					},
				},
			},
		],
	},
];
