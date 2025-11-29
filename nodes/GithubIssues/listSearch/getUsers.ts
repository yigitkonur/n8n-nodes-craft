/**
 * LIST SEARCH METHOD: getUsers
 * Powers the "Repository Owner" dropdown with searchable user list
 * Registered in node: methods.listSearch.getUsers
 * Called by: resourceLocator with searchListMethod: 'getUsers'
 */
import type {
	ILoadOptionsFunctions,    // Context for loadOptions/listSearch - has getNodeParameter, etc.
	INodeListSearchResult,    // Return type: { results: [], paginationToken?: string }
	INodeListSearchItems,     // Item type: { name, value, url? }
} from 'n8n-workflow';
import { githubApiRequest } from '../shared/transport';

// Type definitions for GitHub API response
type UserSearchItem = { login: string; html_url: string };
type UserSearchResponse = { items: UserSearchItem[]; total_count: number };

/**
 * @param filter - User's search input (what they typed in the dropdown)
 * @param paginationToken - Token from previous call to fetch next page
 * @returns { results: [{name, value, url}], paginationToken?: string }
 */
export async function getUsers(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	// PAGINATION: Convert token to page number (or start at 1)
	const page = paginationToken ? +paginationToken : 1;
	const per_page = 100;

	// Initialize empty response (for graceful failure)
	let responseData: UserSearchResponse = { items: [], total_count: 0 };

	try {
		// Use transport helper for authenticated API call
		responseData = await githubApiRequest.call(this, 'GET', '/search/users', {
			q: filter,  // Pass user's search filter to API
			page,
			per_page,
		});
	} catch {
		// GRACEFUL FAILURE: Return empty results instead of throwing
	}

	// TRANSFORM: Convert API response to n8n format
	const results: INodeListSearchItems[] = responseData.items.map((item: UserSearchItem) => ({
		name: item.login,      // Displayed in dropdown
		value: item.login,     // Stored when selected
		url: item.html_url,    // Optional: shown as link in UI
	}));

	// PAGINATION TOKEN: Return next page number if more results exist
	const nextPaginationToken = page * per_page < responseData.total_count ? page + 1 : undefined;

	return { results, paginationToken: nextPaginationToken };
}
