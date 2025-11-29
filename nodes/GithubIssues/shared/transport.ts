/**
 * TRANSPORT LAYER
 * Centralizes API request logic for listSearch methods and programmatic execute()
 * Benefits: Single place to handle auth, base URL, headers, error handling
 */
import type {
	IHookFunctions,           // Context for webhook/polling triggers
	IExecuteFunctions,        // Context for execute() method
	IExecuteSingleFunctions,  // Context for single-item execution
	ILoadOptionsFunctions,    // Context for loadOptions/listSearch methods
	IHttpRequestMethods,      // 'GET' | 'POST' | 'PUT' | 'DELETE' | etc.
	IDataObject,              // Generic object type { [key: string]: any }
	IHttpRequestOptions,      // Request configuration object
} from 'n8n-workflow';

/**
 * Make authenticated API request to GitHub
 * Usage: await githubApiRequest.call(this, 'GET', '/users', { q: 'filter' });
 */
export async function githubApiRequest(
	// CONTEXT TYPES: Function works in multiple n8n contexts
	this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,           // API path like '/repos/owner/repo/issues'
	qs: IDataObject = {},       // Query string parameters
	body: IDataObject | undefined = undefined,
) {
	// Get user's auth selection to determine which credential to use
	const authenticationMethod = this.getNodeParameter('authentication', 0);

	const options: IHttpRequestOptions = {
		method,
		qs,
		body,
		url: `https://api.github.com${resource}`,  // Prepend base URL
		json: true,  // Parse response as JSON
	};

	// CREDENTIAL MAPPING: Map auth selection to credential type name
	const credentialType =
		authenticationMethod === 'accessToken' ? 'githubIssuesApi' : 'githubIssuesOAuth2Api';

	// httpRequestWithAuthentication: n8n helper that injects auth headers automatically
	return this.helpers.httpRequestWithAuthentication.call(this, credentialType, options);
}
