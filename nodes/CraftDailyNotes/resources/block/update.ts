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
						options: [
							{ name: 'Body', value: 'body' },
							{ name: 'Code', value: 'code' },
							{ name: 'Heading 1', value: 'h1' },
							{ name: 'Heading 2', value: 'h2' },
							{ name: 'Heading 3', value: 'h3' },
							{ name: 'Subtitle', value: 'subtitle' },
							{ name: 'Title', value: 'title' },
						],
						default: 'body',
						description: 'The text style for the block (optional)',
					},
					{
						displayName: 'List Style',
						name: 'listStyle',
						type: 'options',
						options: [
							{ name: 'Bullet', value: 'bullet' },
							{ name: 'None', value: 'none' },
							{ name: 'Numbered', value: 'numbered' },
							{ name: 'Todo', value: 'todo' },
							{ name: 'Toggle', value: 'toggle' },
						],
						default: 'none',
						description: 'The list style for the block (optional)',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'blocks',
				value:
					'={{ $value.blockValues ? $value.blockValues.map(b => { const block = { id: b.id }; if (b.markdown) block.markdown = b.markdown; if (b.textStyle && b.textStyle !== "body") block.textStyle = b.textStyle; if (b.listStyle && b.listStyle !== "none") block.listStyle = b.listStyle; return block; }) : [] }}',
			},
		},
	},
];
