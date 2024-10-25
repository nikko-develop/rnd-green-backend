import { Injectable } from '@nestjs/common';
import { RefreshTokenRecord } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.schema';
import { Mapper } from '@Libs/ddd/Mapper.interface';
import { RefreshTokenEntity } from '@Entities/RefreshToken/Domain/RefreshToken.entity';
@Injectable()
export class RefreshTokenMapper implements Mapper<RefreshTokenEntity, RefreshTokenRecord> {
	public toPersistence(entity: RefreshTokenEntity): RefreshTokenRecord {
		const propsCopy = entity.getPropsCopy();
		return {
			id: entity.id,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			hash: propsCopy.hash,
			userId: propsCopy.userId
		};
	}

	public toDomain(record: RefreshTokenRecord): RefreshTokenEntity {
		return RefreshTokenEntity.create(
			{
				hash: record.hash,
				userId: record.userId
			},
			record.id,
			record.createdAt,
			record.updatedAt
		);
	}
}
