/**
 * UTILITY FUNCTIONS
 * Reusable helpers for API response processing
 */

/**
 * Parse HTTP Link header for pagination
 * GitHub returns: Link: <https://api.github.com?page=2>; rel="next", <...>; rel="last"
 * Returns: { next: 'url', last: 'url' }
 *
 * Used in pagination routing to check if more pages exist and get next URL
 */
export function parseLinkHeader(header?: string): { [rel: string]: string } {
	const links: { [rel: string]: string } = {};

	// Split by comma to get each link part
	for (const part of header?.split(',') ?? []) {
		const section = part.trim();
		// Regex: Extract URL from <...> and relationship from rel="..."
		const match = section.match(/^<([^>]+)>\s*;\s*rel="?([^"]+)"?/);
		if (match) {
			const [, url, rel] = match;
			links[rel] = url;  // Store as { 'next': 'url', 'last': 'url' }
		}
	}

	return links;
}
