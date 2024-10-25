import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MongoRepository } from '@Infrastructure/MongoDB/Mongo.repository';
import { RefreshTokenMapper } from '@Infrastructure/Repositories/RefreshToken/RefreshToken.mapper';
import {
	RefreshTokenDocument,
	RefreshTokenRecord
} from '@Infrastructure/Repositories/RefreshToken/RefreshToken.schema';
import { NotFoundException } from '@Libs/Exceptions';
import { ULID } from '@Libs/types/ULID.type';
import { RefreshTokenEntity } from '@Entities/RefreshToken/Domain/RefreshToken.entity';
import { RefreshTokenRepositoryPort } from '@Entities/RefreshToken/Port/RefreshToken.repository.port';

@Injectable()
export class RefreshTokenRepository
	extends MongoRepository<RefreshTokenEntity, RefreshTokenRecord>
	implements RefreshTokenRepositoryPort
{
	protected readonly logger = new Logger(RefreshTokenRepository.name);

	public constructor(
		protected readonly mapper: RefreshTokenMapper,
		@InjectModel(RefreshTokenRecord.name) protected readonly model: Model<RefreshTokenDocument>
	) {
		super(mapper);
	}

	public async save(entity: RefreshTokenEntity): Promise<void> {
		const props = entity.getPropsCopy();
		const persistence = this.mapper.toPersistence(entity);

		await this.model.findOneAndUpdate(
			{ userId: props.userId },
			{ ...persistence, updatedAt: new Date() },
			{ upsert: true }
		);
	}

	public async findByUserId(userId: ULID): Promise<RefreshTokenEntity> {
		const record = await this.model.findOne({ userId }).lean();

		if (!record) throw new NotFoundException('Refresh token не найден');

		return this.mapper.toDomain(record);
	}
	public async findByUserIdOrCreate(userId: ULID): Promise<RefreshTokenEntity> {
		try {
			const refreshToken = await this.findByUserId(userId);
			return refreshToken;
		} catch (err) {
			if (err instanceof NotFoundException) {
				return RefreshTokenEntity.create({ userId });
			}
			throw err;
		}
	}
}
