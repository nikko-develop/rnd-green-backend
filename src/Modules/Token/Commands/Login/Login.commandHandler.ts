import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from './Login.command';
import { RefreshTokenRepositoryPort } from '@Entities/RefreshToken/Port/RefreshToken.repository.port';
import { JWT_SERVICE } from '@Infrastructure/JWT/JWT.di.tokens';
import { Tokens } from '@Infrastructure/JWT/JWT.types';
import { REFRESH_TOKEN_REPOSITORY } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.di.tokens';
import { NotFoundException, UnauthorizedException } from '@Libs/Exceptions';
import { TokenServicePort } from '@Libs/Ports/TokenService.port';
import { UserRepositoryPort } from '@Entities/User/Port/User.repository.port';
import { USER_REPOSITORY } from '@Infrastructure/Repositories/User/User.di.tokens';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
	private readonly logger = new Logger(LoginCommandHandler.name);

	public constructor(
		@Inject(JWT_SERVICE) private readonly tokenService: TokenServicePort,
		@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryPort,
		@Inject(REFRESH_TOKEN_REPOSITORY)
		private readonly refreshTokenRepository: RefreshTokenRepositoryPort
	) {}

	public async execute(command: LoginCommand): Promise<Tokens> {
		const userExists = await this.userRepository.existsByLogin(command.login);
		if (!userExists) throw new NotFoundException('Пользователь не найден');
		const user = await this.userRepository.findByLogin(command.login);
		const passwordMatch = await this.tokenService.isMatch(
			command.password,
			user.getPropsCopy().passwordHash
		);
		if (!passwordMatch) throw new UnauthorizedException('Пароль не правильный');
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
