/**
 * BLOCK INSERT OPERATION
 * POST /blocks - Insert content into a daily note
 * 
 * SIMPLE APPROACH: Send markdown as single text block, Craft API parses it automatically!
 * The API splits markdown into proper blocks (headers, code, paragraphs) server-side.
 */
import type {
	INodeProperties,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';

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
 * 
 * CLEAN IMPLEMENTATION: Send markdown as single text block
 * Craft API parses it into proper blocks server-side
 */
export async function blockInsertPreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	// Get position parameters
	const position = buildPositionObject(this);

	// Get markdown content - ensure it's a string
	let markdownContent = '';
	try {
		const rawValue = this.getNodeParameter('markdownContent', '');
		if (typeof rawValue === 'string') {
			markdownContent = rawValue;
		} else if (rawValue) {
			markdownContent = String(rawValue);
		}
	} catch {
		markdownContent = '';
	}

	// Build the request body - EXACTLY as the API expects
	const requestBody = {
		blocks: [
			{
				type: 'text',
				markdown: markdownContent,
			},
		],
		position: {
			position: String(position.position || 'end'),
			date: String(position.date || 'today'),
		},
	};

	// Add referenceBlockId only if needed
	if (position.referenceBlockId) {
		(requestBody.position as IDataObject).referenceBlockId = String(position.referenceBlockId);
	}

	// COMPLETELY REPLACE the body - don't merge with existing
	// Use JSON.stringify to send as raw JSON string
	requestOptions.body = JSON.stringify(requestBody);
	
	// Set headers for JSON
	requestOptions.headers = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	};

	return requestOptions;
}

export const blockInsertDescription: INodeProperties[] = [
	// Markdown Content - main input field
	{
		displayName: 'Markdown Content',
		name: 'markdownContent',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		default: '',
		required: true,
		placeholder: '# Meeting Notes\n\n- Discussed timeline\n- Assigned tasks\n\n```javascript\nconsole.log("code blocks work too!");\n```\n\nNext steps...',
		description: 'Paste markdown content. Craft API automatically parses it into proper blocks (headers, code, lists, etc.).',
		displayOptions: { show: showOnlyForBlockInsert },
	},

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
