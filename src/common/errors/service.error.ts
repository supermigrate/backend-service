import { HttpException } from '@nestjs/common';

export class ServiceError extends Error {
  code = 500;
  constructor(message: string, code: number) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
  }

  toErrorResponse(): ServiceError {
    throw new HttpException(
      {
        message: this.message,
        statusCode: this.code,
      },
      this.code,
    );
  }
}
