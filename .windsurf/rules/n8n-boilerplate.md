---
trigger: always_on
---

# n8n Custom Node Development: AI Agent System Prompt

> **PURPOSE**: This document provides comprehensive guidance for AI agents building n8n custom nodes. It combines architectural understanding, code patterns, and decision-making frameworks.

---

## 🎯 How to Use This Guide

### When Starting a New Node Project

**STEP 1: Research the Target API**
- Read the API documentation at `[API_DOCS_URL]`
- Identify authentication method (API key, OAuth2, Basic Auth)
- List all available endpoints and their HTTP methods
- Note required/optional parameters for each endpoint
- Check if official SDK exists

**STEP 2: Choose Node Architecture**
```
Decision Tree:
│
├─ Is it a REST API with standard CRUD? 
│  └─ YES → Use DECLARATIVE style
│     └─ Read: docs/12-declarative-routing.md
│     └─ Reference: nodes/GithubIssues/GithubIssues.node.ts
│
├─ Does it have an official SDK/client library?
│  └─ YES → Use PROGRAMMATIC style
│     └─ Read: docs/13-custom-execute-methods.md + docs/19-external-sdk-integration.md
│     └─ Reference: nodes/Example/Example.node.ts
│
├─ Is it GraphQL, WebSocket, or non-REST?
│  └─ YES → Use PROGRAMMATIC style
│     └─ Read: docs/13-custom-execute-methods.md
│
└─ Complex authentication (request signing, multi-step auth)?
   └─ YES → Use PROGRAMMATIC style
      └─ Read: docs/13-custom-execute-methods.md
```

**STEP 3: Create File Structure**
```bash
# For simple single-resource API:
credentials/MyServiceApi.credentials.ts
nodes/MyService/
  ├── MyService.node.ts
  ├── MyService.node.json
  └── myservice.svg

# For multi-resource REST API (recommended pattern):
credentials/MyServiceApi.credentials.ts
nodes/MyService/
  ├── MyService.node.ts              # Main entry point
  ├── MyService.node.json            # Metadata
  ├── myservice.svg                  # Icon
  ├── resources/                     # One folder per resource
  │   ├── user/
  │   │   ├── index.ts              # Operations + common fields
  │   │   ├── create.ts             # Create operation properties
  │   │   ├── get.ts                # Get operation properties
  │   │   ├── getAll.ts             # List operation + pagination
  │   │   ├── update.ts             # Update operation properties
  │   │   └── delete.ts             # Delete operation properties
  │   └── project/
  │       └── [same structure]
  ├── listSearch/                    # Dynamic dropdowns
  │   ├── getUsers.ts
  │   └── getProjects.ts
  └── shared/
      ├── descriptions.ts            # Reusable UI components
      ├── transport.ts               # API request wrapper
      └── utils.ts                   # Helper functions
```

**STEP 4: Build Credentials**
- Read: `docs/08-api-key-credentials.md` OR `docs/09-oauth2-credentials.md`
- Reference: `credentials/GithubIssuesApi.credentials.ts`
- Create: `credentials/YourServiceApi.credentials.ts`

**STEP 5: Build Main Node File**
- Reference: `nodes/GithubIssues/GithubIssues.node.ts` (declarative) OR `nodes/Example/Example.node.ts` (programmatic)
- Define: `description` object with metadata
- Add: `credentials` array
- Add: `requestDefaults` (for declarative nodes)
- Add: `properties` array with resource selector
- Add: `methods` object with `listSearch` (if needed)

**STEP 6: Organize Resources (Multi-Resource APIs)**
- Read: `docs/11-resources-and-operations.md`
- For each API resource, create folder in `resources/`
- In `resources/[resource]/index.ts`:
  - Export array named `[resource]Description`
  - Include operation selector dropdown
  - Include common fields (owner, repository, etc.)
  - Spread operation-specific properties from separate files

**STEP 7: Define Operations**
- Create separate file for each operation (create.ts, get.ts, getAll.ts, etc.)
- Reference: `nodes/GithubIssues/resources/issue/create.ts`
- Each file exports: `[resource][Operation]Description: INodeProperties[]`
- Use `displayOptions.show` to show fields only for this operation
- Add `routing` config for declarative nodes

**STEP 8: Register in package.json**
```json
{
  "n8n": {
    "nodes": ["dist/nodes/YourService/YourService.node.js"],
    "credentials": ["dist/credentials/YourServiceApi.credentials.js"]
  }
}
```

---

## 📚 Code Pattern Reference Guide

### Pattern 1: Declarative REST API Node

**When to use**: REST API, standard CRUD operations, HTTP-based

**Key files to read**:
1. `docs/12-declarative-routing.md` - Core routing concepts
2. `docs/11-resources-and-operations.md` - Multi-resource organization
3. `nodes/GithubIssues/GithubIssues.node.ts` - Main structure
4. `nodes/GithubIssues/resources/issue/index.ts` - Resource organization
5. `nodes/GithubIssues/resources/issue/create.ts` - Operation with routing.send
6. `nodes/GithubIssues/resources/issue/getAll.ts` - Pagination pattern

**Architecture components**:
```typescript
// Main node: nodes/YourService/YourService.node.ts
description: {
  requestDefaults: {
    baseURL: 'https://api.yourservice.com/v1',
    headers: { 'Content-Type': 'application/json' }
  },
  properties: [
    { /* Authentication selector */ },
    { /* Resource selector */ },
    ...userDescription,        // Import from resources/user/index.ts
    ...projectDescription,     // Import from resources/project/index.ts
  ]
}

// Resource index: resources/user/index.ts
export const userDescription: INodeProperties[] = [
  { 
    /* Operation selector with inline routing */
    options: [
      {
        name: 'Create',
        value: 'create',
        routing: { request: { method: 'POST', url: '/users' } }
      }
    ]
  },
  { /* Common fields: owner, repository */ },
  ...userCreateFields,         // Import from ./create.ts
  ...userGetFields,            // Import from ./get.ts
  ...userGetAllFields,         // Import from ./getAll.ts
]

// Operation file: resources/user/create.ts
export const userCreateFields: INodeProperties[] = [
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    displayOptions: { show: { resource: ['user'], operation: ['create'] } },
    routing: { send: { type: 'body', property: 'name' } }
  }
]
```

**Routing types reference**:
- `routing.send.type: 'body'` → Sends to request body
- `routing.send.type: 'query'` → Sends as URL parameter (?name=value)
- `routing.send.type: 'header'` → Sends as HTTP header
- `routing.send.value: '={{ expression }}'` → Transform before sending
- `routing.output.maxResults: '={{$value}}'` → Limit returned items

---

### Pattern 2: Programmatic SDK-Based Node

**When to use**: Official SDK exists, complex logic, non-REST protocols

**Key files to read**:
1. `docs/13-custom-execute-methods.md` - Execute method basics
2. `docs/19-external-sdk-integration.md` - SDK integration
3. `docs/17-error-handling-patterns.md` - Error handling
4. `nodes/Example/Example.node.ts` - Basic execute pattern

**Architecture components**:
```typescript
// Main node with execute method
export class YourNode implements INodeType {
  description: INodeTypeDescription = { /* ... */ };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // 1. Get credentials ONCE (not per item)
    const credentials = await this.getCredentials('yourServiceApi') as {
      apiKey: string;
      projectId: number;
    };

    // 2. Initialize SDK client ONCE
    const client = new YourSDK(credentials.apiKey, {
      projectId: credentials.projectId,
    });

    // 3. Get input items
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    // 4. Process each item
    for (let i = 0; i < items.length; i++) {
      try {
        // Get parameters for this item
        const operation = this.getNodeParameter('operation', i) as string;
        const param1 = this.getNodeParameter('param1', i) as string;

        // Execute SDK operation
        const result = await client[operation](param1);

        // Add to results with pairedItem
        returnData.push({
          json: result,
          pairedItem: { item: i }
        });
      } catch (error) {
        // Handle error
        if (this.continueOnFail()) {
          returnData.push({
            json: { error: error.message },
            pairedItem: { item: i }
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
```

**Critical execution context methods**:
- `this.getInputData()` → Get all input items from previous node
- `this.getNodeParameter(name, itemIndex)` → Get user-configured value
- `this.getCredentials(name)` → Get decrypted credentials
- `this.helpers.httpRequestWithAuthentication()` → Make authenticated HTTP request
- `this.continueOnFail()` → Check if should continue on error
- `this.logger.info/error/debug()` → Logging

---

### Pattern 3: Resource Locator (Multi-Mode Selection)

**When to use**: Users need flexible ways to select resources (search, URL, ID)

**Key files to read**:
1. `docs/15-resource-locators.md` - Resource locator overview
2. `docs/14-list-search-methods.md` - Dynamic dropdown implementation
3. `nodes/GithubIssues/shared/descriptions.ts` - Complete examples
4. `nodes/GithubIssues/listSearch/getUsers.ts` - List search implementation

**Architecture components**:
```typescript
// Shared description: shared/descriptions.ts
export const userSelect: INodeProperties = {
  displayName: 'User',
  name: 'userId',
  type: 'resourceLocator',
  default: { mode: 'list', value: '' },
  required: true,
  modes: [
    {
      // Mode 1: Searchable dropdown
      displayName: 'From List',
      name: 'list',
      type: 'list',
      placeholder: 'Select a user...',
      typeOptions: {
        searchListMethod: 'getUsers',  // Links to methods.listSearch.getUsers
        searchable: true,
        searchFilterRequired: false
      }
    },
    {
      // Mode 2: Paste URL and extract ID
      displayName: 'By URL',
      name: 'url',
      type: 'string',
      placeholder: 'https://example.com/users/123',
      extractValue: {
        type: 'regex',
        regex: '/users/([0-9]+)'  // Extracts "123"
      },
      validation: [{
        type: 'regex',
        properties: {
          regex: 'https://example.com/users/[0-9]+',
          errorMessage: 'Invalid user URL'
        }
      }]
    },
    {
      // Mode 3: Direct ID entry
      displayName: 'By ID',
      name: 'id',
      type: 'string',
      placeholder: '123',
      url: '=https://example.com/users/{{$value}}'  // Optional: make ID clickable
    }
  ]
};

// List search method: listSearch/getUsers.ts
export async function getUsers(
  this: ILoadOptionsFunctions,
  filter?: string,               // User's search input
  paginationToken?: string,      // For pagination
): Promise<INodeListSearchResult> {
  const page = paginationToken ? +paginationToken : 1;
  const perPage = 100;

  // Get dependent parameters if needed
  const projectId = this.getCurrentNodeParameter('projectId', { extractValue: true });

  // Fetch from API
  const response = await apiRequest.call(this, 'GET', '/users', {
    q: filter,
    page,
    per_page: perPage
  });

  // Transform to required format
  const results: INodeListSearchItems[] = response.items.map(user => ({
    name: user.name,           // Display text
    value: user.id,            // Stored value
    url: user.html_url,        // Optional: clickable link
    description: user.email    // Optional: secondary text
  }));

  // Calculate next page token
  const hasMore = page * perPage < response.total_count;
  const nextToken = hasMore ? String(page + 1) : undefined;

  return {
    results,
    paginationToken: nextToken
  };
}

// Register in main node
methods = {
  listSearch: {
    getUsers,
    getProjects,
  }
}
```

---

### Pattern 4: Pagination Handling

**When to use**: "Get All" / "Return All" operations with large result sets

**Key files to read**:
1. `docs/16-pagination-handling.md` - Pagination overview
2. `nodes/GithubIssues/resources/issue/getAll.ts` - Link h