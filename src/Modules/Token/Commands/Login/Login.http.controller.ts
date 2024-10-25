import { Body, Controller, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { LoginCommand } from './Login.command';
import { LoginCommandHandler } from './Login.commandHandler';
import { HttpResponse } from '@Infrastructure/Http/Http.type';
import { routesV1 } from '@Libs/Config/App.routes';
import { CommandResponse } from '@Libs/types/CQRSResponse.type';
import { LoginUnauthorizedReposneDto } from '@Modules/Token/DTOs/Errors/Login.unauthorized.response.dto';
import { LoginDto } from '@Modules/Token/DTOs/Requests/Login.dto';
import { LoginResponseDto } from '@Modules/Token/DTOs/Responses/Login.response.dto';
import { TokenToDTOMapper } from '@Modules/Token/Mappers/Token.toDTO.mapper';
import { TokenResponseDto } from '@Modules/Token/DTOs/Responses/Token.response.dto';

@ApiTags(routesV1.greenRostov.tag)
@Controller(routesV1.version)
export class LoginHttpController {
	public constructor(
		private readonly commandBus: CommandBus,
		private readonly mapper: TokenToDTOMapper
	) {}

	@Post(routesV1.greenRostov.login)
	@ApiOkResponse({ description: 'Возвращает refresh и access токены', type: TokenResponseDto })
	@ApiUnauthorizedResponse({
		description: 'Логин или пароль не верные',
		type: LoginUnauthorizedReposneDto
	})
	@ApiBadRequestResponse({ description: 'Неправильный формат запроса' })
	public async login(
		@Body() dto: LoginDto,
		@Res() response: HttpResponse
	): Promise<LoginResponseDto> {
		const command = new LoginCommand({
			login: dto.login,
			password: dto.password
		});
		const tokens = await this.commandBus.execute<
			LoginCommand,
			CommandResponse<LoginCommandHandler>
		>(command);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		response.setCookie('refreshToken', tokens.refreshToken, { httpOnly: true });
		return response.send(this.mapper.toLoginDTO(tokens));
	}
}
