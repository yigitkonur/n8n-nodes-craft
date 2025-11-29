/**
 * DECLARATIVE NODE PATTERN
 * Use this pattern when: REST APIs with standard CRUD operations
 * Key concept: No execute() method - properties with 'routing' config make HTTP requests automatically
 */
import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';

// MODULAR IMPORTS: Each resource has its own folder with operation definitions
import { issueDescription } from './resources/issue';
import { issueCommentDescription } from './resources/issueComment';

// LIST SEARCH IMPORTS: Functions that power dynamic dropdowns
import { getRepositories } from './listSearch/getRepositories';
import { getUsers } from './listSearch/getUsers';
import { getIssues } from './listSearch/getIssues';

export class GithubIssues implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GitHub Issues',
		name: 'githubIssues',
		icon: { light: 'file:../../icons/github.svg', dark: 'file:../../icons/github.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',  // Dynamic subtitle
		description: 'Consume issues from the GitHub API',
		defaults: { name: 'GitHub Issues' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],

		// CREDENTIALS: Support multiple auth types with conditional display
		credentials: [
			{
				name: 'githubIssuesApi',         // Links to credentials/GithubIssuesApi.credentials.ts
				required: true,
				displayOptions: {
					show: { authentication: ['accessToken'] },  // Show only when Access Token selected
				},
			},
			{
				name: 'githubIssuesOAuth2Api',   // Links to credentials/GithubIssuesOAuth2Api.credentials.ts
				required: true,
				displayOptions: {
					show: { authentication: ['oAuth2'] },       // Show only when OAuth2 selected
				},
			},
		],

		// REQUEST DEFAULTS: Applied to ALL declarative API calls from this node
		requestDefaults: {
			baseURL: 'https://api.github.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},

		// PROPERTIES: Merged from multiple sources using spread operator
		properties: [
			// Auth selector - controls which credential appears
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{ name: 'Access Token', value: 'accessToken' },
					{ name: 'OAuth2', value: 'oAuth2' },
				],
				default: 'accessToken',
			},

			// Resource selector - controls which operation options appear
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,  // Don't allow expressions for this field
				options: [
					{ name: 'Issue', value: 'issue' },
					{ name: 'Issue Comment', value: 'issueComment' },
				],
				default: 'issue',
			},

			// SPREAD PATTERN: Import all properties from resource files
			// Each resource file exports an array of INodeProperties
			...issueDescription,         // All Issue operations (Get, Get Many, Create)
			...issueCommentDescription,  // All Issue Comment operations
		],
	};

	// METHODS: Register dynamic dropdown handlers
	// These are called by resourceLocator fields with searchListMethod config
	methods = {
		listSearch: {
			getRepositories,  // Called by repository dropdown
			getUsers,         // Called by owner dropdown
			getIssues,        // Called by issue dropdown
		},
	};
}
