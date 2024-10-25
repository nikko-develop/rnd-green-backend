import { Injectable, Logger } from '@nestjs/common';
import { createDecoder, createSigner, createVerifier, VerifierSync, SignerSync } from 'fast-jwt';
import * as bcrypt from 'bcrypt';

import { JwtConfig } from '@Libs/Config/Schemas/JwtConfig';
import { TokenServicePort } from '@Libs/Ports/TokenService.port';

import { JwtSignServiceDto } from './DTOs/JWT.signService.dto';
import { JwtSignTokensDto } from './DTOs/JWT.signTokens.dto';
import { Tokens } from './JWT.types';

@Injectable()
export class JWTService implements TokenServicePort {
	public constructor(private readonly config: JwtConfig) {
		this.signAccess = createSigner({
			key: this.config.accessPrivateKey,
			expiresIn: this.config.accessExpiresIn
		});
		this.signRefresh = createSigner({
			key: this.config.refreshPrivateKey,
			expiresIn: this.config.refreshExpiresIn
		});
		this.signService = createSigner({
			key: this.config.servicePrivateKey,
			expiresIn: this.config.serviceExpiresIn
		});

		this.verifyRefresh = createVerifier({
			key: this.config.refreshPublicKey,
			allowedIss: this.config.issuer,
			cache: true
		});
		this.verifyAccess = createVerifier({
			key: this.config.accessPublicKey,
			allowedIss: this.config.issuer,
			cache: true
		});
		this.verifyService = createVerifier({
			key: this.config.servicePublicKey,
			allowedIss: this.config.issuer,
			cache: true
		});

		this.decode = createDecoder();
	}
	private logger = new Logger(JWTService.name);

	public verifyRefresh: typeof VerifierSync;
	public verifyAccess: typeof VerifierSync;
	public verifyService: typeof VerifierSync;

	public decode: ReturnType<typeof createDecoder>;

	private signRefresh: typeof SignerSync;
	private signAccess: typeof SignerSync;
	private signService: typeof SignerSync;

	public signTokens({ payload }: JwtSignTokensDto): Tokens {
		const accessToken = this.signAccess(payload);
		const refreshToken = this.signRefresh(payload);
		return { accessToken, refreshToken };
	}
	public signServiceToken({ payload }: JwtSignServiceDto): string {
		return this.signService({ ...payload, isService: true });
	}
	public async hash(password: string): Promise<string> {
		return bcrypt.hash(password, this.config.salt);
	}
	public async isMatch(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}
}
