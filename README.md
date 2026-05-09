# @arshdelight/singlekey

<p align="center">
  <strong>Secure AI credential management for modern applications</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@arshdelight/singlekey">
    <img src="https://img.shields.io/npm/v/@arshdelight/singlekey.svg" alt="npm version">
  </a>
  <a href="https://github.com/arshdelight/singlekey">
    <img src="https://img.shields.io/github/stars/arshdelight/singlekey.svg" alt="GitHub stars">
  </a>
  <a href="https://github.com/arshdelight/singlekey/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@arshdelight/singlekey.svg" alt="license">
  </a>
  <a href="https://www.npmjs.com/package/@arshdelight/singlekey">
    <img src="https://img.shields.io/npm/dt/@arshdelight/singlekey.svg" alt="downloads">
  </a>
</p>

<p align="center">
  English | <a href="https://github.com/arshdelight/singlekey/blob/main/README_CN.md">中文</a>
</p>

## Features

- 🔒 Securely resolve SingleKey to AI credentials
- 📦 **Bundle mode** — one key to rule all your AI models (LLM, vector, vision, voice, rerank)
- 🌐 Works with any AI API provider
- 📦 Zero dependencies
- ⚡ Simple and lightweight
- 🎯 TypeScript support out of the box
- 📝 Clear error messages from server

## Installation

```bash
npm install @arshdelight/singlekey
```

## Quick Start

### Legacy Single-Model Key

```javascript
import { parse } from '@arshdelight/singlekey';

const credentials = await parse('your-singlekey');
console.log(credentials.baseurl);
console.log(credentials.apikey);
console.log(credentials.model);
console.log(credentials.id);    // model ID
console.log(credentials.name);  // model name
```

### Bundle Key (Multi-Model)

```typescript
import { parse } from '@arshdelight/singlekey';

const { bundleName, categories } = await parse('your-bundle-key');

console.log(`Bundle: ${bundleName}`);

// Access each category with model metadata
for (const [category, model] of Object.entries(categories)) {
  console.log(`${category}:`, model.name, `(${model.id})`, model.baseurl, model.apikey, model.model);
}

// For backward compatibility, baseurl/apikey/model
// are automatically filled from the first available category:
const { baseurl, apikey, model } = await parse('your-bundle-key');
```

## Usage

### Basic Usage

```typescript
import { parse } from '@arshdelight/singlekey';

async function useAI() {
  try {
    const credentials = await parse('your-singlekey');
    console.log('Credentials:', credentials);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### With Custom API Endpoint

```typescript
import { parse } from '@arshdelight/singlekey';

const credentials = await parse(
  'your-singlekey',
  'https://your-custom-api.com'
);
```

### With OpenAI (Legacy Key)

```typescript
import { parse } from '@arshdelight/singlekey';
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

### With Multiple Providers (Bundle Key)

```typescript
import { parse } from '@arshdelight/singlekey';
import OpenAI from 'openai';

async function useBundle() {
  const { categories } = await parse('your-bundle-key');

  // Language model
  const llm = categories.language;
  const openai = new OpenAI({
    baseURL: llm.baseurl,
    apiKey: llm.apikey
  });

  // Vector model
  const embedding = categories.vector;
  const embedResponse = await fetch(`${embedding.baseurl}/embeddings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${embedding.apikey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: embedding.model,
      input: 'Hello world'
    })
  });
}
```

## API Reference

### parse(key: string, apiBaseUrl?: string): Promise&lt;ParseResult&gt;

Resolves a SingleKey to AI credentials via API.

**Parameters:**
- `key` (string, required): The SingleKey to parse
- `apiBaseUrl` (string, optional): Custom API endpoint URL. Defaults to `https://www.practihub.com/api/singlekey/v1`

**Returns:**
- `Promise<ParseResult>`: Object containing:

```typescript
interface ParseResult {
  /** Bundle name (empty string for legacy keys) */
  bundleName: string;
  /** All categories with their decrypted credentials */
  categories: Record<string, CategoryModel>;
  /**
   * First category's id — identifies which model config is being used.
   */
  id: string;
  /**
   * First category's name — human-readable model display name.
   */
  name: string;
  /**
   * First category's baseurl — backward compatible.
   * @deprecated Use categories instead.
   */
  baseurl: string;
  /**
   * First category's apikey — backward compatible.
   * @deprecated Use categories instead.
   */
  apikey: string;
  /**
   * First category's model — backward compatible.
   * @deprecated Use categories instead.
   */
  model: string;
}

interface CategoryModel {
  /** Model config ID (8-char alphanumeric) */
  id: string;
  /** Human-readable model display name */
  name: string;
  /** API base URL */
  baseurl: string;
  /** API key */
  apikey: string;
  /** Model name identifier */
  model: string;
}
```

**Legacy response backward compatibility:**
When parsing a legacy single-model key, the response will have `bundleName: ''` and `categories: { default: { id, name, baseurl, apikey, model } }`. The `baseurl`, `apikey`, and `model` fields remain populated for code that hasn't been updated yet.

**Throws:**
- Network error if request fails
- Server-specific error messages (e.g., "IP不在白名单中", "无效的SingleKey")
- HTTP error with status code as fallback

## Error Handling

The library provides clear, actionable error messages from the server:

```typescript
import { parse } from '@arshdelight/singlekey';

try {
  const credentials = await parse('your-singlekey');
} catch (error) {
  if (error.message.includes('IP不在白名单中')) {
    console.log('Please add your IP to the whitelist');
  } else if (error.message.includes('无效的SingleKey')) {
    console.log('Please check your SingleKey');
  } else if (error.message.includes('HTTP error')) {
    console.log('API request failed:', error.message);
  } else {
    console.log('Network error:', error.message);
  }
}
```

## License

MIT © Arshdelight
