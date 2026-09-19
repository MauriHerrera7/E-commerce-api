import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request & { requestId?: string }>();
    const httpException =
      exception instanceof HttpException ? exception : undefined;
    const status =
      httpException?.getStatus() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = httpException?.getResponse();
    const message =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as { message?: string | string[] }).message
        : (exceptionResponse ?? 'Internal server error');

    response.status(status).json({
      statusCode: status,
      message,
      requestId: request.requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
