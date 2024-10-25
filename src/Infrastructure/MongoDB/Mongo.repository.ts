import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HydratedDocument, Model } from 'mongoose';

import { AggregateID, Entity } from '@Libs/ddd/Entity.base';
import { Mapper } from '@Libs/ddd/Mapper.interface';
import { ReadRepositoryPort } from '@Libs/Ports/ReadRepositoryPort.base';
import { WriteRepositoryPort } from '@Libs/Ports/WriteRepositoryPort.base';

import { MongoSchemaBase } from '@Infrastructure/MongoDB/MongoSchema.base';

export abstract class MongoRepository<
		Aggregate extends Entity<unknown>,
		DbModel extends MongoSchemaBase
	>
	implements ReadRepositoryPort<Aggregate>, WriteRepositoryPort<Aggregate>
{
	protected abstract readonly logger: Logger;
	protected abstract model: Model<HydratedDocument<DbModel>>;

	protected constructor(
		protected readonly mapper: Mapper<Aggregate, DbModel>,
		protected readonly eventEmitter?: EventEmitter2
	) {}

	public async insert(entity: Aggregate | Aggregate[]): Promise<string[]> {
		const entities = Array.isArray(entity) ? entity : [entity];

		const records = entities.map((entity) => this.model.hydrate(this.mapper.toPersistence(entity)));

		const result = await this.model.insertMany<HydratedDocument<DbModel>>(records);

		return result.map((item) => item.id as AggregateID);
	}

	public async findById(id: string): Promise<Aggregate> {
		const result = (await this.model.findOne({ id }).exec()) as HydratedDocument<DbModel>;
		const entity = this.mapper.toDomain(result.toObject() as DbModel);
		return Promise.resolve(entity);
	}

	public async update(entity: Aggregate): Promise<boolean> {
		const updatedRecord = await this.model.findOneAndUpdate(
			{ id: entity.id },
			this.mapper.toPersistence(entity),
			{
				new: true
			}
		);

		return Boolean(updatedRecord);
	}

	public async delete(entity: Aggregate): Promise<boolean> {
		const record = this.mapper.toPersistence(entity);

		// TODO: Check if it can be typed
		const result = await this.model.deleteOne({ id: record.id }).exec();

		return Promise.resolve(Boolean(result.deletedCount));
	}
}
