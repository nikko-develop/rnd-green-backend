import { Logger, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { REFRESH_TOKEN_REPOSITORY } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.di.tokens';
import { RefreshTokenMapper } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.mapper';
import { RefreshTokenRepository } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.repository';
import {
	RefreshTokenRecord,
	RefreshTokenSchema
} from '@Infrastructure/Repositories/RefreshToken/RefreshToken.schema';

const repositories: Provider[] = [
	{
		provide: REFRESH_TOKEN_REPOSITORY,
		useClass: RefreshTokenRepository
	}
];

const mappers: Provider[] = [RefreshTokenMapper];

@Module({
	imports: [
		MongooseModule.forFeature([{ name: RefreshTokenRecord.name, schema: RefreshTokenSchema }])
	],
	providers: [Logger, ...repositories, ...mappers],
	exports: [...repositories, ...mappers]
})
export class RefreshTokenRepositoryModule {}
