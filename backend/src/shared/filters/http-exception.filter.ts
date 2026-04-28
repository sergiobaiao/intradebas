import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

type ErrorResponse = {
  statusCode: number;
  message?: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const payload = this.toPayload(exception, status);
    response.status(status).json({
      statusCode: status,
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  private toPayload(exception: unknown, status: number): Omit<ErrorResponse, 'statusCode'> {
    if (!(exception instanceof HttpException)) {
      return {
        message:
          process.env.NODE_ENV === 'production'
            ? 'Erro interno do servidor'
            : exception instanceof Error
              ? exception.message
              : 'Erro interno do servidor',
        error: 'Internal Server Error',
      };
    }

    const response = exception.getResponse();

    if (typeof response === 'string') {
      return {
        message: response,
        error: exception.name,
      };
    }

    const errorResponse = response as ErrorResponse;
    return {
      message: errorResponse.message ?? exception.message,
      error: errorResponse.error ?? HttpStatus[status],
    };
  }
}
