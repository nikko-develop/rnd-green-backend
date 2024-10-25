import { HttpStatus } from '@nestjs/common';
import { ExceptionBase, ExceptionCodes } from '.';

export class ArgumentInvalidException extends ExceptionBase {
  public readonly code = ExceptionCodes.ArgumentInvalid;
  public readonly status = HttpStatus.BAD_REQUEST;
}

export class ArgumentNotProvidedException extends ExceptionBase {
  public readonly code = ExceptionCodes.ArgumentNotProvided;
  public readonly status = HttpStatus.BAD_REQUEST;
}

export class ArgumentOutOfRangeException extends ExceptionBase {
  public readonly code = ExceptionCodes.ArgumentOutOfRange;
  public readonly status = HttpStatus.BAD_REQUEST;
}

export class ConflictException extends ExceptionBase {
  public readonly code = ExceptionCodes.Conflict;
  public readonly status = HttpStatus.CONFLICT;
}

export class UnauthorizedException extends ExceptionBase {
  public readonly code = ExceptionCodes.Unauthorized;
  public readonly status = HttpStatus.UNAUTHORIZED;
}

export class InternalServerErrorException extends ExceptionBase {
  public readonly code = ExceptionCodes.InternalServerError;
  public readonly status = HttpStatus.INTERNAL_SERVER_ERROR;
}
export class NotFoundException extends ExceptionBase {
  public readonly code = ExceptionCodes.NotFound;
  public readonly status = HttpStatus.NOT_FOUND;
}

export class ForbiddenException extends ExceptionBase {
  public readonly code = ExceptionCodes.Forbidden;
  public readonly status = HttpStatus.FORBIDDEN;
}

export const getAbstractExceptionClass = (code: string, status: number) => {
  return class Exception extends ExceptionBase {
    public readonly code = code;
    public readonly status = status;
  };
};
