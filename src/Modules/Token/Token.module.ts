import { Provider, Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JWTModule } from '@Infrastructure/JWT/JWT.module';
import { RefreshTokenRepositoryModule } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.repository.module';
import { UserRepositoryModule } from '@Infrastructure/Repositories/User/User.repository.module';
import { LoginHttpController } from '@Modules/Token/Commands/Login/Login.http.controller';
import { RegisterHttpController } from '@Modules/Token/Commands/Register/Register.http.controller';
import { LogoutHttpController } from '@Modules/Token/Commands/Logout/Logout.http.controller';
import { RefreshTokenHttpController } from '@Modules/Token/Commands/RefreshToken/RefreshToken.http.controller';
import { LoginCommandHandler } from '@Modules/Token/Commands/Login/Login.commandHandler';
import { RegisterCommandHandler } from '@Modules/Token/Commands/Register/Register.commandHandler';
import { RefreshTokenCommandHandler } from '@Modules/Token/Commands/RefreshToken/RefreshToken.commandHandler';
import { TokenToDTOMapper } from '@Modules/Token/Mappers/Token.toDTO.mapper';

const httpControllers = [
	LoginHttpController,
	RegisterHttpController,
	LogoutHttpController,
	RefreshTokenHttpController
];
const commandHandlers: Provider[] = [
	LoginCommandHandler,
	RegisterCommandHandler,
	RefreshTokenCommandHandler
];
const queryHandlers: Provider[] = [];

const eventHandlers: Provider[] = [];

const mappers: Provider[] = [TokenToDTOMapper];

@Module({
	imports: [
		ConfigModule,
		CqrsModule,
		JWTModule,
		RefreshTokenRepositoryModule,
		UserRepositoryModule
	],
	controllers: [...httpControllers],
	providers: [Logger, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...mappers],
	exports: [...mappers]
})
export class TokenModule {}
