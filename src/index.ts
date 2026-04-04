interface ParseResult {
  baseurl: string;
  apikey: string;
  model: string;
}

export async function parse(
  key: string,
  apiBaseUrl?: string
): Promise<ParseResult> {
  const url = apiBaseUrl || 'https://practihub.com/api/singlekey/v1';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key })
  });

  const data = await response.json();

  if (!response.ok) {
    if (data && data.error) {
      throw new Error(data.error);
    }
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }

  return data;
}
