import { IsNumber, IsString } from 'class-validator';

export class JwtConfig {
	@IsString()
	public readonly accessPrivateKey: string;
	@IsString()
	public readonly accessPublicKey: string;
	@IsString()
	public readonly refreshPrivateKey: string;
	@IsString()
	public readonly refreshPublicKey: string;
	@IsString()
	public readonly servicePrivateKey: string;
	@IsString()
	public readonly servicePublicKey: string;
	@IsString()
	public readonly refreshExpiresIn: string;
	@IsString()
	public readonly accessExpiresIn: string;
	@IsString()
	public readonly serviceExpiresIn: string;
	@IsString()
	public readonly issuer: string;
	@IsNumber()
	public readonly salt: number;
}
