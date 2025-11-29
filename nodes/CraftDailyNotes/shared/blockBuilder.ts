/**
 * SMART BLOCK BUILDER
 * Converts markdown content into Craft API block structure
 * Handles intelligent splitting for large content
 */

export interface BlockStructure {
	type: 'text';
	markdown: string;
	textStyle?: 'body' | 'title' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'code' | 'page';
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
	if (line.startsWith('#### ') || line.startsWith('##### ') || line.startsWith('###### ')) return 'h3';
	if (line.startsWith('```')) return 'code';
	return 'body';
}

/**
 * Check if a line is a header
 */
function isHeader(line: string): boolean {
	return /^#{1,6}\s+/.test(line);
}

/**
 * Split text by sentences while respecting the max size
 */
function splitBySentences(text: string, maxSize: number): string[] {
	const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
	const chunks: string[] = [];
	let currentChunk = '';

	for (const sentence of sentences) {
		if (currentChunk.length + sentence.length > maxSize && currentChunk.length > 0) {
			chunks.push(currentChunk.trim());
			currentChunk = sentence;
		} else {
			currentChunk += sentence;
		}
	}

	if (currentChunk.trim()) {
		chunks.push(currentChunk.trim());
	}

	return chunks;
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

	// Split by paragraphs first
	const paragraphs = opts.splitOnParagraphs ? splitByParagraphs(markdown) : [markdown];

	for (const paragraph of paragraphs) {
		const trimmed = paragraph.trim();
		if (!trimmed) continue;

		// Check if this is a header
		if (opts.preserveHeaders && isHeader(trimmed)) {
			const lines = trimmed.split('\n');
			for (const line of lines) {
				if (isHeader(line)) {
					blocks.push({
						type: 'text',
						markdown: line,
						textStyle: detectTextStyle(line),
					});
				} else if (line.trim()) {
					blocks.push({
						type: 'text',
						markdown: line.trim(),
					});
				}
			}
			continue;
		}

		// Check if this is a code block
		if (trimmed.startsWith('```')) {
			blocks.push({
				type: 'text',
				markdown: trimmed,
				textStyle: 'code',
			});
			continue;
		}

		// Handle regular content - split if too large
		if (trimmed.length <= opts.maxBlockSize) {
			blocks.push({
				type: 'text',
				markdown: trimmed,
			});
		} else {
			// Split large content by sentences
			const chunks = splitBySentences(trimmed, opts.maxBlockSize);
			for (const chunk of chunks) {
				blocks.push({
					type: 'text',
					markdown: chunk,
				});
			}
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
