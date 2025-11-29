/**
 * BLOCK GET OPERATION
 * GET /blocks - Fetch content from daily notes
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBlockGet = { operation: ['get'], resource: ['block'] };

export const blockGetDescription: INodeProperties[] = [
	// Fetch By selector
	{
		displayName: 'Fetch By',
		name: 'fetchBy',
		type: 'options',
		options: [
			{ name: 'Date', value: 'date', description: 'Fetch blocks from a specific date' },
			{ name: 'Block ID', value: 'blockId', description: 'Fetch a specific block by its ID' },
		],
		default: 'date',
		displayOptions: { show: showOnlyForBlockGet },
		description: 'How to identify which blocks to fetch',
	},

	// Date field (shown when fetchBy = date)
	{
		displayName: 'Date',
		name: 'date',
		type: 'string',
		default: 'today',
		placeholder: 'today, tomorrow, yesterday, or YYYY-MM-DD',
		description:
			'The date for the daily note. Accepts relative dates (today, tomorrow, yesterday) or ISO format.',
		displayOptions: {
			show: {
				...showOnlyForBlockGet,
				fetchBy: ['date'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'date',
			},
		},
	},

	// Block ID field (shown when fetchBy = blockId)
	{
		displayName: 'Block ID',
		name: 'blockId',
		type: 'string',
		default: '',
		placeholder: 'E21E3640-FBD2-4887-BD1B-B1FFE1781168',
		description: 'The UUID of the specific block to fetch',
		displayOptions: {
			show: {
				...showOnlyForBlockGet,
				fetchBy: ['blockId'],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'id',
			},
		},
	},

	// Max Depth
	{
		displayName: 'Max Depth',
		name: 'maxDepth',
		type: 'number',
		typeOptions: {
			minValue: -1,
			maxValue: 10,
		},
		default: -1,
		description:
			'Maximum depth of nested content to fetch. -1 for all descendants, 0 for only the block itself.',
		displayOptions: { show: showOnlyForBlockGet },
		routing: {
			send: {
				type: 'query',
				property: 'maxDepth',
			},
		},
	},

	// Response Format
	{
		displayName: 'Response Format',
		name: 'responseFormat',
		type: 'options',
		options: [
			{
				name: 'JSON (Structured)',
				value: 'json',
				description: 'Returns structured block data with IDs and properties',
			},
			{
				name: 'Markdown (Text)',
				value: 'markdown',
				description: 'Returns rendered markdown content',
			},
		],
		default: 'json',
		description: 'Format of the response',
		displayOptions: { show: showOnlyForBlockGet },
		routing: {
			request: {
				headers: {
					Accept: '={{ $value === "markdown" ? "text/markdown" : "application/json" }}',
				},
			},
		},
	},

	// Additional Options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: showOnlyForBlockGet },
		options: [
			{
				displayName: 'Fetch Metadata',
				name: 'fetchMetadata',
				type: 'boolean',
				default: false,
				description:
					'Whether to include metadata (comments, timestamps, authors) for the blocks',
				routing: {
					send: {
						type: 'query',
						property: 'fetchMetadata',
					},
				},
			},
		],
	},
];
