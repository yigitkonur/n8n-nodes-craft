# n8n-nodes-craft-daily-notes

n8n community node for **[Craft Daily Notes API](https://www.craft.do/s/hLrMZpKFfYRWPT)** — manage blocks, tasks, collections, and search across your Craft daily notes.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-craft-daily-notes?style=flat-square&color=blue)](https://www.npmjs.com/package/n8n-nodes-craft-daily-notes)
[![n8n](https://img.shields.io/badge/n8n-Community%20Node-FF6D5A?style=flat-square&logo=n8n&logoColor=white)](https://docs.n8n.io/integrations/community-nodes/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE.md)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in n8n
2. Select **Install**
3. Enter `n8n-nodes-craft-daily-notes`
4. Select **Install**

### Manual Installation

```bash
cd ~/.n8n/nodes
npm install n8n-nodes-craft-daily-notes
```

## Setup

1. In Craft, go to **Settings → Connect → Daily Notes & Tasks**
2. Copy your **Connect API URL** (looks like `https://connect.craft.do/links/YOUR_ID/api/v1`)
3. In n8n, create new credentials for **Craft Daily Notes API**
4. Paste your API URL

> **Note**: The API URL itself acts as your authentication token. Keep it secure and do not share it publicly.

## Features

| Resource | Operations |
|----------|------------|
| **Block** | Get, Insert, Update, Delete, Move, Search in Document |
| **Task** | Get, Add, Update, Delete |
| **Collection** | List, Get Schema, Get Items, Add Items, Update Items, Delete Items |
| **Search** | Search Across Daily Notes |

### Smart Block Builder

Paste large markdown content — the node automatically splits it into optimal blocks while preserving headers and structure. Configurable options include:

- **Max Block Size**: Control maximum characters per block (1000-10000)
- **Preserve Headers**: Keep markdown headers as separate styled blocks
- **Split on Paragraphs**: Intelligent paragraph-aware splitting

### Relative Dates

Use `today`, `tomorrow`, `yesterday`, or ISO format (`YYYY-MM-DD`) throughout all date fields.

### AI Agent Support

This node is compatible with n8n AI agents (`usableAsTool: true`), allowing it to be used as a tool in AI-powered workflows.

## Examples

### Get Today's Blocks
- Resource: **Block**
- Operation: **Get**
- Date: `today`

### Add a Task to Inbox
- Resource: **Task**
- Operation: **Add**
- Task Content: `Review pull requests`
- Location Type: **Inbox**

### Search Across Notes
- Resource: **Search**
- Operation: **Search Across Daily Notes**
- Search Terms: `project alpha`

### Insert Smart Blocks
- Resource: **Block**
- Operation: **Insert**
- Content Mode: **Markdown Text**
- Paste your long-form content and let the node handle optimal splitting

## Development

```bash
npm install
npm run dev     # Start n8n with hot reload
npm run build   # Compile TypeScript
npm run lint    # Check code quality
```

## Resources

- [Craft Daily Notes API Documentation](https://www.craft.do/s/hLrMZpKFfYRWPT)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Changelog](CHANGELOG.md)

## Author

**Yigit Konur** — [GitHub](https://github.com/yigitkonur) • [Email](mailto:yigit@konur.dev)

## License

[MIT](LICENSE.md)
