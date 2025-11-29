/**
 * SMART BLOCK BUILDER
 * Converts markdown content into Craft API block structure
 * Handles code blocks, headers, and intelligent splitting
 */

export interface BlockStructure {
	type: 'text';
	markdown: string;
	// Valid textStyle values per API: card, page, h1, h2, h3, h4, caption, body
	// Note: 'code' is NOT a valid textStyle - API auto-detects code blocks from ``` syntax
	textStyle?: 'body' | 'card' | 'page' | 'h1' | 'h2' | 'h3' | 'h4' | 'caption';
	listStyle?: 'none' | 'bullet' | 'numbered' | 'todo' | 'toggle';
}

export interface BlockBuilderOptions {
	maxBlockSize: number;
	preserveHeaders: boolean;
	splitOnParagraphs: boolean;
}

const DEFAULT_OPTIONS: BlockBuilderOptions = {
	maxBlockSize: 5000,
	preserveHeaders: true,
	splitOnParagraphs: true,
};

/**
 * Detect text style from markdown content
 */
function detectTextStyle(line: string): BlockStructure['textStyle'] {
	if (line.startsWith('# ')) return 'h1';
	if (line.startsWith('## ')) return 'h2';
	if (line.startsWith('### ')) return 'h3';
	// h4 is the deepest heading level supported by the API
	if (line.startsWith('#### ') || line.startsWith('##### ') || line.startsWith('###### ')) return 'h4';
	return 'body';
}

/**
 * Check if a line is a header
 */
function isHeader(line: string): boolean {
	return /^#{1,6}\s+/.test(line);
}

/**
 * Extract code blocks from markdown BEFORE paragraph splitting
 * Returns array of {type: 'code' | 'text', content: string}
 */
function extractCodeBlocks(markdown: string): Array<{ type: 'code' | 'text'; content: string }> {
	const result: Array<{ type: 'code' | 'text'; content: string }> = [];
	
	// Match code blocks: ```language\n...content...\n```
	// This regex captures complete code blocks including internal newlines
	const codeBlockRegex = /```[\s\S]*?```/g;
	
	let lastIndex = 0;
	let match;
	
	while ((match = codeBlockRegex.exec(markdown)) !== null) {
		// Add text before this code block
		if (match.index > lastIndex) {
			const textBefore = markdown.slice(lastIndex, match.index);
			if (textBefore.trim()) {
				result.push({ type: 'text', content: textBefore });
			}
		}
		
		// Add the code block as a single unit
		result.push({ type: 'code', content: match[0] });
		lastIndex = match.index + match[0].length;
	}
	
	// Add remaining text after last code block
	if (lastIndex < markdown.length) {
		const remaining = markdown.slice(lastIndex);
		if (remaining.trim()) {
			result.push({ type: 'text', content: remaining });
		}
	}
	
	return result;
}

/**
 * Split text by paragraphs (double newlines)
 */
function splitByParagraphs(text: string): string[] {
	return text.split(/\n\n+/).filter((p) => p.trim());
}

/**
 * Build blocks from markdown content
 * Main entry point for the block builder
 */
export function buildBlocksFromMarkdown(
	markdown: string,
	options: Partial<BlockBuilderOptions> = {},
): BlockStructure[] {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const blocks: BlockStructure[] = [];

	// Handle empty input
	if (!markdown || !markdown.trim()) {
		return [];
	}

	// STEP 1: Extract code blocks first (they should never be split)
	const segments = extractCodeBlocks(markdown);

	for (const segment of segments) {
		// Code blocks: send as single block, NO textStyle (API auto-detects)
		if (segment.type === 'code') {
			blocks.push({
				type: 'text',
				markdown: segment.content.trim(),
				// NO textStyle - API auto-detects code blocks from ``` syntax
			});
			continue;
		}

		// STEP 2: Split text segments by paragraphs
		const paragraphs = opts.splitOnParagraphs 
			? splitByParagraphs(segment.content) 
			: [segment.content];

		for (const paragraph of paragraphs) {
			const trimmed = paragraph.trim();
			if (!trimmed) continue;

			// Headers: each gets its own block with textStyle
			if (opts.preserveHeaders && isHeader(trimmed)) {
				const lines = trimmed.split('\n');
				for (const line of lines) {
					const lineTrimmed = line.trim();
					if (!lineTrimmed) continue;
					
					if (isHeader(lineTrimmed)) {
						blocks.push({
							type: 'text',
							markdown: lineTrimmed,
							textStyle: detectTextStyle(lineTrimmed),
						});
					} else {
						// Non-header line after header - no textStyle needed
						blocks.push({
							type: 'text',
							markdown: lineTrimmed,
						});
					}
				}
				continue;
			}

			// Regular text: single block, no textStyle (API uses body by default)
			blocks.push({
				type: 'text',
				markdown: trimmed,
			});
		}
	}

	return blocks;
}

/**
 * Parse JSON block array from user input
 * Validates and normalizes the structure
 */
export function parseBlockArray(jsonString: string): BlockStructure[] {
	try {
		const parsed = JSON.parse(jsonString);
		
		// Handle both array and single object
		const blocks = Array.isArray(parsed) ? parsed : [parsed];
		
		// Validate and normalize each block
		return blocks.map((block) => {
			if (!block.type) {
				block.type = 'text';
			}
			if (!block.markdown && block.content) {
				block.markdown = block.content;
			}
			return block as BlockStructure;
		});
	} catch {
		throw new Error('Invalid JSON block array. Expected format: [{"type":"text","markdown":"Content"}]');
	}
}
