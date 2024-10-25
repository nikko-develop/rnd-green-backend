import { Type } from 'class-transformer';
import { IsPort, IsString, ValidateNested } from 'class-validator';

import { JwtConfig } from '@Libs/Config/Schemas/JwtConfig';
import { MongoConfig } from '@Libs/Config/Schemas/MongoConfig';

export class ConfigSchema {
	@ValidateNested()
	@Type(() => MongoConfig)
	public readonly mongo!: MongoConfig;

	@ValidateNested()
	@Type(() => JwtConfig)
	public readonly JWT!: JwtConfig;

	@IsString()
	public readonly name!: string;

	@IsPort()
	public readonly port!: number;
}
