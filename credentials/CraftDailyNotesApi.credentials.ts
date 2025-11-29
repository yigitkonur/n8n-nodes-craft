import type {
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CraftDailyNotesApi implements ICredentialType {
	name = 'craftDailyNotesApi';

	displayName = 'Craft Daily Notes API';

	icon: Icon = { light: 'file:../icons/craft.svg', dark: 'file:../icons/craft.dark.svg' };

	documentationUrl = 'https://www.craft.do/s/hLrMZpKFfYRWPT';

	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://connect.craft.do/links/YOUR_ID/api/v1',
			description:
				'Your Connect API URL from Craft. Go to Settings → Connect → Daily Notes & Tasks to get this URL.',
		},
	];

	// No authenticate block needed - the API URL itself IS the authentication
	// The URL contains the unique identifier that grants access

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/blocks',
			method: 'GET',
			qs: {
				date: 'today',
			},
		},
	};
}
