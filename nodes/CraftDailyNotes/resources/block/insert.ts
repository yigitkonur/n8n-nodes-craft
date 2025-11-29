/**
 * BLOCK INSERT OPERATION
 * POST /blocks - Insert content into a daily note
 * Uses preSend hook for smart block building within declarative routing
 */
import type {
	INodeProperties,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';

import { buildBlocksFromMarkdown, parseBlockArray } from '../../shared/blockBuilder';

/**
 * Build position object from node parameters
 * Returns safe defaults if position is not configured
 */
function buildPositionObject(context: IExecuteSingleFunctions): IDataObject {
	// Safe extraction with multiple fallback layers
	let positionParam: IDataObject | undefined;
	try {
		positionParam = context.getNodeParameter('position', {}) as IDataObject;
	} catch {
		// Parameter doesn't exist or can't be read - use defaults
		positionParam = undefined;
	}

	// Extract positionValues with null-safe access
	const positionValues = (positionParam?.positionValues as IDataObject) ?? {};

	// Build position with safe defaults
	const position: IDataObject = {
		position: (positionValues.position as string) || 'end',
		date: (positionValues.date as string) || 'today',
	};

	// Add referenceBlockId if using before/after
	if (
		['before', 'after'].includes(position.position as string) &&
		positionValues.referenceBlockId
	) {
		position.referenceBlockId = positionValues.referenceBlockId;
	}

	return position;
}

/**
 * PreSend hook for block insert operation
 * Transforms markdown content or JSON blocks into the API request body
 * Supports three modes:
 * - rawMarkdown: Uses native API text/markdown content-type (simplest)
 * - markdown: Client-side block building with smart splitting
 * - blocks: Pre-structured JSON block array
 */
export async function blockInsertPreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const contentMode = this.getNodeParameter('contentMode', 'rawMarkdown') as string;

	// Build position object (used by all modes)
	const position = buildPositionObject(this);

	// RAW MARKDOWN MODE: Use API's native text/markdown content-type
	// This is the simplest approach - API handles markdown parsing directly
	if (contentMode === 'rawMarkdown') {
		const markdownContent = this.getNodeParameter('rawMarkdownContent', '') as string;

		// Set Content-Type to text/markdown
		requestOptions.headers = {
			...requestOptions.headers,
			'Content-Type': 'text/markdown',
		};

		// Position goes as query parameter for text/markdown mode
		requestOptions.qs = {
			...requestOptions.qs,
			position: JSON.stringify(position),
		};

		// Raw markdown content as body
		requestOptions.body = markdownContent;

		return requestOptions;
	}

	// SMART MARKDOWN MODE: Client-side block building with smart splitting
	if (contentMode === 'markdown') {
		const markdownContent = this.getNodeParameter('markdownContent', '') as string;
		const processingOptions = this.getNodeParameter('blockProcessingOptions', {}) as IDataObject;

		const builtBlocks = buildBlocksFromMarkdown(markdownContent, {
			preserveHeaders: processingOptions.preserveHeaders !== false,
			splitOnParagraphs: processingOptions.splitOnParagraphs !== false,
		});

		requestOptions.body = {
			blocks: builtBlocks as unknown as IDataObject[],
			position,
		};

		return requestOptions;
	}

	// BLOCKS MODE: Pre-structured JSON block array
	const blocksJson = this.getNodeParameter('blocksJson') as string;
	const blocks = parseBlockArray(blocksJson) as unknown as IDataObject[];

	requestOptions.body = {
		blocks,
		position,
	};

	return requestOptions;
}

const showOnlyForBlockInsert = { operation: ['insert'], resource: ['block'] };

export const blockInsertDescription: INodeProperties[] = [
	// Content Mode selector
	{
		displayName: 'Content Mode',
		name: 'contentMode',
		type: 'options',
		options: [
			{
				name: 'Raw Markdown (API Native)',
				value: 'rawMarkdown',
				description: 'Send markdown directly to API - simplest option, API handles parsing',
			},
			{
				name: 'Smart Markdown (Block Split)',
				value: 'markdown',
				description: 'Client-side splitting into optimal blocks with header detection',
			},
			{
				name: 'Block Array (Advanced)',
				value: 'blocks',
				description: 'Provide pre-structured block array in JSON format',
			},
		],
		default: 'rawMarkdown',
		displayOptions: { show: showOnlyForBlockInsert },
		description: 'How to provide the content to insert',
	},

	// Raw Markdown Content (shown when contentMode = rawMarkdown)
	{
		displayName: 'Markdown Content',
		name: 'rawMarkdownContent',
		type: 'string',
		required: true,
		typeOptions: {
			rows: 10,
		},
		default: '',
		placeholder: '## Meeting Notes\n\n- Discussed Q1 goals\n- Action items assigned\n- Follow up next week',
		description:
			'Raw markdown content sent directly to the API using text/markdown content-type. The API handles parsing.',
		displayOptions: {
			show: {
				...showOnlyForBlockInsert,
				contentMode: ['rawMarkdown'],
			},
		},
	},

	// Smart Markdown Content (shown when contentMode = markdown)
	{
		displayName: 'Markdown Content',
		name: 'markdownContent',
		type: 'string',
		required: true,
		typeOptions: {
			rows: 10,
		},
		default: '',
		placeholder: '# Meeting Notes\n\n- Discussed timeline\n- Assigned tasks\n\nNext steps...',
		description:
			'Paste any length of markdown content. The node will automatically split it into optimal blocks while preserving structure.',
		displayOptions: {
			show: {
				...showOnlyForBlockInsert,
				contentMode: ['markdown'],
			},
		},
	},

	// Block Processing Options (shown when contentMode = markdown)
	{
		displayName: 'Block Processing Options',
		name: 'blockProcessingOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForBlockInsert,
				contentMode: ['markdown'],
			},
		},
		options: [
			{
				displayName: 'Preserve Headers',
				name: 'preserveHeaders',
				type: 'boolean',
				default: true,
				description: 'Whether to keep headers as separate blocks with proper text style',
			},
			{
				displayName: 'Split on Paragraphs',
				name: 'splitOnParagraphs',
				type: 'boolean',
				default: true,
				description: 'Whether to split content on paragraph breaks (double newlines)',
			},
		],
	},

	// Blocks JSON (shown when contentMode = blocks)
	{
		displayName: 'Blocks (JSON)',
		name: 'blocksJson',
		type: 'json',
		default: '[{"type":"text","markdown":"Content here"}]',
		description:
			'Pre-structured block array. Each block should have "type" and "markdown" properties.',
		displayOptions: {
			show: {
				...showOnlyForBlockInsert,
				contentMode: ['blocks'],
			},
		},
	},

	// Position
	{
		displayName: 'Position',
		name: 'position',
		type: 'fixedCollection',
		default: { positionValues: { position: 'end', date: 'today' } },
		placeholder: 'Add Position',
		displayOptions: { show: showOnlyForBlockInsert },
		options: [
			{
				name: 'positionValues',
				displayName: 'Position',
				values: [
					{
						displayName: 'Position Type',
						name: 'position',
						type: 'options',
						options: [
							{ name: 'End', value: 'end', description: 'Insert at the end of the document' },
							{
								name: 'Start',
								value: 'start',
								description: 'Insert at the start of the document',
							},
							{
								name: 'Before',
								value: 'before',
								description: 'Insert before a specific block',
							},
							{ name: 'After', value: 'after', description: 'Insert after a specific block' },
						],
						default: 'end',
					},
					{
						displayName: 'Target Date',
						name: 'date',
						type: 'string',
						default: 'today',
						placeholder: 'today, tomorrow, yesterday, or YYYY-MM-DD',
						description: 'Which daily note to insert into',
					},
					{
						displayName: 'Reference Block ID',
						name: 'referenceBlockId',
						type: 'string',
						default: '',
						placeholder: 'Block ID (UUID)',
						description: 'The block ID to position relative to (required for before/after)',
						displayOptions: {
							show: {
								position: ['before', 'after'],
							},
						},
					},
				],
			},
		],
	},
];
