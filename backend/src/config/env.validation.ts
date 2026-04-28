import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  PORT: Joi.number().port().default(4000),
  FRONTEND_BASE_URL: Joi.string().uri().default('http://localhost:3000'),
  REDIS_URL: Joi.string().uri().allow('', null),
  REDIS_PASSWORD: Joi.string().allow('', null),
  MAIL_HOST: Joi.string().default('mailhog'),
  MAIL_PORT: Joi.number().port().default(1025),
  MAIL_FROM: Joi.string().default('noreply@intradebas.local'),
  MINIO_ENDPOINT: Joi.string().default('minio'),
  MINIO_PORT: Joi.number().port().default(9000),
  MINIO_USE_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  MINIO_ACCESS_KEY: Joi.string().default('minioadmin'),
  MINIO_SECRET_KEY: Joi.string().default('minioadmin'),
  MINIO_BUCKET: Joi.string().default('intradebas'),
  RECAPTCHA_SECRET_KEY: Joi.string().allow('', null),
}).unknown(true);
