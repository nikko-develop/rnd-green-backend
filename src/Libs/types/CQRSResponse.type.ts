import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';

export type QueryResponse<T extends IQueryHandler> = Awaited<ReturnType<T['execute']>>;
export type CommandResponse<T extends ICommandHandler> = Awaited<ReturnType<T['execute']>>;
