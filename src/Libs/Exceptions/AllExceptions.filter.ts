import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { InternalServerErrorException, getAbstractExceptionClass } from './Exceptions';
import { ExceptionBase } from '@Libs/Exceptions/Exception.base';
import { ExceptionResponseDto } from '@Libs/Exceptions/Exception.response.dto';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  public constructor(protected readonly httpAdapterHost: HttpAdapterHost) {
    super();
  }

  public catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    if (exception instanceof ExceptionBase) {
      const httpStatus = exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const responseBody: ExceptionResponseDto = {
        timestamp: new Date().toISOString(),
        ...exception.toJSON(),
      };

      this.logger.error(`Caught an exception: ${JSON.stringify(responseBody, null, 2)}`);

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } else if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();
      const Exception = getAbstractExceptionClass(exception.name, httpStatus);
      const mappedException = new Exception(exception.message, undefined, exception.getResponse());
      const responseBody: ExceptionResponseDto = {
        timestamp: new Date().toISOString(),
        ...mappedException.toJSON(),
      };

      this.logger.error(`Caught an exception: ${JSON.stringify(responseBody, null, 2)}`);

      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    } else if (exception instanceof Error) {
      const internalServerErrorException = new InternalServerErrorException(exception.message);
      const responseBody: ExceptionResponseDto = {
        timestamp: new Date().toISOString(),
        ...internalServerErrorException.toJSON(),
      };
      httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      super.catch(exception, host);
    }
  }
}
