import { Provider, Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_REPOSITORY } from '@Infrastructure/Repositories/User/User.di.tokens';
import { UserMapper } from '@Infrastructure/Repositories/User/User.mapper';
import { UserRepository } from '@Infrastructure/Repositories/User/User.repository';
import { UserRecord, UserSchema } from '@Infrastructure/Repositories/User/User.schema';

const repositories: Provider[] = [
	{
		provide: USER_REPOSITORY,
		useClass: UserRepository
	}
];

const mappers: Provider[] = [UserMapper];

@Module({
	imports: [MongooseModule.forFeature([{ name: UserRecord.name, schema: UserSchema }])],
	providers: [Logger, ...repositories, ...mappers],
	exports: [...repositories, ...mappers]
})
export class UserRepositoryModule {}
