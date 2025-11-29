/**
 * LIST SEARCH METHOD: getIssues
 * Powers the "Issue" dropdown - filtered by owner AND repository
 * Demonstrates: Getting multiple sibling values, combining filters
 */
import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodeListSearchItems,
} from 'n8n-workflow';
import { githubApiRequest } from '../shared/transport';

type IssueSearchItem = { number: number; title: string; html_url: string };
type IssueSearchResponse = { items: IssueSearchItem[]; total_count: number };

export async function getIssues(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 1;
	const per_page = 100;

	let responseData: IssueSearchResponse = { items: [], total_count: 0 };

	// GET MULTIPLE SIBLINGS: Need both owner and repository to search issues
	// Second arg '' is default value if not found
	const owner = this.getNodeParameter('owner', '', { extractValue: true });
	const repository = this.getNodeParameter('repository', '', { extractValue: true });

	// COMBINE FILTERS: User's search + repo constraint
	const filters = [filter, `repo:${owner}/${repository}`];

	responseData = await githubApiRequest.call(this, 'GET', '/search/issues', {
		q: filters.filter(Boolean).join(' '),  // Remove empty, join with space
		page,
		per_page,
	});

	// DIFFERENT VALUE TYPE: value is number (issue ID), not string
	const results: INodeListSearchItems[] = responseData.items.map((item: IssueSearchItem) => ({
		name: item.title,       // Show issue title in dropdown
		value: item.number,     // Store issue number when selected
		url: item.html_url,
	}));

	const nextPaginationToken = page * per_page < responseData.total_count ? page + 1 : undefined;
	return { results, paginationToken: nextPaginationToken };
}
