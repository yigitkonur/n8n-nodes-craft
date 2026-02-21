/**
 * Transport layer for loadOptions methods
 * Provides centralized API request handling with proper error handling
 */
import type {
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

/**
 * Make API request to Craft Daily Notes API (n8n-nodes-craft)
 * Used by loadOptions methods (e.g., getCollections)
 *
 * @throws Error with descriptive message on API failure
 */
export async function craftApiRequest(
	this: ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	qs: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('craftDailyNotesApi');
	const apiUrl = credentials.apiUrl as string;

	if (!apiUrl) {
		throw new Error('API URL is not configured in credentials');
	}

	const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		qs,
		json: true,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	};

	try {
		return await this.helpers.httpRequest(options);
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		const httpError = error as { response?: { status?: number; body?: unknown } };
		const statusCode = httpError?.response?.status;
		const responseBody = httpError?.response?.body;

		let detailedMessage = `Craft API request failed: ${errorMessage}`;
		if (statusCode) {
			detailedMessage += ` (HTTP ${statusCode})`;
		}
		if (responseBody && typeof responseBody === 'object') {
			const body = responseBody as { error?: string; message?: string };
			if (body.error || body.message) {
				detailedMessage += ` - ${body.error || body.message}`;
			}
		}

		throw new Error(detailedMessage);
	}
}
