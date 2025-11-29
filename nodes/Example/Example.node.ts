/**
 * PROGRAMMATIC NODE PATTERN
 * Use this pattern when: SDK integration, complex logic, non-REST APIs, triggers
 * Key concept: You write the execute() method to handle all logic manually
 */
import type {
	IExecuteFunctions,      // Context for execute() - provides helpers like getNodeParameter()
	INodeExecutionData,     // Structure for input/output items: { json: {}, binary?: {} }
	INodeType,              // Interface every node must implement
	INodeTypeDescription,   // Type for the description object
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

export class Example implements INodeType {
	// DESCRIPTION: Defines node metadata and UI fields
	description: INodeTypeDescription = {
		displayName: 'Example',           // Shown in node picker and canvas
		name: 'example',                  // Internal identifier (camelCase, unique)
		icon: { light: 'file:example.svg', dark: 'file:example.dark.svg' },
		group: ['input'],                 // Category in node picker
		version: 1,                       // Increment when breaking changes occur
		description: 'Basic Example Node',
		defaults: { name: 'Example' },    // Default node name on canvas
		inputs: [NodeConnectionTypes.Main],   // Input connection types
		outputs: [NodeConnectionTypes.Main],  // Output connection types
		usableAsTool: true,               // Allow AI agents to use this node

		// PROPERTIES: Each object = one UI field users can configure
		properties: [
			{
				displayName: 'My String',     // Label shown in UI
				name: 'myString',             // Key to retrieve value in execute()
				type: 'string',               // Field type: string, number, boolean, options, etc.
				default: '',                  // Initial value
				placeholder: 'Placeholder value',
				description: 'The description text',  // Tooltip help text
			},
		],
	};

	/**
	 * EXECUTE METHOD: Core logic runs here
	 * Called once per node execution with all input items
	 * Must return array of arrays: [[items]] for single output, [[items1], [items2]] for multiple outputs
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get all items from previous node (or trigger data)
		const items = this.getInputData();

		let item: INodeExecutionData;
		let myString: string;

		// ITEM LOOP: Process each input item individually
		// Important: itemIndex allows expressions like {{$json.field}} to resolve per-item
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				// GET PARAMETER: Retrieve user-configured value for this specific item
				// Third arg is default value if parameter not found
				myString = this.getNodeParameter('myString', itemIndex, '') as string;
				item = items[itemIndex];

				// MODIFY OUTPUT: Add/change data on the item's json property
				item.json.myString = myString;
			} catch (error) {
				// ERROR HANDLING: Two patterns based on user's "Continue On Fail" setting
				if (this.continueOnFail()) {
					// Pattern 1: Add error to output, continue processing other items
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Pattern 2: Stop execution, throw error with itemIndex for debugging
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					// NodeOperationError: n8n's standard error with context
					throw new NodeOperationError(this.getNode(), error, { itemIndex });
				}
			}
		}

		// RETURN: Wrap items in array (one array per output connection)
		return [items];
	}
}
