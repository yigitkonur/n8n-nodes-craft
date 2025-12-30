# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-30

### 🎉 Highlights

**Major release with 40+ improvements, 100% API coverage, and 500+ ready-to-use workflows!**

- 📋 **Document Dropdowns** — Select documents visually instead of copying IDs
- 🧱 **Structured Block Insert** — Full control over block types (text, code, image, divider)
- 🔍 **Regex Search** — RE2-compatible pattern matching across all documents
- 📊 **Schema-Aware Collections** — Dynamic property fields based on collection schema
- 📦 **500+ Workflows** — [Production-ready workflows](https://github.com/yigitkonur/craft-n8n-workflows) ported from ClickUp, Airtable, Monday.com, Grist, NocoDB & Baserow

### ⚠️ Breaking Changes

| Change | Migration |
|:---|:---|
| Block search `beforeBlockCount`/`afterBlockCount` now default to `5` (was `0`) | Set explicitly to `0` if you need no context blocks |
| `listStyle: 'todo'` renamed to `'task'` | Update hardcoded values to use `task` |
| Collection `properties` field restructured | Workflows using raw JSON may need adjustment for new dynamic fields |

### Added

- **Document Selector Dropdowns** for all block operations — no more manual ID entry
- **Structured Block Insert Mode** with full type control:
  - Text blocks: markdown, textStyle, listStyle, font, indentation, color
  - Page/Card blocks: title, textStyle, cardLayout
  - Code blocks: content, language
  - Image blocks: URL, altText
  - Divider blocks
- **Regex Search Support** with `regexps` parameter (RE2-compatible patterns)
- **Get Single Collection Item** operation — retrieve by ID without fetching entire collection
- **Dynamic Collection Properties** — auto-loads schema, shows correct input types
- **Native Date Pickers** with relative date support (`today`, `tomorrow`, `+3 days`)
- **`fetchMetadata` Parameter** — include `lastModifiedAt` and `createdAt` in document list
- **`allowNewSelectOptions`** — automatically add new select values to collection schema
- **Simplify Output Toggle** — flatten nested response structures on all GET operations
- **Resource Locator for Block IDs** — browse, search, or enter block IDs
- **Block Update Properties**: font, indentationLevel, color, textAlignment, cardLayout
- **Task Block Properties**: taskInfo.state, taskInfo.scheduleDate, taskInfo.deadlineDate
- **Enhanced AI Tool Descriptions** — better `usableAsTool` support with structured parameters
- **Shared Module Architecture** — 40% code reduction, consistent error handling
- **PostReceive Hooks** — consistent response processing across all operations
- **TypeScript Strict Mode** — strict null checks, explicit return types
- **Comprehensive Error Messages** with troubleshooting guidance

### Changed

- `beforeBlockCount` default: `0` → `5` (users expect search results with context)
- `afterBlockCount` default: `0` → `5`
- `listStyle` value: `todo` → `task` (matches API spec)
- Block ID inputs now use resource locator with multiple input modes
- Date inputs now use native date picker
- Collection properties use dynamic fields instead of raw JSON
- Error messages now user-friendly with context and troubleshooting tips
- Shared code consolidated to `shared/` directory

### Fixed

- `listStyle: 'todo'` not matching API specification
- Empty search context by default (now returns 5 blocks before/after)
- Collection property JSON parse errors not reported clearly
- Date timezone interpretation issues
- Empty responses returning `undefined` instead of `[]`
- Inconsistent error handling across operations

### Technical

- New directory structure with `nodes/shared/` for reusable modules
- `transport.ts` — API request factory
- `blockDefinitions.ts` — Reusable block property definitions
- `pagination.ts` — Pagination helpers
- `parseHelpers.ts` — ID array parsing, JSON parsing
- `types.ts` — Shared TypeScript interfaces

### Statistics

| Metric | v1.x | v2.0 | Change |
|:---|:---:|:---:|:---:|
| Operations | 23 | 28 | +5 |
| Parameters | 67 | 94 | +27 |
| Shared Code | 0% | 35% | +35% |
| API Coverage | ~70% | 100% | +30% |

---

## [1.0.17] - 2025-11-29

### Changed

- **MAJOR SIMPLIFICATION**: Let Craft API do the markdown parsing!
  - Send markdown as single text block → API automatically splits into proper blocks
  - Headers → h1/h2/h3/h4 blocks
  - Code fences → code blocks with language detection
  - Paragraphs → text blocks
  - Lists → properly formatted list blocks
  - Removed all client-side block building logic (no more `rawCode: undefined` errors!)

### Removed

- Removed `blockBuilder.ts` dependency from insert operation
- Removed "Content Mode" selector (no longer needed)
- Removed "Processing Options" (API handles everything)
- Simplified UI to just: Markdown Content + Target Date + Position

## [1.0.16] - 2025-11-29

### Fixed

- **Critical**: Fixed `rawCode: undefined` error when inserting code blocks
  - Added defensive line ending normalization (CRLF → LF)
  - Added `sanitizeBlock()` validation pass to ensure all blocks are valid
  - Code blocks now guaranteed to have `rawCode` as string (never undefined)
  - Text blocks now guaranteed to have valid `textStyle` from API allowed values
  - Empty/invalid blocks are filtered out before API request

### Changed

- `createCodeBlock()` function now more robust with multiple fallback strategies
- Added explicit block validation before returning from `buildBlocksFromMarkdown()`

## [1.0.15] - 2025-11-29

### Fixed

- **Critical**: Complete rewrite of Insert operation to fix n8n frontend crash
  - Replaced `fixedCollection` position field with simple direct properties
  - Frontend no longer crashes with "Cannot read properties of undefined (reading 'positionValues')"
  - All parameters now have proper try-catch wrappers with defaults

### Changed

- **Simplified Insert UI**: Position is now configured with simple dropdowns instead of nested collection
  - `Target Date`: Which daily note to insert into (default: today)
  - `Insert Position`: End, Start, Before Block, After Block (default: end)
  - `Reference Block ID`: Only shown when using Before/After

### Removed

- Removed non-working "Raw Markdown (API Native)" mode - API doesn't support text/markdown content-type
- Simplified to two content modes: Markdown (smart splitting) and Block Array (JSON)

## [1.0.14] - 2025-11-29

### Fixed

- **Critical**: "Cannot read properties of undefined (reading 'positionValues')" error
  - Added null-safe access (`?.` and `??`) to position parameter extraction
  - Added try-catch wrapper around getNodeParameter for position
  - Position now gracefully defaults to `{position: 'end', date: 'today'}` in all error cases

## [1.0.13] - 2025-11-29

### Fixed

- **Critical**: "Could not get parameter" error when using Insert operation
  - Position field now has proper defaults (`end` position, `today` date) - no need to click "Add Position"
  - Added fallback values for all getNodeParameter calls to prevent parameter resolution errors
  - Added `required: true` to markdown content fields for clearer validation errors

## [1.0.12] - 2025-11-29

### Added

- **Raw Markdown (API Native)** content mode for block insert
  - Sends markdown directly to API using `Content-Type: text/markdown`
  - Position passed as query parameter - simplest approach, API handles parsing
  - Now the default content mode for easier usage

### Fixed

- **Critical**: Code blocks now sent as `type: "code"` with `rawCode` property
  - Previous: sent as `type: "text"` with markdown containing ``` syntax
  - API requires proper code block structure with `rawCode` field
  - Language hints (e.g., \`\`\`javascript) are extracted and sent as `language` property

### Changed

- Renamed content modes for clarity:
  - "Raw Markdown (API Native)" - new default, simplest option
  - "Smart Markdown (Block Split)" - client-side processing with header detection
  - "Block Array (Advanced)" - for full control over block properties

### Removed

- Removed unused `maxBlockSize` option from block processing (was defined but never implemented)

## [1.0.11] - 2025-11-29

### Fixed

- **Critical**: API REQUIRES `textStyle` on all text blocks - cannot be omitted!
  - Previous versions omitted `textStyle` for non-headers → validation failure
  - Now ALL blocks get explicit `textStyle: 'body'` (headers get h1/h2/h3/h4)
  - Code blocks also get `textStyle: 'body'` - API auto-detects code from ``` syntax
  - Renamed `createPlainTextBlock()` → `createBodyTextBlock()` for clarity

## [1.0.10] - 2025-11-29

### Added

- **Fail-Safe Error Handling**: Block builder now never throws - always produces valid output
  - If code block extraction fails → send whole content as plain text
  - If paragraph splitting fails → send whole segment as plain text
  - If any segment processing fails → send that segment as plain text
  - Ultimate fallback: any error → send entire markdown as single plain text block
  - Plain text blocks have no `textStyle` - API uses sensible defaults

### Changed

- `detectTextStyle()` now returns `undefined` for non-headers (let API decide)
- Added `createPlainTextBlock()` helper for consistent fail-safe blocks

## [1.0.9] - 2025-11-29

### Fixed

- **Critical**: Code blocks with internal blank lines no longer cause 400 validation errors
  - Root cause: `splitByParagraphs()` was splitting code blocks on `\n\n`, creating invalid fragments
  - Fix: Extract code blocks BEFORE paragraph splitting using regex `/```[\s\S]*?```/g`
  - Code blocks are now preserved as single units and sent without textStyle (API auto-detects)
  - This fixes issues with markdown like:
    ```
    ```other
    line 1
    
    line 2
    ```
    ```

## [1.0.8] - 2025-11-29

### Changed

- **Codebase Cleanup**: Removed unused code and streamlined transport layer
  - Removed unused `craftApiRequestWithAccept` function (52 lines)
  - Simplified `craftApiRequest` to only what's needed for loadOptions
  - Removed `.DS_Store` and other OS artifacts
  - Removed `AGENTS.md` from git tracking (still in .gitignore)
  - Total source: 2041 lines across 25 files

## [1.0.7] - 2025-11-29

### Fixed

- **Block Update Partial Updates**: Added "Don't Change" option for textStyle and listStyle
  - Users can now explicitly set blocks to `body` or `none` without issues
  - Default is now "Don't Change" to support true partial updates
  - Only non-empty values are sent to API (matches task state pattern)

### Changed

- Updated `API_VALUE_REFERENCE.md` to document partial update patterns

## [1.0.6] - 2025-11-29

### Fixed

- **Block Update**: Fixed textStyle options to match valid API values
  - Removed invalid: `code`, `subtitle`, `title`
  - Added missing: `caption`, `card`, `h4`, `page`
- **Heading Detection**: `####` markdown now correctly maps to `h4` (was incorrectly mapped to `h3`)

### Added

- `API_VALUE_REFERENCE.md` - Complete reference of valid API values to prevent future issues

## [1.0.5] - 2025-11-29

### Fixed

- **Critical**: Block insert now works with code blocks (triple backticks)
- Root cause: `textStyle: 'code'` was being sent but is NOT a valid API value
- Valid textStyle values are: `card`, `page`, `h1`, `h2`, `h3`, `h4`, `caption`, `body`
- The API auto-detects code blocks from the ``` markdown syntax
- Updated `blockBuilder.ts` to not set textStyle for code blocks

## [1.0.4] - 2025-11-29

### Fixed

- **Critical**: Credential test now uses `/tasks?scope=active` instead of `/blocks?date=today`
- The previous test failed with 404 when no daily note exists for today's date, incorrectly reporting "Couldn't connect"
- The new test endpoint always returns 200 OK even with empty results

## [1.0.3] - 2025-11-29

### Fixed

- **Critical**: Task Update operation now supports true partial updates - State field defaults to "Don't Change" to prevent accidentally resetting completed/cancelled tasks back to "To Do"
- Verified all API endpoints match official Craft Daily Notes API documentation

## [1.0.2] - 2025-11-29

### Fixed

- Minor code quality improvements for n8n community standards compliance
- Alphabetized field ordering in Task Add operation per n8n linting rules
- Added conditional display for Location Date field (only shown when Location Type is Daily Note)

## [1.0.1] - 2025-11-29

### Fixed

- Initial compliance improvements

## [1.0.0] - 2025-11-29

### Added

- **Block Resource**: Get, Insert, Update, Delete, Move, Search in Document operations
- **Task Resource**: Get, Add, Update, Delete operations  
- **Collection Resource**: List, Get Schema, Get Items, Add Items, Update Items, Delete Items operations
- **Search Resource**: Search Across Daily Notes with relevance ranking
- **Smart Block Builder**: Automatically splits large markdown content into optimal blocks using preSend hooks
- **Dynamic Collection Dropdown**: Searchable dropdown for collection selection via loadOptions
- **Relative Date Support**: Use `today`, `tomorrow`, `yesterday`, or ISO format throughout
- **AI Tool Support**: Node can be used as an AI agent tool (`usableAsTool: true`)

### Technical

- Fully declarative node architecture with preSend hooks for complex operations
- TypeScript with strict mode enabled
- Full n8n community node standards compliance
- MIT licensed for n8n Cloud compatibility
