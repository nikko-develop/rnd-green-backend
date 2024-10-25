import { ServiceTokenPayload } from '../JWT.types';

export interface JwtSignServiceDto {
	payload: ServiceTokenPayload<unknown>;
}
