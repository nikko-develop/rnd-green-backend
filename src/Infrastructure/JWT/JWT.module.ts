import { Global, Module, Provider } from '@nestjs/common';

import { ConfigSchema } from '@Libs/Config/ConfigSchema';

import { JWT_SERVICE } from './JWT.di.tokens';
import { JWTService } from './JWT.service';

const JwtService: Provider = {
	provide: JWT_SERVICE,
	useFactory: (config: ConfigSchema) => new JWTService(config.JWT),
	inject: [ConfigSchema]
};

@Global()
@Module({
	providers: [JwtService],
	exports: [JwtService]
})
export class JWTModule {}
