import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable, tap } from 'rxjs';

import { RequestContextService } from '@Libs/Application/AppRequestContext';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Injectable()
export class ContextInterceptor implements NestInterceptor {
	public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request: FastifyRequest = context.switchToHttp().getRequest();
		const requestId = request.raw.id as string;
		RequestContextService.setRequestId(requestId);

		return next.handle().pipe(
			tap(() => {
				// Если потребуется очистка
			})
		);
	}
}
/* eslint-enable @typescript-eslint/no-explicit-any */
