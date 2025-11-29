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

const showOnlyForBlockInsert = { operation: ['insert'], resource: ['block'] };

/**
 * Build position object from simple node parameters
 */
function buildPositionObject(context: IExecuteSingleFunctions): IDataObject {
	let positionType = 'end';
	let targetDate = 'today';
	let referenceBlockId = '';

	try {
		positionType = context.getNodeParameter('positionType', 'end') as string;
		targetDate = context.getNodeParameter('targetDate', 'today') as string;
		referenceBlockId = context.getNodeParameter('referenceBlockId', '') as string;
	} catch {
		// Use defaults if parameters can't be read
	}

	const position: IDataObject = {
		position: positionType || 'end',
		date: targetDate || 'today',
	};

	// Add referenceBlockId if using before/after
	if (['before', 'after'].includes(positionType) && referenceBlockId) {
		position.referenceBlockId = referenceBlockId;
	}

	return position;
}

/**
 * PreSend hook for block insert operation
 * Transforms markdown content or JSON blocks into the API request body
 */
export async function blockInsertPreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	let contentMode = 'markdown';
	try {
		contentMode = this.getNodeParameter('contentMode', 'markdown') as string;
	} catch {
		// Default to markdown mode
	}

	// Build position object
	const position = buildPositionObject(this);

	// SMART MARKDOWN MODE: Client-side block building with smart splitting
	if (contentMode === 'markdown') {
		let markdownContent = '';
		let processingOptions: IDataObject = {};
		
		try {
			markdownContent = this.getNodeParameter('markdownContent', '') as string;
			processingOptions = this.getNodeParameter('blockProcessingOptions', {}) as IDataObject;
		} catch {
			// Use defaults
		}

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
	let blocksJson = '[{"type":"text","markdown":"","textStyle":"body"}]';
	try {
		blocksJson = this.getNodeParameter('blocksJson', blocksJson) as string;
	} catch {
		// Use default
	}
	
	const blocks = parseBlockArray(blocksJson) as unknown as IDataObject[];

	requestOptions.body = {
		blocks,
		position,
	};

	return requestOptions;
}

export const blockInsertDescription: INodeProperties[] = [
	// Content Mode selector
	{
		displayName: 'Content Mode',
		name: 'contentMode',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Markdown',
				value: 'markdown',
				description: 'Paste markdown content - automatically split into optimal blocks',
			},
			{
				name: 'Block Array (JSON)',
				value: 'blocks',
				description: 'Provide pre-structured block array in JSON format',
			},
		],
		default: 'markdown',
		displayOptions: { show: showOnlyForBlockInsert },
		description: 'How to provide the content to insert',
	},

	// Markdown Content (shown when contentMode = markdown)
	{
		displayName: 'Markdown Content',
		name: 'markdownContent',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		default: '',
		required: true,
		placeholder: '# Meeting Notes\n\n- Discussed timeline\n- Assigned tasks\n\nNext steps...',
		description: 'Paste any length of markdown content. The node will automatically split it into optimal blocks.',
		displayOptions: {
			show: {
				...showOnlyForBlockInsert,
				contentMode: ['markdown'],
			},
		},
	},

	// Block Processing Options (shown when contentMode = markdown)
	{
		displayName: 'Processing Options',
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
				description: 'Whether to detect headers (# ## ###) and apply proper text styles',
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
		default: '[{"type":"text","markdown":"Content here","textStyle":"body"}]',
		required: true,
		description: 'Pre-structured block array. Each block should have "type", "markdown", and "textStyle" properties.',
		displayOptions: {
			show: {
				...showOnlyForBlockInsert,
				contentMode: ['blocks'],
			},
		},
	},

	// ===== POSITION SETTINGS (simple properties, no fixedCollection) =====

	// Target Date
	{
		displayName: 'Target Date',
		name: 'targetDate',
		type: 'string',
		default: 'today',
		placeholder: 'today, tomorrow, yesterday, or YYYY-MM-DD',
		description: 'Which daily note to insert into',
		displayOptions: { show: showOnlyForBlockInsert },
	},

	// Position Type
	{
		displayName: 'Insert Position',
		name: 'positionType',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'End of Document', value: 'end' },
			{ name: 'Start of Document', value: 'start' },
			{ name: 'Before Block', value: 'before' },
			{ name: 'After Block', value: 'after' },
		],
		default: 'end',
		description: 'Where to insert the content in the daily note',
		displayOptions: { show: showOnlyForBlockInsert },
	},

	// Reference Block ID (only for before/after)
	{
		displayName: 'Reference Block ID',
		name: 'referenceBlockId',
		type: 'string',
		default: '',
		placeholder: 'Block UUID',
		description: 'The block ID to position relative to (required for before/after)',
		displayOptions: {
			show: {
				...showOnlyForBlockInsert,
				positionType: ['before', 'after'],
			},
		},
	},
];
