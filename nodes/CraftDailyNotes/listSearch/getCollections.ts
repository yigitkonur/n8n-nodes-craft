/**
 * LOAD OPTIONS METHOD: Get Collections
 * Powers the dynamic dropdown for collection selection
 */
import type { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';

import { craftApiRequest } from '../shared/transport';

interface CraftCollection {
	id: string;
	name: string;
	itemCount: number;
	dailyNoteDate: string;
}

interface CraftCollectionsResponse {
	items: CraftCollection[];
}

export async function getCollections(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const response = await craftApiRequest.call(this, 'GET', '/collections');

	const data = response as unknown as CraftCollectionsResponse;
	const collections = data.items || [];

	// Map to n8n options format
	return collections.map((collection) => ({
		name: `${collection.name} (${collection.dailyNoteDate})`,
		value: collection.id,
	}));
}
