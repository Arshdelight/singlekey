import { parse } from '../src';

// Mock fetch
global.fetch = jest.fn();

describe('singlekey parse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse successfully with default API URL', async () => {
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

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://singlekey.arshdelight.com/api/v1',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'test-single-key' })
      }
    );
  });

  it('should parse successfully with custom API URL', async () => {
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

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://custom-api.com',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'test-single-key' })
      }
    );
  });

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
