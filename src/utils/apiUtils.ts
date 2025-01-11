import { QueryResponse } from '@/types/query.type';

// Define the URLs and their types using enums and type literals
export enum ApiUrls {
  Local = 'http://localhost:4040',
  Prod = 'https://api.blindtus.com',
}

export enum Mode {
  Local = 'local',
  Prod = 'prod',
}

export enum Client {
  Local = 'http://localhost:3000',
  Prod = 'https://blindtus.com',
}

// Define the type for API call settings
export type CallApi = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; // More explicit HTTP methods
  cache?: RequestCache; // Using built-in RequestCache type for cache settings
  data?: Record<string, unknown> | null; // Using a more precise type for data
  formData?: FormData | null; // Using a more precise type for FormData
  endpoint: string;
};

// Consolidate URLs into a single object with nested enums
export const url = {
  api: {
    [Mode.Local]: ApiUrls.Local,
    [Mode.Prod]: ApiUrls.Prod,
  },
  client: {
    [Mode.Local]: Client.Local,
    [Mode.Prod]: Client.Prod,
  },
};

// Environment dependent variables
export const mode: Mode = (process.env['NEXT_PUBLIC_DATABASE_MODE'] as Mode) || Mode.Local;
export const API_TOKEN = process.env['NEXT_PUBLIC_API_TOKEN'] || '';

// URL configurations based on mode
export const API = url.api[mode];
export const CLIENT = url.client[mode];

// Function to call an API
export const callApi = async <T>({
  method = 'GET',
  cache = 'no-cache',
  data = null,
  formData = null,
  endpoint = '',
}: CallApi): Promise<QueryResponse<T>> => {
  const config: RequestInit = {
    method,
    mode: 'cors',
    cache,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  if (!formData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    };
  }

  if (data) {
    config.body = JSON.stringify(data);
  } else if (formData) {
    config.body = formData;
  }

  const response = await fetch(`${API}${endpoint}`, config);
  return await response.json();
};
