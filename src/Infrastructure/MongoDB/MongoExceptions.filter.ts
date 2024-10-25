import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Error } from 'mongoose';

import { ExceptionResponseDto } from '@Libs/Exceptions/Exception.response.dto';

import { MongoExceptionCodes } from '@Infrastructure/MongoDB/Mongo.exceptions';

@Catch(Error)
export class MongoExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(MongoExceptionsFilter.name);

	public constructor(protected readonly host: HttpAdapterHost) {}

	public async catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<FastifyReply>();
		const request = ctx.getRequest<FastifyRequest>();
		let code: string;
		let message: string;

		switch (exception.name) {
			case Error.CastError.name: {
				code = MongoExceptionCodes.CastError;
				message = Error.CastError.toString();
				break;
			}
			case Error.DocumentNotFoundError.name: {
				code = MongoExceptionCodes.DocumentNotFound;
				message = Error.DocumentNotFoundError.toString();
				break;
			}
			default: {
				code = MongoExceptionCodes.Unknown;
				message = Error.toString();
			}
		}

		const errorResponse: ExceptionResponseDto = {
			code,
			message,
			cause: request.url,
			timestamp: new Date().toISOString()
		};

		this.logger.error(`Caught Mongoose exception: ${JSON.stringify(errorResponse)}`);

		await response.status(500).send(errorResponse);
	}
}
