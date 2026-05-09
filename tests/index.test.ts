import { parse } from '../src';

global.fetch = jest.fn();

describe('singlekey parse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('legacy single-model response', () => {
    it('should parse single-model response successfully', async () => {
      const mockResponse = {
        baseurl: 'https://api.openai.com/v1',
        apikey: 'sk-test123',
        model: 'gpt-4'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await parse('test-single-key');

      expect(result.bundleName).toBe('');
      expect(result.categories).toEqual({
        default: { baseurl: 'https://api.openai.com/v1', apikey: 'sk-test123', model: 'gpt-4' }
      });
      expect(result.baseurl).toBe('https://api.openai.com/v1');
      expect(result.apikey).toBe('sk-test123');
      expect(result.model).toBe('gpt-4');
    });

    it('should use custom API URL', async () => {
      const mockResponse = {
        baseurl: 'https://api.openai.com/v1',
        apikey: 'sk-test123',
        model: 'gpt-4'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await parse('test-single-key', 'https://custom-api.com');

      expect(result.baseurl).toBe('https://api.openai.com/v1');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://custom-api.com',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: 'test-single-key' })
        }
      );
    });
  });

  describe('bundle response', () => {
    it('should parse bundle response successfully', async () => {
      const mockResponse = {
        bundleName: 'myapp',
        categories: {
          language: {
            baseurl: 'https://api.openai.com/v1',
            apikey: 'sk-openai-xxx',
            model: 'gpt-4'
          },
          vector: {
            baseurl: 'https://api.openai.com/v1',
            apikey: 'sk-embed-xxx',
            model: 'text-embedding-3'
          }
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await parse('test-bundle-key');

      expect(result.bundleName).toBe('myapp');
      expect(result.categories).toEqual(mockResponse.categories);
      expect(result.baseurl).toBe('https://api.openai.com/v1');
      expect(result.apikey).toBe('sk-openai-xxx');
      expect(result.model).toBe('gpt-4');
    });

    it('should fall back to empty first category values when no categories exist', async () => {
      const mockResponse = {
        bundleName: 'empty-bundle',
        categories: {}
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await parse('test-empty-bundle');

      expect(result.bundleName).toBe('empty-bundle');
      expect(result.categories).toEqual({});
      expect(result.baseurl).toBe('');
      expect(result.apikey).toBe('');
      expect(result.model).toBe('');
    });
  });

  describe('backward compatibility', () => {
    it('legacy code accessing result.baseurl/apikey/model still works', async () => {
      const mockResponse = {
        bundleName: 'formyapp',
        categories: {
          language: {
            baseurl: 'https://api.openai.com/v1',
            apikey: 'sk-xxx',
            model: 'gpt-4'
          }
        }
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await parse('test-key');
      const { baseurl, apikey, model } = result;

      expect(baseurl).toBe('https://api.openai.com/v1');
      expect(apikey).toBe('sk-xxx');
      expect(model).toBe('gpt-4');
    });
  });

  describe('error handling', () => {
    it('should throw error on network failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(parse('test-single-key')).rejects.toThrow('Network error');
    });

    it('should throw error on HTTP error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => ({})
      });

      await expect(parse('test-single-key')).rejects.toThrow('HTTP error: 403 Forbidden');
    });

    it('should throw error with server error message', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'IP不在白名单中' })
      });

      await expect(parse('test-single-key')).rejects.toThrow('IP不在白名单中');
    });
  });
});
