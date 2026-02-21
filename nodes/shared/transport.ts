/**
 * Shared Transport Layer Factory
 * Creates API request functions for different Craft credentials
 * Eliminates duplication between CraftDocuments and CraftDailyNotes
 */
import type {
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

/**
 * Factory function to create a Craft API request handler
 * @param credentialName - The name of the credential to use (e.g., 'craftDocumentsApi', 'craftApi')
 * @returns An async function that makes API requests to the Craft API
 */
export function createCraftApiRequest(credentialName: string) {
	return async function craftApiRequest(
		this: ILoadOptionsFunctions,
		method: IHttpRequestMethods,
		endpoint: string,
		qs: IDataObject = {},
	): Promise<IDataObject | IDataObject[]> {
		const credentials = await this.getCredentials(credentialName);
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

		// Add Bearer token if configured
		const apiToken = credentials.apiToken as string | undefined;
		if (apiToken) {
			options.headers = {
				...options.headers,
				Authorization: `Bearer ${apiToken}`,
			};
		}

		try {
			return await this.helpers.httpRequest(options);
		} catch (error: unknown) {
			const err = error as { message?: string; response?: { status?: number; body?: unknown } };
			const errorMessage = err?.message || 'Unknown error';
			const statusCode = err?.response?.status;
			const responseBody = err?.response?.body;

			let detailedMessage = `Craft API request failed: ${errorMessage}`;

			// Provide helpful error messages based on status code
			if (statusCode === 401) {
				detailedMessage = 'Authentication failed. Check your API URL or token.';
			} else if (statusCode === 404) {
				detailedMessage = 'Resource not found. Check the ID or endpoint.';
			} else if (statusCode === 429) {
				detailedMessage = 'Rate limit exceeded. Please wait and try again.';
			} else if (statusCode) {
				detailedMessage += ` (HTTP ${statusCode})`;
			}

			// Include error details from response body if available
			if (responseBody && typeof responseBody === 'object') {
				const body = responseBody as { error?: { message?: string; code?: string }; message?: string };
				const errorDetail = body.error?.message || body.message;
				if (errorDetail) {
					detailedMessage += ` - ${errorDetail}`;
				}
			}

			throw new Error(detailedMessage);
		}
	};
}

/**
 * Common ID array parsing expression
 * Handles both comma-separated and JSON array formats
 */
export const parseIdArrayExpression =
	'={{ $value && $value.trim().startsWith("[") ? (() => { try { return JSON.parse($value); } catch { return $value.split(",").map(id => id.trim()).filter(id => id); } })() : ($value ? $value.split(",").map(id => id.trim()).filter(id => id) : []) }}';
