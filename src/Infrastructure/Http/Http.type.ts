import { FastifyReply, FastifyRequest } from 'fastify';

import { ServiceTokenPayload, TokenPayload } from '@Infrastructure/JWT/JWT.types';

type HttpFrameworkRequest = FastifyRequest;
type HttpFrameworkResponse = FastifyReply;

export type HttpRequest = HttpFrameworkRequest & {
	tokenPayload: ServiceTokenPayload<unknown> | TokenPayload<unknown>;
};

export type HttpResponse = HttpFrameworkResponse;
