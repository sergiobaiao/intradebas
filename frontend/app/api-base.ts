const DEFAULT_PUBLIC_API_BASE_URL = 'http://localhost:4000/api/v1';

export function getPublicApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_PUBLIC_API_BASE_URL;
}

export function getServerApiBaseUrl() {
  return process.env.INTERNAL_API_URL ?? getPublicApiBaseUrl();
}

export function getApiBaseUrl() {
  return typeof window === 'undefined' ? getServerApiBaseUrl() : getPublicApiBaseUrl();
}
