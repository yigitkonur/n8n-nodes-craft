/**
 * BLOCK INSERT OPERATION
 * POST /blocks - Insert content into a daily note
 * Uses programmatic execute for smart block building
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBlockInsert = { operation: ['insert'], resource: ['block'] };

export const blockInsertDescription: INodeProperties[] = [
	// Content Mode selector
	{
		displayName: 'Content Mode',
		name: 'contentMode',
		type: 'options',
		options: [
			{
				name: 'Markdown Text',
				value: 'markdown',
				description: 'Paste any length content - automatically split into optimal blocks',
			},
			{
				name: 'Block Array (Advanced)',
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
				displayName: 'Max Block Size',
				name: 'maxBlockSize',
				type: 'number',
				typeOptions: {
					minValue: 1000,
					maxValue: 10000,
				},
				default: 5000,
				description: 'Maximum character count per block before splitting',
			},
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
		default: {},
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
