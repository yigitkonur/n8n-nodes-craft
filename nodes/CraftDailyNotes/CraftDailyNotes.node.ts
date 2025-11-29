/**
 * CRAFT DAILY NOTES NODE
 * Hybrid declarative + programmatic node for Craft Daily Notes API
 * Programmatic only for: Block Insert with smart markdown splitting
 */
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

// Resource descriptions
import { blockDescription } from './resources/block';
import { taskDescription } from './resources/task';
import { collectionDescription } from './resources/collection';
import { searchDescription } from './resources/search';

// List search methods
import { getCollections } from './listSearch/getCollections';

// Shared utilities
import { craftApiRequest } from './shared/transport';
import { buildBlocksFromMarkdown, parseBlockArray } from './shared/blockBuilder';

export class CraftDailyNotes implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Craft Daily Notes',
		name: 'craftDailyNotes',
		icon: { light: 'file:../../icons/craft.svg', dark: 'file:../../icons/craft.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Craft Daily Notes API - manage blocks, tasks, collections, and search',
		defaults: { name: 'Craft Daily Notes' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],

		credentials: [
			{
				name: 'craftDailyNotesApi',
				required: true,
			},
		],

		// Request defaults - baseURL comes from credentials
		requestDefaults: {
			baseURL: '={{$credentials.apiUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},

		properties: [
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Block',
						value: 'block',
						description: 'Manage content blocks in daily notes',
					},
					{
						name: 'Task',
						value: 'task',
						description: 'Manage tasks across daily notes',
					},
					{
						name: 'Collection',
						value: 'collection',
						description: 'Manage collections (database-like structures)',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search across daily notes',
					},
				],
				default: 'block',
			},

			// Spread all resource descriptions
			...blockDescription,
			...taskDescription,
			...collectionDescription,
			...searchDescription,
		],
	};

	// Methods for dynamic dropdowns
	methods = {
		loadOptions: {
			getCollections,
		},
	};

	/**
	 * Execute method - only handles Block Insert operation
	 * All other operations use declarative routing
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Only handle Block Insert programmatically
		if (resource === 'block' && operation === 'insert') {
			for (let i = 0; i < items.length; i++) {
				try {
					const contentMode = this.getNodeParameter('contentMode', i) as string;

					let blocks: IDataObject[];

					if (contentMode === 'markdown') {
						// Smart block building from markdown
						const markdownContent = this.getNodeParameter('markdownContent', i) as string;
						const processingOptions = this.getNodeParameter(
							'blockProcessingOptions',
							i,
							{},
						) as IDataObject;

						const builtBlocks = buildBlocksFromMarkdown(markdownContent, {
							maxBlockSize: (processingOptions.maxBlockSize as number) || 5000,
							preserveHeaders: processingOptions.preserveHeaders !== false,
							splitOnParagraphs: processingOptions.splitOnParagraphs !== false,
						});

						blocks = builtBlocks as unknown as IDataObject[];
					} else {
						// Parse JSON block array
						const blocksJson = this.getNodeParameter('blocksJson', i) as string;
						blocks = parseBlockArray(blocksJson) as unknown as IDataObject[];
					}

					// Build position object
					const positionParam = this.getNodeParameter('position', i, {}) as IDataObject;
					const positionValues = (positionParam.positionValues as IDataObject) || {};

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

					// Make API request
					const response = await craftApiRequest.call(this, 'POST', '/blocks', {
						blocks,
						position,
					});

					returnData.push({
						json: response as IDataObject,
						pairedItem: { item: i },
					});
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({
							json: {
								error: error instanceof Error ? error.message : 'Unknown error',
							},
							pairedItem: { item: i },
						});
						continue;
					}
					throw new NodeOperationError(
						this.getNode(),
						error instanceof Error ? error : new Error('Unknown error'),
						{ itemIndex: i },
					);
				}
			}

			return [returnData];
		}

		// For all other operations, return empty to let declarative routing handle them
		return [[]];
	}
}
