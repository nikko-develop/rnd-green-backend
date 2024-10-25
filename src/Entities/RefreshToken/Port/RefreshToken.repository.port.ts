import { RefreshTokenEntity } from '@Entities/RefreshToken/Domain/RefreshToken.entity';
import { ReadRepositoryPort } from '@Libs/Ports/ReadRepositoryPort.base';
import { ULID } from '@Libs/types/ULID.type';

export interface RefreshTokenRepositoryPort extends ReadRepositoryPort<RefreshTokenEntity> {
	save(entity: RefreshTokenEntity): Promise<void>;
	findByUserId(userId: ULID): Promise<RefreshTokenEntity>;
	findByUserIdOrCreate(userId: ULID): Promise<RefreshTokenEntity>;
}
