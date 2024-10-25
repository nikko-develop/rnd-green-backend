import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { RequestContextModule } from 'nestjs-request-context';

import { ContextInterceptor } from '@Libs/Application/ContextInterceptor';
import { RequestIdMiddleware } from '@Libs/Application/RequestId.middleware';
import { ConfigModule } from '@Libs/Config/Config.module';
import { ConfigSchema } from '@Libs/Config/ConfigSchema';
import { AllExceptionsFilter } from '@Libs/Exceptions/AllExceptions.filter';

import { JWTModule } from '@Infrastructure/JWT/JWT.module';
import { MongoExceptionsFilter } from '@Infrastructure/MongoDB/MongoExceptions.filter';

import { HealthcheckController } from './HealtChecker.controller';
import { TokenModule } from '@Modules/Token/Token.module';

const interceptors = [
	{
		provide: APP_INTERCEPTOR,
		useClass: ContextInterceptor
	}
];

const httpControllers = [HealthcheckController];

@Module({
	imports: [
		LoggerModule.forRoot({ pinoHttp: { autoLogging: false } }),
		ConfigModule,
		EventEmitterModule.forRoot(),
		MongooseModule.forRootAsync({
			useFactory: (configSchema: ConfigSchema) => ({
				uri: configSchema.mongo.connectionString
			}),
			inject: [ConfigSchema]
		}),
		RequestContextModule,
		JWTModule,
		TokenModule
	],
	controllers: [...httpControllers],
	providers: [
		...interceptors,
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter
		},
		{
			provide: APP_FILTER,
			useClass: MongoExceptionsFilter
		}
	]
})
export class AppModule {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(RequestIdMiddleware).forRoutes('*');
	}
}
