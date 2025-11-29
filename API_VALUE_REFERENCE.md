# Craft API Value Reference

**Purpose:** Prevent invalid API value bugs by documenting exact valid values from API responses.

---

## Block Properties

### textStyle (for text blocks)
**Source:** API validation error message + response examples

| Valid Value | Description | Node Default |
|-------------|-------------|--------------|
| *(empty)* | Don't change (partial update) | ✅ Default |
| `body` | Default text style | |
| `card` | Card-styled block | |
| `page` | Page title style | |
| `h1` | Heading level 1 | |
| `h2` | Heading level 2 | |
| `h3` | Heading level 3 | |
| `h4` | Heading level 4 (deepest) | |
| `caption` | Caption text | |

**⚠️ INVALID VALUES:**
- `code` - NOT valid! API auto-detects code blocks from ``` markdown syntax
- `title` - NOT valid! Use `page` or `h1` instead
- `subtitle` - NOT valid! Use `caption` or `body` instead

**Code blocks:** Send as `type: 'text'` with markdown containing ``` syntax. API will return `type: 'code'` with `language` and `rawCode` properties.

**Partial Updates:** When updating blocks, use empty string (Don't Change) to keep current style. Only non-empty values are sent to API.

---

### listStyle
**Source:** API response examples

| Valid Value | Description | Node Default |
|-------------|-------------|--------------|
| *(empty)* | Don't change (partial update) | ✅ Default |
| `none` | No list style | |
| `bullet` | Bullet point list | |
| `numbered` | Numbered list | |
| `todo` | Todo/checkbox item | |
| `toggle` | Collapsible toggle | |

**Partial Updates:** When updating blocks, use empty string (Don't Change) to keep current style.

---

### type (block type in responses)
**Source:** API validation error message

| Valid Value | Description |
|-------------|-------------|
| `text` | Standard text block |
| `page` | Page container |
| `code` | Code block (auto-detected) |
| `richUrl` | URL preview block |
| `line` | Horizontal line |
| `table` | Table block |
| `image` | Image block |
| `video` | Video block |
| `file` | File attachment |

---

## Task Properties

### state
**Source:** API docs

| Valid Value | Description |
|-------------|-------------|
| `todo` | Not completed |
| `done` | Completed (moves to logbook) |
| `cancelled` | Cancelled (moves to logbook) |

### scope (for GET /tasks)
**Source:** API docs

| Valid Value | Description |
|-------------|-------------|
| `active` | Tasks due before now, not completed |
| `upcoming` | Tasks scheduled after now |
| `inbox` | Only inbox tasks |
| `logbook` | Completed/cancelled tasks |

### location.type (for POST /tasks)
**Source:** API docs

| Valid Value | Description |
|-------------|-------------|
| `inbox` | Add to task inbox |
| `dailyNote` | Add to specific daily note (requires `date`) |

---

## Collection Properties

### schema format (GET /collections/{id}/schema)
**Source:** API docs

| Valid Value | Description |
|-------------|-------------|
| `json-schema-items` | JSON Schema for validation (default) |
| `schema` | Schema structure with name/properties |

---

## Position Object

### position
**Source:** API docs

| Valid Value | Description |
|-------------|-------------|
| `end` | Insert at end of document |
| `start` | Insert at start of document |
| `before` | Insert before referenceBlockId |
| `after` | Insert after referenceBlockId |

### date
**Source:** API docs

| Valid Value | Description |
|-------------|-------------|
| `today` | Current date |
| `tomorrow` | Next day |
| `yesterday` | Previous day |
| `YYYY-MM-DD` | ISO date format |

---

## Validation Rules

1. **Always validate against this document** before adding new options
2. **When API returns 400**, check the error message for valid values
3. **Code blocks** are NEVER sent with `textStyle: 'code'`
4. **Empty strings** may be invalid - check if API expects `undefined` instead
5. **Dates** support relative formats - use them for better UX
