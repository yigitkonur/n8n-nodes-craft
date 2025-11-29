/**
 * SHARED UI COMPONENTS
 * Reusable field definitions imported by multiple operations
 * Contains: Resource Locator fields with multiple input modes
 *
 * RESOURCE LOCATOR PATTERN:
 * - type: 'resourceLocator' enables multiple input modes in one field
 * - modes: [list, url, name] give users flexibility
 * - list mode: Searchable dropdown powered by listSearch methods
 * - url mode: Paste URL, extract value with regex
 * - name mode: Direct input with validation
 */
import type { INodeProperties } from 'n8n-workflow';

// OWNER SELECTOR: 3 ways to specify repository owner
export const repoOwnerSelect: INodeProperties = {
	displayName: 'Repository Owner',
	name: 'owner',
	type: 'resourceLocator',  // Special type with multiple input modes
	default: { mode: 'list', value: '' },
	required: true,
	modes: [
		// MODE 1: Searchable dropdown
		{
			displayName: 'Repository Owner',
			name: 'list',
			type: 'list',
			placeholder: 'Select an owner...',
			typeOptions: {
				searchListMethod: 'getUsers',  // Links to methods.listSearch.getUsers
				searchable: true,
				searchFilterRequired: false,   // Can show results without search
			},
		},
		// MODE 2: Paste URL, extract value
		{
			displayName: 'Link',
			name: 'url',
			type: 'string',
			placeholder: 'e.g. https://github.com/n8n-io',
			extractValue: {
				type: 'regex',
				regex: 'https:\\/\\/github.com\\/([-_0-9a-zA-Z]+)',  // Capture group = value
			},
			validation: [
				{
					type: 'regex',
					properties: {
						regex: 'https:\\/\\/github.com\\/([-_0-9a-zA-Z]+)(?:.*)',
						errorMessage: 'Not a valid GitHub URL',
					},
				},
			],
		},
		// MODE 3: Direct text input
		{
			displayName: 'By Name',
			name: 'name',
			type: 'string',
			placeholder: 'e.g. n8n-io',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '[-_a-zA-Z0-9]+',
						errorMessage: 'Not a valid GitHub Owner Name',
					},
				},
			],
			url: '=https://github.com/{{$value}}',  // Generate clickable link
		},
	],
};

export const repoNameSelect: INodeProperties = {
	displayName: 'Repository Name',
	name: 'repository',
	type: 'resourceLocator',
	default: {
		mode: 'list',
		value: '',
	},
	required: true,
	modes: [
		{
			displayName: 'Repository Name',
			name: 'list',
			type: 'list',
			placeholder: 'Select an Repository...',
			typeOptions: {
				searchListMethod: 'getRepositories',
				searchable: true,
			},
		},
		{
			displayName: 'Link',
			name: 'url',
			type: 'string',
			placeholder: 'e.g. https://github.com/n8n-io/n8n',
			extractValue: {
				type: 'regex',
				regex: 'https:\\/\\/github.com\\/(?:[-_0-9a-zA-Z]+)\\/([-_.0-9a-zA-Z]+)',
			},
			validation: [
				{
					type: 'regex',
					properties: {
						regex: 'https:\\/\\/github.com\\/(?:[-_0-9a-zA-Z]+)\\/([-_.0-9a-zA-Z]+)(?:.*)',
						errorMessage: 'Not a valid GitHub Repository URL',
					},
				},
			],
		},
		{
			displayName: 'By Name',
			name: 'name',
			type: 'string',
			placeholder: 'e.g. n8n',
			validation: [
				{
					type: 'regex',
					properties: {
						regex: '[-_.0-9a-zA-Z]+',
						errorMessage: 'Not a valid GitHub Repository Name',
					},
				},
			],
			url: '=https://github.com/{{$parameter["owner"]}}/{{$value}}',
		},
	],
	displayOptions: {
		hide: {
			resource: ['user', 'organization'],
			operation: ['getRepositories'],
		},
	},
};

export const issueSelect: INodeProperties = {
	displayName: 'Issue',
	name: 'issue',
	type: 'resourceLocator',
	default: {
		mode: 'list',
		value: '',
	},
	required: true,
	modes: [
		{
			displayName: 'Issue',
			name: 'list',
			type: 'list',
			placeholder: 'Select an Issue...',
			typeOptions: {
				searchListMethod: 'getIssues',
				searchable: true,
			},
		},
		{
			displayName: 'By ID',
			name: 'name',
			type: 'string',
			placeholder: 'e.g. 123',
			url: '=https://github.com/{{$parameter.owner}}/{{$parameter.repository}}/issues/{{$value}}',
		},
	],
};
