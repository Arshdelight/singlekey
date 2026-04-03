# @arshdelight/singlekey

<p align="center">
  <strong>现代化应用的安全 AI 凭证管理</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@arshdelight/singlekey">
    <img src="https://img.shields.io/npm/v/@arshdelight/singlekey.svg" alt="npm version">
  </a>
  <a href="https://github.com/arshdelight/singlekey/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@arshdelight/singlekey.svg" alt="license">
  </a>
  <a href="https://www.npmjs.com/package/@arshdelight/singlekey">
    <img src="https://img.shields.io/npm/dt/@arshdelight/singlekey.svg" alt="downloads">
  </a>
</p>

<p align="center">
  <a href="README.md">English</a> | 中文
</p>

## 特性

- 🔒 安全地将 SingleKey 解析为 AI 凭证
- 🌐 支持任何 AI API 提供商
- 📦 零依赖
- ⚡ 简单轻量
- 🎯 开箱即用的 TypeScript 支持
- 📝 清晰的服务器错误信息

## 安装

```bash
npm install @arshdelight/singlekey
```

## 快速开始

```javascript
import { parse } from '@arshdelight/singlekey';

const credentials = await parse('your-singlekey');
console.log(credentials.baseurl);
console.log(credentials.apikey);
console.log(credentials.model);
```

## 使用

### 基本使用

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

### 使用自定义 API 端点

```typescript
import { parse } from '@arshdelight/singlekey';

const credentials = await parse(
  'your-singlekey',
  'https://your-custom-api.com'
);
```

### 与 OpenAI 一起使用

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

## API 参考

### parse(key: string, apiBaseUrl?: string): Promise&lt;ParseResult&gt;

通过 API 将 SingleKey 解析为 AI 凭证。

**参数:**
- `key` (string, 必需): 要解析的 SingleKey
- `apiBaseUrl` (string, 可选): 自定义 API 端点 URL。默认为 `https://singlekey.arshdelight.com/api/v1`

**返回:**
- `Promise<ParseResult>`: 包含以下内容的对象:
  - `baseurl` (string): AI API 基础 URL
  - `apikey` (string): AI API 密钥
  - `model` (string): AI 模型名称

**抛出错误:**
- 请求失败时的网络错误
- 服务器特定错误信息（例如："IP不在白名单中"、"无效的SingleKey"）
- 作为后备的带状态码的 HTTP 错误

## 错误处理

该库提供来自服务器的清晰、可操作的错误信息：

```typescript
import { parse } from '@arshdelight/singlekey';

try {
  const credentials = await parse('your-singlekey');
} catch (error) {
  if (error.message.includes('IP不在白名单中')) {
    console.log('请将您的 IP 添加到白名单');
  } else if (error.message.includes('无效的SingleKey')) {
    console.log('请检查您的 SingleKey');
  } else if (error.message.includes('HTTP error')) {
    console.log('API 请求失败:', error.message);
  } else {
    console.log('网络错误:', error.message);
  }
}
```

## TypeScript 类型

```typescript
interface ParseResult {
  baseurl: string;
  apikey: string;
  model: string;
}

function parse(key: string, apiBaseUrl?: string): Promise<ParseResult>;
```

## 许可证

MIT © Arshdelight
