# singlekey

Client library for singlekey - secure AI credential management.

## Installation

```bash
npm install singlekey
```

## Quick Start

```javascript
import { parse } from 'singlekey';

// Parse using the default API endpoint
const credentials = await parse('your-website-singlekey');
console.log(credentials.baseurl);
console.log(credentials.apikey);
console.log(credentials.model);

// Parse using a custom API endpoint
const credentials = await parse('your-website-singlekey', 'https://your-custom-api.com');
```

## API Reference

### parse(key: string, apiBaseUrl?: string): Promise&lt;ParseResult&gt;

Resolves a website singlekey to AI credentials via API.

**Parameters:**
- `key` (string, required): The website singlekey to parse
- `apiBaseUrl` (string, optional): Custom API endpoint URL. Defaults to `https://singlekey.arshdelight.com/api/v1`

**Returns:**
- `Promise<ParseResult>`: Object containing:
  - `baseurl` (string): AI API base URL
  - `apikey` (string): AI API key
  - `model` (string): AI model name

**Throws:**
- Network error if request fails
- HTTP error with status code if response is not ok

## TypeScript Types

```typescript
interface ParseResult {
  baseurl: string;
  apikey: string;
  model: string;
}

function parse(key: string, apiBaseUrl?: string): Promise<ParseResult>;
```

## Examples

### Basic Usage with OpenAI

```javascript
import { parse } from 'singlekey';
import OpenAI from 'openai';

async function chat() {
  const { baseurl, apikey, model } = await parse('your-singlekey');
  
  const openai = new OpenAI({
    baseURL: baseurl,
    apiKey: apikey
  });
  
  const response = await openai.chat.completions.create({
    model: model,
    messages: [{ role: 'user', content: 'Hello!' }]
  });
  
  return response.choices[0].message.content;
}
```

### Custom API Endpoint

```javascript
import { parse } from 'singlekey';

const credentials = await parse(
  'your-singlekey',
  'https://your-private-singlekey-server.com'
);
```

## Error Handling

```javascript
import { parse } from 'singlekey';

try {
  const credentials = await parse('your-singlekey');
} catch (error) {
  if (error.message.includes('HTTP error')) {
    console.log('API request failed:', error.message);
  } else {
    console.log('Network error:', error.message);
  }
}
```
