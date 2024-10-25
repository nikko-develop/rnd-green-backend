import { Tokens } from '@Infrastructure/JWT/JWT.types';
import { LoginResponseDto } from '@Modules/Token/DTOs/Responses/Login.response.dto';

export class TokenToDTOMapper {
	public toLoginDTO(tokens: Tokens): LoginResponseDto {
		return {
			accessToken: tokens.accessToken
		};
	}
}
