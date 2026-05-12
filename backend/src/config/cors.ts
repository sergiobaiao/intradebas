type CorsOriginHandler = (
  origin: string | undefined,
  callback: (error: Error | null, allow?: boolean) => void,
) => void;

const DEFAULT_LOCAL_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

export function getAllowedCorsOrigins() {
  const configured = process.env.FRONTEND_BASE_URL?.trim();
  const origins = new Set<string>();

  if (configured) {
    origins.add(configured);
  }

  if (process.env.NODE_ENV !== 'production') {
    for (const origin of DEFAULT_LOCAL_ORIGINS) {
      origins.add(origin);
    }
  }

  return Array.from(origins);
}

export function isCorsOriginAllowed(origin?: string) {
  if (!origin) {
    return true;
  }

  return getAllowedCorsOrigins().includes(origin);
}

export function createCorsOriginHandler(): CorsOriginHandler {
  return (origin, callback) => {
    if (isCorsOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin not allowed by CORS'));
  };
}

export function createCorsOptions() {
  return {
    origin: createCorsOriginHandler(),
    credentials: true,
  };
}
