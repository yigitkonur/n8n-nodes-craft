/**
 * BLOCK UPDATE OPERATION
 * PUT /blocks - Update content in daily notes
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBlockUpdate = { operation: ['update'], resource: ['block'] };

export const blockUpdateDescription: INodeProperties[] = [
	// Blocks to Update
	{
		displayName: 'Blocks to Update',
		name: 'blocksToUpdate',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: 'Add Block',
		displayOptions: { show: showOnlyForBlockUpdate },
		options: [
			{
				name: 'blockValues',
				displayName: 'Block',
				values: [
					{
						displayName: 'Block ID',
						name: 'id',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'E21E3640-FBD2-4887-BD1B-B1FFE1781168',
						description: 'The UUID of the block to update',
					},
					{
						displayName: 'New Markdown',
						name: 'markdown',
						type: 'string',
						typeOptions: {
							rows: 4,
						},
						default: '',
						description: 'The new markdown content for the block',
					},
					{
						displayName: 'Text Style',
						name: 'textStyle',
						type: 'options',
						// Valid API values: card, page, h1, h2, h3, h4, caption, body
						// Note: 'code' is NOT a valid textStyle - API auto-detects from ``` syntax
						options: [
							{ name: 'Body', value: 'body' },
							{ name: 'Caption', value: 'caption' },
							{ name: 'Card', value: 'card' },
							{ name: "Don't Change", value: '', description: 'Keep current text style' },
							{ name: 'Heading 1', value: 'h1' },
							{ name: 'Heading 2', value: 'h2' },
							{ name: 'Heading 3', value: 'h3' },
							{ name: 'Heading 4', value: 'h4' },
							{ name: 'Page', value: 'page' },
						],
						default: '',
						description: 'The text style for the block. Code blocks are auto-detected from ``` markdown syntax.',
					},
					{
						displayName: 'List Style',
						name: 'listStyle',
						type: 'options',
						options: [
							{ name: 'Bullet', value: 'bullet' },
							{ name: "Don't Change", value: '', description: 'Keep current list style' },
							{ name: 'None', value: 'none' },
							{ name: 'Numbered', value: 'numbered' },
							{ name: 'Todo', value: 'todo' },
							{ name: 'Toggle', value: 'toggle' },
						],
						default: '',
						description: 'The list style for the block',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'blocks',
				// Only include textStyle/listStyle if explicitly set (not empty string = "Don't Change")
				value:
					'={{ $value.blockValues ? $value.blockValues.map(b => { const block = { id: b.id }; if (b.markdown) block.markdown = b.markdown; if (b.textStyle && b.textStyle !== "") block.textStyle = b.textStyle; if (b.listStyle && b.listStyle !== "") block.listStyle = b.listStyle; return block; }) : [] }}',
			},
		},
	},
];
