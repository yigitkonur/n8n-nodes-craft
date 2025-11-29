/**
 * RESOURCE INDEX PATTERN
 * This file defines: operations dropdown + common fields + spreads operation-specific properties
 * Exported array is spread into main node's properties: ...issueDescription
 */
import type { INodeProperties } from 'n8n-workflow';

// Shared UI components (resource locators)
import { repoNameSelect, repoOwnerSelect } from '../../shared/descriptions';

// Operation-specific properties (each file defines fields for one operation)
import { issueGetManyDescription } from './getAll';
import { issueGetDescription } from './get';
import { issueCreateDescription } from './create';

// DISPLAY CONDITION: Reusable condition to show fields only when resource='issue'
const showOnlyForIssues = { resource: ['issue'] };

export const issueDescription: INodeProperties[] = [
	// OPERATION SELECTOR: Each option includes its routing config
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForIssues },  // Only show when Issue resource selected
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get issues in a repository',  // Shows in AI agent descriptions
				description: 'Get many issues in a repository',
				// ROUTING: Declarative HTTP request - no execute() code needed
				routing: {
					request: {
						method: 'GET',
						// URL EXPRESSION: {{$parameter.X}} injects user-selected values
						url: '=/repos/{{$parameter.owner}}/{{$parameter.repository}}/issues',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an issue',
				description: 'Get the data of a single issue',
				routing: {
					request: {
						method: 'GET',
						url: '=/repos/{{$parameter.owner}}/{{$parameter.repository}}/issues/{{$parameter.issue}}',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a new issue',
				description: 'Create a new issue',
				routing: {
					request: {
						method: 'POST',
						url: '=/repos/{{$parameter.owner}}/{{$parameter.repository}}/issues',
					},
				},
			},
		],
		default: 'getAll',
	},

	// COMMON FIELDS: Appear for all operations of this resource
	// Spread shared components and add resource-specific displayOptions
	{ ...repoOwnerSelect, displayOptions: { show: showOnlyForIssues } },
	{ ...repoNameSelect, displayOptions: { show: showOnlyForIssues } },

	// OPERATION-SPECIFIC FIELDS: Each spread adds fields for one operation
	// Each file uses displayOptions to show only for its operation
	...issueGetManyDescription,   // Limit, Return All, Filters
	...issueGetDescription,       // Issue selector
	...issueCreateDescription,    // Title, Body, Labels
];
