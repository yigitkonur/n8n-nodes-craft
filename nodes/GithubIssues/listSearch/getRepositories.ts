/**
 * LIST SEARCH METHOD: getRepositories
 * Powers the "Repository Name" dropdown - filtered by selected owner
 * Demonstrates: Getting sibling field values with getCurrentNodeParameter
 */
import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { githubApiRequest } from '../shared/transport';

type RepositorySearchItem = { name: string; html_url: string };
type RepositorySearchResponse = { items: RepositorySearchItem[]; total_count: number };

export async function getRepositories(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	// GET SIBLING VALUE: Get the 'owner' field value that user already selected
	// extractValue: true → gets the actual value from resourceLocator (not the mode object)
	const owner = this.getCurrentNodeParameter('owner', { extractValue: true });

	const page = paginationToken ? +paginationToken : 1;
	const per_page = 100;

	// BUILD QUERY: Combine user filter with owner constraint
	// GitHub search syntax: "user:owner" filters by owner, "fork:true" includes forks
	const q = `${filter ?? ''} user:${owner} fork:true`;

	let responseData: RepositorySearchResponse = { items: [], total_count: 0 };

	try {
		responseData = await githubApiRequest.call(this, 'GET', '/search/repositories', {
			q,
			page,
			per_page,
		});
	} catch {
		// GRACEFUL FAILURE: Owner might not have any repositories
	}

	const results: INodeListSearchItems[] = responseData.items.map((item: RepositorySearchItem) => ({
		name: item.name,
		value: item.name,
		url: item.html_url,
	}));

	const nextPaginationToken = page * per_page < responseData.total_count ? page + 1 : undefined;
	return { results, paginationToken: nextPaginationToken };
}
