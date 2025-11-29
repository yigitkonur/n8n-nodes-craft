/**
 * GET OPERATION PROPERTIES
 * Minimal file: Reuses issueSelect from shared descriptions
 * Demonstrates: DRY principle - import reusable components, add display conditions
 */
import type { INodeProperties } from 'n8n-workflow';
import { issueSelect } from '../../shared/descriptions';

const showOnlyForIssueGet = { operation: ['get'], resource: ['issue'] };

export const issueGetDescription: INodeProperties[] = [
	// SPREAD + OVERRIDE: Take shared component, add operation-specific displayOptions
	{ ...issueSelect, displayOptions: { show: showOnlyForIssueGet } },
];
