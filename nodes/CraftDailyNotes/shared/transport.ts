/**
 * TRANSPORT LAYER
 * Centralizes API request logic for listSearch methods and programmatic execute()
 */
import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

/**
 * Make API request to Craft Daily Notes API
 * The API URL from credentials IS the authentication
 */
export async function craftApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs: IDataObject = {},
	headers: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('craftDailyNotesApi');
	const apiUrl = credentials.apiUrl as string;

	// Ensure apiUrl doesn't have trailing slash
	const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		qs,
		json: true,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...headers,
		},
	};

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	return this.helpers.httpRequest(options);
}

/**
 * Make API request with custom Accept header (for markdown response)
 */
export async function craftApiRequestWithAccept(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	accept: string,
	body?: IDataObject,
	qs: IDataObject = {},
): Promise<IDataObject | IDataObject[] | string> {
	const credentials = await this.getCredentials('craftDailyNotesApi');
	const apiUrl = credentials.apiUrl as string;

	const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		qs,
		headers: {
			Accept: accept,
			'Content-Type': 'application/json',
		},
		returnFullResponse: false,
	};

	// For markdown, don't parse as JSON
	if (accept === 'text/markdown') {
		options.json = false;
	} else {
		options.json = true;
	}

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	return this.helpers.httpRequest(options);
}
