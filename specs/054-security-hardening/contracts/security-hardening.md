# Contracts: Security Hardening

## Authentication

- `POST /api/v1/auth/login`
  - Request: `{ email, password }`
  - Response body: `{ user }`
  - Side effect: `Set-Cookie` para `intradebas_admin_token` e `intradebas_admin_refresh_token`

- `POST /api/v1/auth/refresh`
  - Request: body opcional `{ refreshToken? }`
  - Preferred input: cookie `intradebas_admin_refresh_token`
  - Response body: `{ user }`
  - Side effect: rotaciona cookies da sessao

- `POST /api/v1/auth/logout`
  - Request: body opcional `{ refreshToken? }`
  - Response body: `{ success: true }`
  - Side effect: revoga refresh token e limpa cookies

## Athletes

- `GET /api/v1/athletes`
  - Auth required: yes
  - Returns admin athlete payload with PII

- `GET /api/v1/athletes/:id`
  - Auth required: yes
  - Returns admin athlete payload with PII

- `GET /api/v1/athletes/public`
  - Auth required: no
  - Returns `PublicAthleteSummary[]`

- `GET /api/v1/teams/:id/athletes`
  - Auth required: yes
  - Returns admin athlete payload with PII

## Media Upload

- `POST /api/v1/media/upload`
  - Auth required: yes
  - Multipart field: `file`
  - Accepted MIME: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `video/mp4`, `video/quicktime`
  - Max size: `20 MB`
  - Error responses:
    - `400 Tipo de arquivo nao permitido`
    - `400 Arquivo excede o tamanho maximo`
