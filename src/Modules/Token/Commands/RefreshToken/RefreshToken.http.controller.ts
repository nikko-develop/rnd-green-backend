import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenCommand } from './RefreshToken.command';
import { RefreshTokenCommandHandler } from './RefreshToken.commandHandler';
import { routesV1 } from '@Libs/Config/App.routes';
import { CommandResponse } from '@Libs/types/CQRSResponse.type';
import { TokenResponseDto } from '@Modules/Token/DTOs/Responses/Token.response.dto';
import { TokenToDTOMapper } from '@Modules/Token/Mappers/Token.toDTO.mapper';
import { HttpRequest, HttpResponse } from '@Infrastructure/Http/Http.type';

@ApiTags(routesV1.greenRostov.tag)
@Controller(routesV1.version)
export class RefreshTokenHttpController {
	public constructor(
		private readonly commandBus: CommandBus,
		private readonly mapper: TokenToDTOMapper
	) {}

	@Post(routesV1.greenRostov.refreshToken)
	@ApiOkResponse({ description: 'Возвращает refresh и access токены', type: TokenResponseDto })
	public async refreshToken(
		@Req() request: HttpRequest,
		@Res() response: HttpResponse
	): Promise<TokenResponseDto> {
		const refreshToken = request.cookies.refreshToken;

		if (refreshToken) {
			const command = new RefreshTokenCommand({
				refreshToken
			});
			const tokens = await this.commandBus.execute<
				RefreshTokenCommand,
				CommandResponse<RefreshTokenCommandHandler>
			>(command);

			response.setCookie('refreshToken', tokens.refreshToken, { httpOnly: true });
			return this.mapper.toLoginDTO(tokens);
		}

		return response.status(500).send({ message: 'error' });
	}
}
