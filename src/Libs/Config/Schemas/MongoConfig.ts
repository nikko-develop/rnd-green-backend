import { Type } from 'class-transformer';
import { IsIP, IsOptional, IsPort, IsString, ValidateNested } from 'class-validator';

export class MongoAuth {
  @IsString()
  public readonly database!: string;

  @IsString()
  public readonly password!: string;

  @IsString()
  public readonly user: string;
}

export class MongoInstance {
  @IsIP()
  public readonly ip: string;

  @IsPort()
  @Type(() => String)
  public readonly port: number;
}

export class MongoConfig {
  @ValidateNested()
  @Type(() => MongoAuth)
  public readonly auth!: MongoAuth;

  @IsOptional()
  @IsString()
  public readonly type!: string;

  @IsOptional()
  @IsIP()
  public readonly ip: string;

  @IsOptional()
  @IsPort()
  public readonly port: number;

  @IsOptional()
  @Type(() => MongoInstance)
  @ValidateNested({ each: true })
  public readonly instances: MongoInstance[];

  @IsOptional()
  @IsString()
  public readonly clusterName?: string;

  @IsString()
  public get connectionString(): string {
    if (this.type === 'single') {
      return `mongodb://${this.auth.user}:${this.auth.password}@${this.ip}:${this.port}/${this.auth.database}?authSource=admin`;
    }

    if (this.type !== 'replicaset') {
      throw new SyntaxError(`CONFIG: Unknown MongoDB connection type`);
    }

    if (this.clusterName && this.instances.length) {
      return [
        `mongodb://${this.auth.user}:${this.auth.password}@`,
        this.instances.map(({ ip, port }) => [ip, port].join(':')).join(','),
        `/${this.auth.database}`,
        `?replicaSet=${this.clusterName}&authSource=admin`,
      ].join('');
    }
    throw new SyntaxError(`CONFIG: All MongoDB cluster parameters should be specified`);
  }
}
