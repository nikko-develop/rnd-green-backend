import { VerifierSync } from 'fast-jwt';

import { JwtSignServiceDto } from '@Infrastructure/JWT/DTOs/JWT.signService.dto';
import { JwtSignTokensDto } from '@Infrastructure/JWT/DTOs/JWT.signTokens.dto';
import { ServiceTokenPayload, TokenPayload, Tokens } from '@Infrastructure/JWT/JWT.types';

export interface TokenServicePort {
	verifyRefresh(token: Buffer | string): ReturnType<typeof VerifierSync>;
	verifyAccess(token: Buffer | string): ReturnType<typeof VerifierSync>;
	verifyService(token: Buffer | string): ReturnType<typeof VerifierSync>;
	decode(token: Buffer | string): ServiceTokenPayload<unknown> | TokenPayload<unknown>;
	signTokens({ payload }: JwtSignTokensDto): Tokens;
	signServiceToken({ payload }: JwtSignServiceDto): string;
	hash(password: string): Promise<string>;
	isMatch(password: string, hash: string): Promise<boolean>;
}
