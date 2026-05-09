interface CategoryModel {
  id: string;
  name: string;
  baseurl: string;
  apikey: string;
  model: string;
}

interface BundleResult {
  bundleName: string;
  categories: Record<string, CategoryModel>;
}

interface LegacyResult {
  id: string;
  name: string;
  baseurl: string;
  apikey: string;
  model: string;
}

type ApiResponse = BundleResult | LegacyResult;

export interface ParseResult {
  /** Bundle name (empty string for legacy single-model keys) */
  bundleName: string;
  /** All categories with their decrypted credentials (empty for legacy keys) */
  categories: Record<string, CategoryModel>;
  /**
   * First non-null category's or legacy response's id.
   */
  id: string;
  /**
   * First non-null category's or legacy response's name.
   */
  name: string;
  /**
   * First non-null category's baseurl — for backward compatibility.
   * @deprecated Use categories instead for multi-model access.
   */
  baseurl: string;
  /**
   * First non-null category's apikey — for backward compatibility.
   * @deprecated Use categories instead for multi-model access.
   */
  apikey: string;
  /**
   * First non-null category's model — for backward compatibility.
   * @deprecated Use categories instead for multi-model access.
   */
  model: string;
}

function isBundleResult(data: any): data is BundleResult {
  return data && typeof data.bundleName === 'string' && typeof data.categories === 'object';
}

function getFirstCategory(data: BundleResult): CategoryModel {
  const categories = data.categories;
  for (const key of Object.keys(categories)) {
    const model = categories[key];
    if (model && model.baseurl && model.apikey) {
      return model;
    }
  }
  return { id: '', name: '', baseurl: '', apikey: '', model: '' };
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

  if (isBundleResult(data)) {
    const first = getFirstCategory(data);
    return {
      bundleName: data.bundleName,
      categories: data.categories,
      id: first.id,
      name: first.name,
      baseurl: first.baseurl,
      apikey: first.apikey,
      model: first.model,
    };
  }

  // Legacy single-model response
  const legacy = data as LegacyResult;
  return {
    bundleName: '',
    categories: {
      default: {
        id: legacy.id,
        name: legacy.name,
        baseurl: legacy.baseurl,
        apikey: legacy.apikey,
        model: legacy.model,
      },
    },
    id: legacy.id,
    name: legacy.name,
    baseurl: legacy.baseurl,
    apikey: legacy.apikey,
    model: legacy.model,
  };
}
