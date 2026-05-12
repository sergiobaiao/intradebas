import { createCorsOriginHandler, getAllowedCorsOrigins, isCorsOriginAllowed } from '../src/config/cors';

describe('CORS config', () => {
  beforeEach(() => {
    process.env.FRONTEND_BASE_URL = 'https://intradebas.com.br';
    delete process.env.NODE_ENV;
  });

  it('includes configured frontend and local dev origins outside production', () => {
    expect(getAllowedCorsOrigins()).toEqual(
      expect.arrayContaining([
        'https://intradebas.com.br',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ]),
    );
  });

  it('rejects unknown origins', () => {
    expect(isCorsOriginAllowed('https://evil.example.com')).toBe(false);
  });

  it('allows configured origin through callback', () => {
    const callback = jest.fn();
    createCorsOriginHandler()('https://intradebas.com.br', callback);
    expect(callback).toHaveBeenCalledWith(null, true);
  });
});
