import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HttpRequest, HttpResponse } from '@Infrastructure/Http/Http.type';
import { routesV1 } from '@Libs/Config/App.routes';
import { LogoutResponseDto } from '@Modules/Token/DTOs/Responses/Logout.response.dto';

@ApiTags(routesV1.greenRostov.tag)
@Controller(routesV1.version)
export class LogoutHttpController {
	@Post(routesV1.greenRostov.logout)
	@ApiOkResponse({ description: 'Удалет refreshToken из cookies', type: LogoutResponseDto })
	@ApiBadRequestResponse({ description: 'Неправильный формат запроса' })
	public async logout(
		@Req() request: HttpRequest,
		@Res() response: HttpResponse
	): Promise<LogoutResponseDto> {
		const refreshToken = request.cookies.refreshToken;

		if (refreshToken) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			response.setCookie('refreshToken', '', { httpOnly: true });
		}

		return response.send({ message: 'ok' });
	}
}
