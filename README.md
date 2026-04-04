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
  English | <a href="README_CN.md">中文</a>
</p>

## Features

- 🔒 Securely resolve SingleKey to AI credentials
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

```javascript
import { parse } from '@arshdelight/singlekey';

const credentials = await parse('your-singlekey');
console.log(credentials.baseurl);
console.log(credentials.apikey);
console.log(credentials.model);
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

### With OpenAI

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

## API Reference

### parse(key: string, apiBaseUrl?: string): Promise&lt;ParseResult&gt;

Resolves a SingleKey to AI credentials via API.

**Parameters:**
- `key` (string, required): The SingleKey to parse
- `apiBaseUrl` (string, optional): Custom API endpoint URL. Defaults to `https://www.practihub.com/api/singlekey/v1`

**Returns:**
- `Promise<ParseResult>`: Object containing:
  - `baseurl` (string): AI API base URL
  - `apikey` (string): AI API key
  - `model` (string): AI model name

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

## TypeScript Types

```typescript
interface ParseResult {
  baseurl: string;
  apikey: string;
  model: string;
}

function parse(key: string, apiBaseUrl?: string): Promise<ParseResult>;
```

## License

MIT © Arshdelight
