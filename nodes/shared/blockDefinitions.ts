/**
 * Shared Block Definitions
 * Common options for block operations used by both CraftDocuments and CraftDailyNotes nodes
 */
import type { INodePropertyOptions } from 'n8n-workflow';

/**
 * Text style options for blocks
 * Valid API values: card, page, h1, h2, h3, h4, caption, body
 */
export const textStyleOptions: INodePropertyOptions[] = [
	{ name: 'Body', value: 'body' },
	{ name: 'Caption', value: 'caption' },
	{ name: 'Card', value: 'card' },
	{ name: "Don't Change", value: '' },
	{ name: 'Heading 1', value: 'h1' },
	{ name: 'Heading 2', value: 'h2' },
	{ name: 'Heading 3', value: 'h3' },
	{ name: 'Heading 4', value: 'h4' },
	{ name: 'Page', value: 'page' },
];

/**
 * List style options for blocks
 * API uses 'task' (not 'todo') for task/checkbox items
 */
export const listStyleOptions: INodePropertyOptions[] = [
	{ name: 'Bullet', value: 'bullet' },
	{ name: "Don't Change", value: '' },
	{ name: 'None', value: 'none' },
	{ name: 'Numbered', value: 'numbered' },
	{ name: 'Task', value: 'task' },
	{ name: 'Toggle', value: 'toggle' },
];

/**
 * Font options for blocks
 * API values: system, serif, rounded, mono
 */
export const fontOptions: INodePropertyOptions[] = [
	{ name: "Don't Change", value: '' },
	{ name: 'System', value: 'system' },
	{ name: 'Serif', value: 'serif' },
	{ name: 'Rounded', value: 'rounded' },
	{ name: 'Mono', value: 'mono' },
];

/**
 * Block types supported by the Craft API
 */
export const blockTypeOptions: INodePropertyOptions[] = [
	{ name: 'Text', value: 'text', description: 'Plain text with markdown' },
	{ name: 'Page/Card', value: 'page', description: 'Container for nested content' },
	{ name: 'Code', value: 'code', description: 'Code snippet with syntax highlighting' },
	{ name: 'Image (URL)', value: 'image', description: 'Image from URL' },
];

/**
 * Position type options for block insert/move operations
 */
export const positionTypeOptions: INodePropertyOptions[] = [
	{ name: 'End of Document', value: 'end', description: 'Append to the end' },
	{ name: 'Start of Document', value: 'start', description: 'Insert at the beginning' },
	{ name: 'Before Block', value: 'before', description: 'Insert before a specific block' },
	{ name: 'After Block', value: 'after', description: 'Insert after a specific block' },
];
