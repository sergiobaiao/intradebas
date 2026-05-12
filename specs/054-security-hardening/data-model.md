# Data Model: Security Hardening

## AdminSessionCookie

- Fields:
  - `intradebas_admin_token`: JWT de acesso curto
  - `intradebas_admin_refresh_token`: JWT de refresh rotativo
- Rules:
  - ambos definidos pelo backend
  - `HttpOnly` sempre
  - `SameSite=Lax` sempre
  - `Secure` apenas em producao/HTTPS

## PublicAthleteSummary

- Fields:
  - `id`
  - `name`
  - `team { id, name, color, totalScore }`
  - `sports[] { id, name, category }`
- Excluded fields:
  - `cpf`
  - `email`
  - `phone`
  - `birthDate`
  - `unit`

## AllowedCorsOrigin

- Fields:
  - `origin`
  - `environment`
  - `credentialsAllowed`
- Rules:
  - origem deve bater exatamente com `FRONTEND_BASE_URL` ou allowlist local segura fora de producao

## UploadPolicy

- Fields:
  - `allowedMimeTypes`
  - `maxFileSizeBytes`
- Rules:
  - imagens: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
  - videos: `video/mp4`, `video/quicktime`
  - maximo: `20971520`
