n8n community nodes for Craft's Connect API. two nodes — one for daily notes + tasks, one for named documents. fully declarative, no `execute()` method, works as AI agent tools (`usableAsTool: true`).

```bash
npm install n8n-nodes-craft-daily-notes
```

or install via n8n's community nodes UI by package name.

[![npm](https://img.shields.io/npm/v/n8n-nodes-craft-daily-notes.svg?style=flat-square)](https://www.npmjs.com/package/n8n-nodes-craft-daily-notes)
[![node](https://img.shields.io/badge/node->=20.15-93450a.svg?style=flat-square)](https://nodejs.org/)
[![license](https://img.shields.io/badge/license-MIT-grey.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## what it does

two separate n8n nodes wrapping Craft's two Connect APIs:

**craft daily notes** — date-indexed journal entries

| resource | operations |
|:---|:---|
| block | get, insert, update, delete, move, search |
| task | get, add, update, delete |
| collection | list, get schema, get items, add items, update items, delete items |
| search | search across all daily notes (plain text or RE2 regex) |

**craft documents** — named, addressable documents

| resource | operations |
|:---|:---|
| document | list |
| block | get, insert, update, delete, move, search |
| collection | list, get schema, get items, add items, update items, delete items |
| search | search across documents with include/exclude filters |

the difference between the two nodes is addressing: daily notes use dates, documents use document IDs. everything else — block updates, collection operations, search — works the same way.

## authentication

no tokens, no OAuth. Craft's Connect API embeds the auth in the URL itself.

1. in Craft, go to Settings > Connect
2. grab the API URL (looks like `https://connect.craft.do/links/{UUID}/api/v1`)
3. paste it into the n8n credential

that's the entire auth setup. the UUID in the URL is the access grant.

## usage

### insert a block into today's daily note

set resource to **block**, operation to **insert**, write your content as markdown. Craft's server parses it into proper block types.

### manage tasks

get active/upcoming/inbox/logbook tasks, add new ones with schedule and deadline dates, update state (todo/done/cancelled), or delete by ID.

### work with collections

collections are structured databases inside Craft. you can list them, fetch their schema (raw or JSON Schema format), and CRUD items with typed properties.

### search

two scopes: search within a single document/daily note (returns matching blocks with context), or search across all daily notes / documents with date range or document ID filters. supports plain text and RE2 regex.

## block properties

| property | values |
|:---|:---|
| text style | `body`, `caption`, `card`, `h1`-`h4`, `page` |
| list style | `bullet`, `none`, `numbered`, `task`, `toggle` |
| font | `system`, `serif`, `rounded`, `mono` |
| position | `start`, `end`, `before`, `after` (relative to a sibling block) |
| color | hex value, sent as `decorations: [{ color: "#hex" }]` |

## build from source

```bash
git clone https://github.com/yigitkonur/n8n-nodes-craft-daily-notes.git
cd n8n-nodes-craft-daily-notes
pnpm install
pnpm build
```

other commands:

```bash
pnpm build:watch    # tsc --watch
pnpm lint           # n8n-node lint
pnpm lint:fix       # n8n-node lint --fix
```

requires node >= 20.15 and pnpm.

## project structure

```
credentials/
  CraftDailyNotesApi.credentials.ts    — daily notes API credential
  CraftDocumentsApi.credentials.ts     — documents API credential
nodes/
  shared/
    blockDefinitions.ts                — shared option lists (styles, fonts, positions)
    transport.ts                       — API request factory, ID array parser
  CraftDailyNotes/
    CraftDailyNotes.node.ts            — main node class
    shared/transport.ts                — credential-bound API request
    loadOptions/getCollections.ts      — dynamic dropdown for collections
    resources/
      block/                           — get, insert, update, delete, move, search
      task/                            — get, add, update, delete
      collection/                      — list, schema, items CRUD
      search/                          — cross-daily-note search
  CraftDocuments/
    CraftDocuments.node.ts             — main node class
    shared/transport.ts                — credential-bound API request
    loadOptions/
      getDocuments.ts                  — dynamic dropdown for documents
      getCollections.ts                — dynamic dropdown for collections
      getBlocks.ts                     — dynamic dropdown, flattens block tree
    resources/
      document/                        — list
      block/                           — same as daily notes, uses document ID instead of date
      collection/                      — same ops, filters by document IDs instead of dates
      search/                          — cross-document search with include/exclude
icons/
  craft.svg                            — light mode
  craft.dark.svg                       — dark mode
```

## how it works internally

- fully declarative architecture — all routing defined in `INodeProperties` metadata, no imperative `execute()` method
- block insert uses a `preSend` hook that wraps markdown into a `type: "text"` block, lets Craft's server-side parser handle the rest
- ID fields accept both comma-separated strings and JSON arrays
- dynamic dropdowns (`loadOptions`) fetch live data from the API for collections, documents, and block trees
- block tree flattening uses recursive traversal with depth-based indentation for the dropdown display

## license

MIT
