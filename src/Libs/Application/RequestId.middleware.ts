import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ulid } from 'ulid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
	public use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
		const requestId = req.headers['request-id'] ?? ulid();
		req.id = requestId;
		next();
	}
}
