import { Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import _ from 'lodash';
import { RefreshTokenRepositoryPort } from '@Entities/RefreshToken/Port/RefreshToken.repository.port';
import { JWT_SERVICE } from '@Infrastructure/JWT/JWT.di.tokens';
import { Tokens, TokenPayload } from '@Infrastructure/JWT/JWT.types';
import { REFRESH_TOKEN_REPOSITORY } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.di.tokens';
import { TokenServicePort } from '@Libs/Ports/TokenService.port';
import { QueryResponse } from '@Libs/types/CQRSResponse.type';
import { RefreshTokenCommand } from '@Modules/Token/Commands/RefreshToken/RefreshToken.command';
import { USER_REPOSITORY } from '@Infrastructure/Repositories/User/User.di.tokens';
import { UserRepositoryPort } from '@Entities/User/Port/User.repository.port';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand> {
	private readonly logger = new Logger(RefreshTokenCommandHandler.name);

	public constructor(
		@Inject(REFRESH_TOKEN_REPOSITORY)
		private readonly refreshTokenRepository: RefreshTokenRepositoryPort,
		@Inject(JWT_SERVICE) private readonly tokenService: TokenServicePort,
		@Inject(USER_REPOSITORY) private readonly userService: UserRepositoryPort
	) {}

	public async execute(command: RefreshTokenCommand): Promise<Tokens> {
		try {
			this.tokenService.verifyRefresh(command.refreshToken);
		} catch (err) {
			throw new UnauthorizedException('Не валидный refresh токен');
		}
		const decoded = this.tokenService.decode(command.refreshToken) as TokenPayload<unknown>;
		if ([decoded.userId].some((el) => _.isNil(el))) {
			this.logger.error({ message: 'Не верные данные в refresh токене', payload: decoded });
			throw new UnauthorizedException('Не верные данные в refresh токене');
		}
		const existsUser = await this.userService.existsById(decoded.userId);
		if (!existsUser) throw new UnauthorizedException('Пользователь не найден');
		const user = await this.userService.findById(decoded.userId);

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
