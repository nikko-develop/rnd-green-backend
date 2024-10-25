import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { RegisterCommand } from './Register.command';
import { RefreshTokenRepositoryPort } from '@Entities/RefreshToken/Port/RefreshToken.repository.port';
import { JWT_SERVICE } from '@Infrastructure/JWT/JWT.di.tokens';
import { Tokens } from '@Infrastructure/JWT/JWT.types';
import { REFRESH_TOKEN_REPOSITORY } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.di.tokens';
import { ConflictException, NotFoundException } from '@Libs/Exceptions';
import { TokenServicePort } from '@Libs/Ports/TokenService.port';
import { UserRepositoryPort } from '@Entities/User/Port/User.repository.port';
import { USER_REPOSITORY } from '@Infrastructure/Repositories/User/User.di.tokens';
import { UserAggregate } from '@Entities/User/Domain/User.entity';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
	private readonly logger = new Logger(RegisterCommandHandler.name);

	public constructor(
		@Inject(JWT_SERVICE) private readonly tokenService: TokenServicePort,
		@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
		@Inject(REFRESH_TOKEN_REPOSITORY)
		private readonly refreshTokenRepository: RefreshTokenRepositoryPort
	) {}

	public async execute(command: RegisterCommand): Promise<Tokens> {
		const userExists = await this.userRepository.existsByLogin(command.login);
		if (userExists) throw new ConflictException('Пользователь уже существует');

		const hash = await this.tokenService.hash(command.password);
		const user = UserAggregate.create({
			name: command.name,
			login: command.login,
			passwordHash: hash,
			contactData: {}
		});
		await this.userRepository.save(user);

		const tokens = this.tokenService.signTokens({
			payload: {
				userId: user.id,
				user: {
					login: user.getPropsCopy().login,
					name: user.getPropsCopy().name
				}
			}
		});
		const refreshToken = await this.refreshTokenRepository.findByUserIdOrCreate(user.id);
		refreshToken.setHashFromToken(tokens.refreshToken);
		await this.refreshTokenRepository.save(refreshToken);
		return tokens;
	}
}
