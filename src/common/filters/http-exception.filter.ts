import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse: {
      message: string | string[];
      error: string | Record<string, unknown>;
    } = exception.getResponse() as {
      message: string | string[];
      error: string | Record<string, unknown>;
    };

    if (
      typeof exceptionResponse === 'string' ||
      typeof exceptionResponse.message === 'string'
    ) {
      response.status(status).json({
        ...exceptionResponse,
      });
    } else {
      const arrayMessage = exceptionResponse.message;

      response.status(status).json({
        status: false,
        message: arrayMessage?.[arrayMessage?.length - 1],
      });
    }
  }
}
