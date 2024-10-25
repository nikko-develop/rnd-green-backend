import { RequestContextService } from '@Libs/Application/AppRequestContext';

export interface SerializedException {
  message: string;
  code: string;
  status?: number;
  correlationId?: string;
  stack?: string;
  cause?: string;
  metadata?: unknown;
}

export abstract class ExceptionBase extends Error {
  public abstract code: string;
  public abstract status?: number;

  public readonly correlationId: string;

  public constructor(
    public readonly message: string,
    public readonly cause?: Error,
    public readonly metadata?: unknown,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    const requestContext = RequestContextService.getContext();
    this.correlationId = requestContext.requestId;
  }

  public toJSON(): SerializedException {
    return {
      message: this.message,
      code: this.code,
      status: this.status,
      stack: this.stack,
      correlationId: this.correlationId,
      cause: JSON.stringify(this.cause),
      metadata: JSON.stringify(this.metadata),
    };
  }
}
