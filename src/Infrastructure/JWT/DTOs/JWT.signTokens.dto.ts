import { TokenPayload } from '../JWT.types';

export interface JwtSignTokensDto {
	payload: TokenPayload<unknown>;
}
