/**
 * BLOCK MOVE OPERATION
 * PUT /blocks/move - Move blocks to reorder or move to different daily note
 */
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBlockMove = { operation: ['move'], resource: ['block'] };

export const blockMoveDescription: INodeProperties[] = [
	// Block IDs to move
	{
		displayName: 'Block IDs',
		name: 'blockIds',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'ID1, ID2, ID3 or ["ID1", "ID2"]',
		description: 'Block IDs to move. Provide as comma-separated values or JSON array.',
		displayOptions: { show: showOnlyForBlockMove },
		routing: {
			send: {
				type: 'body',
				property: 'blockIds',
				value:
					'={{ $value.startsWith("[") ? JSON.parse($value) : $value.split(",").map(id => id.trim()) }}',
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
		displayOptions: { show: showOnlyForBlockMove },
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
							{ name: 'End', value: 'end', description: 'Move to the end of the document' },
							{ name: 'Start', value: 'start', description: 'Move to the start of the document' },
							{ name: 'Before', value: 'before', description: 'Move before a specific block' },
							{ name: 'After', value: 'after', description: 'Move after a specific block' },
						],
						default: 'end',
					},
					{
						displayName: 'Target Date',
						name: 'date',
						type: 'string',
						default: 'today',
						placeholder: 'today, tomorrow, yesterday, or YYYY-MM-DD',
						description: 'Which daily note to move the blocks to',
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
		routing: {
			send: {
				type: 'body',
				property: 'position',
				value:
					'={{ $value.positionValues ? { position: $value.positionValues.position, date: $value.positionValues.date, ...(["before", "after"].includes($value.positionValues.position) && $value.positionValues.referenceBlockId ? { referenceBlockId: $value.positionValues.referenceBlockId } : {}) } : { position: "end", date: "today" } }}',
			},
		},
	},
];
