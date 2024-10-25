import { Body, Controller, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { RegisterCommand } from './Register.command';
import { RegisterCommandHandler } from './Register.commandHandler';
import { HttpResponse } from '@Infrastructure/Http/Http.type';
import { routesV1 } from '@Libs/Config/App.routes';
import { CommandResponse } from '@Libs/types/CQRSResponse.type';
import { RegisterDto } from '@Modules/Token/DTOs/Requests/Register.dto';
import { LoginResponseDto } from '@Modules/Token/DTOs/Responses/Login.response.dto';
import { TokenToDTOMapper } from '@Modules/Token/Mappers/Token.toDTO.mapper';
import { TokenResponseDto } from '@Modules/Token/DTOs/Responses/Token.response.dto';

@ApiTags(routesV1.greenRostov.tag)
@Controller(routesV1.version)
export class RegisterHttpController {
	public constructor(
		private readonly commandBus: CommandBus,
		private readonly mapper: TokenToDTOMapper
	) {}

	@Post(routesV1.greenRostov.register)
	@ApiOkResponse({ description: 'Возвращает refresh и access токены', type: TokenResponseDto })
	@ApiBadRequestResponse({ description: 'Неправильный формат запроса' })
	public async Register(
		@Body() dto: RegisterDto,
		@Res() response: HttpResponse
	): Promise<LoginResponseDto> {
		const command = new RegisterCommand({
			name: dto.name,
			login: dto.login,
			password: dto.password
		});
		const tokens = await this.commandBus.execute<
			RegisterCommand,
			CommandResponse<RegisterCommandHandler>
		>(command);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		response.setCookie('refreshToken', tokens.refreshToken, { httpOnly: true });
		return response.send(this.mapper.toLoginDTO(tokens));
	}
}
